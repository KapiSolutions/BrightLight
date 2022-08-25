import React, { useState } from 'react'
import Head from 'next/head'
import { Container, Alert, Row, Col } from 'react-bootstrap'
import { RiAlertFill } from 'react-icons/ri'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { db } from '../../config/firebase'
import { doc, getDoc, getDocs, collection } from "firebase/firestore"
import ReactCardFlip from 'react-card-flip'

function CardPage(props) {
  // const router = useRouter()
  // router.query.pid
  const tarot = props.tarot
  const [flip1, setFlip1] = useState(false)
  const [flip2, setFlip2] = useState(false)
  const [flip3, setFlip3] = useState(false)
  return (
    <>
      <Head>
        <title>BrightLight | {!!props.error ? 'Error' : tarot.title}</title>
      </Head>
      <Container className='justify-content-center text-center mt-5'>
        {!!props.error
          ? (<Alert variant="danger" className='m-5'>
            <RiAlertFill className="me-2 mb-1 iconSizeAlert" data-size='2' />
            <strong>Ups! </strong>
            {props.error}
          </Alert>)
          : (
            <>
              <Row className="d-flex mb-3 text-center">
                <h1 className='color-primary mb-1'> {tarot.title} </h1>
                <p className='color-primary '>Ask your question and <strong>choose 3 cards</strong></p>
              </Row>
              <Row className="d-flex mb-5 justify-content-center">

                <Col className="d-flex col-sm-4 col-md-5 pt-3 justify-content-end">
                  <ReactCardFlip isFlipped={flip1}
                    flipDirection="horizontal">
                    <div style={{opacity: '0.5'}}>
                      <Image src='/img/back.png' width='120' height='200' alt="img1" onClick={() => setFlip1(!flip1)} />
                    </div>
                    <div>
                      <Image src='/img/hanged-man.png' width='120' height='200' alt="img2" onClick={() => setFlip1(!flip1)} />
                    </div>
                  </ReactCardFlip>
                </Col>

                <Col className="d-flex col-sm-4 col-md-2 justify-content-center">
                <ReactCardFlip isFlipped={flip2}
                    flipDirection="horizontal">
                    <div style={{opacity: '0.5'}}>
                      <Image src='/img/back.png' width='120' height='200' alt="img1" onClick={() => setFlip2(!flip2)} />
                    </div>
                    <div>
                      <Image src='/img/hanged-man.png' width='120' height='200' alt="img2" onClick={() => setFlip2(!flip2)} />
                    </div>
                  </ReactCardFlip>
                </Col>

                <Col className="d-flex col-sm-4 col-md-5 pt-3 justify-content-start">
                <ReactCardFlip isFlipped={flip3}
                    flipDirection="horizontal">
                    <div style={{opacity: '0.5'}}>
                      <Image src='/img/back.png' width='120' height='200' alt="img1" onClick={() => setFlip3(!flip3)} />
                    </div>
                    <div>
                      <Image src='/img/hanged-man.png' width='120' height='200' alt="img2" onClick={() => setFlip3(!flip3)} />
                    </div>
                  </ReactCardFlip>
                </Col>
              </Row>
              <Row className="d-flex mb-2 text-center">
                <p>
                  Set of cards
                </p>
              </Row>
            </>
          )}
      </Container>
    </>
  )
}


export default CardPage

export async function getStaticProps(context) {
  const pid = context.params.pid
  let tarotCard = null
  let error = ''

  const ref = doc(db, "tarot", pid)
  const docSnap = await getDoc(ref)
  if (docSnap.exists()) {
    tarotCard = docSnap.data()
  } else {
    error = 'Error: card doesnt exist'
  }

  return {
    props: {
      tarot: tarotCard,
      error: error
    },
    revalidate: 60
  };
}

export async function getStaticPaths() {
  const cardIds = []
  const querySnapshot = await getDocs(collection(db, "tarot"))
  querySnapshot.forEach((doc) => {
    const cardId = {
      pid: doc.id
    }
    cardIds.push(cardId)
  });

  return {
    paths: cardIds.map((cardId) => {
      return {
        params: {
          pid: cardId.pid,
        },
      };
    }),
    fallback: false,
  }
}