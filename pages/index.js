import React from "react";
import Head from "next/head";
import { Container, Row, Col } from "react-bootstrap";
import CardTarot from "../components/CardTarot";
import { db } from "../config/firebase";
import { collection, getDocs } from "firebase/firestore";

export default function Home(props) {
  return (
    <>
      <Head>
        <title>BrightLight | Home</title>
      </Head>

      <Container className="d-flex mt-5 flex-column align-items-center justify-content-center">
        <Row className="d-flex mb-2 text-center">
          <h1 className="color-primary">Your Cards</h1>
          <p className="color-primary small">Choose one or more to get what you need.</p>
        </Row>

        <Row sm={2} md={2} lg={3} className="g-4 justify-content-center">
          {props.tarot.map((tarot) => (
            <Col key={tarot.id} className="d-flex justify-content-center">
              <CardTarot id={tarot.id} title={tarot.title} desc={tarot.description} img={tarot.image} />
            </Col>
          ))}
        </Row>
      </Container>
    </>
  );
}

export async function getStaticProps() {
  const tarot = [];
  const querySnapshot = await getDocs(collection(db, "tarot"));
  querySnapshot.forEach((doc) => {
    tarot.push(doc.data());
  });

  return {
    props: {
      tarot: tarot,
    },
    revalidate: 60, //1minute
  };
}
