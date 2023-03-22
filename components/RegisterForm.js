import React, { useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Container, Form, Button, Alert, FloatingLabel, Spinner, InputGroup } from "react-bootstrap";
import { FaFacebookF, FaGoogle, FaTwitter, FaRegEyeSlash, FaRegEye } from "react-icons/fa";
import { RiAlertFill } from "react-icons/ri";
import { useAuth } from "../context/AuthProvider";

function RegisterForm() {
  const router = useRouter();
  const locale = router.locale;
  const nameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const { registerUser, loginWithGoogle, loginWithFacebook, loginWithTwitter } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); //to disable the submit button after clicked and wait for submit response
  const [inputType, setInputType] = useState("password");

  async function handleSubmit(e) {
    e.preventDefault();
    if (passwordRef.current.value.length < 6) {
      return setError("Password should be at least 6 characters");
    }

    try {
      setLoading(true);
      setError("");
      await registerUser(
        emailRef.current.value,
        passwordRef.current.value,
        nameRef.current.value
        // bdateRef.current.value
      );
    } catch (error) {
      setLoading(false);

      if (error.message.includes("email-already-in-use")) {
        return setError("Failed to register user: email already in use.");
      }

      return setError("Failed to register user: " + error.message);
    }
  }

  const showHidePass = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setInputType(inputType === "text" ? "password" : "text");
  };

  const t = {
    en: {
      h1: "Let's Start!",
      paragraph: "Sign up with",
      or: "Or",
      name: "Name",
      email: "E-mail address",
      pass: "Password",
      button: "Register Account",
      loading: "Loading...",
      by: "By creating an account, you accept our",
      and: "and Our",
      terms: "Terms of Service",
      privacy: "Privacy Policy.",
      account: "Already have an account?",
      sign: "Sign In!",
      male: "Male",
      female: "Female",
      notProvided: "Not provide",
    },
    pl: {
      h1: "Zaczynamy!",
      paragraph: "Utwórz konto poprzez",
      or: "Lub",
      name: "Imię",
      email: "Adres e-mail",
      pass: "Hasło",
      button: "Utwórz konto",
      loading: "Ładowanie...",
      by: "Utworzenie konta jest jednoznaczne z Twoją akceptacją",
      and: "i naszej",
      terms: "Regulaminu",
      privacy: "Politykę Prywatności.",
      account: "Masz już konto?",
      sign: "Zaloguj się!",
      male: "Mężczyzna",
      female: "Kobieta",
      notProvided: "Nie podawaj",
    },
  };
  return (
    <Container className="d-flex justify-content-center border color-primary">
      <section className="w-100" style={{ maxWidth: "400px" }}>
        <h1 className="text-center mt-2 mb-1">{t[locale].h1}</h1>
        <p className="text-center mb-3">{t[locale].paragraph}</p>
        <div className="d-flex justify-content-evenly align-content-center mb-3 ">
          <FaFacebookF className="pointer zoom" onClick={loginWithFacebook} />
          <FaGoogle className="pointer zoom" onClick={loginWithGoogle} />
          <FaTwitter className="pointer zoom" onClick={loginWithTwitter} />
        </div>

        <div className="hrDivider text-center">
          <hr className="background" />
          <p className="color-primary background">{t[locale].or}</p>
        </div>
        {error && (
          <Alert variant="danger">
            <RiAlertFill className="me-2 mb-1 iconSizeAlert" data-size="2" />
            <strong>Ups! </strong>
            {error}
          </Alert>
        )}
        <Form onSubmit={handleSubmit}>
          <FloatingLabel controlId="registerName" label={t[locale].name} className="mb-3 text-dark">
            <Form.Control type="text" placeholder={t[locale].name} ref={nameRef} required />
          </FloatingLabel>

          <FloatingLabel controlId="registerEmail" label={t[locale].email} className="mb-3 text-dark">
            <Form.Control type="email" placeholder={t[locale].email} ref={emailRef} required />
          </FloatingLabel>

          <div className="d-flex w-100">
            <FloatingLabel controlId="registerPassword" label={t[locale].pass} className="w-100 text-dark">
              <Form.Control type={inputType} placeholder={t[locale].pass} ref={passwordRef} required />
            </FloatingLabel>
            <InputGroup.Text className="pointer border" onClick={showHidePass}>
              {inputType === "password" ? (
                <FaRegEyeSlash className="iconSizeAlert" />
              ) : (
                <FaRegEye className="iconSizeAlert" />
              )}
            </InputGroup.Text>
          </div>
          <div className="mt-3">
            <Form.Check inline label={t[locale].male} />
            <Form.Check inline label={t[locale].female} />
            <Form.Check inline label={t[locale].notProvided} />
          </div>
          <Button className="w-100 mt-3 mb-2 btn-lg" type="submit" disabled={loading}>
            {loading ? (
              <>
                <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                <span> {t[locale].loading}</span>
              </>
            ) : (
              <span> {t[locale].button} </span>
            )}
          </Button>
        </Form>

        <div className="w-100 text-center mt-1">
          <p>
            <small>
              {t[locale].by}{" "}
              <Link href="/terms-of-service#main" passHref className="color-secondary">
                <u>{t[locale].terms} </u>
              </Link>
              {t[locale].and}{" "}
              <Link href="/privacy-policy#main" passHref className="color-secondary underline">
                <u>{t[locale].privacy}</u>
              </Link>
            </small>
          </p>
          {t[locale].account}
          <Link href="/sign-in"> {t[locale].sign}</Link>
        </div>
      </section>
    </Container>
  );
}

export default RegisterForm;
