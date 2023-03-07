import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import { TbHeartHandshake } from "react-icons/tb";

function DeleteUserModal(props) {
  const router = useRouter();
  const locale = router.locale;
  const [show, setShow] = useState(false);

  useEffect(() => {
    props.msg == "deleteUser" && setShow(true);
  }, [props.msg]);

  const t = {
    en: {
      h1: "ACCOUNT DELETED",
      bye: "Good luck and be always in the bright light!",
      cheers: "Cheers!"
    },
    pl: {
      h1: "KONTO USUNIĘTE",
      bye: "Powodzenia i krocz zawszę jasną ścieżką!",
      cheers: "Bright Light Gypsy"
    },
  };

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
        <h1 className="fs-2 mt-0 mb-0">{t[locale].h1}</h1>
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
        <p>{t[locale].bye}</p>
        <p>{t[locale].cheers}</p>
        <h1 className="mb-0">
          <TbHeartHandshake />
        </h1>
      </Modal.Body>
    </Modal>
  );
}

export default DeleteUserModal;
