/**
 * Main Bot File, same for everybot
 *
 * eslint-disable no-continue
 * eslint-disable no-unused-vars
 * eslint-disable no-plusplus
 * @format
 */

// config
const BOT_FILENAME = 'bot_enirrisky.js'; // <-- change this if you want to use a different bot
const PORT = process.env.PORT || 8080;

// bring in the bot
const Bot = require(`./src/${BOT_FILENAME}`);
const bot = new Bot();

// setup express server
const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const path = require("path");

// set express server to serve static frontend
app.use(express.static(path.resolve(__dirname, "./client/build")));

// setup io for talking with frontend
const server_io = require("socket.io")(server, {
  allowEIO3: true,
  cors: {
    origin: true,
    credentials: true,
  },
});

// runs when frontend makes a connection to this server
server_io.on("connection", (socket) => {
  socket.emit("connection", null);
  bot.log("Connected to the bot");
});

// runs when frontend disconnects
server_io.on("disconnect", () => {
  console.log("Disconnected from client");
});

// global variable for custom game ids
let customGameId = "washington_quickplay";
const userId = process.env.BOT_ID;

// setup io for talking with game server
const base = "https://bot.generals.io";
const game_io = require("socket.io-client")(base);

// this is a socket client setup for talking with the generals.io bot server
game_io.on('connect', () => {
  console.log("Connected to game server");
  bot.log("Connected to game server");


  // the first time you connect a bot to the generals.io bot server,
  // you'll need to send a set_username message to register your bot with the id in your config
  const set_username = false
  if (set_username){
    game_io.on("error_set_username", (error) => {
      if (error) {
        console.error(`ERROR: ${error}`);
      }
    });
    game_io.emit("set_username", process.env.BOT_ID, process.env.BOT_NAME)
  }

  // these are all events that our bot could possibly send to the game server
  // https://dev.generals.io/api
  let send_events = [
    "set_username",
    "play",
    "join_1v1",
    "join_private",
    "set_custom_team",
    "leave_team",
    "cancel",
    "set_force_start",
    "attack",
    "clear_moves",
    "ping_tile",
    "chat_message",
    "leave_game",
    "stars_and_rank",
  ];

  // Each bot should have an em prop which is an event emitter/listener,
  // Here we attach all the events the bot might want to emit to the game server
  // so the bot can communicate with the game server from within its file
  send_events.forEach((event) => {
    // when the bot emits this event
    bot.em.on(event, (...params) => {
      // send the event to the game server
      game_io.emit(event, ...params)
    });
  });

  // Also some additional events that we may call inside our bot
  // we want to emit from this server to our client
  bot.em.on("log", (...params) => {
    // when the bot emits log, send it to the client
    server_io.emit("log", ...params)
  });
  bot.em.on("leave_game", (...params) => {
    // when the bot emits leave_game, send it to the client
    console.log("leave_game bot event fired");
    server_io.emit("leave_game", ...params);
  });

  // These are all events that the game server could possibly send to the bot
  // https://dev.generals.io/api
  let receive_events = [
    "game_start",
    "game_update",
    "game_lost",
    "game_won",
    "chat_message",
    "stars",
    "rank",
  ];

  // Here we attach all the events the game server might want to emit to the bot
  receive_events.forEach((event) => {
    game_io.on(event, (...params) => {
      // when the game server emits this event, we call the the bots method associated with that event,
      // and pass the data from the game server
      // the bot may want to do modify that data and can return it here
      const alt_data = bot?.[event](...params);
      const [data] = params;
      if (event === "game_update") {
        // our server here sends the game update data (possibly modified by our bot) to the client for display
        server_io.emit("game_update", alt_data ?? data);
      }
      if (event === "game_start") {
        // same thing for game start
        server_io.emit("game_start", alt_data ?? data);
      }
    });
  });
});

game_io.on("disconnect", () => {
  const msg = "Disconnected from game server";
  bot.log(msg);
  console.error(msg);
  // let the client know the game servers been disconnected
  server_io.emit('game_disconnected')
  process.exit(1);
});


/*
  Now we define some endpoints our client can call to interact with the game server and/or bot
  TODO: rather than sending these events in each endpoint directly from game_io client, we should
  call the bots methods directly so the bot can have more control.
*/

app.get("/quickplay", (req, res) => {
  console.log("quickplay");
  bot.log("Quickplay selected");
  game_io.emit("join_private", customGameId, userId);
  setTimeout(() => game_io.emit("set_force_start", customGameId, true), 2000);
  res.send({
    url: `http://bot.generals.io/games/${encodeURIComponent(customGameId)}`,
    username: userId,
  });
});

app.get("/rejoin", (req, res) => {
  bot.log(
    `Rejoining http://bot.generals.io/games/${encodeURIComponent(customGameId)}`
  );
  game_io.emit("join_private", customGameId, userId);
  game_io.emit("set_force_start", customGameId, true);
});

app.get("/invite/:game_id", (req, res) => {
  if (req?.params?.game_id) {
    customGameId = req.params.game_id;
  }
  bot.log(`Invited bot to ${customGameId}`);
  game_io.emit("join_private", customGameId, userId);
  game_io.emit("set_force_start", customGameId, true);
  res.send({
    url: `http://bot.generals.io/games/${encodeURIComponent(customGameId)}`,
  });
});

app.get("/1v1", () => {
  bot.log("Joining 1v1");
  game_io.emit("join_1v1", userId);
});

app.get("/ffa", () => {
  bot.log("Joining FFA");
  game_io.emit("play", userId);
});

app.get("/quit", () => {
  bot.log("Quitting the game");
  game_io.emit("cancel", userId);
  game_io.emit("leave_game", userId);
});

// start server
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
