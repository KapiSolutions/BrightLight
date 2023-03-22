import React, { useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Container, Form, Button, Alert, FloatingLabel, Row, Col, Spinner } from "react-bootstrap";
import { RiAlertFill } from "react-icons/ri";
import { GiAce } from "react-icons/gi";
import { useAuth } from "../context/AuthProvider";
import { queryByFirestore } from "../firebase/Firestore";
import { useDeviceStore } from "../stores/deviceStore";
import { useRouter } from "next/router";

function ForgotPasswordForm(props) {
  const router = useRouter();
  const locale = router.locale;
  const emailRef = useRef();
  const { resetPassword } = useAuth();
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [userName, setUserName] = useState("");
  const isMobile = useDeviceStore((state) => state.isMobile);
  const theme = useDeviceStore((state) => state.themeState);
  const themeDarkInput = theme == "dark" ? "bg-accent6 text-light border-accent4" : "";

  const t = {
    en: {
      h1: "Forgot Password?",
      home: "Home",
      loginPage: "Sign In",
      forgotPage: "Forgot password",
      buttonReset: "Reset password",
      buttonAgain: "Send Again",
      loading: "Loading...",
      wrongEmail: "User with this email address does not exist.",
      checkEmail: "Check your email/spam for further instructions.",
      resetFailed: "Failed to reset password: ",
      ifRemember: "However do you remember your password?",
      signIn: "Sign In!",
      email: "Email address",
    },
    pl: {
      h1: "Nie pamiętasz hasła?",
      home: "Strona Główna",
      loginPage: "Logowanie",
      forgotPage: "Resetowanie hasła",
      buttonReset: "Zresetuj hasło",
      buttonAgain: "Wyślij ponownie",
      loading: "Ładowanie...",
      wrongEmail: "Użytkownik z takim adresem email nie istnieje.",
      checkEmail: "Sprawdź swoją skrzynkę e-mail/spam, aby uzyskać dalsze instrukcje.",
      resetFailed: "Błąd resetowania hasła: ",
      ifRemember: "Jednak pamiętasz swoje hasło?",
      signIn: "Zaloguj się!",
      email: "Adres email",
    },
  };

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setError("");
      setMessage("");
      setLoading(true);

      await resetPassword(emailRef.current.value);
      setLoading(false);
      return setMessage(t[locale].checkEmail);
    } catch (error) {
      const errMessage = error.message.toString();
      setLoading(false);

      if (errMessage.includes("user-not-found")) {
        setError(t[locale].wrongEmail);
      } else {
        setError(t[locale].resetFailed + errMessage);
      }
    }
  }

  return (
    <Container className="d-flex justify-content-center color-primary">
      {!isMobile && (
        <div className="d-flex gap-2" style={{ position: "absolute", top: "20px", left: "20px" }}>
          <small>
            <Link href="/#main">{t[locale].home}</Link>
          </small>
          <small>&gt;</small>
          <small>
            <Link href="/sign-in#main">{t[locale].loginPage}</Link>
          </small>
          <small>&gt;</small>
          <small>{t[locale].forgotPage}</small>
        </div>
      )}

      <Row xs={1} md={2}>
        <Col className="d-flex justify-content-center">
          {isMobile ? (
            <Image src={`/svg/signUp${props.theme}.svg`} width="150" height="150" alt="SignIn Image" />
          ) : (
            <Image src={`/svg/signUp${props.theme}.svg`} width="500" height="500" alt="SignIn Image" className="pe-5" />
          )}
        </Col>

        <Col className="d-flex justify-content-center align-self-center ">
          <section className="w-100" style={{ maxWidth: "400px" }}>
            <h2 className="text-center mb-4">{t[locale].h1}</h2>
            {/* <p className="text-center mb-4">Just put your email below and check mailbox!</p> */}

            {error && (
              <Alert variant="danger">
                <RiAlertFill className="me-2 mb-1 iconSizeAlert" />
                <strong>Ups! </strong>
                {error}
              </Alert>
            )}
            {message && (
              <Alert variant="success">
                <GiAce className="me-2 mb-1 iconSizeAlert" />
                <strong>Ok! </strong>
                {message}
              </Alert>
            )}
            <Form onSubmit={handleSubmit} >
              <FloatingLabel controlId="forgotEmail" label={t[locale].email} className="mb-3">
                <Form.Control
                  type="email"
                  placeholder={t[locale].email}
                  ref={emailRef}
                  className={themeDarkInput}
                  required
                />
              </FloatingLabel>
              <Button className="w-100 btn-lg" type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                    <span>{t[locale].loading}</span>
                  </>
                ) : (
                  <span> {message ? t[locale].buttonAgain : t[locale].buttonReset} </span>
                )}
              </Button>
            </Form>
            <div className="w-100 text-center mt-3">
              <p className="color-primary mb-0">{t[locale].ifRemember}</p>
              <Link href="/sign-in">{t[locale].signIn}</Link>
            </div>
          </section>
        </Col>
      </Row>
    </Container>
  );
}

export default ForgotPasswordForm;
