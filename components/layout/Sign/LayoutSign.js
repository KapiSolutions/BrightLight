import React from 'react'
import Link from 'next/link'
import { BsBackspace } from 'react-icons/bs';
import { SSRProvider } from 'react-bootstrap';


function LayoutSign({ children }) {
  return (
    <>
      <SSRProvider>
        <div>
          <Link href='/' passHref><p style={{ cursor: 'pointer' }}><BsBackspace />Back</p></Link>
        </div>

        <div>
          {children}
        </div>
      </SSRProvider>
    </>
  )
}

export default LayoutSign