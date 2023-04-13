import React from "react";
import { NextSeo } from "next-seo";
import { useRouter } from "next/router";
import { Container, Button } from "react-bootstrap";
import TarotLottery from "../../components/TarotLottery";
import { getDocById, getDocsFromCollection } from "../../firebase/Firestore";
import { VscBracketError } from "react-icons/vsc";
import Link from "next/link";

function ProductPage(props) {
  const router = useRouter();
  const locale = props.locale;
  const t = {
    en: {
      msg: "Tarot does not exist.",
      button: "Go Back",
      home: "Home",
    },
    pl: {
      msg: "Wybrany tarot nie istnieje.",
      button: "Wróć",
      home: "Strona Główna",
    },
  };

  return (
    <>
      <NextSeo
        title={`BrightLight | ${props.product ? props.product.title : "404 Error"}`}
        canonical={`https://www.brightlightgypsy.pl/${locale}${router.asPath}`}
        languageAlternates={[
          {
            hrefLang: "en",
            href: `https://www.brightlightgypsy.pl/en${router.asPath}`,
          },
          {
            hrefLang: "pl",
            href: `https://www.brightlightgypsy.pl/pl${router.asPath}`,
          },
          {
            hrefLang: "x-default",
            href: `https://www.brightlightgypsy.pl${router.asPath}`,
          },
        ]}
      />
      {/* Breadcrumbs */}
      <nav>
        <ol
          itemScope=""
          itemType="http://schema.org/BreadcrumbList"
          style={{ listStyleType: "none" }}
          className="d-flex flex-row gap-2 ps-3 mb-0 mt-2 color-primary"
        >
          <li itemProp="itemListElement" itemScope="" itemType="http://schema.org/ListItem">
            <Link href="/#main" itemScope="" itemType="http://schema.org/Thing" itemProp="item" itemID="/" passHref>
              <small itemProp="name">{t[locale].home}</small>
            </Link>
            <meta itemProp="position" content="0" />
          </li>
          <li>
            <small>&gt;</small>
          </li>
          <li itemProp="itemListElement" itemScope="" itemType="http://schema.org/ListItem">
            <span itemScope="" itemType="http://schema.org/Thing" itemProp="item" itemID={`/product${router.asPath}`}>
              <small itemProp="name">{props.product?.title}</small>
            </span>
            <meta itemProp="position" content="1" />
          </li>
        </ol>
      </nav>
      <Container className="justify-content-center text-center mt-3">
        {props.product ? (
          <TarotLottery locale={locale} product={props.product} />
        ) : (
          <div className="text-center">
            <VscBracketError style={{ width: "40px", height: "40px" }} className="mb-3" />
            <h4 className="mt-0 mb-4">{t[locale].msg}</h4>
            <Button variant="outline-primary" onClick={() => router.replace("/#main")}>
              {t[locale].button}
            </Button>
          </div>
        )}
      </Container>
      <section className="text-center mt-4 text-muted ps-2 pe-2">
        <small>
          Illustrations of the cards from &ldquo;Pastel Journey&rdquo; Tarot Deck by{" "}
          <Link
            target="_blank"
            rel="noopener noreferrer"
            href="https://beau-life.com/products/the-pastel-journey-tarot-deck-by-vanessa-somuayina"
          >
            Vanessa Somuayina
          </Link>
        </small>
      </section>
    </>
  );
}

export default ProductPage;

export async function getStaticProps(context) {
  const id = context.params.pid;
  const locale = context.locale;
  let doc = await getDocById("products", id);
  if (doc) {
    doc.desc = doc.desc[locale];
    doc.title = doc.title[locale];
  }

  return {
    props: {
      product: doc ? JSON.parse(JSON.stringify(doc)) : null,
      locale: locale,
    },
    revalidate: false, //on demand revalidation
  };
}

export async function getStaticPaths({ locales }) {
  const docs = await getDocsFromCollection("products", true); //true - get only Id's

  return {
    paths: docs.flatMap((doc) => {
      return locales.map((locale) => {
        return {
          params: { pid: doc },
          locale: locale,
        };
      });
    }),

    fallback: "blocking",
  };
}
