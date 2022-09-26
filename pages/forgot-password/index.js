import React from 'react'
import Head from 'next/head'
import LayoutSign from '../../components/layout/Sign/LayoutSign'
import useLocalStorageState from 'use-local-storage-state'
import ForgotPasswordForm from '../../components/ForgotPasswordForm'

function ForgotPassword() {
    const [theme, setTheme] = useLocalStorageState('theme', {
        ssr: true,
        defaultValue: 'light'
      })
  return (
    <>
    <Head>
      <title>BrightLight | Forgot password?</title>
    </Head>
    
    <ForgotPasswordForm theme={theme} />
  </>
  )
}

export default ForgotPassword

ForgotPassword.getLayout = function getLayout(page) {
    return (
      <LayoutSign>
        {page}
      </LayoutSign>
    )
  }