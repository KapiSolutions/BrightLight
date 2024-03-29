import React, { useState, useRef, useReducer, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Container, Form, Button, Alert, Spinner, InputGroup } from "react-bootstrap";
import { FaFacebookF, FaGoogle, FaTwitter, FaRegEyeSlash, FaRegEye } from "react-icons/fa";
import { RiAlertFill } from "react-icons/ri";
import { useAuth } from "../context/AuthProvider";
import dynamic from "next/dynamic";
import { useDeviceStore } from "../stores/deviceStore";
const ReCAPTCHA = dynamic(() => import("react-google-recaptcha"));
import axios from "axios";

function RegisterForm() {
  const router = useRouter();
  const locale = router.locale;
  const nameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const recaptchaRef = useRef(null);

  const isMobile = useDeviceStore((state) => state.isMobile);
  const theme = useDeviceStore((state) => state.themeState);
  const { registerUser, loginWithGoogle, loginWithFacebook, loginWithTwitter } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); //to disable the submit button after clicked and wait for submit response
  const [inputType, setInputType] = useState("password");
  const [recaptchaNeeded, setRecaptchaNeeded] = useState(false);
  const [captchaResult, setCaptchaResult] = useState("");
  const invalidInit = { name: false, email: false, password: false, catpcha: false };
  const [invalid, updateInvalid] = useReducer((state, updates) => ({ ...state, ...updates }), invalidInit);
  const themeDarkInput = theme == "dark" ? "bg-accent6 text-light border-accent4" : "";

  const t = {
    en: {
      h1: "Let's Start!",
      home: "Home",
      loginPage: "Sign In",
      registerPage: "Create account",
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
      shortPassword: "The password should be at least 6 characters long.",
      errorCaptcha: "Error reCAPTCHA validation.",
      errEmailExists: "User with provided Email already exists.",
      errFirebase: "Failed to register user: ",
      popUpClosed: "Popup closed by the user.",
    },
    pl: {
      h1: "Zaczynamy!",
      home: "Strona Główna",
      loginPage: "Logowanie",
      registerPage: "Rejestracja",
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
      shortPassword: "Hasło powinno mieć co najmniej 6 znaków.",
      errorCaptcha: "Błąd uwierzytelnienia reCAPTCHA.",
      errEmailExists: "Podany adres email już istnieje.",
      errFirebase: "Błąd rejestracji: ",
      popUpClosed: "Zamknięto okno logowania.",
    },
  };

  const checkFields = () => {
    if (nameRef.current.value !== "" && emailRef.current.value !== "" && passwordRef.current.value !== "") {
      setRecaptchaNeeded(true);
    }

    if (invalid.password && passwordRef.current.value.length >= 6) {
      updateInvalid({ password: false }); //data ok
    }
  };

  const onReCAPTCHAChange = async (captchaCode) => {
    if (!captchaCode) {
      return;
    }
    setCaptchaResult(captchaCode);
  };

  const captchaValidation = async (captchaCode) => {
    try {
      const res = await axios.post("/api/recaptcha", { captcha: captchaCode });
      if (res.data.success) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.log(error.response.data);
      setError(t[locale].errorCaptcha);
      return false;
    }
  };

  // handle register action
  async function handleSubmit(e) {
    e.preventDefault();
    updateInvalid({ email: false }); //reset
    setError("");
    setLoading(true);
    // Validate data
    if (passwordRef.current.value.length < 6) {
      updateInvalid({ password: true }); //invalid
      document.getElementsByName("registerPassword")[0].focus();
      document.getElementsByName("registerPassword")[0].scrollIntoView({ block: "center", inline: "nearest" });
      return;
    } else {
      updateInvalid({ password: false }); //data ok
    }

    if (!captchaResult) {
      setLoading(false);
      return;
    }

    const captchaOK = await captchaValidation(captchaResult);

    if (captchaOK) {
      try {
        await registerUser(emailRef.current.value, passwordRef.current.value, nameRef.current.value);
      } catch (error) {
        const errMessage = error.message.toString();
        if (errMessage.includes("email-already-in-use")) {
          updateInvalid({ email: true }); //invalid
          setError(t[locale].errEmailExists);
        } else {
          setError(t[locale].errFirebase + errMessage);
        }
      }
      setLoading(false);
      return;
    } else {
      setLoading(false);
      return;
    }
  }

  const externalRegister = async (provider) => {
    setLoading(true);
    try {
      await provider();
      await router.push("/")
    } catch (error) {
      console.log(error);
      if (error.includes("popup-closed-by-user")) {
        setError(t[locale].popUpClosed);
      } else {
        setError(t[locale].errFirebase + error);
      }
    }
    setLoading(false);
  };

  const showHidePass = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setInputType(inputType === "text" ? "password" : "text");
  };

  return (
    <Container className="d-flex justify-content-center color-primary mt-2 mb-4">

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
          <small>{t[locale].registerPage}</small>
        </div>
      )}

      <section className="w-100" style={{ maxWidth: "400px" }}>
        <h1 className="text-center mt-2 mb-2">{t[locale].h1}</h1>
        <p className="text-center mb-4">{t[locale].paragraph}</p>
        <div className="d-flex justify-content-evenly align-content-center mb-3 ">
          <FaFacebookF className="pointer zoom" onClick={() => externalRegister(loginWithFacebook)} />
          <FaGoogle className="pointer zoom" onClick={() => externalRegister(loginWithGoogle)} />
          <FaTwitter className="pointer zoom" onClick={() => externalRegister(loginWithTwitter)} />
        </div>

        <div className="hrDivider text-center">
          <hr className="background" />
          <p className="color-primary background">{t[locale].or}</p>
        </div>
        {error && (
          <Alert variant="danger" className="mt-2 mb-0">
            <RiAlertFill className="me-2 mb-1 iconSizeAlert" data-size="2" />
            <strong>Ups! </strong>
            {error}
          </Alert>
        )}
        <Form onSubmit={handleSubmit} className="d-flex mt-1 flex-column ">
          <Form.Group className="mb-0" controlId="controlName">
            <Form.Label className="mb-1">
              <small>{t[locale].name}</small>
            </Form.Label>
            <Form.Control
              type="text"
              placeholder={t[locale].name}
              ref={nameRef}
              maxLength={20}
              className={themeDarkInput}
              disabled={loading}
              required
            />
          </Form.Group>

          <Form.Group className="" controlId="controlEmail">
            <Form.Label className="mb-1">
              <small>{t[locale].email}</small>
            </Form.Label>
            <Form.Control
              name="registerEmail"
              type="email"
              placeholder={t[locale].email}
              ref={emailRef}
              maxLength={40}
              className={`${invalid.email && "border border-danger"} ${themeDarkInput}`}
              disabled={loading}
              required
            />
          </Form.Group>

          <Form.Group className="d-flex flex-wrap w-100" controlId="controlPass">
            <Form.Label className="mb-1 w-100">
              <small>{t[locale].pass}</small>
            </Form.Label>
            <div className="d-flex w-100">
              <Form.Control
                name="registerPassword"
                type={inputType}
                placeholder={t[locale].pass}
                ref={passwordRef}
                onChange={checkFields}
                maxLength={30}
                className={`${invalid.password && "border border-danger"} ${themeDarkInput}`}
                disabled={loading}
                required
              />
              <InputGroup.Text className={`pointer border ${theme == "dark" && "opacity-75"}`} onClick={showHidePass}>
                {inputType === "password" ? (
                  <FaRegEyeSlash className="iconSizeAlert" />
                ) : (
                  <FaRegEye className="iconSizeAlert" />
                )}
              </InputGroup.Text>
            </div>
            {invalid.password && <small className="text-danger">{t[locale].shortPassword}</small>}
          </Form.Group>

          {recaptchaNeeded && (
            <div className="mt-3 d-flex justify-content-center">
              <ReCAPTCHA
                ref={recaptchaRef}
                sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_CLIENT_KEY}
                onChange={onReCAPTCHAChange}
                theme={theme}
              />
            </div>
          )}

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
          <Link href="/sign-in" className="color-secondary"> <strong>{t[locale].sign}</strong></Link>
        </div>
      </section>
    </Container>
  );
}

export default RegisterForm;
