import React from "react";
import { NextSeo } from "next-seo";
import Image from "next/image";
import { Container } from "react-bootstrap";
import { useDeviceStore } from "../../stores/deviceStore";
import cardsIcon from "../../public/img/cards-light.png";
import cookie from "../../public/img/cookies/cookie.webp";
import tarotDeck from "../../public/img/contributors/pastel_journey__tarot_deck.jpg";
import backLight from "../../public/img/landing-back-light.jpg";
import backDark from "../../public/img/landing-back-dark.jpg";
import deliveryInfo from "../../public/img/delivery_info.png";
import zodiacSigns from "../../public/img/zodiac/Aries.png";
import aboutDiamond from "../../public/img/about/diamond.png";
import aboutCards from "../../public/img/about/tarot-cards.png";
import aboutJapanBack from "../../public/img/about/japan-light.png";
import aboutJapanSticker from "../../public/img/about/japan-sticker.png";

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
              <div className="d-flex me-2" style={{ position: "relative", height: "100px", minWidth: "100px" }}>
                <Image
                  src={cardsIcon}
                  fill
                  alt="Tarot Online - Bright Light Gypsy"
                  title="Tarot Online - Bright Light Gypsy"
                />
              </div>
              <div>
                Image by{" "}
                <Link
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://www.freepik.com/free-vector/witchy-occult-set_26753006.htm#page=3&query=vecstock%20tarot&position=31&from_view=search&track=ais"
                >
                  gstudioimagen1
                </Link>{" "}
                on Freepik
              </div>
            </li>
            {/* ------- */}
            <li className="d-flex flex-row align-items-center border-bottom pb-2">
              <div className="d-flex me-2 border" style={{ position: "relative", height: "100px", minWidth: "100px" }}>
                <Image
                  src={tarotDeck}
                  fill
                  alt="Tarot Online - Bright Light Gypsy"
                  title="Tarot Online - Bright Light Gypsy"
                  style={{ objectFit: "cover" }}
                  className="rounded"
                />
              </div>
              <div>
                Pastel Yourney Tarot Deck by{" "}
                <Link
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://beau-life.com/products/the-pastel-journey-tarot-deck-by-vanessa-somuayina"
                >
                  Vanessa Somuayina
                </Link>{" "}
                , Illustrations of the cards from{" "}
                <Link
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://www.tarotstack.com/products/the-pastel-journey-tarot"
                >
                  TarotStack
                </Link>
              </div>
            </li>
            {/* ------- */}
            <li className="d-flex flex-row align-items-center border-bottom pb-2">
              <div className="d-flex me-2" style={{ position: "relative", height: "100px", minWidth: "100px" }}>
                <Image
                  src={backLight}
                  fill
                  alt="Tarot Online - Bright Light Gypsy"
                  title="Tarot Online - Bright Light Gypsy"
                  style={{ objectFit: "contain" }}
                />
              </div>
              <div>
                Image from{" "}
                <Link
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://www.wallpaperflare.com/artistic-pixel-art-wallpaper-gflht"
                >
                  Wallpaper Flare
                </Link>
              </div>
            </li>
            {/* ------- */}
            <li className="d-flex flex-row align-items-center border-bottom pb-2">
              <div className="d-flex me-2" style={{ position: "relative", height: "100px", minWidth: "100px" }}>
                <Image
                  src={backDark}
                  fill
                  alt="Tarot Online - Bright Light Gypsy"
                  title="Tarot Online - Bright Light Gypsy"
                  style={{ objectFit: "contain" }}
                />
              </div>
              <div>
                Image by{" "}
                <Link
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://www.freepik.com/free-vector/realistic-galaxy-background_4665545.htm#query=space%20background&position=1&from_view=keyword&track=ais"
                >
                  pikisuperstar / Freepik
                </Link>
              </div>
            </li>
            {/* ------- */}
            <li className="d-flex flex-row align-items-center border-bottom pb-2">
              <div className="d-flex me-2" style={{ position: "relative", height: "100px", minWidth: "100px" }}>
                <Image
                  src={deliveryInfo}
                  fill
                  alt="Tarot Online - Bright Light Gypsy"
                  title="Tarot Online - Bright Light Gypsy"
                  style={{ objectFit: "contain" }}
                />
              </div>
              <div>
                Image by{" "}
                <Link
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://www.freepik.com/free-vector/cute-unicorn-working-laptop-cartoon-vector-icon-illustration-animal-technology-icon-concept-flat_28565591.htm#query=cute%20unicorn&position=3&from_view=keyword&track=ais"
                >
                  catalyststuff
                </Link>{" "}
                on Freepik
              </div>
            </li>
            {/* ------- */}
            <li className="d-flex flex-row align-items-center border-bottom pb-2">
              <div className="d-flex me-2" style={{ position: "relative", height: "100px", minWidth: "100px" }}>
                <Image
                  src={aboutDiamond}
                  fill
                  alt="Tarot Online - Bright Light Gypsy"
                  title="Tarot Online - Bright Light Gypsy"
                  style={{ objectFit: "contain" }}
                />
              </div>
              <div>
                Image from{" "}
                <Link target="_blank" rel="noopener noreferrer" href="https://www.pngwing.com/en/free-png-nutet">
                  PngWing
                </Link>
              </div>
            </li>
            {/* ------- */}
            <li className="d-flex flex-row align-items-center border-bottom pb-2">
              <div className="d-flex me-2" style={{ position: "relative", height: "100px", minWidth: "100px" }}>
                <Image
                  src={aboutCards}
                  fill
                  alt="Tarot Online - Bright Light Gypsy"
                  title="Tarot Online - Bright Light Gypsy"
                  style={{ objectFit: "contain" }}
                />
              </div>
              <div>
                Image by{" "}
                <Link
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://www.redbubble.com/i/sticker/Your-Future-Will-Be-Bright-Nikury-by-nikury/36469422.EJUG5"
                >
                  Nikury
                </Link>
              </div>
            </li>
            {/* ------- */}
            <li className="d-flex flex-row align-items-center border-bottom pb-2">
              <div className="d-flex me-2" style={{ position: "relative", height: "100px", minWidth: "100px" }}>
                <Image
                  src={aboutJapanBack}
                  fill
                  alt="Tarot Online - Bright Light Gypsy"
                  title="Tarot Online - Bright Light Gypsy"
                  style={{ objectFit: "contain" }}
                />
              </div>
              <div>
                Image from{" "}
                <Link
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://cutewallpaper.org/25x/komottwa0/1558820021.html"
                >
                  CuteWallpaper
                </Link>
              </div>
            </li>
            {/* ------- */}
            <li className="d-flex flex-row align-items-center border-bottom pb-2">
              <div className="d-flex me-2" style={{ position: "relative", height: "100px", minWidth: "100px" }}>
                <Image
                  src={aboutJapanSticker}
                  fill
                  alt="Tarot Online - Bright Light Gypsy"
                  title="Tarot Online - Bright Light Gypsy"
                  style={{ objectFit: "contain" }}
                />
              </div>
              <div>
                Image by{" "}
                <Link
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://www.redbubble.com/i/sticker/TOKYO-JAPAN-by-rtcifra/25366684.EJUG5"
                >
                  Ralph Cifra
                </Link>
              </div>
            </li>
            {/* ------- */}
            <li className="d-flex flex-row align-items-center border-bottom pb-2">
              <div className="d-flex me-2" style={{ position: "relative", height: "100px", minWidth: "100px" }}>
                <Image
                  src={zodiacSigns}
                  fill
                  alt="Tarot Online - Bright Light Gypsy"
                  title="Tarot Online - Bright Light Gypsy"
                  style={{ objectFit: "contain" }}
                />
              </div>
              <div>
                Zodiac illustrations from{" "}
                <Link target="_blank" rel="noopener noreferrer" href="https://www.thefunest.com/?page=zodiac-signs">
                  The Funest
                </Link>
              </div>
            </li>
            {/* ------- */}
            <li className="d-flex flex-row align-items-center border-bottom pb-2">
              <div className="d-flex me-2" style={{ position: "relative", height: "100px", minWidth: "100px" }}>
                <Image
                  src={cookie}
                  fill
                  alt="Tarot Online - Bright Light Gypsy"
                  title="Tarot Online - Bright Light Gypsy"
                  style={{ objectFit: "contain" }}
                />
              </div>
              <div>
                Image by{" "}
                <Link
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://www.freepik.com/free-vector/hand-drawn-cookies-logo-template_35631372.htm#page=3&query=cookie%20cartoon&position=17&from_view=keyword&track=ais"
                >
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
