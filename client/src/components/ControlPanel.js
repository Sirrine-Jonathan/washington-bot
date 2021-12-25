import { useState } from "react";
import { Card, Input, Button, Icon, Divider, Image } from "semantic-ui-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styled from "styled-components";
const ControlPanel = ({ bot }) => {
  const [gameID, setGameID] = useState("sirrine");
  const quit = () => {
    fetch(`/quit`)
      .then((res) => res.json())
      .then((data) => {
        toast(
          <StyledLink href={`${data.url}`} target="_blank" rel="noreferrer">
            Quit Game!
          </StyledLink>
        );
      });
  };
  const quickplay = () => {
    fetch(`/quickplay`)
      .then((res) => res.json())
      .then((data) => {
        window.open(data.url, "_blank");
      });
  };
  const invite = (dir) => {
    fetch(`/invite/${gameID}`)
      .then((res) => res.json())
      .then((data) => {
        toast(
          <StyledLink href={`${data.url}`} target="_blank" rel="noreferrer">
            Game Starting!
          </StyledLink>
        );
      });
  };
  const join = () => {
    fetch(`/rejoin`)
      .then((res) => res.json())
      .then((data) => {
        toast(
          <StyledLink href={`${data.url}`} target="_blank" rel="noreferrer">
            Rejoined!
          </StyledLink>
        );
      });
  };
  const challenge = () => {
    fetch(`/1v1`)
      .then((res) => res.json())
      .then((data) => {
        toast(
          <StyledLink href={`${data.url}`} target="_blank" rel="noreferrer">
            Joining 1v1
          </StyledLink>
        );
      });
  };
  const play = () => {
    fetch(`/ffa`)
      .then((res) => res.json())
      .then((data) => {
        toast(
          <StyledLink href={`${data.url}`} target="_blank" rel="noreferrer">
            Joining FFA
          </StyledLink>
        );
      });
  };
  return (
    <Card.Group>
      <Card fluid>
        <Card.Content>
          <Card.Header
            style={{ display: "flex", justifyContent: "space-between" }}
          >
            <ControlTitle>Control Panel</ControlTitle>
            <Row>
              <StyledInput
                type="text"
                value={gameID}
                placeholder="Game ID"
                onChange={(e) => {
                  setGameID(e.target.value);
                }}
              />
              <StyledButton secondary onClick={invite}>
                <Icon name="envelope" />
                <div>Invite</div>
              </StyledButton>
            </Row>
          </Card.Header>
          <Divider />
          <ButtonRow>
            <StyledButton color="red" onClick={quit}>
              <Icon name="close icon" />
              <div>Quit</div>
            </StyledButton>
            <StyledButton primary onClick={quickplay}>
              <Icon name="game" />
              <div>Quick Play</div>
            </StyledButton>
            <StyledButton primary onClick={challenge}>
              <Icon name="game" />
              <div>1v1</div>
            </StyledButton>
            <StyledButton primary onClick={play}>
              <Icon name="game" />
              <div>Free-for-All</div>
            </StyledButton>
            <StyledButton secondary onClick={join}>
              <Icon name="redo alternate" />
              <div>Ready Up</div>
            </StyledButton>
          </ButtonRow>
        </Card.Content>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar
          newestOnTop={false}
          closeOnClick={false}
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </Card>
    </Card.Group>
  );
};

export default ControlPanel;

const Row = styled.div`
  display: flex;
  justify-content: start;
  box-sizing: border-box;
`;

const ButtonRow = styled.div`
  display: flex;
  flex: 1;
  width: 100%;
  justify-content: center;
  box-sizing: border-box;
`;

const StyledInput = styled(Input)`
  margin-right: 4px;
`;

const StyledButton = styled(Button)`
  display: flex !important;
  flex-wrap: no-wrap !important;
  flex-direction: row !important;
  justify-content: center;
  align-items: center;
  & div {
    padding-left: 5px;
  }
`;

const StyledLink = styled.a`
  text-decoration: none;
  font-size: 16px;
  color: #000;
  &:hover {
    color: #333;
    text-decoration: underline;
  }
`;

const ControlTitle = styled.div`
  font-size: 30px;
  padding: 10px;
`;
