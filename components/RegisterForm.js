import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { Container, Form, Button, FloatingLabel, Row, Col } from 'react-bootstrap'
import { FaFacebookF, FaGoogle, FaTwitter } from 'react-icons/fa';

function RegisterForm(props) {
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
          
                    <section className="w-100" style={{ maxWidth: "400px" }}>

                        <h1 className="text-center mb-4">Let&apos;s Start!</h1>
                        

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
                            <FloatingLabel controlId="registerEmail" label="Email address" className="mb-3 text-dark">
                                <Form.Control type="email" placeholder="Email address" required />
                            </FloatingLabel>

                            <FloatingLabel controlId="registerPassword" label="Password" className="mb-3 text-dark">
                                <Form.Control type="password" placeholder="Password" required />
                            </FloatingLabel>

                            <FloatingLabel controlId="registerConfirmPassword" label="ConfirmPassword" className="text-dark">
                                <Form.Control type="password" placeholder="ConfirmPassword" required />
                            </FloatingLabel>

                            <Button className="w-100 mt-4 mb-4 btn-lg" type="submit">Register</Button>
                        </Form>

                    </section>
            
        </Container>
    )
}

export default RegisterForm