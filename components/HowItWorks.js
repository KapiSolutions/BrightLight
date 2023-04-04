import Image from "next/image";
import React from "react";
import avatarPath from "../public/img/about/avatar.png";

function HowItWorks(props) {
  const locale = props.locale;
  const isMobile = props.isMobile;
  const t = {
    en: {
      h: "How it works?",
      p1: `It's Easy! Just choose your cards, ask a question, and receive an interpretation from our expert esotericist, Bright Light Gypsy, or through our advanced AI technology. ❤`,
      p2: `Our algorithms are designed to provide a personalized and authentic experience, making you feel like you are in a one-on-one meeting with a real Tarot reader, all from the 
            comfort of your own home. With the ability to select your own cards, you have a real impact on the outcome of your divination, allowing you to receive tailored advice on various 
            aspects of life, including love, career, and personal development.`,
      p3: `Our user-friendly interface allows you to purchase coins to use for your AI readings, and you can easily exchange them for personalized tips. Choose between an interpretation by 
            our experienced esotericist or our AI technology, depending on your needs and budget.`,
      p4: `Don't hesitate to take advantage of our services to gain insights and clarity on your life path. Join us on this beautiful journey and discover the guidance you need to live your best life!`,
    },
    pl: {
      h: "Jak to działa?",
      p1: `To łatwe! Po prostu wybierz swoje karty, zadaj pytanie i uzyskaj interpretację od profesjonalnej ezoteryczki Bright Light Gypsy, 
          lub za pośrednictwem naszej zaawansowanej technologii AI. ❤`,
      p2: `Nasze algorytmy zostały zaprojektowane tak, aby zapewnić spersonalizowane i autentyczne doświadczenie, zupełnie jak na spotkaniu z prawdziwą Tarocistką, 
            a to wszystko bez wychodzenia z domu! Dzięki możliwości doboru własnych kart masz realny wpływ na wynik swoich wróżb, i w efekcie uzyskanej porady.`,
      p3: `Nasz przyjazny dla użytkownika interfejs umożliwia zakup monet do wykorzystania w odczytach AI, a także łatwą wymianę ich na spersonalizowane wskazówki 
      dotyczące różnych aspektów życia, w tym miłości, kariery i rozwoju osobistego.
      Dzięki możliwość wyboru między interpretacją od doświadcznej ezoteryczki lub naszej technologii AI, znajdziesz idealne dopasowanie do swoich potrzeb i budżetu.`,
      p4: `Nie czekaj i uzyskaj dokładne i spersonalizowane odczyty, które pomogą Ci w tej pięknej podróży jaką jest życie!`,
    },
  };
  return (
    <section className="mt-5 color-primary">
      <div className="ps-3 pe-3">
        <div className="text-center mt-2 mb-1">
          <Image src={avatarPath} width="170" height="170" alt="Avatar" />
        </div>
        <h2 className="text-center">{t[locale].h}</h2>
        <div className={`${isMobile ? "w-100" : "w-75"} m-auto`} style={{ textAlign: "justify" }}>
          <p>{t[locale].p1}</p>
          <p>{t[locale].p2}</p>
          <p>{t[locale].p3}</p>
          <p>{t[locale].p4}</p>
        </div>
      </div>
    </section>
  );
}

export default HowItWorks;
