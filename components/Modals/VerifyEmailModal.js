import { sendEmailVerification } from "firebase/auth";
import React, { useState, useEffect } from "react";
import { Button, Modal, Spinner } from "react-bootstrap";
import { RiAlertFill } from "react-icons/ri";
import { useAuth } from "../../context/AuthProvider";
import { IoCheckmarkDoneSharp } from "react-icons/io5";

function VerifyEmailModal(props) {
  const locale = props.locale;
  const [show, setShow] = useState(false);
  const [sending, setSending] = useState(false);
  const [sended, setSended] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const { authUserCredential, refreshCredentials } = useAuth();
  const verified = authUserCredential.emailVerified;
  const sleep = (milliseconds) => {
    return new Promise((resolve) => setTimeout(resolve, milliseconds));
  };

  useEffect(() => {
    props.show ? setShow(true) : setShow(false);
  }, [props.show]);

  useEffect(() => {
    verified && closeModalFunc();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [verified]);

  const closeModalFunc = async () => {
    await sleep(1000);
    props.closeModal(false);
  };

  const t = {
    en: {
      p1: "Please verify your email.",
      link: "Click here ",
      endMsg: "to send activation link again.",
      sended: "Sent! Check your email and open the activation link.",
      refresh: "Refresh!",
    },
    pl: {
      p1: "Zweryfikuj swój adres e-mail.",
      link: "Kliknij tutaj, ",
      endMsg: "aby wysłać ponownie link aktywacyjny.",
      sended: "Wysłano! Sprawdź swoją pocztę i otwórz link aktywacyjny.",
      refresh: "Odśwież!",
    },
  };
  const resendEmail = async () => {
    setSending(true);
    // Send verification email
    try {
      await sendEmailVerification(authUserCredential);
      console.log("ended");
      await sleep(900);
    } catch (error) {
      console.error(error);
      setError("Error sending email");
    }
    setSended(true);
    setSending(false);
  };

  const refreshUser = async () => {
    setLoading(true);
    try {
      await refreshCredentials();
    } catch (error) {
      console.log(error);
    }
    await sleep(500);
    setLoading(false);
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
            variant={verified ? "success" : "warning"}
            onClick={!verified && refreshUser}
            disabled={loading || verified}
          >
            {loading ? (
              <>
                <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
              </>
            ) : (
              <>
                {verified ? (
                  <IoCheckmarkDoneSharp style={{ width: "20px", height: "20px" }} />
                ) : (
                  <span>{t[locale].refresh}</span>
                )}
              </>
            )}
          </Button>
        </Modal.Footer>
      ) : null}
    </Modal>
  );
}

export default VerifyEmailModal;
