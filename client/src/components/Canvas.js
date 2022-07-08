import styled from "styled-components";
import Tile from "./Tile";

const Canvas = ({ data, showTileNumbers = true }) => {
  const displayBoard = () => {
    let rows = [];
    let row = [];
    let col_count = 0;
    let row_count = 0;
    for (let i = 0; i < data.size; i++) {
      row.push(
        <Tile key={i} tile={i} data={data} showTileNumbers={showTileNumbers} />
      );
      col_count++;
      if (col_count === data.width) {
        col_count = 0;
        row_count++;
        rows.push(<MapRow key={`row-${row_count}`}>{row}</MapRow>);
        row = [];
      }
    }
    return rows;
  };

  return (
    <StyledCanvas>
      {data && data.meta ? (
        <GameArea>
          <Meta />
          <Board className="Board">{displayBoard()}</Board>
        </GameArea>
      ) : (
        <MessageContainer>
          <Message>No Game Running</Message>
        </MessageContainer>
      )}
    </StyledCanvas>
  );
};
export default Canvas;
const StyledCanvas = styled.div``;
const MessageContainer = styled.div`
  width: 100%;
  display: flex;
  text-align: center;
  background: #fefefe;
  height: 150px;
  align-items: center;
  justify-content: center;
  border-radius: 5px;
  margin: 20px 0;
`;
const GameArea = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  justify-content: center;
  border-radius: 5px;
  margin: 20px 0;
  box-sizing: border-box;
`;
const Board = styled.div`
  margin: 20px;
  background: #f0ead6;
  border-radius: 10px;
  overflow: hidden;
`;
const MapRow = styled.div`
  display: flex;
`;
const Message = styled.div`
  font-size: 30px;
`;
