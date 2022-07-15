import React from 'react'
import LayoutSign from '../components/layout/Sign/LayoutSign'

function ErrorPage() {
    return (
        <div style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)"
        }}>
            404 | PAGE NOT FOUND
        </div>
    )
}

export default ErrorPage

ErrorPage.getLayout = function getLayout(page) {
    return (
      <LayoutSign>
        {page}
      </LayoutSign>
    )
  }