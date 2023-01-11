import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Navigation from './Navigation'
import styles from '../../../../styles/layout/main/Header.module.scss'
import { Button } from 'react-bootstrap'

function Header(props) {
    const cardsIcon = '/img/cards-light.png';

    return (
        <div className={`${styles.container} landingBack `}>
            <Navigation theme={props.theme} />
            <div className={styles.proposal}>
                <div>
                    <h1 className='color-primary m-0 fw-bold'>WANNA KNOW YOUR FUTURE?</h1>
                    <p className='color-primary'>DON&apos;T WAIT</p>
                    <br />
                    <Link href="/#main" passHref>
                        <Button className={props.theme === 'light' ? styles.animatedBorderLight : styles.animatedBorderDark} variant='secondary' size='lg'>FIND IT OUT!</Button>
                    </Link>
                    <br /><br />
                    <Image src={cardsIcon} width="100" height="100" alt='tarot cards' />
                </div>
            </div>
        </div>
    )
}

export default Header