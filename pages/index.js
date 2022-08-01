import React from 'react'
import Head from 'next/head'
import { Container, Row, Col } from 'react-bootstrap'
import CardTarot from '../components/CardTarot'

export default function Home() {
  return (
    <>
      <Head>
        <title>BrightLight | Home</title>
      </Head>


      <Container className='d-flex mt-5 flex-column align-items-center justify-content-center'>
        <Row className="d-flex mb-2 text-center">
          <h1 className='color-primary'>Your Cards</h1>
          <p className='color-primary small'>Choose one or a pair to get what you need.</p>
        </Row>

        <Row xs={1} md={2} lg={3} className="g-4">
          {Array.from({ length: 4 }).map((_, idx) => (
            <Col key={idx} className='d-flex justify-content-center'>
              <CardTarot />
            </Col>
          ))}
        </Row>
      </Container>

    </>
  )
}

