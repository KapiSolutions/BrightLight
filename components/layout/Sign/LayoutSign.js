import React from 'react'
import Link from 'next/link'
import Head from 'next/head'
import { VscArrowLeft } from 'react-icons/vsc';
import { SSRProvider, Container, Button } from 'react-bootstrap';
import styles from '../../../styles/layout/sign/Sign.module.scss'
import useLocalStorageState from 'use-local-storage-state'

function LayoutSign({ children }) {
  const [theme, setTheme] = useLocalStorageState('theme', {
    ssr: true,
    defaultValue: 'light'
  })
  return (
    <>
      <Head>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <SSRProvider>
        <div className={theme}>
          <div className={`${styles.container} background`}>

          {/* <div className={`${styles.backButton} text-center`}>
              <Link href='/' passHref>
                <Button className='btn-sm' variant={theme === 'light' ? 'outline-dark' : 'outline-light'}>
                  <VscArrowLeft style={{ width: '20px', height: '20px', marginBottom: '3px' }} />
                  Back
                </Button>
              </Link>
            </div> */}

            <Container>
              {children}
            </Container>

          </div>
        </div>
      </SSRProvider>
    </>
  )
}

export default LayoutSign