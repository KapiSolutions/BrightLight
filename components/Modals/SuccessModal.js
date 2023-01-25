import React, { useState, useEffect, useRef } from "react";
import { Button, Modal } from "react-bootstrap";
import { GiBeerStein, GiCharm } from "react-icons/gi";
import { Fireworks } from "@fireworks-js/react";
//https://www.cssscript.com/firework-animation-canvas/

function SuccessModal(props) {
  const [show, setShow] = useState(false);
  const fireRef = useRef();

  useEffect(() => {
    if (props.msg) {
      setShow(true);
      fireRef.current.start();
    } else {
      setShow(false);
      fireRef.current.stop();
      fireRef.current.clear();
    }
  }, [props.msg]);

  return (
    <>
      <Modal show={show} onHide={props.closeFunc} centered animation={true} className="text-start">
        <Modal.Header className="bg-success text-light" closeButton closeVariant="white">
          <Modal.Title>
            <GiCharm className="mb-1" /> Yeah!
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>{props.msg}</Modal.Body>
        <Modal.Footer>
          <Button variant="success" className="text-light" onClick={props.closeFunc}>
            {props.btn}
          </Button>
        </Modal.Footer>
      </Modal>
      <Fireworks
        ref={fireRef}
        options={{
          opacity: 1,
          friction: 1,
          particles: 50,
          traceSpeed: 10,
          acceleration: 1,
          lineStyle: "round",
          hue: {
            min: 296,
            max: 331,
          },
        }}
        style={{
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          position: "fixed",
          background: "none",
        }}
      />
    </>
  );
}

export default SuccessModal;
