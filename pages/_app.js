import React, { useEffect } from "react";
import "../styles/main.scss";
import "@fontsource/k2d";
import "@fontsource/ms-madi";
import "@fontsource/nothing-you-could-do";
import Layout from "../components/layout/Main/Layout";
import AuthProvider from "../context/AuthProvider";
import { useDeviceStore } from "../stores/deviceStore";
import { useRouter } from "next/router";
import { GoogleAnalytics } from "nextjs-google-analytics";
import { DefaultSeo } from "next-seo";
// import LogRocket from "logrocket";
// import setupLogRocketReact from "logrocket-react";

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const locale = router.locale;
  const getLayout = Component.getLayout || ((page) => <Layout>{page}</Layout>);
  const setMobile = useDeviceStore((state) => state.setMobile);
  const setCurrency = useDeviceStore((state) => state.setCurrency);
  const t = {
    en: {
      desc: "Wanna know Your future? Don't wait! Get accurate tarot readings from professional esoteric girl or AI with our web app. Explore the mysteries of the universe and gain insights into your future today. Try now for a personalized and enlightening experience! Bright Light Gypsy Tarot online.",
      descOg: "Wanna know Your future? Don't wait! Get accurate tarot readings from professional esoteric girl or AI ❤",
    },
    pl: {
      desc: "Nurtuje Cię przyszłość? Nie czekaj! Uzyskaj wyjątkowe odczyty tarota od profesjonalnej ezoteryczki lub sztucznej inteligencji AI! Poznaj tajemnice wszechświata i uzyskaj wgląd w swoją przyszłość już dziś. Wypróbuj teraz, aby uzyskać spersonalizowane i wyjątkowe doświadczenia! Bright Light Gypsy Tarot online.",
      descOg:
        "Nurtuje Cię przyszłość? Nie czekaj! Uzyskaj wyjątkowe odczyty tarota od profesjonalnej ezoteryczki lub sztucznej inteligencji AI ❤",
    },
    default: {
      desc: "Wanna know Your future? Don't wait! Get accurate tarot readings from professional esoteric girl or AI with our web app. Explore the mysteries of the universe and gain insights into your future today. Try now for a personalized and enlightening experience! Bright Light Gypsy Tarot online.",
      descOg: "Wanna know Your future? Don't wait! Get accurate tarot readings from professional esoteric girl or AI ❤",
    }
  };

  function handleWindowSizeChange() {
    setMobile(window.innerWidth <= 768);
  }
  useEffect(() => {
    window.addEventListener("resize", handleWindowSizeChange);
    return () => {
      window.removeEventListener("resize", handleWindowSizeChange);
    };
  });

  useEffect(() => {
    handleWindowSizeChange();
    setCurrency(locale == "pl" ? "pln" : "usd");
    // only initialize LogRocket when in the browser
    // if (typeof window !== "undefined") {
    //   LogRocket.init(process.env.NEXT_PUBLIC_LOGROCKET_KEY);
    //   setupLogRocketReact(LogRocket);
    // }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <AuthProvider>
      <GoogleAnalytics
        trackPageViews={{ ignoreHashChange: true }}
        strategy="lazyOnload"
        gaMeasurementId={process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID}
      />
      <DefaultSeo
        description={t[locale].desc}
        openGraph={{
          type: "website",
          siteName: "Bright Light Gypsy",
          url: `https://www.brightlightgypsy.pl/${locale == "default" ? "" : locale}${router.asPath}`,
          title: "BrightLight | Tarot Online",
          locale: locale == "default" ? "en" : locale,
          description: t[locale].descOg,
          images: [
            {
              url: "https://firebasestorage.googleapis.com/v0/b/brightlight-443b7.appspot.com/o/images%2Fothers%2Fseo-og-image.png?alt=media&token=4b3ebb3c-b324-45c7-8cd5-9aff77723b7e",
              width: 1200,
              height: 628,
              alt: "Bright Light Gypsy",
              type: "image/png",
            },
          ],
        }}
        additionalLinkTags={[
          {
            rel: "icon",
            href: "/favicon.ico",
          },
        ]}
      />
      {getLayout(<Component {...pageProps} />)}
    </AuthProvider>
  );
}

export default MyApp;
