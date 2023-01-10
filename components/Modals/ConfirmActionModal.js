import React, { useState, useEffect } from "react";
import { Button, Modal, Spinner } from "react-bootstrap";
import { TbTrashX } from "react-icons/tb";

function ConfirmActionModal(props) {
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    props.msg ? setShow(true) : setShow(false);
    setLoading(false);
  }, [props.msg]);

  return (
    <Modal
      show={show}
      onHide={() => {
        props.closeModal("");
      }}
      centered
      animation={true}
      className="text-start"
    >
      <Modal.Header className="bg-secondary text-light" closeButton closeVariant="white">
        <Modal.Title>
          <TbTrashX className="mb-1 me-2" />
          Are you sure?
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>{props.msg}</Modal.Body>
      <Modal.Footer>
        <Button
          className="me-3"
          variant="outline-secondary"
          onClick={() => {
            props.closeModal();
          }}
        >
          Go Back
        </Button>
        <Button
          variant="secondary"
          onClick={() => {
            props.action();
            setLoading(true);
          }}
        >
          {loading ? (
            <>
              <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
              <span>Loading...</span>
            </>
          ) : (
            <span> Confirm </span>
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ConfirmActionModal;
