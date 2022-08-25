import React, { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/router'
import { Container, Form, Button, Alert, FloatingLabel } from 'react-bootstrap'
import { FaFacebookF, FaGoogle, FaTwitter } from 'react-icons/fa';
import { RiAlertFill } from 'react-icons/ri'
import { useAuth } from '../context/AuthProvider'

function RegisterForm(props) {
    const [isMobile, setMobile] = useState(false);
    const router = useRouter();
    const emailRef = useRef();
    const passwordRef = useRef();
    const passwordConfirmRef = useRef();
    const { registerUser, loginWithGoogle } = useAuth();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false); //to disable the submit button after clicked and wait for submit response

    async function handleSubmit(e) {
        e.preventDefault()

        if (passwordRef.current.value !== passwordConfirmRef.current.value) {
            return setError('Passwords do not match')
        }
        if (passwordRef.current.value.length < 6) {
            return setError('Password should be at least 6 characters')
        }

        try {
            setLoading(true);
            setError('');
            await registerUser(emailRef.current.value, passwordRef.current.value)
            router.push('/');

        } catch (error) {
            setLoading(false);

            if (error.message.includes('email-already-in-use')) {
                return setError('Failed to log in: email already in use.')
            }

            return setError('Failed to register user: ' + error.message)
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
        <Container className='d-flex justify-content-center color-primary'>
            <section className="w-100" style={{ maxWidth: "400px" }}>
                <h1 className="text-center mb-4">Let&apos;s Start!</h1>

                <div className='d-flex justify-content-evenly align-content-center mb-4 '>
                    <FaFacebookF className='pointer zoom' />
                    <FaGoogle className='pointer zoom' onClick={loginWithGoogle} />
                    <FaTwitter className='pointer zoom' />
                </div>

                <div className="hrDivider text-center">
                    <hr className="background" />
                    <p className="color-primary background">Or</p>
                </div>
                {error && <Alert variant="danger">
                    <RiAlertFill className="me-2 mb-1 iconSizeAlert" data-size='2' />
                    <strong>Ups! </strong>
                    {error}
                </Alert>}
                <Form onSubmit={handleSubmit}>
                    <FloatingLabel controlId="registerEmail" label="Email address" className="mb-3 text-dark">
                        <Form.Control type="email" placeholder="Email address" ref={emailRef} required />
                    </FloatingLabel>

                    <FloatingLabel controlId="registerPassword" label="Password" className="mb-3 text-dark">
                        <Form.Control type="password" placeholder="Password" ref={passwordRef} required />
                    </FloatingLabel>

                    <FloatingLabel controlId="registerConfirmPassword" label="Confirm password" className="text-dark">
                        <Form.Control type="password" placeholder="Confirm password" ref={passwordConfirmRef} required />
                    </FloatingLabel>

                    <Button className="w-100 mt-4 mb-4 btn-lg" type="submit" disabled={loading}>Register</Button>
                </Form>

            </section>

        </Container>
    )
}

export default RegisterForm