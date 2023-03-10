import Image from "next/image";
import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import { Button, Modal } from "react-bootstrap";
import styles from "../../styles/components/CookieModal.module.scss";
import cookie from "../../public/img/cookies/cookie.webp";
import { useDeviceStore } from "../../stores/deviceStore";

function CookieModal(props) {
  const router = useRouter();
  const locale = router.locale;
  const [show, setShow] = useState(true);
  const isMobile = useDeviceStore((state) => state.isMobile);
  const footerHeight = "60px";

  // useEffect(() => {
  //   props.msg ? setShow(true) : setShow(false);
  // }, [props.msg]);

  const t = {
    en: {
      cookies: "Cookies!",
      weUse: "We use cookies to make your experience better",
      policy: "Cookies Policy",
      confirm: "OK",
    },
    pl: {
      cookies: "Ciasteczka!",
      weUse: "Używamy plików cookie, aby poprawić Twoje wrażenia",
      policy: "Polityka Cookies",
      confirm: "OK",
    },
  };
  return (
    <Modal
      show={show}
      onHide={() => {
        setShow(false);
      }}
      centered
      size="sm"
      animation={true}
      backdrop="static"
      keyboard={false}
      contentClassName={styles.modal}
    >
      <Modal.Body className="rounded-0 text-center">
        <div className="text-center" style={{ position: "relative", height: isMobile ? "150px" : "200px" }}>
          <Image src={cookie} alt="coockie" fill style={{objectFit:"contain"}}/>
        </div>
        <p className="mt-1 fs-4">
          <strong>{t[locale].cookies}</strong>
        </p>
        <p>{t[locale].weUse}</p>
      </Modal.Body>
      <Modal.Footer className="p-0 m-0 d-flex justify-content-between" style={{ height: footerHeight }}>
        <Button
          className="m-0"
          style={{ height: footerHeight, width: "50%", borderRadius: "0px 0px 0px 20px" }}
          variant="outline-secondary"
          onClick={() => {
            setShow(false);
          }}
        >
          <small>{t[locale].policy}</small>
        </Button>
        <Button
          className="m-0 border-none"
          style={{ height: footerHeight, width: "50%", borderRadius: "0px 0px 20px 0px" }}
          variant="secondary"
          onClick={() => {
            setShow(false);
          }}
        >
          <span className="fs-5">{t[locale].confirm}</span>
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default CookieModal;
