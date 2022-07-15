import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Navbar from './Navbar'
import styles from '../../../../styles/layout/main/Header.module.scss'
import { Button } from 'react-bootstrap'

function Header(props) {
    const cardsLight = '/img/cards-light.png';
    const cardsDark = '/img/cards-dark.png';

    return (
        <div className={`${styles.container} landingBack`}>
            <Navbar theme={props.theme} />
            <div className={styles.proposal}>
                <div>
                    <h1 className='color-primary'>Wanna know Your future?</h1>
                    <br />
                    <Link href="/#main" passHref>
                        <Button variant='secondary' size='lg'>Find it out!</Button>
                    </Link>
                    <br />
                    <Image src={props.theme === 'light' ? cardsLight : cardsDark} width="200" height="200" alt='tarot cards' />
                </div>
            </div>
        </div>
    )
}

export default Header