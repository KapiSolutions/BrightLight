import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Container, Form, Button, FloatingLabel, Row, Col } from 'react-bootstrap'
import { FaFacebookF, FaGoogle, FaTwitter } from 'react-icons/fa';

function SignInForm(props) {
  const [isMobile, setMobile] = useState(false);

  useEffect(() => {
    if (window.innerWidth < 768) {
      setMobile(true);
    } else {
      setMobile(false);
    }
  }, []);
  return (
    <Container className='d-flex justify-content-center color-primary'>
      <Row xs={1} md={2}>
        <Col className='d-flex justify-content-center'>
          {isMobile ?
            <Image src={`/svg/signUp${props.theme}.svg`} width='150' height='150' alt="SignIn Image" />
            :
            <Image src={`/svg/signUp${props.theme}.svg`} width='500' height='500' alt="SignIn Image" className='pe-5' />
          }
        </Col>

        <Col className='d-flex justify-content-center align-content-center'>
          <section className="w-100" style={{ maxWidth: "400px" }}>

            <h1 className="text-center m-0">Sign In</h1>
            <p className="text-center mb-4">Unlock your way to the Future!</p>

            <div className='d-flex justify-content-evenly align-content-center mb-4 mt-3'>
              <FaFacebookF className='pointer zoom' />
              <FaGoogle className='pointer zoom' />
              <FaTwitter className='pointer zoom' />
            </div>

            <div className="hrDivider text-center">
              <hr className="background" />
              <p className="color-primary background">Or</p>
            </div>

            <Form>
              <FloatingLabel controlId="loginEmail" label="Email address" className="mb-3 text-dark">
                <Form.Control type="email" placeholder="Email address" required />
              </FloatingLabel>

              <FloatingLabel controlId="loginPassword" label="Password" className="text-dark">
                <Form.Control type="password" placeholder="Password" required />
              </FloatingLabel>

              <Button className="w-100 btn-lg  mt-4" type="submit" >Sign In</Button>
            </Form>
            <div className="w-100 text-center mt-3">
              <Link href="/forgot-password">Forgot Password?</Link>
            </div>

            <div className="w-100 text-center mt-2">
              Dont have an account yet? <Link href="/register">Register</Link>
            </div>
          </section>
        </Col>

      </Row>
    </Container>
  )
}

export default SignInForm