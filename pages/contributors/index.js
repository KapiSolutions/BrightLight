import React from "react";
import { NextSeo } from "next-seo";
import Image from "next/image";
import { Container } from "react-bootstrap";
import { useDeviceStore } from "../../stores/deviceStore";
import cardsIcon from "../../public/img/cards-light.png";
import cookie from "../../public/img/cookies/cookie.webp";
import tarotDeck from "../../public/img/contributors/pastel_journey__tarot_deck.jpg";

import Link from "next/link";

function ContributorsPage(props) {
  const locale = props.locale;
  const isMobile = useDeviceStore((state) => state.isMobile);
  const theme = useDeviceStore((state) => state.themeState);

  const t = {
    en: {
      title: "Contributors",
      home: "Home",
    },
    pl: {
      title: "Współtwórcy",
      home: "Strona Główna",
    },
  };
  return (
    <>
      <NextSeo
        title={`BrightLight | ${t[locale].title}`}
        canonical={`https://www.brightlightgypsy.pl/${locale}/contributors`}
        languageAlternates={[
          {
            hrefLang: "en",
            href: "https://www.brightlightgypsy.pl/en/contributors",
          },
          {
            hrefLang: "pl",
            href: "https://www.brightlightgypsy.pl/pl/contributors",
          },
          {
            hrefLang: "x-default",
            href: "https://www.brightlightgypsy.pl/contributors",
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
            <span itemScope="" itemType="http://schema.org/Thing" itemProp="item" itemID="/contributors">
              <small itemProp="name">{t[locale].title}</small>
            </span>
            <meta itemProp="position" content="1" />
          </li>
        </ol>
      </nav>
      <Container className="justify-content-center text-center mt-3 color-primary">
        <h1 className="mt-0 color-primary text-center">{t[locale].title}</h1>

        <section>
          <ol className="w-100 d-flex flex-column gap-2 text-start ps-0">
            <li className="d-flex flex-row align-items-center border-bottom pb-2">
              <div className="d-flex me-2" style={{ position: "relative", height: "100px", minWidth: "100px"}}>
                <Image
                  src={cardsIcon}
                  fill
                  alt="Tarot Online - Bright Light Gypsy"
                  title="Tarot Online - Bright Light Gypsy"
                />
              </div>
              <div>
              Image by {" "}
                <Link href="https://www.freepik.com/free-vector/witchy-occult-set_26753006.htm#page=3&query=vecstock%20tarot&position=31&from_view=search&track=ais">
                  gstudioimagen1
                </Link>{" "}
                on Freepik
              </div>
            </li>
            {/* ------- */}
            <li className="d-flex flex-row align-items-center border-bottom pb-2">
              <div className="d-flex me-2 border" style={{ position: "relative", height: "100px", minWidth: "100px"}}>
                <Image
                  src={tarotDeck}
                  fill
                  alt="Tarot Online - Bright Light Gypsy"
                  title="Tarot Online - Bright Light Gypsy"
                  style={{objectFit: "cover"}}
                  className="rounded"
                />
              </div>
              <div>
                Amazing Tarot Deck by Vanessa Somuayina, Images of the cards from{" "}
                <Link href="https://www.tarotstack.com/products/the-pastel-journey-tarot">
                  TarotStack
                </Link>
              </div>
            </li>
            {/* ------- */}
            <li className="d-flex flex-row align-items-center border-bottom pb-2">
              <div className="d-flex me-2" style={{ position: "relative", height: "100px", minWidth: "100px"}}>
                <Image
                  src={cookie}
                  fill
                  alt="Tarot Online - Bright Light Gypsy"
                  title="Tarot Online - Bright Light Gypsy"
                  style={{objectFit: "contain"}}
                />
              </div>
              <div>
                Image by{" "}
                <Link href="https://www.freepik.com/free-vector/hand-drawn-cookies-logo-template_35631372.htm#page=3&query=cookie%20cartoon&position=17&from_view=keyword&track=ais">
                  Freepik
                </Link>
              </div>
            </li>
            {/* ------- */}
          </ol>
        </section>
      </Container>
    </>
  );
}

export default ContributorsPage;

export async function getStaticProps({ locale }) {
  return {
    props: {
      locale: locale,
    },
    revalidate: false,
  };
}
