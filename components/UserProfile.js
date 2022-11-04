import React, { useState, useRef, useEffect } from "react";
import { Container, Form, Button, Alert, FloatingLabel, Spinner } from "react-bootstrap";
import { RiAlertFill } from "react-icons/ri";
import { IoCheckmarkDoneSharp } from "react-icons/io5";
import { AiTwotoneDelete } from "react-icons/ai";
import { useAuth } from "../context/AuthProvider";
import ReAuthModal from "./Modals/ReAuthModal";

function UserProfile() {
  const emailRef = useRef();
  const lastNameRef = useRef();
  const nameRef = useRef();
  const ageRef = useRef();
  const [error, setError] = useState("");
  const [warning, setWarning] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingPassReset, setLoadingPassReset] = useState(false);
  const [dataChanged, setDataChanged] = useState(false);
  const [emailChanged, setEmailChanged] = useState(false);
  const [showModal, setShowModal] = useState("");
  const [updateData, setUpdateData] = useState({});
  const { authUserFirestore, updateProfile, resetPassword } = useAuth();

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setError("");
      setMessage("");
      setWarning("");
      setLoading(true);
      let update = {};
      authUserFirestore.name != nameRef.current.value && (update["name"] = nameRef.current.value);
      authUserFirestore.lastName != lastNameRef.current.value && (update["lastName"] = lastNameRef.current.value);
      authUserFirestore.age != ageRef.current.value && (update["age"] = ageRef.current.value);
      authUserFirestore.email != emailRef.current.value && (update["email"] = emailRef.current.value);

      if (Object.keys(update).length > 0) {
        if (emailChanged) {
          setUpdateData(update);
          return setShowModal("changes");
        } else {
          await updateProfile(update);
          setLoading(false);
          setDataChanged(false);
          return setMessage("The changes have been made successfully.");
        }
      } else {
        setLoading(false);
        setDataChanged(false);
        return setWarning("No changes to be made.");
      }
    } catch (error) {
      setLoading(false);
      return setError("Operation failed: " + error.message);
    }
  }
  async function handleResetPassword(e) {
    e.preventDefault();
    try {
      setError("");
      setMessage("");
      setWarning("");
      setLoadingPassReset(true);

      await resetPassword(authUserFirestore.email);
      setLoadingPassReset(false);
      return setMessage("Check your email/spam for further instructions.");
    } catch (error) {
      setLoadingPassReset(false);
      return setError("Operation failed: " + error.message);
    }
  }
  function handleModalCallback(call) {
    if (call == "done" && emailChanged) {
      setMessage("The changes have been made successfully.");
      setDataChanged(false);
      setEmailChanged(false);
      setLoading(false);
    } else if (call == "abort" && emailChanged) {
      setLoading(false);
    } else {
      setError(call);
      setLoading(false);
    }
  }
  function checkEmailChanges() {
    authUserFirestore.email != emailRef.current.value ? setEmailChanged(true) : setEmailChanged(false);
  }
  useEffect(() => {
    showModal && setShowModal("");
  }, [showModal]);

  return (
    <>
      <Container style={{ maxWidth: "450px" }}>
        {error && (
          <Alert variant="danger">
            <RiAlertFill className="me-2 mb-1 iconSizeAlert" />
            <strong>Ups! </strong>
            {error}
          </Alert>
        )}
        {message && (
          <Alert variant="success">
            <IoCheckmarkDoneSharp className="me-2 mb-1 iconSizeAlert" />
            <strong>Ok! </strong>
            {message}
          </Alert>
        )}
        {warning && (
          <Alert variant="warning">
            <RiAlertFill className="me-2 mb-1 iconSizeAlert" />
            <strong>Ups! </strong>
            {warning}
          </Alert>
        )}

        <Form onSubmit={handleSubmit}>
          <FloatingLabel controlId="userName" label="Name" className="mb-3 text-dark">
            <Form.Control
              type="text"
              placeholder="Name"
              ref={nameRef}
              defaultValue={authUserFirestore?.name}
              onChange={() => setDataChanged(true)}
              required
            />
          </FloatingLabel>
          <FloatingLabel controlId="userLastName" label="Last name" className="mb-3 text-dark">
            <Form.Control
              type="text"
              placeholder="Last name"
              ref={lastNameRef}
              defaultValue={authUserFirestore?.lastName}
              onChange={() => setDataChanged(true)}
              required
            />
          </FloatingLabel>
          <FloatingLabel controlId="userAge" label="Age" className="mb-3 text-dark">
            <Form.Control
              type="date"
              placeholder="Age"
              ref={ageRef}
              defaultValue={authUserFirestore?.age}
              min="1920-01-01"
              max={new Date().toLocaleDateString("en-ca")}
              onChange={() => setDataChanged(true)}
              required
            />
          </FloatingLabel>
          <FloatingLabel controlId="userEmail" label="Email address" className="text-dark mb-2">
            <Form.Control
              type="email"
              placeholder="Email address"
              ref={emailRef}
              defaultValue={authUserFirestore?.email}
              onChange={() => {
                setDataChanged(true);
                checkEmailChanges();
              }}
              disabled={authUserFirestore?.signProvider != "emailAndPassword"}
              required
            />
          </FloatingLabel>
          {emailChanged && (
            <section className="float-start text-start">
              <p className="color-primary mb-0">
                <small>Email changes requires authorization.</small>
              </p>
            </section>
          )}
          {authUserFirestore?.signProvider != "emailAndPassword" && (
            <section className="float-start text-start">
              <p className="color-primary mb-0">
                <small>Account created with {authUserFirestore?.signProvider} Provider.</small>
              </p>
              <p className="color-primary mt-0 mb-0">
                <small> &#9708; Email and password changes not available.</small>
              </p>
            </section>
          )}

          <Button className="w-100 btn-lg mt-2 mb-2" type="submit" disabled={loading || !dataChanged}>
            {loading ? (
              <>
                <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                <span>Loading...</span>
              </>
            ) : (
              <span>{emailChanged ? "Authorize" : "Save changes"} </span>
            )}
          </Button>
        </Form>
        <hr className="color-primary" />
        {authUserFirestore?.signProvider == "emailAndPassword" && (
          <Button
            className="w-100 btn-lg mt-2 mb-2"
            disabled={loadingPassReset}
            variant="outline-accent4"
            size="sm"
            onClick={handleResetPassword}
          >
            {loadingPassReset ? (
              <>
                <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                <span>Loading...</span>
              </>
            ) : (
              <span> Reset Password </span>
            )}
          </Button>
        )}
        <Button
          className="w-100 btn-lg mt-2"
          variant="outline-danger"
          onClick={() => {
            setShowModal("delete");
          }}
        >
          <AiTwotoneDelete className="mb-1" /> Delete Account
        </Button>
      </Container>

      <ReAuthModal show={showModal} updateData={updateData} callback={handleModalCallback} />
    </>
  );
}

export default UserProfile;
