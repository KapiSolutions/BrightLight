import React from "react";
import Link from "next/link";
import Image from "next/image";
import Navigation from "./Navigation";
import styles from "../../../../styles/layout/main/Header.module.scss";
import cardsIcon from "../../../../public/img/cards-light.png";
import { Button } from "react-bootstrap";

function Header(props) {
  const locale = props.locale;
  const t = {
    en: {
      h1: "Wanna know your future?",
      dontWait: "don't wait",
      findIt: "Find it out!",
    },
    pl: {
      h1: "Nurtuje Cię przyszłość?",
      dontWait: "Nie czekaj",
      findIt: "Poznaj ją teraz!",
    },
  };
  return (
    <div className={`${styles.container} landingBack `}>
      <Navigation locale={locale} theme={props.theme} />
      <div className={styles.proposal}>
        <div className="text-uppercase">
          <h1 className="color-primary m-0 fw-bold">{t[locale].h1}</h1>
          <p className="color-primary mt-4 mb-4">{t[locale].dontWait}</p>
          <Link href="/#main" passHref>
            <Button
              className={props.theme === "light" ? styles.animatedBorderLight : styles.animatedBorderDark}
              variant="secondary"
              size="lg"
            >
              {t[locale].findIt}
            </Button>
          </Link>
          <br />
          <br />
          <Image
            src={cardsIcon}
            width="100"
            height="100"
            alt="Tarot Online - Bright Light Gypsy"
            title="Tarot Online - Bright Light Gypsy"
          />
        </div>
      </div>
    </div>
  );
}

export default Header;
