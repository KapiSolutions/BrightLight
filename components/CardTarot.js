import React, { useState } from 'react'
import { Card, Button } from 'react-bootstrap'
import { storage } from '../config/firebase'
import { ref, getDownloadURL } from "firebase/storage";
import { useRouter } from 'next/router'
import styles from '../styles/components/CardTarot.module.scss'

function CardTarot(props) {
    const router = useRouter()
    const [fullDesc, setfullDesc] = useState(false)
    const truncLength = 60
    const imageRef = ref(storage, `images/cards/${props.img}`)
    
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

    function DescHandler(id) {
        if (!fullDesc) {
            document.getElementById(`text-${id}`).style.maskImage = 'none'
        } else {
            document.getElementById(`text-${id}`).style.maskImage = 'linear-gradient(180deg, #000 85%, transparent)'
        }
        setfullDesc(!fullDesc)
    }

    return (
        <Card style={{ width: '18rem' }} className='background border shadow-sm' >
            <Card.Img id={props.title} variant="top" className='imgOpacity' alt={props.title} />
            <Card.Body >
                <Card.Title className='color-primary'><strong>{props.title}</strong></Card.Title>
                <Card.Text id={`text-${props.id}`} className={`${styles.cardText} color-primary`}>
                    {fullDesc ? props.desc : `${props.desc.substring(0, truncLength)}...`}
                </Card.Text>
                <Button variant="outline-accent3 float-start" onClick={() => DescHandler(props.id)}>
                    {fullDesc ? 'Read Less' : 'Read more'}
                </Button>
                <Button variant="primary float-end" onClick={() => {
                    router.push({
                        pathname: '/card/[pid]',
                        query: { pid: props.id },
                    })
                }}>Get it</Button>
            </Card.Body>
        </Card>
    )
}

export default CardTarot