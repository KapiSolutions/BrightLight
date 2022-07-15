import Head from 'next/head'
import Image from 'next/image'
import { Container, Card, Button, Row, Col } from 'react-bootstrap'

export default function Home() {
  return (
    <>
      <Head>
        <title>Home</title>
      </Head>


      <Container className='d-flex mt-5 flex-column align-items-center justify-content-center'>
        <Row className="d-flex mb-2 text-center">
          <h1 className='color-primary'>Your Cards</h1>
          <p className='color-primary small'>Choose one or a pair to get what you need.</p>
        </Row>

        <Row xs={1} md={2} lg={3} className="g-4">
          {Array.from({ length: 4 }).map((_, idx) => (
            <Col key={idx} className='d-flex justify-content-center'>
              <Card style={{ width: '18rem' }}>
                <Card.Img variant="top" src="/img/cards-light.png" />
                <Card.Body>
                  <Card.Title>Card Title</Card.Title>
                  <Card.Text>
                    Some quick example text to build on the card title and make up the
                    bulk of the cards content.
                  </Card.Text>
                  <Button variant="primary">Go somewhere</Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>


      </Container>
    </>
  )
}

