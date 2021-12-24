import { useEffect, useState } from "react";
import io from "socket.io-client";
import styled from "styled-components";
import { Container, Icon, Image } from "semantic-ui-react";
import PageHeader from "../components/PageHeader";
import PageContainer from "../components/PageContainer";
import Log from "../components/Log";
import Canvas from "../components/Canvas";
import ControlPanel from "../components/ControlPanel";
const ENDPOINT = "http://localhost:8080";

const HomePage = () => {
  const [game, setGame] = useState(null);
  const [log, setLog] = useState([]);

  useEffect(() => {
    const socket = io(ENDPOINT);
    socket.on("game_update", (data) => {
      setGame(data);
    });
    socket.on("log", (line) => {
      setLog(line);
    });
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
        <Canvas game={game} />
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
