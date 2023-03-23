import React, { useEffect } from "react";
import Head from "next/head";
import { Container } from "react-bootstrap";
import { useDeviceStore } from "../../../stores/deviceStore";
import { useAuth } from "../../../context/AuthProvider";
import { useRouter } from "next/router";
import Link from "next/link";

function CoinsPage() {
  const router = useRouter();
  const locale = router.locale;
  const isMobile = useDeviceStore((state) => state.isMobile);
  const { isAuthenticated } = useAuth();
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
    },
    pl: {
      title: "Moje Monety",
      home: "Strona Główna",
    },
  };
  return (
    <>
      <Head>
        <title>BrightLight | {t[locale].title}</title>
      </Head>
      <Container className="justify-content-center text-center mt-5" id="uc-ctx">
        <nav className="d-flex gap-2">
          <small>
            <Link href="/#main">{t[locale].home}</Link>
          </small>
          <small>&gt;</small>
          <small>{t[locale].title}</small>
        </nav>
        <h1 className="color-primary">{t[locale].title}</h1>
        
      </Container>
    </>
  );
}

export default CoinsPage;
