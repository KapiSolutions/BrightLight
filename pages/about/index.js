import React from "react";
import { NextSeo } from "next-seo";
import Image from "next/image";
import { Container } from "react-bootstrap";
import { useDeviceStore } from "../../stores/deviceStore";
import styles from "../../styles/pages/About.module.scss";
import { SiHellofresh } from "react-icons/si";
import avatarPath from "../../public/img/about/avatar.png";
import diamondPath from "../../public/img/about/diamond.png";
import tarotPath from "../../public/img/about/tarot-cards.png";
import japanPath from "../../public/img/about/japan-sticker.png";
import Link from "next/link";

function AboutPage(props) {
  const locale = props.locale;
  const isMobile = useDeviceStore((state) => state.isMobile);
  const theme = useDeviceStore((state) => state.themeState);

  const t = {
    en: {
      title: "About Me",
      home: "Home",
      firstSection:
        "I'm a tarotist with several years of experience. Since I was a child, I have also had visions and highly developed intuition. My other passion is music, especially singing.",
      secondSection:
        "Tarot cards allow you to indicate the probable course of life. Let us remember that as a result of introducing certain changes in our life, we can change the predicted future.",
      thirdSection:
        "Therefore, in addition to learning about the upcoming future and other people's intentions, it is also worth asking them for advice.",
      titleJapan: "Japan Dream",
      japanSection1:
        "One of my biggest dreams is to travel to Japan. Discovering beautiful nature and local culture. Japan is a country that is famous for its beautiful landscapes, from volcanoes to mountains to the sea. I would like to see them with my own eyes and feel the amazing feeling that comes from contact with wild nature.",
      japanSection2:
        "But it's not just nature that attracts me to Japan. It is also a rich history and a fascinating culture that has been developing for hundreds of years. I would like to discover this culture, get to know its customs, traditions and taste the local cuisine. Feel like one of the locals and see Japan from their perspective. I would like to discover the beauty of this country, visit beautiful gardens, admire the blooming cherry trees and travel through the mountains and forests in search of amazing views and adventures. Japan is full of contrasts, from densely populated cities to small villages where time has stood still. I would like to meet local people, try their cuisine and immerse myself in their culture. It will surely be an unforgettable experience.",
      japanSection3:
        "I encourage you to join me on this adventure and help me realize my dream. Every contribution is valuable and contributes to making my dream of traveling to Japan a reality. I thank you in advance for every donation and I promise that I will not disappoint you with my relations from Japan. ❤",
    },
    pl: {
      title: "O mnie",
      home: "Strona Główna",
      firstSection:
        "Jestem tarocistką z kilkuletnim doświadczeniem. Od dziecka miewam też wizje i wysoko rozwiniętą intuicję. Moją drugą pasją jest muzyka, a szczególnie śpiew.",
      secondSection:
        "Karty tarota pozwalają wskazać prawdopodobny bieg życia. Pamiętajmy, że w wyniku wprowadzenia pewnych zmian w naszym życiu, możemy zmienić przewidywaną przyszłość.",
      thirdSection:
        "Dlatego oprócz poznawania nadchodzącej przyszłości i intencji innych ludzi, warto też zapytać kart o radę.",
      titleJapan: "Sen o Japonii",
      japanSection1:
        "Jednym z moich największych marzeń jest podróż do Japonii. Odkrywanie pięknej przyrody i lokalnej kultury. Japonia to kraj, który słynie z pięknych krajobrazów, od wulkanów, przez góry, po morze. Chciałabym zobaczyć je na własne oczy i poczuć to niesamowite wrażenie, które daje kontakt z dziką przyrodą.",
      japanSection2:
        "Ale to nie tylko natura przyciąga mnie do Japonii. To również bogata historia i fascynująca kultura, która rozwija się od setek lat. Chciałabym odkryć tę kulturę, poznać jej zwyczaje, tradycje i zasmakować w lokalnej kuchni. Czuć się jak jeden z mieszkańców i zobaczyć Japonię z ich perspektywy. Chciałabym odkryć piękno tego kraju, odwiedzić piękne ogrody, podziwiać kwitnące drzewa wiśni oraz przemierzyć góry i lasy w poszukiwaniu niesamowitych widoków i przygód. Japonia jest pełna kontrastów, od gęsto zaludnionych miast, po małe wioski, w których czas się zatrzymał. Chciałabym poznać lokalnych mieszkańców, spróbować ich kuchni i zanurzyć się w ich kulturze. Z pewnością będą to niezapomniane doświadczenia.",
      japanSection3:
        "Zachęcam Was, abyście dołączyli do mnie w tej przygodzie i pomogli mi zrealizować moje marzenie. Każdy wkład jest cenny i przyczynia się do tego, aby moje marzenie o podróży do Japonii stało się rzeczywistością. Dziękuję z góry za każdy datek i obiecuję, że nie zawiodę Was swoimi relacjami z Japonii. ❤",
    },
  };
  return (
    <>
      <NextSeo
        title={`BrightLight | ${t[locale].title}`}
        canonical={`https://www.brightlightgypsy.pl/${locale}/about`}
        languageAlternates={[
          {
            hrefLang: "en",
            href: "https://www.brightlightgypsy.pl/en/about",
          },
          {
            hrefLang: "pl",
            href: "https://www.brightlightgypsy.pl/pl/about",
          },
          {
            hrefLang: "x-default",
            href: "https://www.brightlightgypsy.pl/about",
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
            <span itemScope="" itemType="http://schema.org/Thing" itemProp="item" itemID="/about">
              <small itemProp="name">{t[locale].title}</small>
            </span>
            <meta itemProp="position" content="1" />
          </li>
        </ol>
      </nav>
      <Container className="justify-content-center text-center mt-3 color-primary">
        {!isMobile && (
          <div style={{ height: "80px" }}>
            <h1 className="mt-0 color-primary text-center">{t[locale].title}</h1>
            <SiHellofresh
              style={{ width: "25px", height: "25px", position: "relative", top: "-90px", left: "120px" }}
            />
          </div>
        )}

        {isMobile && <h1 className="mt-0 color-primary text-center">{t[locale].title}</h1>}

        <section className="d-flex flex-wrap justify-content-center mb-3 p-2">
          <div className={`text-${isMobile ? "center mb-4" : "end"} col-md-3 col-sm-12 m-auto`}>
            <Image src={avatarPath} width="170" height="170" alt="Avatar" />
          </div>

          <div className={`col-md-7 col-sm-12 align-self-center ${!isMobile && "pe-5"}`}>
            <p className={`text-${isMobile ? "center" : "start"}`}>{t[locale].firstSection} &#10084;</p>
          </div>
        </section>

        <section
          className={`d-flex flex-wrap rounded mb-3 p-2 ${
            theme == "light" ? "bg-accent5 text-dark" : "bg-accent6 text-light"
          }`}
        >
          <div
            className={`d-${isMobile ? "none" : "block"} ${!isMobile && "ps-5"} col-md-7 col-sm-12 align-self-center`}
          >
            <p className={`text-${isMobile ? "center" : "end"}`}>{t[locale].secondSection}</p>
          </div>
          <div className={`text-${isMobile ? "center" : "center"} col-md-4 col-sm-12 m-auto`}>
            <Image src={tarotPath} width="170" height="139" alt="Tarot cards roses" />
          </div>
          <div className={`d-${isMobile ? "block" : "none"} col-md-8 col-sm-12 align-self-center`}>
            <p className={`text-${isMobile ? "center" : "end"}`}>{t[locale].secondSection}</p>
          </div>
        </section>

        <section className="d-flex flex-wrap mb-2 p-2">
          <div className={`text-${isMobile ? "center" : "end"} col-md-3 col-sm-12 m-auto`}>
            <Image src={diamondPath} width="170" height="172" alt="Diamond flower" />
          </div>
          <div className={`col-md-7 col-sm-12 align-self-center ${!isMobile && "pe-5"}`}>
            <p className={`text-${isMobile ? "center" : "start"}`}>{t[locale].thirdSection}</p>
          </div>
        </section>
        <hr className="color-primary w-50 m-auto mt-4 mb-5" />
        <section className="mt-5">
          <div className={`${styles.japanBackLight} rounded pt-4 pb-1 mb-3`}>
            <Image src={japanPath} width="170" height="159" alt="Japan sticker" />
            <h2 className="mt-0 text-dark">{t[locale].titleJapan}</h2>
          </div>
          <p>{t[locale].japanSection1}</p>
          <p>{t[locale].japanSection2}</p>
          <p>{t[locale].japanSection3}</p>
        </section>
        <iframe
          id="kofiframeAboutMe"
          src="https://ko-fi.com/brightlightgypsy/?hidefeed=true&widget=true&embed=true&preview=true"
          className="bg-none rounded w-100 shadow mt-3"
          style={{ border: "none", maxWidth: "400px", minHeight: "650px", maxHeight: "712px" }}
          title="Bright Light Gypsy Ko-fi"
          loading="lazy"
        ></iframe>
      </Container>
    </>
  );
}

export default AboutPage;

export async function getStaticProps({ locale }) {
  return {
    props: {
      locale: locale,
    },
    revalidate: false,
  };
}
