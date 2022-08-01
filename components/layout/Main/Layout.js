import React, { useEffect } from 'react'
import Head from 'next/head'
import Header from './Header/Header'
import Footer from './Footer'
import styles from '../../../styles/layout/main/grid.module.scss'
import { SSRProvider } from 'react-bootstrap';
import useLocalStorageState from 'use-local-storage-state'

function Layout({ children }) {
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
                        <Header className={styles.header} theme={theme} />
                        <main id='main' className={`${styles.main} `}>
                            {children}
                        </main>
                        <Footer className={`${styles.footer}`} theme={theme} />
                    </div>
                </div>
            </SSRProvider>
        </>
    )
}

export default Layout