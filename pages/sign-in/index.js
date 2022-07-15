import React from 'react'
import Link from 'next/link'
import LayoutSign from '../../components/layout/Sign/LayoutSign'
import {Card, Container, Form, Button, Alert} from 'react-bootstrap'

function signin() {
  return (
    <Container className='d-flex align-items-center justify-content-center'>
      <section className="w-100" style={{ maxWidth: "400px" }}>
        <Card>
          <Card.Body>
            <h1 className="text-center mb-4">Sign In</h1>
            
            <Form >
              <Form.Group id="email">
                <Form.Label>Email</Form.Label>
                <Form.Control type="email"  required></Form.Control>
              </Form.Group>
              <Form.Group id="password">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password"  required></Form.Control>
              </Form.Group>
              <Button className="w-100 mt-4" type="submit" >Sign In</Button>
            </Form>
            <div className="w-100 text-center mt-3">
              <Link href="/forgot-password">Forgot Password?</Link>
            </div>
          </Card.Body>
        </Card>
        <div className="w-100 text-center mt-2">
          Dont have an account yet? <Link href="/register">Sign Up</Link>
        </div>
      </section>
    </Container>
  )
}

export default signin

signin.getLayout = function getLayout(page) {
  return (
    <LayoutSign>
      {page}
    </LayoutSign>
  )
}