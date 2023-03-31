import React from "react";
import { NextSeo } from "next-seo";
import { Container, Row, Col } from "react-bootstrap";
import ProductCard from "../components/Products/ProductCard";
import { getDocsFromCollection } from "../firebase/Firestore";
// import AdBanner from "../components/AdBanner";
// import Script from "next/script";

export default function Home(props) {
  const locale = props.locale;
  const t = {
    en: {
      title: "Home",
      h1: "Your Cards",
      choose: "Choose one or more to get what you need.",
      findIt: "Find it out!",
    },
    pl: {
      title: "Strona Główna",
      h1: "Twoje karty",
      choose: "Wybierz jedną lub kilka by dowiedzieć się tego czego potrzebujesz.",
      findIt: "Poznaj ją teraz!",
    },
  };
  return (
    <>
      <NextSeo
        title="BrightLight | Tarot Online"
        canonical={`https://www.brightlightgypsy.pl/${locale}`}
        languageAlternates={[
          {
            hrefLang: "en",
            href: "https://www.brightlightgypsy.pl/en",
          },
          {
            hrefLang: "pl",
            href: "https://www.brightlightgypsy.pl/pl",
          },
          {
            hrefLang: "x-default",
            href: "https://www.brightlightgypsy.pl",
          },
        ]}
      />

      {/* <Script
        async
        src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_GOOGLE_ADS_CLIENT_ID}`}
        strategy="lazyOnload"
        crossorigin="anonymous"
      /> */}

      <Container className="d-flex mt-5 flex-column align-items-center justify-content-center">
        <Row className="d-flex mb-2 text-center">
          <h1 className="color-primary">{t[locale].h1}</h1>
          <p className="color-primary small">{t[locale].choose}</p>
        </Row>

        <Row sm={2} md={2} lg={3} className="g-4 justify-content-center">
          {props.products.map(
            (product) =>
              product.active && (
                <Col key={product.id} className="d-flex justify-content-center">
                  <ProductCard product={product} preview={false} />
                </Col>
              )
          )}
        </Row>
        <section>{/* <AdBanner /> */}</section>
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
  // sort by price
  const sortedDocs = docs.sort((a, b) => a.price.pln.amount - b.price.pln.amount);

  return {
    props: {
      products: JSON.parse(JSON.stringify(sortedDocs)),
      locale: locale,
    },
    revalidate: false, //on demand revalidation
  };
}
