import React from 'react'
import Head from 'next/head'
import LayoutSign from '../../components/layout/Sign/LayoutSign'
import SignInForm from '../../components/SignInForm'
import useLocalStorageState from 'use-local-storage-state'


function SignIn() {
  const [theme, setTheme] = useLocalStorageState('theme', {
    ssr: true,
    defaultValue: 'light'
  })
  return (
    <>
      <Head>
        <title>BrightLight | Sign In</title>
      </Head>
      
      <SignInForm theme={theme} />
      
    </>
  )
}

export default SignIn

SignIn.getLayout = function getLayout(page) {
  return (
    <LayoutSign>
      {page}
    </LayoutSign>
  )
}