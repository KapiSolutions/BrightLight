import React from "react";
import { NextSeo } from "next-seo";
import { Container } from "react-bootstrap";
import path from "path";
import { promises as fs } from "fs";
const parse = require("html-react-parser");
import DOMPurify from "dompurify";
import { useDeviceStore } from "../../stores/deviceStore";
import Link from "next/link";

function PrivacyPolicy(props) {
  const locale = props.locale;
  const isMobile = useDeviceStore((state) => state.isMobile);
  const t = {
    en: {
      title: "Privacy Policy",
      home: "Home",
    },
    pl: {
      title: "Polityka Prywatności",
      home: "Strona Główna",
    },
  };
  return (
    <>
      <NextSeo
        title={`BrightLight | ${t[locale].title}`}
        canonical={`https://www.brightlightgypsy.pl/${locale}/privacy-policy`}
        languageAlternates={[
          {
            hrefLang: "en",
            href: "https://www.brightlightgypsy.pl/en/privacy-policy",
          },
          {
            hrefLang: "pl",
            href: "https://www.brightlightgypsy.pl/pl/privacy-policy",
          },
          {
            hrefLang: "x-default",
            href: "https://www.brightlightgypsy.pl/privacy-policy",
          },
        ]}
      />
            {/* Breadcrumbs */}
            <nav>
        <ol
          itemScope=""
          itemType="http://schema.org/BreadcrumbList"
          style={{ listStyleType: "none" }}
          className="d-flex flex-row gap-2 ps-3 mb-0 mt-2"
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
            <span itemScope="" itemType="http://schema.org/Thing" itemProp="item" itemID="/privacy-policy">
              <small itemProp="name">{t[locale].title}</small>
            </span>
            <meta itemProp="position" content="1" />
          </li>
        </ol>
      </nav>

      <Container className="justify-content-center text-center mt-3 color-primary" style={{ maxWidth: "100vw" }}>
        <h1>{t[locale].title}</h1>
        <section className={`text-start m-auto ${!isMobile && "w-75"}`}>
          {parse(DOMPurify.sanitize(props.text))}
        </section>
      </Container>
    </>
  );
}

export default PrivacyPolicy;

export async function getStaticProps({ locale }) {
  let filePath = "";
  let text = "";

  if (locale != "default") {
    filePath = path.join(process.cwd(), `public/regulations/privacy/${locale}/index.txt`);
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
