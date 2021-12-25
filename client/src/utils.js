export const getLeft = (tile, width) => tile - 1;
export const getRight = (tile, width) => tile + 1;
export const getDown = (tile, width) => tile + this.width;
export const getUp = (tile, width) => tile - this.width;

export const patch = (old, diff) => {
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

export const isEnemy = (tile, terrain, playerIndex) => {
  return terrain[tile] !== playerIndex && terrain[tile] >= 0;
};

export const getSurrounding = (tile, width) => {
  return [
    getUp(tile, width),
    getRight(tile, width),
    getDown(tile, width),
    getLeft(tile, width),
  ];
};
