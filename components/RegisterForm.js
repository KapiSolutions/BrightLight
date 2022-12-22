import React, { useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Container, Form, Button, Alert, FloatingLabel, Spinner, InputGroup } from "react-bootstrap";
import { FaFacebookF, FaGoogle, FaTwitter, FaRegEyeSlash, FaRegEye } from "react-icons/fa";
import { RiAlertFill } from "react-icons/ri";
import { useAuth } from "../context/AuthProvider";

function RegisterForm() {
  const router = useRouter();
  const nameRef = useRef();
  // const bdateRef = useRef();
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

  return (
    <Container className="d-flex justify-content-center color-primary">
      <section className="w-100" style={{ maxWidth: "400px" }}>
        <h1 className="text-center mt-2 mb-3">Let&apos;s Start!</h1>
        <p className="text-center mb-3">Sign up with</p>
        <div className="d-flex justify-content-evenly align-content-center mb-4 ">
          <FaFacebookF className="pointer zoom" onClick={loginWithFacebook} />
          <FaGoogle className="pointer zoom" onClick={loginWithGoogle} />
          <FaTwitter className="pointer zoom" onClick={loginWithTwitter} />
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
          <FloatingLabel controlId="registerName" label="Name" className="mb-3 text-dark">
            <Form.Control type="text" placeholder="Name" ref={nameRef} required />
          </FloatingLabel>

          {/* <FloatingLabel controlId="registerBirthDate" label="Birth date" className="mb-3 text-dark">
            <Form.Control
              type="date"
              placeholder="Birth date"
              ref={bdateRef}
              min="1920-01-01"
              max={new Date().toLocaleDateString("en-ca")}
              required
            />
          </FloatingLabel> */}

          <FloatingLabel controlId="registerEmail" label="Email address" className="mb-3 text-dark">
            <Form.Control type="email" placeholder="Email address" ref={emailRef} required />
          </FloatingLabel>

          <div className="d-flex w-100">
            <FloatingLabel controlId="registerPassword" label="Password" className="w-100 text-dark">
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

          <Button className="w-100 mt-4 mb-2 btn-lg" type="submit" disabled={loading}>
            {loading ? (
              <>
                <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                <span>Loading...</span>
              </>
            ) : (
              <span> Register </span>
            )}
          </Button>
        </Form>

        <div className="w-100 text-center mt-1">
          <p>
            <small>
              By creating an account, you accept our <Link href="/terms-of-service#main" passHref className="color-secondary"><u>Terms of service </u></Link> 
              and our <Link
              href="/privacy-policy#main"
              passHref
              className="color-secondary underline"><u>Privacy Policy</u></Link>.
            </small>
          </p>
          Already have an account?
          <Link href="/sign-in"> Sign In!</Link>
        </div>
      </section>
    </Container>
  );
}

export default RegisterForm;
