import React, {useEffect} from 'react'
import useLocalStorageState from 'use-local-storage-state'
import { GiEvilMoon, GiUbisoftSun } from 'react-icons/gi';
import styles from '../styles/components/ChangeThemeButton.module.scss'

function ChangeThemeButton(props) {
    const [theme, setTheme] = useLocalStorageState('theme', {
        ssr: true,
        defaultValue: 'light'
    })
    const switchTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
    }  
    return (
        <div style={{ cursor: 'pointer' }}>
            {theme == 'light' ?
                <div onClick={switchTheme}>
                    <GiEvilMoon className={`${styles.themeIcon} color-primary`} />
                    {props.text ?
                        <span className='color-primary'> Dark theme</span>
                        :
                        <span></span>
                    }
                </div>
                :
                <div onClick={switchTheme}>
                    <GiUbisoftSun className={`${styles.themeIcon} color-primary`} />
                    {props.text ?
                        <span className='color-primary'> Light theme</span>
                        :
                        <span></span>
                    }
                </div>
            }
        </div>
    )
}

export default ChangeThemeButton