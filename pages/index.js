import React from "react";
import Head from "next/head";
import { NextSeo } from "next-seo";
import { Container, Row, Col } from "react-bootstrap";
import ProductCard from "../components/Products/ProductCard";
import AdBanner from "../components/AdBanner";
import { getDocsFromCollection } from "../firebase/Firestore";
import Script from "next/script";

export default function Home(props) {
  const locale = props.locale;
  const t = {
    en: {
      title: "Home",
      h1: "Your Cards",
      choose: "Choose one or more to get what you need.",
      findIt: "Find it out!",
      desc: "Wanna know Your future? Don't wait! Get accurate tarot readings from professional esoteric girl or AI with our web app. Explore the mysteries of the universe and gain insights into your future today. Try now for a personalized and enlightening experience! Bright Light Gypsy Tarot online.",
      descOg: "Wanna know Your future? Don't wait! Get accurate tarot readings from professional esoteric girl or AI ❤",
    },
    pl: {
      title: "Strona Główna",
      h1: "Twoje karty",
      choose: "Wybierz jedną lub kilka by dowiedzieć się tego czego potrzebujesz.",
      findIt: "Poznaj ją teraz!",
      desc: "Nurtuje Cię przyszłość? Nie czekaj! Uzyskaj wyjątkowe odczyty tarota od profesjonalnej ezoteryczki lub sztucznej inteligencji AI! Poznaj tajemnice wszechświata i uzyskaj wgląd w swoją przyszłość już dziś. Wypróbuj teraz, aby uzyskać spersonalizowane i wyjątkowe doświadczenia! Bright Light Gypsy Tarot online.",
      descOg:
        "Nurtuje Cię przyszłość? Nie czekaj! Uzyskaj wyjątkowe odczyty tarota od profesjonalnej ezoteryczki lub sztucznej inteligencji AI ❤",
    },
  };
  return (
    <>
      <NextSeo
        title="BrightLight | Tarot Online"
        description={t[locale].desc}
        canonical={`https://www.brightlightgypsy.pl/${locale}`}
        openGraph={{
          type: "website",
          siteName: "Bright Light Gypsy",
          url: `https://www.brightlightgypsy.pl/${locale == "default" ? "" : locale}`,
          title: "BrightLight | Tarot Online",
          locale: locale,
          description: t[locale].descOg,
          images: [
            {
              url: "https://firebasestorage.googleapis.com/v0/b/brightlight-443b7.appspot.com/o/images%2Fothers%2Fseo-og-image.png?alt=media&token=4b3ebb3c-b324-45c7-8cd5-9aff77723b7e",
              width: 1200,
              height: 628,
              alt: "Bright Light Gypsy",
              type: "image/png",
            },
          ],
        }}
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
