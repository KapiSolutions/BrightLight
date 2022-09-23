import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import Image from "next/image";
import { Container, Form, Button, Alert, FloatingLabel, Row, Col, Spinner, InputGroup } from "react-bootstrap";
import { FaFacebookF, FaGoogle, FaTwitter, FaRegEyeSlash, FaRegEye } from "react-icons/fa";
import { RiAlertFill } from "react-icons/ri";
import { useAuth } from "../context/AuthProvider";

function SignInForm(props) {
  const router = useRouter();
  const emailRef = useRef();
  const passwordRef = useRef();
  const [isMobile, setMobile] = useState(false);
  const { loginUser, loginWithGoogle, loginWithFacebook, loginWithTwitter } = useAuth();
  
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
      await loginUser(emailRef.current.value, passwordRef.current.value);
      router.push("/");
    } catch (error) {
      setLoading(false);
      if (error.message.includes("wrong-password")) {
        return setError("Failed to log in: wrong password");
      } else if (error.message.includes("user-not-found")) {
        return setError("Failed to log in: user not found");
      }
      return setError("Failed to log in: " + error.message);
    }
  }

  useEffect(() => {
    if (window.innerWidth < 768) {
      setMobile(true);
    } else {
      setMobile(false);
    }
  }, []);

  const showHidePass = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setInputType(inputType === "text" ? "password" : "text");
  };
  return (
    <Container className="d-flex justify-content-center color-primary">
      <Row xs={1} md={2}>
        <Col className="d-flex justify-content-center">
          {isMobile ? (
            <Image src={`/svg/signUp${props.theme}.svg`} width="150" height="150" alt="SignIn Image" />
          ) : (
            <Image src={`/svg/signUp${props.theme}.svg`} width="500" height="500" alt="SignIn Image" className="pe-5" />
          )}
        </Col>

        <Col className="d-flex justify-content-center align-content-center">
          <section className="w-100" style={{ maxWidth: "400px" }}>
            <h1 className="text-center m-0">Sign In</h1>
            <p className="text-center mb-4">Unlock your way to the Future!</p>

            <div className="d-flex justify-content-evenly align-content-center mb-4 mt-3">
              <FaFacebookF className="pointer zoom" onClick={loginWithFacebook}/>
              <FaGoogle className="pointer zoom" onClick={loginWithGoogle}/>
              <FaTwitter className="pointer zoom" onClick={loginWithTwitter}/>
            </div>

            <div className="hrDivider text-center">
              <hr className="background" />
              <p className="color-primary background">Or</p>
            </div>
            {error && (
              <Alert variant="danger">
                <RiAlertFill className="me-2 mb-1 iconSizeAlert" data-size="2" />
                <strong>Ups! </strong>
                {error}
              </Alert>
            )}
            <Form onSubmit={handleSubmit}>
              <FloatingLabel controlId="loginEmail" label="Email address" className="mb-3 text-dark">
                <Form.Control type="email" placeholder="Email address" ref={emailRef} required />
              </FloatingLabel>

              <div className="d-flex w-100">
                <FloatingLabel controlId="loginPassword" label="Password" className="w-100 text-dark">
                  <Form.Control type={inputType} placeholder="Password" ref={passwordRef} required />
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
                    <span>Loading...</span>
                  </>
                ) : (
                  <span> Sign In </span>
                )}
              </Button>
            </Form>
            <div className="w-100 text-center mt-3">
              <Link href="/forgot-password">Forgot Password?</Link>
            </div>

            <div className="w-100 text-center mt-2">
              Don&apos;t have an account?
              <Link href="/register"> Join now!</Link>
            </div>
          </section>
        </Col>
      </Row>
    </Container>
  );
}

export default SignInForm;
