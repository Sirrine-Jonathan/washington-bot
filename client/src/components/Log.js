import styled from "styled-components";
const Log = ({ log }) => {
  return (
    <>
      <StyledLog>
        {log.map((line) => (
          <div>{line}</div>
        ))}
      </StyledLog>
      <Buffer />
    </>
  );
};

export default Log;

const StyledLog = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: start;
  text-align: center;
  background: #333;
  color: #fff;
  height: 700px;
  padding: 10px;
  border-radius: 5px;
  margin: 20px 0;
  overflow-y: scroll;
`;

const Buffer = styled.div`
  height: 70px;
`;
