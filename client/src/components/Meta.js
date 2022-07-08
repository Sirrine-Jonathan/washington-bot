import styled from "styled-components";

const Meta = ({ data }) => {
  return (
    <MetaStyled>
      <MetaTitle>Game Information</MetaTitle>
      <MetaRow>
        <MetaLabel>Player Index:</MetaLabel>
        {meta.playerIndex}
      </MetaRow>
      <MetaRow>
        <MetaLabel>Replay URL:</MetaLabel>
        <a href={meta.replay_url}>{meta.replay_url}</a>
      </MetaRow>
      <div>
        <MetaLabel>Players:</MetaLabel>
        {meta?.usernames &&
          meta?.usernames.map((username, idx) => {
            return (
              <MetaSub key={username}>
                <MetaLabel>{idx}:</MetaLabel>
                {username}
              </MetaSub>
            );
          })}
      </div>
    </MetaStyled>
  )
}

export default Meta;

const MetaStyled = styled.div`
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