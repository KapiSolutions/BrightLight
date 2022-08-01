import React from 'react'
import { Card, Button } from 'react-bootstrap'

function CardTarot() {
    return (
        <Card style={{ width: '18rem' }} className='background border shadow-sm' >
            <Card.Img variant="top" src="/img/cards-light.png" className='border-bottom' />
            <Card.Body >
                <Card.Title className='color-primary'>Card Title</Card.Title>
                <Card.Text className='color-primary'>
                    Some quick example text to build on the card title and make up the
                    bulk of the cards content.
                </Card.Text>
                <Button variant="outline-accent3 float-start">Read more</Button>
                <Button variant="primary float-end">Buy it</Button>
            </Card.Body>
        </Card>
    )
}

export default CardTarot