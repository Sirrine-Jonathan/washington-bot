import { useEffect, useState, useRef } from "react";
import io from "socket.io-client";
import styled from "styled-components";
import { Container, Icon, Image } from "semantic-ui-react";
import PageHeader from "../components/PageHeader";
import PageContainer from "../components/PageContainer";
import Log from "../components/Log";
import Canvas from "../components/Canvas";
import ControlPanel from "../components/ControlPanel";
import { patch, isPerimeter, isEnemy } from "../utils";
const ENDPOINT = "http://localhost:8080";

const HomePage = () => {
  const [game, setGame] = useState({
    meta: null,
    map: [],
    width: 0,
    height: 0,
    size: 0,
    generals: [],
    cities: [],
    terrain: [],
    owned: [],
    enemies: [],
    perimeter: [], // TODO: determine perimeter on update
  });
  const gameRef = useRef(game);
  useEffect(() => {
    gameRef.current = game;
  });
  const [log, setLog] = useState([]);
  const logRef = useRef(log);
  useEffect(() => {
    logRef.current = log;
  });

  const game_start_handler = (data) => {
    console.log("game_start", data);
    // handle a few things at start of game
    const newGame = {
      ...gameRef.current,
      meta: {
        replay_url: `http://bot.generals.io/replays/${encodeURIComponent(
          data.replay_id
        )}`,
        ...data,
      },
    };
    setGame(newGame);
  };

  const game_update_handler = (data) => {
    console.log({ data });
    if (data === null) return false;
    if (gameRef?.current?.meta === null) return false;

    // tick data
    const internal_tick = data.turn / 2;
    const game_tick = Math.ceil(internal_tick);
    const ticks_til_payday = 25 - (game_tick % 25);

    // map data
    const map = patch(gameRef?.current?.map, data.map_diff);
    const cities = patch(gameRef?.current?.cities, data.cities_diff);
    const generals = data.generals;
    const width = map[0];
    const height = map[1];
    const size = width * height;
    const armies = map.slice(2, gameRef?.current?.size + 2);
    const terrain = map.slice(gameRef?.current?.size + 2);
    const owned = terrain
      .map((tile, idx) => {
        if (tile === gameRef?.current?.meta?.playerIndex) {
          return idx;
        }
        return null;
      })
      .filter((tile) => tile !== null);
    const enemies = terrain
      .map((tile, idx) => {
        if (isEnemy(idx, terrain, gameRef?.current?.meta?.playerIndex)) {
          return idx;
        }
        return null;
      })
      .filter((tile) => tile !== null);
    const newGame = {
      ...gameRef.current,
      internal_tick,
      game_tick,
      ticks_til_payday,
      map,
      cities,
      generals,
      armies,
      terrain,
      owned,
      enemies,
      current_path: data.current_path,
      current_target: data.current_target,
      random_from: data.random_from,
    };

    // first tick stuff
    if (
      data.turn === 1 ||
      gameRef?.current?.width === 0 ||
      gameRef?.current?.height === 0
    ) {
      console.log("setting first tick stuff");
      newGame["general_tile"] =
        data.generals[gameRef?.current?.meta?.playerIndex];
      newGame["width"] = width;
      newGame["height"] = height;
      newGame["size"] = size;
      console.log("FIRST TICK GAME", newGame);
    }

    setGame(newGame);
  };

  const leave_game_handler = () => {
    console.log("leave_game_handler");
    setGame({
      meta: null,
      internal_tick: 0,
      game_tick: 0,
      ticks_til_payday: 25,
      map: [],
      generals: [],
      cities: [],
      terrain: [],
      owned: [],
      enemies: [],
      perimeter: [], // TODO: determine perimeter on update
    });
  };

  const log_handler = (line) => {
    setLog(line);
  };

  useEffect(() => {
    const socket = io(ENDPOINT);
    socket.on("game_update", game_update_handler);
    socket.on("game_start", game_start_handler);
    socket.on("leave_game", leave_game_handler);
    socket.on("log", log_handler);
    return () => {
      socket.off("game_update", game_update_handler);
      socket.off("game_start", game_start_handler);
      socket.off("leave_game", leave_game_handler);
      socket.off("log", log_handler);
    };
  }, []);

  return (
    <PageContainer>
      <PageHeader>
        <Row>
          <ImageContainer
            href="https://generals.io/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              src="/robot.png"
              style={{ width: "50px", marginTop: "-5px" }}
            />
          </ImageContainer>
          <a
            href="https://github.com/Sirrine-Jonathan/generals-bots.git"
            target="_blank"
            rel="noreferrer"
            style={{ marginRight: "15px" }}
          >
            <Icon name="github" style={{ color: "#fff" }} size="huge" />
          </a>
          <Col>
            <h1>Washington</h1>
            <h4>Generals.io Bot</h4>
          </Col>
        </Row>
      </PageHeader>
      <Container>
        <Canvas data={game} />
        <ControlPanel />
        <Log log={log} />
      </Container>
    </PageContainer>
  );
};
export default HomePage;

const Row = styled.div`
  display: flex;
  align-items: center;
`;

const ImageContainer = styled.a`
  background: #fff;
  border-radius: 60px;
  height: 60px;
  width: 60px;
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 15px;
  cursor: pointer;
`;

const Col = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  color: white;
  & * {
    margin: 0;
  }
`;
