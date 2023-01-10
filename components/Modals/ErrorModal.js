import React, { useState, useEffect } from "react";
import { Button, Modal } from "react-bootstrap";
import { RiAlertFill } from "react-icons/ri";
import Link from "next/link";

function ErrorModal(props) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    props.msg ? setShow(true) : setShow(false);
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
          <RiAlertFill className="mb-1" /> Ups!
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {props.msg == "sign" ? (
          <p>
            It looks like you are not signed in, please{" "}
            <Link
              href="/sign-in"
              onClick={() => {
                props.closeModal("");
              }}
            >
              Sign In
            </Link>{" "}
            first.
          </p>
        ) : (
          props.msg
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="secondary"
          onClick={() => {
            props.closeModal("");
          }}
        >
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ErrorModal;
