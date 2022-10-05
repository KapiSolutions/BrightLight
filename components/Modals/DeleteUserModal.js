import React, { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import { TbHeartHandshake } from "react-icons/tb";

function DeleteUserModal(props) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    props.msg == "deleteUser" && setShow(true);
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
      className="text-center text-dark"
    >
      <Modal.Header className="text-center justify-content-center">
        <h1 className="fs-2 mt-0 mb-0">ACCOUNT DELETED</h1>
        <span
          style={{ position: "absolute", top: "12px", right: "20px" }}
          className="Hover pointer fs-3"
          onClick={() => {
            setShow(false);
            props.resetMsg("");
          }}
        >
          X
        </span>
      </Modal.Header>
      <Modal.Body>
        <p>Good luck and be always in the bright light!</p>
        <p>Cheers!</p>
        <h1 className="mb-0">
          <TbHeartHandshake />
        </h1>
      </Modal.Body>
    </Modal>
  );
}

export default DeleteUserModal;
