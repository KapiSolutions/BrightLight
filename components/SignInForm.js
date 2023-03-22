import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import Image from "next/image";
import { Container, Form, Button, Alert, FloatingLabel, Row, Col, Spinner, InputGroup } from "react-bootstrap";
import { FaFacebookF, FaGoogle, FaTwitter, FaRegEyeSlash, FaRegEye } from "react-icons/fa";
import { RiAlertFill } from "react-icons/ri";
import { useAuth } from "../context/AuthProvider";
import { useDeviceStore } from "../stores/deviceStore";
import svgLight from "../public/svg/signUplight.svg";
import svgDark from "../public/svg/signUpdark.svg";

function SignInForm(props) {
  const router = useRouter();
  const locale = router.locale;
  const emailRef = useRef();
  const passwordRef = useRef();
  const { loginUser, loginWithGoogle, loginWithFacebook, loginWithTwitter } = useAuth();
  const [error, setError] = useState("");
  const [errorPass, setErrorPass] = useState(false);
  const [errorEmail, setErrorEmail] = useState(false);
  const [loading, setLoading] = useState(false); //to disable the submit button after clicked and wait for submit response
  const [inputType, setInputType] = useState("password");
  const isMobile = useDeviceStore((state) => state.isMobile);
  const theme = useDeviceStore((state) => state.themeState);
  const themeDarkInput = theme == "dark" ? "bg-accent6 text-light border-accent4" : "";

  const t = {
    en: {
      h1: "Sign In",
      home: "Home",
      loginPage: "Sign In",
      unlock: "Unlock your way to the Future!",
      or: "Or",
      email: "E-mail address",
      pass: "Password",
      button: "Sign In",
      loading: "Loading...",
      forgot: "Forgot Password?",
      account: "Don't have an account yet?",
      join: "Join now!",
      shortPass: "Password should be at least 6 characters",
      failLogin: "Failed to log in: ",
      failLoginPass: "Incorrect password.",
      failLoginUser: "User with this email address does not exist.",
      popUpClosed: "Popup closed by the user.",
    },
    pl: {
      h1: "Logowanie",
      home: "Strona Główna",
      loginPage: "Logowanie",
      unlock: "Otwórz swoją drogę do przyszłości!",
      or: "Lub",
      email: "Adres e-mail",
      pass: "Hasło",
      button: "Zaloguj",
      loading: "Ładowanie...",
      forgot: "Nie pamiętasz hasła?",
      account: "Nie masz jeszcze konta?",
      join: "Dołącz teraz!",
      shortPass: "Hasło powinno mieć przynajmiej 6 znaków",
      failLogin: "Błąd logowania: ",
      failLoginPass: "Niepoprawne hasło.",
      failLoginUser: "Użytkownik z takim adresem email nie istnieje.",
      popUpClosed: "Zamknięto okno logowania.",
    },
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setErrorPass(false);
    setErrorEmail(false);
    if (passwordRef.current.value.length < 6) {
      return setError(t[locale].shortPass);
    }

    setLoading(true);

    try {
      await loginUser(emailRef.current.value, passwordRef.current.value);
      router.push("/");
    } catch (error) {
      setLoading(false);
      if (error.message.includes("wrong-password")) {
        setErrorPass(true);
        return;
      } else if (error.message.includes("user-not-found")) {
        setErrorEmail(true);
        return;
      }
      return setError(t[locale].failLogin + error.message);
    }
  }

  const externalLogin = async (provider) => {
    setLoading(true);
    try {
      await provider();
      await router.push("/")
    } catch (error) {
      console.log(error);
      if (error.includes("popup-closed-by-user")) {
        setError(t[locale].popUpClosed);
      } else {
        setError(t[locale].failLogin + error);
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
    <div className="color-primary ps-3 pe-3">
      {!isMobile && (
        <div className="d-flex gap-2" style={{ position: "absolute", top: "20px", left: "20px" }}>
          <small>
            <Link href="/#main">{t[locale].home}</Link>
          </small>
          <small>&gt;</small>
          <small>{t[locale].loginPage}</small>
        </div>
      )}

      <Row xs={1} md={2}>
        <Col
          className={`d-flex justify-content-center ${
            !isMobile && `border-end ${props.theme == "dark" && "border-accent4"}`
          } `}
        >
          {isMobile ? (
            <Image
              src={props.theme == "light" ? svgLight : svgDark}
              width="150"
              height="150"
              alt="SignIn - Bright Light Gypsy"
            />
          ) : (
            <Image
              src={props.theme == "light" ? svgLight : svgDark}
              width="500"
              height="500"
              alt="SignIn - Bright Light Gypsy"
              className={`pe-5 ${!isMobile && "me-4"}`}
            />
          )}
        </Col>

        <Col className="d-flex justify-content-center align-content-center">
          <section className={`w-100 ${!isMobile && "ms-4"}`} style={{ maxWidth: "400px" }}>
            <h1 className="text-center m-0">{t[locale].h1}</h1>
            <p className="text-center mb-4">{t[locale].unlock}</p>

            <div className="d-flex justify-content-evenly align-content-center mb-4 mt-3">
              <FaFacebookF className="pointer zoom" onClick={() => externalLogin(loginWithFacebook)} />
              <FaGoogle className="pointer zoom" onClick={() => externalLogin(loginWithGoogle)} />
              <FaTwitter className="pointer zoom" onClick={() => externalLogin(loginWithTwitter)} />
            </div>

            <div className="hrDivider text-center">
              <hr className="background" />
              <p className="color-primary background">{t[locale].or}</p>
            </div>
            {error && (
              <Alert variant="danger" className="mt-3 mb-0">
                <RiAlertFill className="me-2 mb-1 iconSizeAlert" data-size="2" />
                <strong>Ups! </strong>
                {error}
              </Alert>
            )}
            <Form onSubmit={handleSubmit} className="mt-4">
              <FloatingLabel controlId="loginEmail" label={t[locale].email} className="mb-3">
                <Form.Control
                  type="email"
                  placeholder={t[locale].email}
                  ref={emailRef}
                  className={`${errorEmail && "border border-danger"} ${themeDarkInput}`}
                  disabled={loading}
                  required
                />
                {errorEmail && <small className="text-danger">{t[locale].failLoginUser}</small>}
              </FloatingLabel>

              <div className="d-flex flex-wrap w-100">
                <div className="d-flex w-100">
                  <FloatingLabel controlId="loginPassword" label={t[locale].pass} className="w-100">
                    <Form.Control
                      type={inputType}
                      placeholder={t[locale].pass}
                      ref={passwordRef}
                      className={`${errorPass && "border border-danger"} ${themeDarkInput}`}
                      disabled={loading}
                      required
                    />
                  </FloatingLabel>
                  <InputGroup.Text
                    className={`pointer border ${theme == "dark" && "opacity-75"}`}
                    onClick={showHidePass}
                  >
                    {inputType === "password" ? (
                      <FaRegEyeSlash className="iconSizeAlert" />
                    ) : (
                      <FaRegEye className="iconSizeAlert" />
                    )}
                  </InputGroup.Text>
                </div>
                {errorPass && <small className="text-danger w-100">{t[locale].failLoginPass}</small>}
              </div>

              <Button className="w-100 btn-lg  mt-4" type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                    <span> {t[locale].loading}</span>
                  </>
                ) : (
                  <span>{t[locale].button}</span>
                )}
              </Button>
            </Form>
            <div className="w-100 text-center mt-3">
              <Link href="/forgot-password">{t[locale].forgot}</Link>
            </div>

            <div className="w-100 text-center mt-2">
              {t[locale].account}
              <Link href="/register">
                {" "}
                <strong>{t[locale].join}</strong>
              </Link>
            </div>
          </section>
        </Col>
      </Row>
    </div>
  );
}

export default SignInForm;
