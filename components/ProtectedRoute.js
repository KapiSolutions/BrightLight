import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import { useAuth } from '../context/AuthProvider'

function ProtectedRoute({children}) {
    const {currentUser} = useAuth()
    const router = useRouter()

    useEffect(() => {
        if(!currentUser) {
        router.replace('/sign-in')
        }
    }, [router, currentUser])

  return (
    <>
    {currentUser && children }
    </>
  )
}

export default ProtectedRoute