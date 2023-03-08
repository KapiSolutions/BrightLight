import React, { useEffect } from "react";
import Head from "next/head";
import { Container } from "react-bootstrap";
import Horoscope from "../../../components/Horoscope";
import { useDeviceStore } from "../../../stores/deviceStore";
import { useAuth } from "../../../context/AuthProvider";
import { useRouter } from "next/router";

function HoroscopePage() {
  const router = useRouter();
  const locale = router.locale;
  const isMobile = useDeviceStore((state) => state.isMobile);
  const { isAuthenticated } = useAuth();
  const sleep = (milliseconds) => {
    return new Promise((resolve) => setTimeout(resolve, milliseconds));
  };
  async function scroll() {
    await sleep(300);
    document.getElementById("uh-ctx").scrollIntoView();
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
      title: "Horoscope",

    },
    pl: {
      title: "Horoskop",

    },
  };
  return (
    <>
      <Head>
        <title>BrightLight | {t[locale].title}</title>
      </Head>
      <Container className="justify-content-center text-center mt-5" id="uh-ctx">
        <h1 className="color-primary">{t[locale].title}</h1>
        <Horoscope />
      </Container>
    </>
  );
}

export default HoroscopePage;
