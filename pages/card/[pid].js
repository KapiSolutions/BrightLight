import React from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { Container, Alert, Row, Col } from 'react-bootstrap'
import { RiAlertFill } from 'react-icons/ri'
import { db } from '../../config/firebase'
import { doc, getDoc, getDocs, collection } from "firebase/firestore"
import TarotLottery from '../../components/TarotLottery/TarotLottery'


function CardPage(props) {
  const router = useRouter()
  return (
    <>
      <Head>
        <title>BrightLight | {!!props.error ? 'Error' : props.tarot.title}</title>
      </Head>
      <Container className='justify-content-center text-center mt-5'>
        {!!props.error
          ?
          <Alert variant="danger" className='m-5'>
            <RiAlertFill className="me-2 mb-1 iconSizeAlert" data-size='2' />
            <strong>Ups! </strong>
            {props.error}
          </Alert>
          :
          <TarotLottery id={router.query.pid} title={props.tarot.title} cardSet={props.tarot.cardSet} />
        }
      </Container>
    </>
  )
}


export default CardPage

export async function getStaticProps(context) {
  const pid = context.params.pid
  let tarotCards = null
  let error = ''

  const ref = doc(db, "tarot", pid)
  const docSnap = await getDoc(ref)
  if (docSnap.exists()) {
    tarotCards = docSnap.data()
  } else {
    error = 'Error: card doesnt exist'
  }

  return {
    props: {
      tarot: tarotCards,
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