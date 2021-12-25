import styled from "styled-components";
import { useEffect, useRef } from "react";
const Log = ({ log }) => {
  const ref = useRef();
  useEffect(() => {
    ref.current.scrollTop = ref.current.scrollHeight;
  });
  return (
    <>
      <StyledLog ref={ref}>
        {log.map((line, idx) => (
          <div key={idx}>{line}</div>
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
