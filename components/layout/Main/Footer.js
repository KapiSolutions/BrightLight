import React from 'react'
import styles from '../../../styles/layout/main/Footer.module.scss'

function Footer() {
  return (
    <div className={`${styles.container} color-primary`}>
      <div className={styles.links}>
        <p>Contact | Regulamin</p>
      </div>
      <div className={styles.signature}>
      <p>©Kapisolutions 2022</p>
      </div>
    </div>
  )
}

export default Footer