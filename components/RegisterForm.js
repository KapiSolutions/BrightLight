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

  const theme = useDeviceStore((state) => state.themeState);
  const { registerUser, loginWithGoogle, loginWithFacebook, loginWithTwitter } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); //to disable the submit button after clicked and wait for submit response
  const [inputType, setInputType] = useState("password");
  const [recaptchaNeeded, setRecaptchaNeeded] = useState(false);
  const [captchaResult, setCaptchaResult] = useState("");
  const invalidInit = { name: false, email: false, password: false, catpcha: false };
  const [invalid, updateInvalid] = useReducer((state, updates) => ({ ...state, ...updates }), invalidInit);
  const themeDarkInput = theme == "dark" ? "bg-accent6 text-light" : "";
  const [men, setMen] = useState(false);
  const [women, setWomen] = useState(false);
  const [notProvided, setNotProvided] = useState(false);

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
      shortPassword: "The password should be at least 6 characters long.",
      errorCaptcha: "Error reCAPTCHA validation.",
      errEmailExists: "User with provided Email already exists.",
      errFirebase: "Failed to register user: ",
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
      shortPassword: "Hasło powinno mieć co najmniej 6 znaków.",
      errorCaptcha: "Błąd uwierzytelnienia reCAPTCHA.",
      errEmailExists: "Podany adres email już istnieje.",
      errFirebase: "Błąd rejestracji: ",
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

  const showHidePass = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setInputType(inputType === "text" ? "password" : "text");
  };

  return (
    <Container className="d-flex justify-content-center color-primary">
      <section className="w-100" style={{ maxWidth: "400px" }}>
        <h1 className="text-center mt-2 mb-2">{t[locale].h1}</h1>
        <p className="text-center mb-4">{t[locale].paragraph}</p>
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
          <Alert variant="danger" className="mt-2 mb-0">
            <RiAlertFill className="me-2 mb-1 iconSizeAlert" data-size="2" />
            <strong>Ups! </strong>
            {error}
          </Alert>
        )}
        <Form onSubmit={handleSubmit} className="d-flex mt-1 flex-column ">
          <Form.Group className="mb-0" controlId="controlName">
            <Form.Label className="mb-0">
              <small>{t[locale].name}</small>
            </Form.Label>
            <Form.Control
              type="text"
              placeholder={t[locale].name}
              ref={nameRef}
              maxLength={20}
              className={themeDarkInput}
              required
            />
          </Form.Group>

          <Form.Group className="" controlId="controlEmail">
            <Form.Label className="mb-0">
              <small>{t[locale].email}</small>
            </Form.Label>
            <Form.Control
              name="registerEmail"
              type="email"
              placeholder={t[locale].email}
              ref={emailRef}
              maxLength={40}
              className={`${invalid.email && "border border-danger"} ${themeDarkInput}`}
              required
            />
          </Form.Group>

          <Form.Group className="d-flex flex-wrap w-100" controlId="controlPass">
            <Form.Label className="mb-0 w-100">
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
                required
              />
              <InputGroup.Text className="pointer border" onClick={showHidePass}>
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

          {/* <div className="mt-3">
            <Form.Check inline>
              <Form.Check.Input
                id="checkMen"
                type="checkbox"
                checked={men}
                className="pointer"
                onChange={() => {
                  setMen(true);
                  setWomen(false);
                  setNotProvided(false);
                }}
              />
              <Form.Check.Label htmlFor="checkMen" className="pointer">
                {t[locale].male}
              </Form.Check.Label>
            </Form.Check>

            <Form.Check inline>
              <Form.Check.Input
                id="checkWowen"
                type="checkbox"
                checked={women}
                className="pointer"
                onChange={() => {
                  setMen(false);
                  setWomen(true);
                  setNotProvided(false);
                }}
              />
              <Form.Check.Label htmlFor="checkWowen" className="pointer">
                {t[locale].female}
              </Form.Check.Label>
            </Form.Check>

            <Form.Check inline>
              <Form.Check.Input
                id="checkNotProvided"
                type="checkbox"
                checked={notProvided}
                className="pointer"
                onChange={() => {
                  setMen(false);
                  setWomen(false);
                  setNotProvided(true);
                }}
              />
              <Form.Check.Label htmlFor="checkNotProvided" className="pointer">
                {t[locale].notProvided}
              </Form.Check.Label>
            </Form.Check>
          </div> */}

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
