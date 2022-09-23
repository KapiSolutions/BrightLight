import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Container, Form, Button, Alert, FloatingLabel, Row, Col, Spinner, InputGroup } from "react-bootstrap";
import { RiAlertFill } from "react-icons/ri";
import { GiAce } from "react-icons/gi";
import { useAuth } from "../context/AuthProvider";

function ForgotPasswordForm(props) {
  const emailRef = useRef();
  const { resetPassword } = useAuth();
  const [isMobile, setMobile] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setError("");
      setMessage("");
      setLoading(true);
      await resetPassword(emailRef.current.value);
      setMessage("Check your email/spam for further instructions.");
      setLoading(false);
    } catch (error) {
      setLoading(false);
      return setError("Failed to reset password" + error.message);
    }
  }

  useEffect(() => {
    if (window.innerWidth < 768) {
      setMobile(true);
    } else {
      setMobile(false);
    }
  }, []);
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
            <h1 className="text-center mb-3">Forgot password?</h1>
            {/* <p className="text-center mb-4">Just put your email below and check mailbox!</p> */}

            {error && (
              <Alert variant="danger">
                <RiAlertFill className="me-2 mb-1 iconSizeAlert" data-size="2" />
                <strong>Ups! </strong>
                {error}
              </Alert>
            )}
            {message && (
              <Alert variant="success">
                <GiAce className="me-2 mb-1 iconSizeAlert" data-size="2" />
                <strong>Great! </strong>
                {message}
              </Alert>
            )}
            <Form onSubmit={handleSubmit}>
              <FloatingLabel controlId="loginEmail" label="Email address" className="mb-3 text-dark">
                <Form.Control type="email" placeholder="Email address" ref={emailRef} required />
              </FloatingLabel>
              <Button className="w-100 btn-lg" type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                    <span>Loading...</span>
                  </>
                ) : (
                  <span> {message ? 'Send Again' : 'Reset password'} </span>
                )}
                
              </Button>
            </Form>
            <div className="w-100 text-center mt-3">
              <p className="color-primary mb-0">However do you remember your password?</p>
              <Link href="/sign-in">Sign In!</Link>
            </div>
          </section>
        </Col>
      </Row>
    </Container>
  );
}

export default ForgotPasswordForm;
