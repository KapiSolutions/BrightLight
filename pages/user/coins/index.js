import React, { useEffect } from "react";
import Head from "next/head";
import { Container } from "react-bootstrap";
import { useDeviceStore } from "../../../stores/deviceStore";
import { useAuth } from "../../../context/AuthProvider";
import { useRouter } from "next/router";
import Link from "next/link";
import { BiCoin } from "react-icons/bi";
import CoinsCard from "../../../components/Coins/CoinsCard";

function CoinsPage() {
  const router = useRouter();
  const locale = router.locale;
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
      yourCoins: "Moje monety: ",
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

        <section className="text-center mt-4">
          <p>
            {t[locale].yourCoins}
            <span className="ms-1">
              {authUserFirestore?.coins.amount}
              <BiCoin className="ms-1" style={{ width: "22px", height: "22px", position: "relative", bottom: "1px" }} />
            </span>
          </p>
        </section>

        <CoinsCard />
      </Container>
    </>
  );
}

export default CoinsPage;
