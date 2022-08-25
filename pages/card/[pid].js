import React from 'react'
import Head from 'next/head'
import { Container } from 'react-bootstrap'
import { useRouter } from 'next/router'
import { db } from '../../config/firebase'
import { doc, getDoc, getDocs, collection} from "firebase/firestore"

function CardPage(props) {
    const router = useRouter()
  return (
    <>
    <Head>
        <title>BrightLight | Card</title>
      </Head>
      <Container className='justify-content-center text-center'>
       <h1 className='color-primary'> Card </h1>
       <p>{router.query.pid}</p>
       
       </Container>
    </>
  )
}

export default CardPage

export async function getStaticProps() {
  const tarot = []
  const ref = doc(db, "tarot", "J2foBvlBzOh5C3Wk7kuJ")
  const docSnap = await getDoc(ref)
  if (docSnap.exists()) {
    // Convert to City object
    const city = docSnap.data()
    // Use a City instance method
    // console.log(city)
  } else {
    console.log("No such document!")
  }


  return {
    props: { 
      tarot: tarot },
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