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
  const [loading, setLoading] = useState(false); //to disable the submit button after clicked and wait for submit response
  const [inputType, setInputType] = useState("password");
  const isMobile = useDeviceStore((state) => state.isMobile);

  const t = {
    en: {
      h1: "Sign In",
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
      failLoginPass: "Failed to log in: wrong password",
      failLoginUser: "Failed to log in: user not found"
    },
    pl: {
      h1: "Logowanie",
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
      failLoginPass: "Błąd logowania: złe hasło",
      failLoginUser: "Błąd logowania: użytkownik nie istnieje"
    },
  };

  async function handleSubmit(e) {
    e.preventDefault();
    if (passwordRef.current.value.length < 6) {
      return setError(t[locale].shortPass);
    }

    try {
      setLoading(true);
      setError("");
      await loginUser(emailRef.current.value, passwordRef.current.value);
      router.push("/");
    } catch (error) {
      setLoading(false);
      if (error.message.includes("wrong-password")) {
        return setError(t[locale].failLoginPass);
      } else if (error.message.includes("user-not-found")) {
        return setError(t[locale].failLoginUser);
      }
      return setError(t[locale].failLogin + error.message);
    }
  }

  const showHidePass = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setInputType(inputType === "text" ? "password" : "text");
  };


  return (
    <div className="color-primary ps-3 pe-3">
      <Row xs={1} md={2}>
        <Col
          className={`d-flex justify-content-center ${
            !isMobile && `border-end ${props.theme == "dark" && "border-primary"}`
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
              <FloatingLabel controlId="loginEmail" label={t[locale].email} className="mb-3 text-dark">
                <Form.Control type="email" placeholder={t[locale].email} ref={emailRef} required />
              </FloatingLabel>

              <div className="d-flex w-100">
                <FloatingLabel controlId="loginPassword" label={t[locale].pass} className="w-100 text-dark">
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
              <Link href="/register"> {t[locale].join}</Link>
            </div>
          </section>
        </Col>
      </Row>
    </div>
  );
}

export default SignInForm;
