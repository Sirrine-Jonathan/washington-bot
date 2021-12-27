import { useState, useEffect } from "react";
import { Input, Button, Modal, Icon, Dropdown } from "semantic-ui-react";
import styled from "styled-components";

const MapPreview = () => {
  return null;
};

const MapModal = ({ open, setOpen }) => {
  const [map, setMap] = useState("");
  const [options, setOptions] = useState([]);
  useEffect(() => {
    // fetch("/mapOptions")
    //   .then((res) => res.json())
    //   .then((data) => {
    //     setOptions(data);
    //   });
  }, []);
  return (
    <Modal
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
    >
      <Modal.Header>Pick a test map</Modal.Header>
      <Modal.Actions>
        <MapPreview map={map} />
        <Row>
          <Dropdown placeholder="Select Map" selection options={options} />
          <StyledButton secondary onClick={setMap}>
            <div>Submit</div>
          </StyledButton>
        </Row>
      </Modal.Actions>
    </Modal>
  );
};

export default MapModal;

const Row = styled.div`
  display: flex;
  justify-content: start;
  align-items: center;
  box-sizing: border-box;
`;

const StyledButton = styled(Button)`
  display: flex !important;
  flex-wrap: no-wrap !important;
  flex-direction: row !important;
  justify-content: center;
  align-items: center;
  margin-left: 10px !important;
  & div {
    padding-left: 5px;
  }
`;
