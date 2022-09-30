import React, { useState, useEffect } from "react";
import { Button, Modal } from "react-bootstrap";
import { useRouter } from "next/router";
import { RiAlertFill } from "react-icons/ri";
import { GiGlassCelebration } from "react-icons/gi";
import { IoCheckmarkDoneSharp } from "react-icons/io5";
import { TbHeartHandshake } from "react-icons/tb";
import { useAuth } from "../../context/AuthProvider";

function OperationMsgModal() {
  const router = useRouter();
  const [show, setShow] = useState(false);
  const { authUserFirestore, errorMsg, setErrorMsg, successMsg, setSuccessMsg } = useAuth();

  useEffect(() => {
    (successMsg || errorMsg) && setShow(true);
  }, [successMsg, errorMsg]);

  return (
    <Modal
      show={show}
      onHide={() => {
        setShow(false);
        setSuccessMsg("");
        setErrorMsg("");
        successMsg == "newUser" && router.push("#main");
      }}
      centered
      animation={true}
      className="text-center"
    >
      <Modal.Header closeButton>
        <Modal.Title className="ms-auto">
          {successMsg == "newUser" && (
            <>
              <IoCheckmarkDoneSharp className="mb-1" /> Hi {authUserFirestore?.name}!
            </>
          )}
          {successMsg == "deleteUser" && <span className="ms-3">Your account has been deleted</span>}

          {successMsg && successMsg != "newUser" && successMsg != "deleteUser" && (
            <>
              <IoCheckmarkDoneSharp className="mb-1" /> Success!
            </>
          )}

          {errorMsg && (
            <>
              <RiAlertFill className="mb-1" /> Ups!
            </>
          )}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {successMsg == "newUser" && (
          <>
            <p>Welcome to Bright Light! I&apos;m delighted you signed up.</p>
            <p>Don&apos;t wait and start your adventure now! </p>
            <h1 className="mb-0">
              <GiGlassCelebration />
            </h1>
          </>
        )}
        {successMsg == "deleteUser" && (
          <>
            <p>Good luck and be always in the bright light!</p>
            <p>Cheers!</p>
            <h1 className="mb-0">
              <TbHeartHandshake />
            </h1>
          </>
        )}

        {successMsg && successMsg != "newUser" && successMsg != "deleteUser" && { successMsg }}

        {errorMsg}
      </Modal.Body>
      {/* <Modal.Footer>
        <Button variant="secondary" onClick={() => setShow(false)}>
          Close
        </Button>
      </Modal.Footer> */}
    </Modal>
  );
}

export default OperationMsgModal;
