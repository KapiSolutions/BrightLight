import React, {useEffect} from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { Container } from 'react-bootstrap'
import { useAuth } from '../../context/AuthProvider'

function BlogPage() {
    const { isAuthenticated } = useAuth();
    const router = useRouter();

    useEffect(() => {
        isAuthenticated() 
            ? {}
            : router.replace('/sign-in')
      // eslint-disable-next-line react-hooks/exhaustive-deps
      }, []);

    return (
        <>
            <Head>
                <title>BrightLight | Blog</title>
            </Head>
            <Container className='justify-content-center text-center'>
                <h1 className='color-primary'> BLOG </h1>
            </Container>
        </>
    )
}

export default BlogPage