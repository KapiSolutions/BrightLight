import React from 'react'
import LayoutSign from '../components/layout/Sign/LayoutSign'
import styles from '../styles/pages/404.module.scss'

function ErrorPage() {
    return (
        <div className={styles.container}>
          <h3>Ups!</h3>
            <h1 className='color-primary'>404 | PAGE NOT FOUND</h1>
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