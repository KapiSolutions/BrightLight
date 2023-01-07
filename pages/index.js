import React from "react";
import Head from "next/head";
import { Container, Row, Col } from "react-bootstrap";
import CardTarot from "../components/CardTarot";
import { getDocsFromCollection } from "../firebase/Firestore";

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
  const docs = await getDocsFromCollection("tarot");

  return {
    props: {
      tarot: docs,
    },
    revalidate: 60, //1minute
  };
}
