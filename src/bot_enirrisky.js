/**
 * [Bot] Blank
 *
 * @format
 */

var events = require("events");
require("dotenv").config();
const Objective = require("./objective.js");
const { getRandomQuote } = require("./quotes.js");
const fs = require("fs");

// Terrain Constants.
// Any tile with a nonnegative value is owned by the player corresponding to its value.
// For example, a tile with value 1 is owned by the player with playerIndex = 1.
const TILE_EMPTY = -1;
const TILE_MOUNTAIN = -2;
const TILE_FOG = -3;
const TILE_FOG_OBSTACLE = -4; // Cities and Mountains show up as Obstacles in the fog of war.

// exports a class named Bot
module.exports = class Bot {
  // logging informartion
  path = "./logs/";
  filename = "log.txt";
  log_lines = [];
  log_chunk = [];
  should_log = false;
  first_fail = null;

  // The latest game tick that the bot will pull armies off it's general tile
  PULL_FROM_GENERAL_MAX = 50;

  // The earliest game tick that the bot will start to attack cities
  ATTACK_CITIES_MIN = 50;

  // Game data from game_start
  // https://dev.generals.io/api#game_start
  playerIndex = null;
  replay_id;
  chat_room;
  team_chat_room;
  usernames;
  teams;

  // Useful data gathered from the info given on game update
  game_tick = 0;
  ticks_til_payday = 25;

  generals = [];  // The indices of generals we have vision of.
  cities = [];    // The indices of cities we have vision of.

  width = null;   // map width
  height = null;  // map height
  map = [];       // large array containing all map information
  terrain = [];   // obstacle or enemy player information of map
  owned = [];     // all the owned tiles
  enemies = [];   // all tiles owned by enemies
  perimeter = []; // all the tiles on the perimeter of the bot's territory

  current_tile = null;
  current_coords = null;
  general_tile = null;
  general_coords = null;

  last_move = null;
  last_type_taken = null;
  objective_queue = [];
  last_chat = null;
  history = [];

  // mechanism for freeing the bot when it's gotten stuck
  checksum = null;
  no_change_count = 0;
  no_change_threshold = 5;
  lastAttemptedMove = null;

  // constructor sets up an event emitter
  constructor() {
    this.em = new events.EventEmitter();
    this.filename = this.updateFilename();
  }

  updateFilename = () => {
    var now = new Date();
    return (
      "LOG_" +
      now.getFullYear() +
      "-" +
      now.getMonth() +
      "-" +
      now.getDate() +
      "_" +
      now.getHours() +
      "-" +
      now.getMinutes() +
      ".txt"
    );
  };

  // log function for debugging
  log = function () {
    let arr = [...arguments].map((param) => {
      if (typeof param === "object") {
        return JSON.stringify(param, null, 2);
      } else {
        return param;
      }
    });
    const line = arr.join(" ") + "\n";
    this.log_lines = [...this.log_lines, line];
    this.em.emit("log", this.log_lines);
    if (process.env.LOG === "TRUE" && this.should_log) {
      this.log_chunk.push(line);
    }
  };

  /*
    functions handling the events sent by the game server
  */
  game_start = (data) => {
    this.updateFilename();
    this.should_log = true;

    // get all the props from game_start data and load them into our class props
    Object.keys(data).forEach((key) => {
      this[key] = data[key];
    });
    this.replay_url = `http://bot.generals.io/replays/${encodeURIComponent(data.replay_id)}`;
    this.log(`STARTING INFORMATION`);
    this.log(`Player Index: ${this.playerIndex}`);
    this.log(`Replay URL: ${this.replay_url}`);
    this.log(`Chat Room: ${this.chat_room}`);
    if (this.team_chat_room) {
      this.log(`Team Chat Room: ${this.team_chat_room}`);
    }
    this.usernames.forEach((username, index) => {
      this.log(`Player ${index}: ${username}`);
    })
    this.log(`Teams: ${this.teams}`);
  };
  game_update = (data) => {
    // start by logging out every log chunk we've queued up by calling this.log during the previous game_update
    if (this.log_chunk.length > 0 && process.env.LOG === "TRUE") {
      const chunk = this.log_chunk.join("") + "\n\n";
      this.log_chunk = [];
      fs.appendFile(this.path + this.filename, chunk, (err) => {
        if (err) console.log(err);
      });
    }
    this.log("=================================");
    this.log(`GAME TICK ${data.turn / 2}`);
    this.log("=================================");

    this.gatherIntel(data);

    // update generals
    this.generals = data.generals;

    // update cities
    this.cities = this.patch(this.cities, data.cities_diff);

    this.log({
      owned: this.owned,
      enemies: this.enemies,
      perimeter: this.perimeter,
      frontline: this.frontline,
      generals: this.generals,
      cities: this.cities,
    });

    // skip lots of processing if we can't even make a move
    if (this.isFullyStretched()) {
      this.log("Fully Stretched");
      return;
    }

    // perform random move
    this.nextMove()

    return {
      ...data,
    };
  };
  game_lost = (data) => {
    let msg;
    if (data.killer){
      msg = `Defeated by ${data.killer}`;
    } else {
      msg = `Goodbye`;
    }
    this.chat(msg);
    this.log(msg);
  };
  game_won = (data) => {
    const msg = `Victory!`;
    this.chat(msg);
    this.log(msg);
  };
  chat_message = (chat_room, data) => {
    const { username, playerIndex, text } = data;
    let msg;
    if (username){
      msg = `[Room ${chat_room}] ${username} (${playerIndex}): ${text}`;
    } else {
      msg = `[Room ${chat_room}]: ${text}`;
    }
    this.log(msg);
  };
  stars = (data) => {};
  rank = (data) => {};

  /*
    Functions used to emit events to the game server
    they are named the same as the event they emit, but with send_ at the start
  */
  send_set_username = (user_id, username) => { this.em.emit("set_username", { user_id, username }); }
  send_play = (user_id) => { this.em.emit("play", { user_id }); }
  send_join_1v1 = (user_id) => { this.em.emit("join_1v1", { user_id }); }
  send_join_private = (custom_game_id, user_id) => { this.em.emit("join_private", { custom_game_id, user_id }); }
  send_set_custom_team = (custom_game_id, team) => { this.em.emit("set_custom_team", { custom_game_id, team }); }
  send_join_team = (team_id, user_id) => { this.em.emit("join_team", { team_id, user_id }); }
  send_leave_team = (team_id) => { this.em.emit("leave_team", { team_id }); }
  send_cancel = () => { this.em.emit("cancel"); }
  send_set_force_start = () => { this.em.emit("set_force_start"); }
  send_attack = (start, end, is50) => { this.em.emit("attack", { start, end, is50 }); }
  send_clear_moves = () => { this.em.emit("clear_moves"); }
  send_ping_tile = (index) => { this.em.emit("ping_tile", { index }); }
  send_chat_message = (chat_room, text) => { this.em.emit("chat_message", chat_room, text); };
  send_leave_game = () => {
    this.updateFilename();
    this.should_log = false;
    console.log(`${username} left the game`);
    this.em.emit("leave_game");
  };
  send_stars_and_rank = (user_id) => { this.em.emit("stars_and_rank", { user_id }); }

  /*
    wrapper functions to make sending events to the server easier
  */
  chat = (msg) => { this.send_chat_message(this.chat_room, msg); }
  team_chat = (msg) => { this.send_chat_message(this.team_chat_room, msg); }
  tell_team_about_general = (general_tile) => {
    this.send_ping_tile(general_tile);
    let { x, y } = this.getCoords(tile);
    this.team_chat(`General at ${x}, ${y}`);
  }

  /*
    PATCH FUNCTION
  */
  /* Returns a new array created by patching the diff into the old array.
   * The diff formatted with alternating matching and mismatching segments:
   * Example 1: patching a diff of [1, 1, 3] onto [0, 0] yields [0, 3].
   * Example 2: patching a diff of [0, 1, 2, 1] onto [0, 0] yields [2, 0].
   *
   * First element of diff is how many are matching.
   * Patch will copy that number of elements to out.
   * Next element in diff is how many are differnt.
   * If num different is x, then the next x elements will be the changes.
   * Patch will copy the next x number of elements of diff to out.
   * Next elements will be how many are matching, and will follow the above pattern
   */
  patch = (old, diff) => {
    const out = [];
    let i = 0;
    while (i < diff.length) {
      if (diff[i]) {
        // matching
        Array.prototype.push.apply(
          out,
          old.slice(out.length, out.length + diff[i])
        );
      }
      i++;
      if (i < diff.length && diff[i]) {
        // mismatching
        Array.prototype.push.apply(out, diff.slice(i + 1, i + 1 + diff[i]));
        i += diff[i];
      }
      i++;
    }
    return out;
  };

  // gather all useful data from all we are give from the game server
  gatherIntel = (data) => {

    // game timing
    this.internal_tick = data.turn / 2;
    this.game_tick = Math.ceil(this.internal_tick);
    this.ticks_til_payday = 25 - (this.game_tick % 25);

    // update map variables
    this.map = this.patch(this.map, data.map_diff);
    if (data.turn === 1) {
      this.width = this.map[0];
      this.height = this.map[1];
      this.size = this.width * this.height;
      this.center = Math.floor(this.width / 2) + Math.floor(this.height / 2) * this.width;
    }
    this.armies = this.map.slice(2, this.size + 2);
    this.terrain = this.map.slice(this.size + 2, this.size + 2 + this.size);

    // recognize borders
    if (data.turn === 1){
      let allTiles = Array(this.size)
        .fill(false)
        .map((empty_var, tile) => tile);
      this.leftBorder = allTiles.filter((tile) => this.isLeftBorder(tile));
      this.rightBorder = allTiles.filter((tile) => this.isRightBorder(tile));
    }

    // all the enemy tiles
    let newEnemies = this.terrain
      .map((tile) => {
        if (this.isEnemy(tile)) {
          return tile;
        }
        return null;
      })
      .filter((tile) => tile !== null);
    this.enemies = newEnemies;

    // all the tiles we own
    let newOwned = this.terrain
      .map((tile, idx) => {
        if (tile === this.playerIndex) {
          return idx;
        }
        return null;
      })
      .filter((tile) => tile !== null);
    this.owned = newOwned;

    // all the tiles we own that have more than one army
    let newOwnedWithArmy = this.owned.filter((tile) => {
      return this.armies[tile] > 1;
    })
    this.ownedWithArmy = newOwnedWithArmy;

    // of the tiles we own, only the ones on the perimeter
    let newPerimeter = this.owned.filter((tile) => this.isPerimeter(tile));
    this.perimeter = newPerimeter;

    // of the tiles we own, only the ones that border an enemy
    let newFrontline = this.owned.filter((tile) => this.isFrontline(tile));
    this.frontline = newFrontline;

    // do things at first turn
    if (data.turn === 1) {
      this.chat("Here we go!");

      // set general info
      this.general_tile = data.generals[this.playerIndex];
      this.general_coords = this.getCoords(this.general_tile);

      // initialize current tile info
      this.current_tile = this.general_tile;
      this.current_coords = this.getCoords(this.current_tile);

      // why not dump a starting report
      this.log("==STARTING REPORT==");
      this.log({
        general: this.general_tile,
        owned: this.owned,
        current_tile: `${this.current_tile}, (${this.current_coords.x}, ${this.current_coords.y})`,
        game_dimensions: `${this.width} x ${this.height}`,
      });
    }
  };

  isFullyStretched = () => {
    return this.owned
      .map((tile) => this.armies[tile])
      .every((amount) => amount === 1);
  };

  getSurroundingTiles = (index) => {
    return [
      this.getUp(index),
      this.getRight(index),
      this.getDown(index),
      this.getLeft(index),
    ];
  };

  getRandomSurroundingEmpty = (tile) => {
    return this.getSurroundingTile(tile)
      .filter((tile) => this.isEmpty(tile));
  }

  getSurroundingTerrain = (index) => {
    let terrain = this.getSurroundingTiles(index).map(
      (tile) => this.terrain[tile]
    );
    return terrain;
  };

  nextMove = (
    priority = [
      this.isLowEnemy, // Enemy Owned
      this.isEmpty, // Empty
      this.isOwned, // Self Owned
    ]
  ) => {
    this.log(`Finding Random Move`, {
      frontline: JSON.stringify(this.frontline),
      perimeter: JSON.stringify(this.perimeter),
      owned: JSON.stringify(this.owned),
    });

    // perform move to
    this.attack(move_from, move_to);
  };

  // Getting surrounding tiles
  getLeft = (index) => index - 1;
  getRight = (index) => index + 1;
  getDown = (index) => index + this.width;
  getUp = (index) => index - this.width;
  getUpLeft = (index) => this.getLeft(this.getUp(index));
  getUpRight = (index) => this.getRight(this.getUp(index));
  getDownLeft = (index) => this.getLeft(this.getDown(index));
  getDownRight = (index) => this.getRight(this.getDown(index));

  recordMove = (from, to) => {
    return {
      to,
      from,
      toArmies: this.armiesAtTile(to),
      fromArmies: this.armiesAtTile(from),
      toTerrain: this.terrain[to],
      fromTerrain: this.terrain[from],
    };
  };

  attack = function (from, to) {
    this.log(`launching attacking from ${from} to ${to}`);
    this.lastAttemptedMove = this.recordMove(from, to);
    this.current_tile = to;
    this.em.emit("attack", from, to);
  };

  left = (index) => {
    this.attack(index, this.getLeft(index));
  };

  right = (index) => {
    this.attack(index, this.getRight(index));
  };

  down = (index) => {
    this.attack(index, this.getDown(index));
  };

  up = (index) => {
    this.attack(index, this.getUp(index));
  };

  // check if file is frontline tile
  isFrontline = (tile) => {
    let surrounding = this.getSurroundingTiles(tile);
    let foundEnemy = false;
    surrounding.forEach((t) => {
      if (this.isEnemy(t) && !this.willMoveCrossHorizontalBorder(tile, t)) {
        foundEnemy = true;
      }
    });
    return foundEnemy;
  };

  // check if tile is a perimeter tile
  isPerimeter = (tile) => {
    // first check we actually own it,
    if (this.terrain[tile] === this.playerIndex) {
      // get surrounding tiles
      let surrounding = this.getSurroundingTiles(tile);

      // filter out all tiles that would not make it a perimeter tile
      let surrounding_mapped = surrounding.map((tile) =>
        this.isVentureTile(tile)
      );

      // if tile is on top edge
      if (this.isTopBorder(tile)) {
        // set top tile to false
        surrounding_mapped[0] = false;
      }

      // if tile is on right edge
      if (this.isRightBorder(tile)) {
        // set right tile to false
        surrounding_mapped[1] = false;
      }

      // if tile is on bottom edge
      if (this.isBottomBorder(tile)) {
        // set bottom tile to false
        surrounding_mapped[2] = false;
      }

      // if tile is on left edge
      if (this.isLeftBorder(tile)) {
        // set left tile to false
        surrounding_mapped[3] = false;
      }

      let venture_tiles = [];
      for (let i = 0; i < surrounding.length; i++) {
        if (surrounding_mapped[i]) {
          venture_tiles.push(surrounding[i]);
        }
      }

      // this.log(`venture tiles for ${tile}: ${venture_tiles}`);
      // this.log(`is ${tile} perimter? ${venture_tiles.length > 0}`);
      return venture_tiles.length > 0;
    }
    return false;
  };

  isTopBorder = (tile) => tile < this.width;

  isLeftBorder = (tile) => tile % this.width === 0;

  isBottomBorder = (tile) => tile >= this.size - this.width;

  isRightBorder = (tile) => (tile + 1) % this.width === 0;

  willMoveCrossHorizontalBorder = (from, to) => {
    if (this.isRightBorder(from) && this.getRight(from) === to) {
      return true;
    }

    // if tile is on left edge and next move is right
    if (this.isLeftBorder(from) && this.getLeft(from) === to) {
      return true;
    }

    return false;
  };

  isVentureTile = (tile) => {
    let terrain = this.terrain[tile];
    return (
      terrain !== undefined &&
      terrain !== this.playerIndex &&
      terrain !== TILE_MOUNTAIN &&
      terrain !== TILE_FOG_OBSTACLE && // excludes cities as venturing
      this.isInBounds(tile) &&
      (!this.isCity(tile) || this.game_tick >= this.ATTACK_CITIES_MIN)
    );
  };

  isInBounds = (tile) => {
    let { x, y } = this.getCoords(tile);
    return x >= 0 || x <= this.width || y >= 0 || y <= this.height;
  };

  // helper for checking if tile is the general tile
  isGeneral = (tile) => tile === this.general_tile;

  // helper for checking if a tile is a city
  isCity = (tile) => this.cities.includes(tile);

  // helper to see if we own a tile
  isOwned = (tile) => this.owned.includes(tile);

  // helper to see if tile is empty
  isEmpty = (tile) => this.terrain[tile] === TILE_EMPTY;

  // helper to see if tile is owned by an enemy
  isEnemy = (tile) => {
    return this.terrain[tile] !== this.playerIndex && this.terrain[tile] >= 0;
  };

  // helper to see if tile is owned by an enemy
  isLowEnemy = (tile, attacking_tile) => {
    const attacking_armies = this.armies[attacking_tile];
    return (
      // is not players own tile
      this.terrain[tile] !== this.playerIndex &&
      // is a player (so must be enemy)
      this.terrain[tile] >= 0 &&
      // is less than attacking armies by at least 2
      this.armies[tile] <= attacking_armies - 2
    );
  };

  // returns true or false if an enemy owns a tile within our comfort threshold
  isEnemyClose = () => {
    let isEnemyClose = this.enemies
      .map((tile) => this.distanceBetweenTiles(this.general_tile, tile))
      .some((distance) => distance >= this.CLOSENESS_LIMIT);
    this.log("REINFORCE GENERAL, ENEMY IS TOO CLOSE");
    return isEnemyClose;
  };

  closeEnemyIsStronger = () => {
    return this.enemies.some((tile) => {
      return (
        this.distanceBetweenTiles(this.general_tile, tile) >=
          this.CLOSENESS_LIMIT &&
        this.armies[tile] >= this.armies[this.general_tile]
      );
    });
  };

  // helper for getting the number of armies at a tile
  armiesAtTile = (tile) => this.armies[tile];

  // any tile we own
  getRandomOwned = () => {
    const index_in_owned = Math.floor(Math.random() * this.owned.length);
    return this.owned[index_in_owned];
  };

  // get the tile that will be the best source of armies
  getBestSourceTile = (includeGeneral = false) => {
    let most_armies = 0;
    let best_tile = null;
    this.owned.forEach((tile) => {
      let armies_at_tile = this.armies[tile];
      if (
        (best_tile === null || armies_at_tile > most_armies) &&
        (includeGeneral || !this.isGeneral(tile))
      ) {
        best_tile = tile;
        most_armies = armies_at_tile;
      }
    });
    return best_tile;
  };

  getBestFrontline = (includeGeneral = false) => {
    if (this.frontline.length <= 0) return null; // short circuit to improve performance
    let most_armies = 1; // explicitly set to 1 since we don't want frontline tiles with anything less than 2
    let best_tile = null;
    this.frontline.forEach((tile) => {
      let armies_at_tile = this.armiesAtTile(tile);
      let surroundingTiles = this.getSurroundingTiles(tile)
      let tilesWithBeatableEnemies = surroundingTiles.filter(tile => {
        let terrain = this.terrain[tile]
        return terrain >= 0 && this.armiesAtTile(tile) < armies_at_tile
      })
      if (
        armies_at_tile > most_armies &&
        tilesWithBeatableEnemies.length > 0 &&
        (includeGeneral || !this.isGeneral(tile))
      ) {
        best_tile = tile;
        most_armies = armies_at_tile;
      }
    });
    return best_tile;
  };

  getBestPerimeter = (includeGeneral = false) => {
    if (this.perimeter.length <= 0) return null;
    let most_armies = 1;
    let best_tile = null;
    this.perimeter.forEach((tile) => {
      let armies_at_tile = this.armiesAtTile(tile)
      if (
        armies_at_tile > most_armies &&
        (includeGeneral || !this.isGeneral(tile))
      ) {
        best_tile = tile;
        most_armies = armies_at_tile;
      }
    });
    return best_tile;
  };

  getRandomPerimeter = () => {
    if (this.perimeter.length <= 0) return null;
    const index = Math.floor(Math.random() * this.perimeter.length);
    return this.perimeter[index];
  };

  getClosestPerimeter = (start) => {
    let distances = this.perimeter.map((tile) =>
      this.distanceBetweenTiles(start, tile)
    );
    let shortest = this.width * this.height;
    let index = null;
    distances.forEach((distance, idx) => {
      if (distance < shortest || index === null) {
        index = idx;
        shortest = distance;
      }
    });
    if (index === null) return null;
    return this.perimeter[index];
  };

  getFartherPerimeter = (start) => {
    let distances = this.perimeter.map((tile) =>
      this.distanceBetweenTiles(start, tile)
    );
    let farthest = 0;
    let index = null;
    distances.forEach((distance, idx) => {
      if (distance > farthest || index === null) {
        index = idx;
        farthest = distance;
      }
    });
    if (index === null) return null;
    return this.perimeter[index];
  };

  getClosestFrontline = (start) => {
    if (this.frontline.length <= 0) return null;
    let distances = this.frontline.map((tile) =>
      this.distanceBetweenTiles(start, tile)
    );
    let shortest = this.width * this.height;
    let index = null;
    distances.forEach((distance, idx) => {
      if (distance < shortest || index === null) {
        index = idx;
        shortest = distance;
      }
    });
    return this.frontline[index];
  };

  getClosest = (current_tile, tile_list) => {
    let lowest_index = 0;
    let lowest_qty = null;
    tile_list
      .map((tile) => this.distanceBetweenTiles(current_tile, tile))
      .forEach((qty, idx) => {
        if (lowest_qty === null || qty < lowest_qty) {
          lowest_index = idx;
          lowest_qty = qty;
        }
      });
    return tile_list[lowest_index];
  };

  distanceBetweenTiles = (a, b) => {
    return this.distanceBetweenCoords(this.getCoords(a), this.getCoords(b));
  };

  distanceBetweenCoords = (a, b) => {
    return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
  };

  // get x, y of tile
  getCoords = (tile) => {
    var y = Math.floor(tile / this.width);
    var x = tile % this.width;
    return { x, y };
  };

  // get tile of x, y
  getTileAtCoords = (x, y) => {
    return y * this.width + x;
  };
};
