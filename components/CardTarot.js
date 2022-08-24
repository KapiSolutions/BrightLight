import React, { useState, useEffect } from 'react'
import { Card, Button } from 'react-bootstrap'
import { storage } from '../config/firebase'
import { ref, getDownloadURL } from "firebase/storage";
import styles from '../styles/components/CardTarot.module.scss'

function CardTarot(props) {
    const imageRef = ref(storage, `images/cards/${props.img}`)
    const [fullDesc, setfullDesc] = useState(false)
    getDownloadURL(imageRef)
        .then((url) => {
            const img = document.getElementById(props.title);
            img.setAttribute('src', url);
        })
        .catch((error) => {
            switch (error.code) {
                case 'storage/object-not-found':
                    console.log('File doesnt exist')
                    break;
                case 'storage/unauthorized':
                    console.log('User doesnt have permission to access the object')
                    break;
                case 'storage/canceled':
                    console.log('User canceled the upload')
                    break;
                case 'storage/unknown':
                    console.log('Unknown error occurred, inspect the server response')
                    break;
            }
        });
    function DescHandler() {
        if (fullDesc) {
            document.getElementById(`text-${props.id}`).style.height = 'auto'
            document.getElementById(`text-${props.id}`).style.maskImage = 'none'
        } else {
            document.getElementById(`text-${props.id}`).style.height = '80px'
            document.getElementById(`text-${props.id}`).style.maskImage = 'linear-gradient(180deg, #000 60%, transparent)'
        }
        setfullDesc(!fullDesc)
    }

    return (
        <Card style={{ width: '18rem' }} className='background border shadow-sm' >
            <Card.Img id={props.title} variant="top" className='border-bottom' alt={props.title} />
            <Card.Body >
                <Card.Title className='color-primary'><strong>{props.title}</strong></Card.Title>
                <Card.Text id={`text-${props.id}`} className={`${styles.cardText} color-primary`}>
                    {props.desc}
                </Card.Text>

                <Button variant="outline-accent3 float-start" onClick={DescHandler}>
                    Read more
                </Button>
                <Button variant="primary float-end">Get it</Button>
            </Card.Body>
        </Card>
    )
}

export default CardTarot