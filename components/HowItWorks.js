import Image from "next/image";
import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import avatarPath from "../public/img/about/avatar.png";
import styles from "../styles/components/HowItWorks.module.scss";
import imgLight from "../public/img/how-it-works/howItWorks_light.jpg";
import imgDark from "../public/img/how-it-works/howItWorks_dark.jpg";
import { useDeviceStore } from "../stores/deviceStore";

function HowItWorks(props) {
  const locale = props.locale;
  const isMobile = useDeviceStore((state) => state.isMobile);
  const theme = useDeviceStore((state) => state.themeState);
  const [offsetY, setOffsetY] = useState(0);

  const handleScroll = () => {
    const offset = window.pageYOffset;
    const element = document.getElementById("howToSectionParallax");
    const pos = element.offsetTop - 250;
    const scale = 1 + (offset - pos) / 1000;
    setOffsetY(scale < 1 ? 1 : scale);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const t = {
    en: {
      h: "Hello!",
      caption: "Are you curious how Online Tarot works?",
      button: "Get Started!",
      h2: "How it works?",
      p1: `It's Easy! Just choose your cards, ask a question, and receive an interpretation from our expert esotericist, Bright Light Gypsy, or through our advanced AI technology. ❤`,
      p2: `Our algorithms are designed to provide a personalized and authentic experience, making you feel like you are in a one-on-one meeting with a real Tarot reader, all from the 
            comfort of your own home. With the ability to select your own cards, you have a real impact on the outcome of your divination, allowing you to receive tailored advice on various 
            aspects of life, including love, career, and personal development.`,
      p3: `Our user-friendly interface allows you to purchase coins to use for your AI readings, and you can easily exchange them for personalized tips. Choose between an interpretation by 
            our experienced esotericist or our AI technology, depending on your needs and budget.`,
      p4: `Don't hesitate to take advantage of our services to gain insights and clarity on your life path. Join us on this beautiful journey and discover the guidance you need to live your best life!`,
    },
    pl: {
      h: "Cześć!",
      caption: "Jesteś ciekaw jak działa Tarot Online?",
      button: "Dowiedz się!",
      h2: "Jak to działa?",
      p1: `To łatwe! Po prostu wybierz swoje karty, zadaj pytanie i uzyskaj interpretację od profesjonalnej ezoteryczki Bright Light Gypsy, 
          lub za pośrednictwem naszej zaawansowanej technologii AI. ❤`,
      p2: `Nasze algorytmy zostały zaprojektowane tak, aby zapewnić spersonalizowane i autentyczne doświadczenie, zupełnie jak na spotkaniu twarzą w twarz z Tarocistką, 
            a to wszystko bez wychodzenia z domu! Dzięki możliwości doboru własnych kart masz realny wpływ na wynik swoich wróżb, i w efekcie uzyskanej porady.`,
      p3: `Nasz przyjazny dla użytkownika interfejs umożliwia zakup monet do wykorzystania w odczytach AI, a także łatwą wymianę ich na spersonalizowane wskazówki 
      dotyczące różnych aspektów życia, w tym miłości, kariery i rozwoju osobistego.
      Dzięki możliwość wyboru między interpretacją od doświadcznej ezoteryczki lub naszej technologii AI, znajdziesz idealne dopasowanie do swoich potrzeb i budżetu.`,
      p4: `Nie czekaj i uzyskaj dokładne i spersonalizowane odczyty, które pomogą Ci w tej pięknej podróży jaką jest życie.`,
    },
  };
  return (
    <section className="mt-5 color-primary" id="howToSectionParallax">
      <section className={styles.parallaxSection}>
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
          <div className="text-center  mb-4">
            <Image src={avatarPath} width="170" height="170" alt="Avatar" />
          </div>
          <h2 className={styles.parallaxTitle}>{t[locale].h}</h2>
          <p className={styles.parallaxCaption}>{t[locale].caption}</p>
          <Button
            variant="primary"
            size="lg"
            className={isMobile ? "" : styles.parallaxButton}
            onClick={() => {
              document
                .getElementsByName("howToSectionDescription")[0]
                .scrollIntoView({ block: isMobile ? "nearest" : "center"});
            }}
          >
            {t[locale].button}
          </Button>
        </div>
      </section>
      <div className={isMobile ? "pt-4" : "pt-4"} name="howToSectionDescription">
      <div className={`ps-3 pe-3 text-start ${isMobile ? "w-100 mt-2" : "w-75"} m-auto`}>
        <h2 className="text-start">{t[locale].h2}</h2>
        <div className={` m-auto`} style={{ textAlign: "justify" }}>
          <p>{t[locale].p1}</p>
          <p>{t[locale].p2}</p>
          <p>{t[locale].p3}</p>
          <p>{t[locale].p4}</p>
        </div>
      </div>
      </div>
    </section>
  );
}

export default HowItWorks;
