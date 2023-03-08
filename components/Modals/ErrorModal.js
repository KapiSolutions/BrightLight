import React, { useState, useEffect } from "react";
import { Button, Modal } from "react-bootstrap";
import { RiAlertFill } from "react-icons/ri";
import Link from "next/link";

function ErrorModal(props) {
  const locale = props.locale;
  const [show, setShow] = useState(false);

  useEffect(() => {
    props.msg ? setShow(true) : setShow(false);
  }, [props.msg]);

  const t = {
    en: {
      notSignIn: "It looks like you are not signed in, please",
      signIn: "Sign In",
      signEnd: "first.",
      close: "Close",
    },
    pl: {
      notSignIn: "Wygląda na to, że nie jesteś zalogowany,",
      signIn: "Zaloguj się,",
      signEnd: "aby kontynuować.",
      close: "Zamknij",
    },
  };
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
            {t[locale].notSignIn}{" "}
            <Link
              href="/sign-in"
              onClick={() => {
                props.closeModal("");
              }}
            >
              {t[locale].signIn}
            </Link>{" "}
            {t[locale].signEnd}
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
          {t[locale].close}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ErrorModal;
