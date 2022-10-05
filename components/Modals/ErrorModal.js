import React, { useState, useEffect } from "react";
import { Button, Modal } from "react-bootstrap";
import { RiAlertFill } from "react-icons/ri";

function ErrorModal(props) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    props.msg && setShow(true);
  }, [props.msg]);

  return (
    <Modal
      show={show}
      onHide={() => {
        setShow(false);
        props.resetMsg("");
      }}
      centered
      animation={true}
      className="text-start"
    >
        <Modal.Header className="bg-secondary text-light" closeButton closeVariant="white">
          <Modal.Title>
            <RiAlertFill className="mb-1" /> Ups!
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>{props.msg}</Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => {
              setShow(false);
              props.resetMsg("");
            }}
          >
            Close
          </Button>
        </Modal.Footer>
      
    </Modal>
  );
}

export default ErrorModal;
