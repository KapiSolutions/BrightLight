import React from "react";
import Head from "next/head";
import { Container } from "react-bootstrap";
import path from "path";
import { promises as fs } from "fs";
const parse = require("html-react-parser");
import DOMPurify from "dompurify";

function TermsOfService(props) {
  const locale = props.locale;
  const t = {
    en: {
      title: "Terms of Service",
      date: "Effective date",
    },
    pl: {
      title: "Regulamin",
      date: "Data obowiązywania",
    },
  };
  return (
    <>
      <Head>
        <title>BrightLight | {t[locale].title}</title>
      </Head>
      <Container className="justify-content-center text-center mt-5" style={{maxWidth: "100vw"}}>
        <h1 className="color-primary">{t[locale].title}</h1>
        <p className="text-start">{t[locale].date}: 01/03/2023</p>
        <section className="text-start ps-1 pe-1">{parse(DOMPurify.sanitize(props.text))}</section>
      </Container>
    </>
  );
}

export default TermsOfService;

export async function getStaticProps({ locale }) {
let filePath = "";
let text = "";

  if (locale != "default") {
    filePath = path.join(process.cwd(), `public/regulations/therms-of-service/${locale}/index.txt`);
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
