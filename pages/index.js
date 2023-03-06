import React from "react";
import Head from "next/head";
import { Container, Row, Col } from "react-bootstrap";
import ProductCard from "../components/Products/ProductCard";
import { getDocsFromCollection } from "../firebase/Firestore";

export default function Home(props) {
  const locale = props.locale;
  const t = {
    en: {
      h1: "Your Cards",
      choose: "Choose one or more to get what you need.",
      findIt: "Find it out!",
    },
    pl: {
      h1: "Twoje karty",
      choose: "Wybierz jedną lub kilka by dowiedzieć się tego czego potrzebujesz.",
      findIt: "Poznaj ją teraz!",
    },
  };
  return (
    <>
      <Head>
        <title>BrightLight | Home</title>
      </Head>

      <Container className="d-flex mt-5 flex-column align-items-center justify-content-center">
        <Row className="d-flex mb-2 text-center">
          <h1 className="color-primary">{t[locale].h1}</h1>
          <p className="color-primary small">{t[locale].choose}</p>
        </Row>

        <Row sm={2} md={2} lg={3} className="g-4 justify-content-center">
          {props.products.map((product) => (
            <Col key={product.id} className="d-flex justify-content-center">
              <ProductCard product={product} preview={false} />
            </Col>
          ))}
        </Row>
      </Container>
    </>
  );
}

export async function getStaticProps({ locale }) {
  let docs = await getDocsFromCollection("products");

  docs.map((doc) => {
    doc.desc = doc.desc[locale];
    doc.title = doc.title[locale];
  });

  return {
    props: {
      products: JSON.parse(JSON.stringify(docs)),
      locale: locale,
    },
    revalidate: false, //on demand revalidation
  };
}
