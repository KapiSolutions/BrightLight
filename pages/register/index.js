import React from 'react'
import Head from 'next/head'
import LayoutSign from '../../components/layout/Sign/LayoutSign'
import RegisterForm from '../../components/RegisterForm'
import useLocalStorageState from 'use-local-storage-state'

function Register() {
    const [theme, setTheme] = useLocalStorageState('theme', {
        ssr: true,
        defaultValue: 'light'
      })
  return (
    <>
    <Head>
      <title>BrightLight | Register</title>
    </Head>
    
    <RegisterForm theme={theme} />
    
  </>
  )
}

export default Register

Register.getLayout = function getLayout(page) {
    return (
      <LayoutSign>
        {page}
      </LayoutSign>
    )
  }