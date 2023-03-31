import React from "react";
import { NextSeo } from "next-seo";
import { useRouter } from "next/router";
import { Container, Button } from "react-bootstrap";
import TarotLottery from "../../components/TarotLottery";
import { getDocById, getDocsFromCollection } from "../../firebase/Firestore";
import { VscBracketError } from "react-icons/vsc";

function ProductPage(props) {
  const router = useRouter();
  const locale = props.locale;
  const t = {
    en: {
      msg: "Tarot does not exist.",
      button: "Go Back",
    },
    pl: {
      msg: "Wybrany tarot nie istnieje.",
      button: "Wróć",
    },
  };
  console.log(router)
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
      <Container className="justify-content-center text-center mt-4">
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
    </>
  );
}

export default ProductPage;

export async function getStaticProps(context) {
  const id = context.params.pid;
  const locale = context.locale;
  let doc = await getDocById("products", id);
  doc.desc = doc.desc[locale];
  doc.title = doc.title[locale];

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
