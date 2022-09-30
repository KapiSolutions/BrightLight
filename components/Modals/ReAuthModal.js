import React, { useState, useRef, useEffect } from "react";
import { Button, Modal, FloatingLabel, Form, Spinner, InputGroup, Alert } from "react-bootstrap";
import { FaRegEyeSlash, FaRegEye, FaFacebookSquare } from "react-icons/fa";
import { GrSecure, GrInsecure, GrTwitter } from "react-icons/gr";
import { RiAlertFill } from "react-icons/ri";
import { FcGoogle } from "react-icons/fc";
import { IoCheckmarkDoneSharp } from "react-icons/io5";
import { useAuth } from "../../context/AuthProvider";

function ReAuthModal(props) {
  const [show, setShow] = useState(false);
  const emailRef = useRef();
  const passRef = useRef();
  const [error, setError] = useState("");
  const [message, setMessage] = useState(""); //operation msg of reauthenticateUser
  const [messageOp, setMessageOp] = useState(""); //operation msg of user data changes
  const [loading, setLoading] = useState(false);
  const [inputType, setInputType] = useState("password");
  const { authUserFirestore, reauthenticateUser, deleteAccount, updateProfile } = useAuth();
  const provider = authUserFirestore?.signProvider;
  const email = authUserFirestore?.email;

  useEffect(() => {
    if (props.show) {
      setShow(props.show);
      setError("");
      setMessage("");
      setMessageOp("");
    }
  }, [props.show]);

  async function handleReauthenticate(e) {
    e.preventDefault();
    try {
      setError("");
      setMessage("");
      setLoading(true);

      if (provider == "emailAndPassword") {
        await reauthenticateUser(provider, emailRef?.current.value, passRef?.current.value);
      } else {
        await reauthenticateUser(provider, "", "");
      }

      setLoading(false);
      return setMessage("Successfully authenticated!");
    } catch (error) {
      setLoading(false);
      return setError("Authenticatio failure: " + error.message);
    }
  }
  async function handleDeleteAccount(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await deleteAccount();
      setLoading(false);
    } catch (error) {
      setLoading(false);
      return setError("Failed to delete account: " + error.message);
    }
  }
  async function handleDataChanges(e) {
    e.preventDefault();
    try {
      setError("");
      setMessageOp("");
      setLoading(true);

      await updateProfile(props.updateData);

      setLoading(false);
      props.callback("done");
      return setMessageOp("Data changed successfully!");
    } catch (error) {
      setLoading(false);
      props.callback(error.message);
      return setError("Failed to change data: " + error.message);
    }
  }

  const showHidePass = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setInputType(inputType === "text" ? "password" : "text");
  };
  return (
    <>
      <Modal
        show={show}
        onHide={() => {
          setShow(false);
          (!messageOp && provider == "emailAndPassword") && props.callback("abort");
        }}
        animation={true}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {message ? (
              <>
                {messageOp ? (
                  <>
                    <IoCheckmarkDoneSharp className="mb-1" /> {messageOp}
                  </>
                ) : (
                  <>
                    <GrInsecure className="mb-1" /> {message}
                  </>
                )}
              </>
            ) : (
              <>
                <GrSecure className="mb-1" /> Authorization required
              </>
            )}
          </Modal.Title>
        </Modal.Header>

        {message ? (
          <>
            {error && (
              <Modal.Body>
                <Alert variant="danger">
                  <RiAlertFill className="me-2 mb-1 iconSizeAlert" />
                  <strong>Ups! </strong>
                  {error}
                </Alert>
              </Modal.Body>
            )}
          </>
        ) : (
          <Modal.Body>
            {provider == "emailAndPassword" ? (
              <Form onSubmit={handleReauthenticate}>
                <FloatingLabel controlId="userEmail" label="Email address" className="text-dark mb-2">
                  <Form.Control type="email" placeholder="Email address" ref={emailRef} defaultValue={email} disabled required />
                </FloatingLabel>
                <div className="d-flex w-100">
                  <FloatingLabel controlId="loginPassword" label="Password" className="w-100 text-dark">
                    <Form.Control type={inputType} placeholder="Password" ref={passRef} required />
                  </FloatingLabel>
                  <InputGroup.Text className="pointer border" onClick={showHidePass}>
                    {inputType === "password" ? (
                      <FaRegEyeSlash className="iconSizeAlert" />
                    ) : (
                      <FaRegEye className="iconSizeAlert" />
                    )}
                  </InputGroup.Text>
                </div>

                <Button className="w-100 btn-lg mt-2 mb-2" type="submit" disabled={loading ? true : undefined}>
                  {loading ? (
                    <>
                      <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                      <span>Loading...</span>
                    </>
                  ) : (
                    <span> Authorize </span>
                  )}
                </Button>
              </Form>
            ) : (
              <>
                {provider == "Google" && (
                  <>
                    <Button
                      variant="outline-warning"
                      className="w-100 btn-lg mt-2 mb-2 text-start text-dark"
                      onClick={handleReauthenticate}
                    >
                      {loading ? (
                        <section className="d-flex">
                          <Spinner
                            as="span"
                            animation="border"
                            size="md"
                            role="status"
                            aria-hidden="true"
                            className="me-3"
                            variant="accent2"
                          />
                          <span> Loading...</span>
                        </section>
                      ) : (
                        <>
                          <FcGoogle style={{ width: "35px", height: "35px" }} className="me-2" /> Authenticate with
                          Google
                        </>
                      )}
                    </Button>
                  </>
                )}
                {provider == "Facebook" && (
                  <>
                    <Button
                      variant="outline-info"
                      className="w-100 btn-lg mt-2 mb-2 text-start "
                      onClick={handleReauthenticate}
                    >
                      {loading ? (
                        <section className="d-flex">
                          <Spinner
                            as="span"
                            animation="border"
                            size="md"
                            role="status"
                            aria-hidden="true"
                            className="me-3"
                          />
                          <span>
                            <strong> Loading...</strong>
                          </span>
                        </section>
                      ) : (
                        <>
                          <FaFacebookSquare style={{ width: "35px", height: "35px" }} className="me-2" />
                          <strong> Authenticate with Facebook</strong>
                        </>
                      )}
                    </Button>
                  </>
                )}
                {provider == "Twitter" && (
                  <>
                    <Button
                      variant="outline-info"
                      className="w-100 btn-lg mt-2 mb-2 text-start"
                      onClick={handleReauthenticate}
                    >
                      {loading ? (
                        <section className="d-flex">
                          <Spinner
                            as="span"
                            animation="border"
                            size="md"
                            role="status"
                            aria-hidden="true"
                            className="me-3"
                          />
                          <span>
                            <strong> Loading...</strong>
                          </span>
                        </section>
                      ) : (
                        <>
                          <GrTwitter style={{ width: "35px", height: "35px" }} className="me-2" />
                          <strong> Authenticate with Twitter</strong>
                        </>
                      )}
                    </Button>
                  </>
                )}
                <p>
                  <small>Account created with {provider} Provider.</small>
                </p>
              </>
            )}
          </Modal.Body>
        )}

        {message && !messageOp && (
          <Modal.Footer>
            {/* <Button
              variant="secondary"
              onClick={() => {
                setShow(false);
              }}
            >
              Close
            </Button> */}
            <Button
              variant="primary"
              onClick={show == "delete" ? handleDeleteAccount : handleDataChanges}
              disable={loading ? true : undefined}
            >
              {loading ? (
                <>
                  <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                  <span>Loading...</span>
                </>
              ) : (
                <span> {show == "delete" ? "Delete Account" : "Save changes"} </span>
              )}
            </Button>
          </Modal.Footer>
        )}
      </Modal>
    </>
  );
}

export default ReAuthModal;
