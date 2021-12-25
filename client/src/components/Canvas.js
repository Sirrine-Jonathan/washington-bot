import { useState } from "react";
import styled from "styled-components";

const Tile = ({ tile, data, showTileNumbers }) => {
  const TILE_EMPTY = -1;
  const TILE_MOUNTAIN = -2;
  const TILE_FOG = -3;
  const TILE_FOG_OBSTACLE = -4;
  const terrain = data.terrain;
  const armies = data.armies;
  const usernames = data?.meta?.usernames;
  const playerIndex = data?.meta?.playerIndex;
  const playerColors = data?.meta?.playerColors;
  const isCity = data?.cities?.includes(tile);
  let army_count = null;
  let classes = [];
  if (terrain[tile] === TILE_EMPTY) {
    classes.push("empty");
  } else if (terrain[tile] === TILE_MOUNTAIN) {
    classes.push("mountain");
  } else if (terrain[tile] === TILE_FOG) {
    classes.push("fog");
  } else if (terrain[tile] === TILE_FOG_OBSTACLE) {
    classes.push("fog-obstacle");
  } else if (terrain[tile] >= 0) {
    if (terrain[tile] === playerIndex) {
      classes.push("owned");
      if (tile === data.general_tile) {
        classes.push("owned-general");
      }
    } else {
      let num = terrain[tile];
      classes.push(`enemy`);
      classes.push(`enemy-${num}`);
      classes.push(usernames[num]);
      classes.push(`color-${playerColors[num]}`);
    }
    army_count = <ArmyCount>{armies[tile]}</ArmyCount>;
  }
  if (isCity) {
    classes.push("city");
    army_count = <ArmyCount>{armies[tile]}</ArmyCount>;
  }
  if (data?.current_path && data?.current_path.includes(tile)) {
    classes.push("path-tile");
  }
  if (data.current_target === tile) {
    classes.push("current-target");
  }
  if (data.random_from === tile) {
    classes.push("random-from");
  }
  if (classes.includes("current-target")) {
    console.log(`set class current-target on tile ${tile}`);
  }
  return (
    <StyledTile className={classes.join(" ")} data-tile={tile}>
      {army_count}
      {showTileNumbers && <TileNumber>{tile}</TileNumber>}
    </StyledTile>
  );
};

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
          <Meta>
            <MetaTitle>Game Information</MetaTitle>
            <MetaRow>
              <MetaLabel>Player Index:</MetaLabel>
              {data?.meta.playerIndex}
            </MetaRow>
            <MetaRow>
              <MetaLabel>Replay URL:</MetaLabel>
              <a href={data?.meta.replay_url}>{data?.meta.replay_url}</a>
            </MetaRow>
            <div>
              <MetaLabel>Players:</MetaLabel>
              {data?.meta?.usernames &&
                data?.meta?.usernames.map((username, idx) => {
                  return (
                    <MetaSub key={username}>
                      <MetaLabel>{idx}:</MetaLabel>
                      {username}
                    </MetaSub>
                  );
                })}
            </div>
          </Meta>
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
const Meta = styled.div`
  width: 100%;
  background: rgba(255, 255, 255, 0.8);
  color: #000;
  border-radius: 10px;
  padding: 15px 30px;
  font-size: 15px;
`;
const MetaTitle = styled.div`
  font-size: 30px;
  color: #000;
  text-shadow: 1px 1px 3px solid #eee;
  padding: 10px 0 20px;
`;
const MetaRow = styled.div`
  display: flex;
`;
const MetaSub = styled.div`
  display: flex;
  margin-left: 15px;
`;
const MetaLabel = styled.div`
  margin-right: 10px;
  font-weight: bold;
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
const ArmyCount = styled.div`
  position: absolute;
  left: 3px;
  bottom: 7px;
  font-size: 25px;
  font-weight: bold;
`;
const TileNumber = styled.div`
  position: absolute;
  top: 0;
  right: 5px;
  font-size: 10px;
`;
const StyledTile = styled.div`
  position: relative;
  width: 50px;
  height: 50px;
  margin: 1px;
  display: flex;
  justify-content: center;
  box-sizing: border-box;
  align-items: center;
  color: #000;
  background: #e2d7b1;
  border-radius: 10px;
  &.owned {
    background: #2185d0;
    color: #fff;
  }
  &.owned-general {
    background: gold;
    color: #000;
  }
  &.empty {
    background: #f0ead6;
    box-shadow: 2px 2px 3px #e2d7b1;
    color: #000;
  }
  &.mountain {
    background: black;
    color: #fff;
  }
  &.enemy {
    background: red;
    color: #fff;
  }
  &.city {
    background: purple;
    color: #fff;
  }
  &.path-tile {
    background: green;
    color: #fff;
  }
  &.current-target {
    background: gold;
    color: #000;
  }
  &.random-from {
    background: #feeaee;
    color: #000;
  }
  &.current-path &::before {
    content: attr("data-tile");
    position: absolute;
  }
`;
