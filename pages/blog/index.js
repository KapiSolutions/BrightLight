import React from 'react'
import Head from 'next/head'
import { Container } from 'react-bootstrap'
function index() {
    return (
        <>
            <Head>
                <title>BrightLight | Blogt</title>
            </Head>
            <Container className='justify-content-center text-center'>
                <h1 className='color-primary'> BLOG </h1>
            </Container>
        </>
    )
}

export default index