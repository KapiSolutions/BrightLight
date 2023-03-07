import React, { useState, useRef, useEffect } from "react";
import { Container, Form, Button, Alert, FloatingLabel, Spinner } from "react-bootstrap";
import { RiAlertFill } from "react-icons/ri";
import { IoCheckmarkDoneSharp } from "react-icons/io5";
import { AiTwotoneDelete } from "react-icons/ai";
import { useAuth } from "../context/AuthProvider";
import ReAuthModal from "./Modals/ReAuthModal";
import { useRouter } from "next/router";

function UserProfile() {
  const router = useRouter();
  const locale = router.locale;
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

  const t = {
    en: {
      name: "Name",
      lastName: "Last Name",
      age: "Birth Date",
      email: "E-mail address",
      pass: "Password",
      button: "Sign In",
      loading: "Loading...",
      emailAuth: "Email changes requires authorization.",
      created: "Account created with",
      provider: "Provider",
      changesForbidden: "Email and password changes not available.",
      authorize: "Authorize",
      save: "Save changes",
      reset: "Reset password",
      delete: "Delete Account",
      success: "The changes have been made successfully.",
      noChanges: "No changes to be made.",
      failed: "Operation failed: ",
      checkEmail: "Check your email/spam for further instructions.",
      abort: "Aborted operation.",
    },
    pl: {
      name: "Imię",
      lastName: "Nazwisko",
      age: "Data urodzenia",
      email: "Adres e-mail",
      pass: "Hasło",
      button: "Zaloguj",
      loading: "Ładowanie...",
      emailAuth: "Zmiana adresu email wymaga autoryzacji.",
      created: "Konto utworzone poprzez",
      provider: "",
      changesForbidden: "Zmiana adresu email oraz hasła niedostępna.",
      authorize: "Uwierzytelnij",
      save: "Zapisz zmiany",
      reset: "Zresetuj hasło",
      delete: "Usuń konto",
      success: "Zamiany wprowadzono pomyślnie.",
      noChanges: "Brak zmian do wprowadzenia",
      failed: "Błąd: ",
      checkEmail: "Sprawdź swoją skrzynkę e-mail/spam, aby uzyskać dalsze instrukcje.",
      abort: "Anulowano operację.",
    },
  };

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
          return setMessage(t[locale].success);
        }
      } else {
        setLoading(false);
        setDataChanged(false);
        return setWarning(t[locale].noChanges);
      }
    } catch (error) {
      setLoading(false);
      return setError(t[locale].failed + error.message);
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
      return setMessage(t[locale].checkEmail);
    } catch (error) {
      setLoadingPassReset(false);
      return setError(t[locale].failed + error.message);
    }
  }
  function handleModalCallback(call) {
    if (call == "done" && emailChanged) {
      setMessage(t[locale].success);
      setDataChanged(false);
      setEmailChanged(false);
      setLoading(false);
    } else if (call == "abort" && emailChanged) {
      setLoading(false);
    } else {
      setError(call == "abort" ? t[locale].abort : call);
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
          <Alert variant="danger" className="d-flex align-items-center justify-content-between">
            <span>
              <RiAlertFill className="me-2 mb-1 iconSizeAlert" />
              <strong>Ups! </strong>
              {error}
            </span>
            <span className="fs-5 pointer Hover" onClick={()=>setError("")}>X</span>
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
          <FloatingLabel controlId="userName" label={t[locale].name} className="mb-3 text-dark">
            <Form.Control
              type="text"
              placeholder={t[locale].name}
              ref={nameRef}
              defaultValue={authUserFirestore?.name}
              onChange={() => setDataChanged(true)}
              required
            />
          </FloatingLabel>
          <FloatingLabel controlId="userLastName" label={t[locale].lastName} className="mb-3 text-dark">
            <Form.Control
              type="text"
              placeholder={t[locale].lastName}
              ref={lastNameRef}
              defaultValue={authUserFirestore?.lastName}
              onChange={() => setDataChanged(true)}
              required
            />
          </FloatingLabel>
          <FloatingLabel controlId="userAge" label={t[locale].age} className="mb-3 text-dark">
            <Form.Control
              type="date"
              placeholder={t[locale].age}
              ref={ageRef}
              defaultValue={authUserFirestore?.age}
              min="1920-01-01"
              max={new Date().toLocaleDateString("en-ca")}
              onChange={() => setDataChanged(true)}
              required
            />
          </FloatingLabel>
          <FloatingLabel controlId="userEmail" label={t[locale].email} className="text-dark mb-2">
            <Form.Control
              type="email"
              placeholder={t[locale].email}
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
                <small>{t[locale].emailAuth}</small>
              </p>
            </section>
          )}
          {authUserFirestore?.signProvider != "emailAndPassword" && (
            <section className="float-start text-start">
              <p className="color-primary mb-0">
                <small>
                  {t[locale].created} {authUserFirestore?.signProvider} {t[locale].provider}.
                </small>
              </p>
              <p className="color-primary mt-0 mb-0">
                <small> &#9708; {t[locale].changesForbidden}</small>
              </p>
            </section>
          )}

          <Button className="w-100 btn-lg mt-2 mb-2" type="submit" disabled={loading || !dataChanged}>
            {loading ? (
              <>
                <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                <span> {t[locale].loading}</span>
              </>
            ) : (
              <span>{emailChanged ? t[locale].authorize : t[locale].save} </span>
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
                <span> {t[locale].loading}</span>
              </>
            ) : (
              <span> {t[locale].reset} </span>
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
          <AiTwotoneDelete className="mb-1" /> {t[locale].delete}
        </Button>
      </Container>

      <ReAuthModal show={showModal} updateData={updateData} callback={handleModalCallback} />
    </>
  );
}

export default UserProfile;
