import React, {useEffect} from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { Container } from 'react-bootstrap'
import { useAuth } from '../../context/AuthProvider'

function BlogPage() {
    return (
        <>
            <Head>
                <title>BrightLight | Blog</title>
            </Head>
            <Container className='justify-content-center text-center mt-5'>
                <h1 className='color-primary'> BLOG </h1>
            </Container>
        </>
    )
}

export default BlogPage