import React, { useEffect } from "react";
import Head from "next/head";
import { Card, Container } from "react-bootstrap";
import { useDeviceStore } from "../../../stores/deviceStore";
import { useAuth } from "../../../context/AuthProvider";
import { useRouter } from "next/router";
import Link from "next/link";
import { BiCoin } from "react-icons/bi";
import Image from "next/image";
import coinImg from "../../../public/img/coins/coins2.jpg";

function CoinsPage() {
  const router = useRouter();
  const locale = router.locale;
  const theme = useDeviceStore((state) => state.themeState);
  const isMobile = useDeviceStore((state) => state.isMobile);
  const { isAuthenticated, authUserFirestore } = useAuth();
  const sleep = (milliseconds) => {
    return new Promise((resolve) => setTimeout(resolve, milliseconds));
  };
  async function scroll() {
    await sleep(300);
    document.getElementById("uc-ctx").scrollIntoView();
  }

  useEffect(() => {
    if (isAuthenticated()) {
      isMobile && scroll();
    } else {
      router.replace("/sign-in");
      return;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const t = {
    en: {
      title: "Bright Coins",
      home: "Home",
      whatIsCoin:
        "Bright Coins are a virtual currency that allows you to use artificial intelligence in the form of Tarot interpretations.",
      yourCoins: "Your Bright Coins: ",
    },
    pl: {
      title: "Moje Monety",
      home: "Strona Główna",
      whatIsCoin:
        "Monety to wirtualna waluta pozwalająca na korzystanie z sztucznej inteligencji w formie interpretacji Tarota.",
      yourCoins: "Twoje monety: ",
    },
  };
  return (
    <>
      <Head>
        <title>BrightLight | {t[locale].title}</title>
      </Head>
      <Container className="justify-content-center color-primary text-center mt-4" id="uc-ctx">
        <nav className="d-flex gap-2">
          <small>
            <Link href="/#main">{t[locale].home}</Link>
          </small>
          <small>&gt;</small>
          <small>{t[locale].title}</small>
        </nav>
        <h1>{t[locale].title}</h1>
        <p>{t[locale].whatIsCoin}</p>
        <section className="text-start">
          <p>
            {t[locale].yourCoins}
            <span className="ms-1">
              {authUserFirestore?.coins.amount}
              <BiCoin className="ms-1" style={{ width: "22px", height: "22px", position: "relative", bottom: "1px" }} />
            </span>
          </p>
        </section>
        <section className="d-flex justify-content-center">
        <Card style={{ width: "18rem" }} className="background border shadow-sm">
      <div className="rounded" style={{ position: "relative", height: "100px" }}>
        <Image
          src={coinImg}
          // variant="top"
          fill
          placeholder="blur"
        //   blurDataURL={placeholder("dark")}
          sizes="(max-width: 768px) 100vw, 33vw"
          alt={`${t[locale].title} - Bright Light Gypsy Tarot`}
          title={`${t[locale].title} - Bright Light Gypsy Tarot`}
          style={{ objectFit: "cover" }}
        />
      </div>
      <Card.Body>
        <Card.Title className="color-primary">
          <strong>asd</strong>
        </Card.Title>
        <Card.Text>
          some text
        </Card.Text>
      </Card.Body>
      <Card.Footer
        className={`d-flex align-items-center justify-content-center ${theme === "dark" && "border-top border-dark"}`}
      >
        
      </Card.Footer>
    </Card>
        </section>
      </Container>
    </>
  );
}

export default CoinsPage;
