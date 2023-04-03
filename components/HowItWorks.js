import Image from "next/image";
import React from "react";
import avatarPath from "../public/img/about/avatar.png";

function HowItWorks(props) {
  const locale = props.locale;
  const isMobile = props.isMobile;
  const t = {
    en: {
      h: "How it works?",
      p1: `Our platform allows you to receive insightful Online Tarot readings from professional esotericist Bright Light Gypsy, 
            or to utilize our state-of-the-art artificial intelligence technology for a more affordable option.`,
      p2: `Thanks to the algorithms used, you can feel like at a meeting with a real Tarot reader, all without leaving your home!
             You choose the cards, so you have a real impact on the result of your own divination and, as a result, the advice you receive.`,
      p3: `We offer an easy to use interface where you can buy coins to use towards your AI readings and
            receive personalized guidance on various aspects of life, including love, career, and personal growth. With the
            option to choose between a human or AI tarot reader, you can find the perfect fit for your needs and budget.`,
      p4: `Don't wait and get Your accurate and empowering readings that will help guide you on your journey!`,
    },
    pl: {
      h: "Jak to działa?",
      p1: `To prostę, wybierz swoje karty, zadaj pytanie i otrzymaj interpretację! Nasza platforma dostarcza szereg 
      prywatnych interpretacji Tarota i porad za pośrednictwem ezoterycznki Bright Light Gypsy,
      lub poprzez technologię sztucznej inteligencji AI.`,
      p2: `Dzięki zastowowanym algorytmom możesz poczuć się jak na spotkaniu z prawdziwą Tarocistką, a to wszystko bez wychodzenia z domu! 
      To Ty wybierasz karty więc masz realny wpływ na wynik własnej wróżby i w efekcie uzyskanej porady.`,
      p3: `Oferujemy łatwy w użyciu interfejs, w którym możesz kupować monety do wykorzystania w swoich odczytach AI.
      Monety w prosty sposób wymienisz na spersonalizowane wskazówki dotyczące różnych aspektów życia, w tym miłości, kariery i rozwoju osobistego.
      Dzięki możliwość wyboru między interpretacją przez doświadczoną ezoteryczkę lub sztuczną inteligencję, znajdziesz idealne dopasowanie do swoich potrzeb i budżetu.`,
      p4: `Nie czekaj i uzyskaj dokładne i budujące odczyty, które pomogą Ci w tej pięknej podróży jaką jest życie!`,
    },
  };
  return (
    <section className="mt-5 color-primary">
      <div className="ps-3 pe-3">
        <div className="text-center mt-2 mb-1">
          <Image src={avatarPath} width="170" height="170" alt="Avatar" />
        </div>
        <h2 className="text-center">{t[locale].h}</h2>
        <div className={`${isMobile ? "w-100" : "w-75"} m-auto`} style={{textAlign: "justify"}}>
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
