import React from "react";
import Head from "next/head";
import { Container } from "react-bootstrap";
import path from "path";
import { promises as fs } from "fs";
const parse = require("html-react-parser");
import DOMPurify from "dompurify";

function CookiesPolicyPage(props) {
  const locale = props.locale;
  const t = {
    en: {
      title: "Cookies Policy",

    },
    pl: {
      title: "Polityka Cookies",

    },
  };
  return (
    <>
      <Head>
        <title>BrightLight | {t[locale].title}</title>
      </Head>
      <Container className="justify-content-center text-center mt-5" style={{maxWidth: "100vw"}}>
        <h1 className="color-primary">{t[locale].title}</h1>
        <section className="text-start ps-1 pe-1">{parse(DOMPurify.sanitize(props.text))}</section>
      </Container>
    </>
  );
}

export default CookiesPolicyPage;

export async function getStaticProps({ locale }) {
  let filePath = "";
  let text = "";
  
    if (locale != "default") {
      filePath = path.join(process.cwd(), `public/regulations/cookies/${locale}/index.txt`);
      text = await fs.readFile(filePath, "utf8");
    } 
      return {
        props: {
          text: text,
          locale: locale,
        },
        revalidate: false, //on demand revalidation
      };
    
  }