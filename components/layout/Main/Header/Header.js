import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Navigation from "./Navigation";
import styles from "../../../../styles/layout/main/Header.module.scss";
import cardsIcon from "../../../../public/img/cards-light.png";
import { Button } from "react-bootstrap";
import { useDeviceStore } from "../../../../stores/deviceStore";
import imgLight from "../../../../public/img/landing-back-light.jpg";
import imgDark from "../../../../public/img/landing-back-dark.jpg";
import { useRouter } from "next/router";

function Header(props) {
  const locale = props.locale;
  const router = useRouter();
  const isMobile = useDeviceStore((state) => state.isMobile);
  const theme = useDeviceStore((state) => state.themeState);
  const [offsetY, setOffsetY] = useState(0);

  const handleScroll = () => {
    const offset = window.pageYOffset;
    const scale = 1 + offset / 1200;
    setOffsetY(scale > 1.5 ? 1.5 : scale);
  };

  useEffect(() => {
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
    <section className={`${styles.parallaxSection} color-primary`}>
      <Navigation locale={locale} theme={props.theme} />
      <div className={styles.parallaxBg} style={{ transform: `scale(${offsetY})` }}>
        <Image
          src={theme == "dark" ? imgDark : imgLight}
          alt="Tarot online background"
          fill
          style={{ objectFit: isMobile ? "cover" : "none" }}
          quality={100}
        />
      </div>
      <div className={styles.parallaxContent}>
        <h2 className={`${styles.parallaxTitle} text-uppercase`}>{t[locale].h1}</h2>
        <p className={`${styles.parallaxCaption} text-uppercase`}>{t[locale].dontWait}</p>
        <Button
          variant="primary"
          size="lg"
          className={`${styles.parallaxButton} 
          ${props.theme === "light" ? styles.animatedBorderLight : styles.animatedBorderDark}
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
    </section>

    // Old version:
    // <div className={`${styles.container} landingBack `}>
    //   <Navigation locale={locale} theme={props.theme} />
    //   <div className={styles.proposal}>
    //     <div className="text-uppercase">
    //       <h1 className="color-primary m-0 fw-bold">{t[locale].h1}</h1>
    //       <p className="color-primary mt-4 mb-4">{t[locale].dontWait}</p>
    //       <Link href="/#main" passHref>
    //         <Button
    //           className={props.theme === "light" ? styles.animatedBorderLight : styles.animatedBorderDark}
    //           variant="secondary"
    //           size="lg"
    //         >
    //           {t[locale].findIt}
    //         </Button>
    //       </Link>
    //       <br />
    //       <br />
    //       <Image
    //         src={cardsIcon}
    //         width="100"
    //         height="100"
    //         alt="Tarot Online - Bright Light Gypsy"
    //         title="Tarot Online - Bright Light Gypsy"
    //       />
    //     </div>
    //   </div>
    // </div>
  );
}

export default Header;
