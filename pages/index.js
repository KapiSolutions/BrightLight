import React from "react";
import { BreadcrumbJsonLd, NextSeo } from "next-seo";
import { Container, Row, Col } from "react-bootstrap";
import ProductCard from "../components/Products/ProductCard";
import { getDocsFromCollection } from "../firebase/Firestore";
import Link from "next/link";
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
      aboutMe: "About me",
      oracle: "Oracle of Love",
    },
    pl: {
      title: "Strona Główna",
      h1: "Twoje karty",
      choose: "Wybierz jedną lub kilka by dowiedzieć się tego czego potrzebujesz.",
      findIt: "Poznaj ją teraz!",
      aboutMe: "O mnie",
      oracle: "Wyrocznia miłości",
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

      {/* Breadcrumbs SEO */}
      <BreadcrumbJsonLd
        itemListElements={[
          {
            position: 1,
            name: "Tarot Online",
            item: `https://www.brightlightgypsy.pl/${locale == "default" ? "" : locale}`,
          },
          {
            position: 2,
            name: t[locale == "default" ? "en" : locale].oracle,
            item: `https://www.brightlightgypsy.pl/${
              locale == "default" ? "" : locale + "/"
            }product/d58647bd-056d#main`,
          },
          {
            position: 3,
            name: "Blog",
            item: `https://www.brightlightgypsy.pl/${locale == "default" ? "" : locale + "/"}blog`,
          },
          {
            position: 4,
            name: t[locale == "default" ? "en" : locale].aboutMe,
            item: `https://www.brightlightgypsy.pl/${locale == "default" ? "" : locale + "/"}about`,
          },
        ]}
      />

      {/* Breadcrumbs */}
      <nav>
        <ol
          itemScope=""
          itemType="http://schema.org/BreadcrumbList"
          style={{ listStyleType: "none" }}
          className="d-flex flex-row ps-3 mb-0 mt-2"
        >
          <li itemProp="itemListElement" itemScope="" itemType="http://schema.org/ListItem">
            <span itemScope="" itemType="http://schema.org/Thing" itemProp="item" itemID="/">
              <small itemProp="name" className="text-muted">
                {t[locale].title}
              </small>
            </span>
            <meta itemProp="position" content="0" />
          </li>
        </ol>
      </nav>

      <Container className="d-flex mt-3 flex-column align-items-center justify-content-center">
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
        <section className="text-center mt-4 text-muted ps-2 pe-2">
          <small>
            Illustrations of the cards from &ldquo;Pastel Yourney&rdquo; Tarot Deck by{" "}
            <Link
              target="_blank"
              rel="noopener noreferrer"
              href="https://beau-life.com/products/the-pastel-journey-tarot-deck-by-vanessa-somuayina"
            >
              Vanessa Somuayina
            </Link>
          </small>
        </section>
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
