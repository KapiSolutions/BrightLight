import React from 'react'
import Head from 'next/head'
import { Container, Row, Col } from 'react-bootstrap'

function AboutPage() {
  return (
    <>
    <Head>
        <title>BrightLight | About</title>
      </Head>
      <Container className='justify-content-center text-center'>
       <h1 className='color-primary'> About me </h1>
       <p className='color-primary'>
       I&apos;m a tarotist with several years of experience. Since I was a child, I have also had visions and highly developed intuition. Tarot cards allow you to indicate the probable course of life. Let us remember that as a result of introducing certain changes in our life, we can change the predicted future. Therefore, in addition to learning about the upcoming future and other people&apos;s intentions, it is also worth asking them for advice.
       </p>
       </Container>
    </>
  )
}

export default AboutPage