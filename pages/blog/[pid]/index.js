import React from 'react'
import Head from 'next/head'
import { Container } from 'react-bootstrap'

function BlogPage() {
    return (
        <>
            <Head>
                <title>BrightLight | Blog</title>
            </Head>
            <Container className='justify-content-center text-center mt-5'>
                <h1 className='color-primary'> Blog Title </h1>
            </Container>
        </>
    )
}

export default BlogPage