import styled from "styled-components";
const Canvas = ({ game }) => {
  const patch = (old, diff) => {
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
  const parse = (game) => {
    return JSON.stringify(game, null, 2);
  };
  return (
    <StyledCanvas>
      <Container>{game ? parse(game) : <div>No Game Running</div>}</Container>
    </StyledCanvas>
  );
};
export default Canvas;

const StyledCanvas = styled.div``;
const Container = styled.div`
  width: 100%;
  display: flex;
  text-align: center;
  background: #fefefe;
  height: 500px;
  align-items: center;
  justify-content: center;
  border-radius: 5px;
  margin: 20px 0;
`;
