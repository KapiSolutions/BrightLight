import React, { useState, useEffect } from "react";
import { Button, Modal } from "react-bootstrap";
import { RiAlertFill } from "react-icons/ri";

function VerifyEmailModal(props) {
  const locale = props.locale;
  const [show, setShow] = useState(false);
  const [sending, setSending] = useState(false);
  const [sended, setSended] = useState(false);

  useEffect(() => {
    props.show ? setShow(true) : setShow(false);
  }, [props.show]);

  const sleep = (milliseconds) => {
    return new Promise((resolve) => setTimeout(resolve, milliseconds));
  };

  const t = {
    en: {
      p1: "Please verify your email.",
      link: "Click here ",
      endMsg: "to send activation link again.",
      close: "Refresh!",
    },
    pl: {
      p1: "Zweryfikuj swój adres e-mail.",
      link: "Kliknij tutaj, ",
      endMsg: "aby wysłać ponownie link aktywacyjny.",
      sended: "Wysłano! Sprawdź swoją pocztę i otwórz link aktywacyjny.",
      close: "Odśwież!",
    },
  };
  const resendEmail = async () => {
    setSending(true);
    await sleep(1000);
    setSended(true);
    setSending(false);
    console.log("resendEmail");
  };

  const fadeOut = {
    opacity: 0,
    transition: "opacity .5s linear",
    WebkitTransition: "opacity .2s linear",
    MozTransition: "opacity .5s linear",
  };
  return (
    <Modal
      show={show}
      onHide={() => {
        props.closeModal(false);
      }}
      centered
      animation={true}
      className="text-start"
    >
      <Modal.Header className="bg-warning text-dark" closeButton>
        <Modal.Title>
          <RiAlertFill className="mb-1" /> Ups!
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>{t[locale].p1}</p>
        {sended ? (
          <span>{t[locale].sended}</span>
        ) : (
          <div style={sending ? fadeOut : null}>
            <span onClick={resendEmail} className="text-decoration-underline pointer">
              {t[locale].link}
            </span>
            <span>{t[locale].endMsg}</span>
          </div>
        )}
      </Modal.Body>
      {sended ? (
        <Modal.Footer>
          <p>Aktywowałeś? Odśwież profil {`->`}</p>
          <Button
            variant="warning"
            onClick={() => {
              props.closeModal(false);
            }}
          >
            {t[locale].close}
          </Button>
        </Modal.Footer>
      ) : null}
    </Modal>
  );
}

export default VerifyEmailModal;
