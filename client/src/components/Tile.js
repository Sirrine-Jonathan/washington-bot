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

export default Tile;

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
    background: green;
    color: #fff;
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
