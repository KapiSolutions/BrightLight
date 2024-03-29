import React, { useLayoutEffect, useState } from "react";
import Image from "next/image";
import Navigation from "./Navigation";
import styles from "../../../../styles/layout/main/Header.module.scss";
import cardsIcon from "../../../../public/img/cards-light.png";
import { Button } from "react-bootstrap";
import { useRouter } from "next/router";
import { useDeviceStore } from "../../../../stores/deviceStore";

function Header(props) {
  const locale = props.locale;
  const router = useRouter();
  // const [offsetY, setOffsetY] = useState(110);
  const [offsetX, setOffsetX] = useState(0);
  const isMobile = useDeviceStore((state) => state.isMobile);
  const handleScroll = () => {
    const offset = window.pageYOffset;
    // const scale = 110 + offset / 15;
    // setOffsetY(scale > 160 ? 160 : scale);
    const move = offset / 8;
    setOffsetX(move);
  };

  useLayoutEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
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
    <div
      className={`${styles.container} landingBack color-primary`}
      style={{
        backgroundPosition: isMobile ? `-${offsetX}px` : "center",
        // backgroundSize: isMobile ? "cover" : `${offsetY}%`,
      }}
    >
      <Navigation locale={locale} theme={props.theme} />
      <div className={styles.proposal}>
        <div className={`text-uppercase ${styles.parallaxContent}`}>
          <h2 className={`${styles.parallaxTitle} text-uppercase`}>{t[locale].h1}</h2>
          <p className={`${styles.parallaxCaption} text-uppercase`}>{t[locale].dontWait}</p>
          <Button
            variant="primary"
            size="lg"
            className={`${props.theme === "light" ? styles.animatedBorderLight : styles.animatedBorderDark}
           text-uppercase`}
            onClick={() => {
              if (router.route === "/") {
                document.getElementsByName("main")[0].scrollIntoView({ block: "start", inline: "nearest" });
              } else {
                router.push("/#main");
                // document.getElementsByName("main")[0].scrollIntoView({ block: "start", inline: "nearest" });
              }
            }}
          >
            {t[locale].findIt}
          </Button>
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
