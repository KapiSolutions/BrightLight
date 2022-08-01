import React from 'react'
import Head from 'next/head'
import { Container, Row, Col } from 'react-bootstrap'

function index() {
  return (
    <>
    <Head>
        <title>BrightLight | About</title>
      </Head>
      <Container className='justify-content-center text-center'>
       <h1 className='color-primary'> This is the About page </h1>
       </Container>
    </>
  )
}

export default index