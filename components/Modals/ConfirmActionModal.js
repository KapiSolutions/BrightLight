import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import { Button, Modal, Spinner } from "react-bootstrap";
import { TbTrashX } from "react-icons/tb";

function ConfirmActionModal(props) {
  const router = useRouter();
  const locale = router.locale;
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    props.msg ? setShow(true) : setShow(false);
    setLoading(false);
  }, [props.msg]);

  const t = {
    en: {
      sure: "Are you sure?",
      back: "Go Back",
      loading: "Loading...",
      confirm: "Confirm",
    },
    pl: {
      sure: "Jesteś pewien(a)?",
      back: "Wróć",
      loading: "Ładuję...",
      confirm: "Potwierdzam",
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
          <TbTrashX className="mb-1 me-2" />
          {t[locale].sure}
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
          {t[locale].back}
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
              <span> {t[locale].loading}</span>
            </>
          ) : (
            <span>{t[locale].confirm}</span>
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ConfirmActionModal;
