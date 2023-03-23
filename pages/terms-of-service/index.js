import React from "react";
import Head from "next/head";
import { Container } from "react-bootstrap";
import path from "path";
import { promises as fs } from "fs";
const parse = require("html-react-parser");
import DOMPurify from "dompurify";
import { useDeviceStore } from "../../stores/deviceStore";
import Link from "next/link";

function TermsOfService(props) {
  const locale = props.locale;
  const isMobile = useDeviceStore((state) => state.isMobile);
  const t = {
    en: {
      title: "Terms of Service",
      home: "Home",
    },
    pl: {
      title: "Regulamin",
      home: "Strona Główna",
    },
  };
  return (
    <>
      <Head>
        <title>BrightLight | {t[locale].title}</title>
      </Head>
      <Container className="justify-content-center text-center mt-4 color-primary" style={{maxWidth: "100vw"}}>
      <nav className="d-flex gap-2">
          <small>
            <Link href="/#main">{t[locale].home}</Link>
          </small>
          <small>&gt;</small>
          <small>{t[locale].title}</small>
        </nav>
        <h1>{t[locale].title}</h1>
        <section className={`text-start m-auto ${!isMobile && "w-75"}`}>{parse(DOMPurify.sanitize(props.text))}</section>
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
