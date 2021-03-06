/**
 * Main Bot File, same for everybot
 *
 * eslint-disable no-continue
 * eslint-disable no-unused-vars
 * eslint-disable no-plusplus
 * @format
 */

// config
const PORT = process.env.PORT || 8080;

// bring in the bot
const Bot = require("./src/bot.js");
const bot = new Bot();

// setup express server
const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const path = require("path");

// set express server to serve static frontend
app.use(express.static(path.resolve(__dirname, "./client/build")));

// setup io for talking with client
const client_io = require("socket.io")(server, {
  allowEIO3: true,
  cors: {
    origin: true,
    credentials: true,
  },
});
client_io.on("connection", (socket) => {
  console.log("Connected to bot client");
  socket.emit("connection", null);
  bot.log("Connected to bot server");
});

client_io.on("disconnect", () => {
  console.log("Disconnected from client");
});

// setup io for talking with game server
const base = "https://bot.generals.io";
const game_io = require("socket.io-client")(base);

// global variable for custom game ids
let customGameId = "washington_quickplay";
const userId = process.env.BOT_ID;

game_io.on("disconnect", () => {
  console.log("Disconnected from game server");
  bot.log("Disconnected from game server");
  console.error("Disconnected from server.");
  process.exit(1);
});

game_io.on("connect", () => {
  console.log("Connected to game server");
  bot.log("Connected to game server");

  game_io.on("error_set_username", (error) => {
    if (error) {
      console.error(`ERROR: ${error}`);
    }
  });

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
  send_events.forEach((event) => {
    bot.em.on(event, (...params) => game_io.emit(event, ...params));
  });
  bot.em.on("log", (...params) => client_io.emit("log", ...params));
  bot.em.on("leave_game", (...params) => {
    console.log("leave_game bot event fired");
    client_io.emit("leave_game", ...params);
  });

  let receive_events = [
    "game_start",
    "game_update",
    "game_lost",
    "game_won",
    "chat_message",
    "stars",
    "rank",
  ];
  receive_events.forEach((event) => {
    game_io.on(event, (data) => {
      let alt_data = bot?.[event](data);
      if (event === "game_update") {
        client_io.emit("game_update", alt_data ?? data);
      }
      if (event === "game_start") {
        client_io.emit("game_start", data);
      }
    });
  });
});

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
