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
import LogRocket from "logrocket";
import setupLogRocketReact from "logrocket-react";

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const locale = router.locale;
  const getLayout = Component.getLayout || ((page) => <Layout>{page}</Layout>);
  const setMobile = useDeviceStore((state) => state.setMobile);
  const setCurrency = useDeviceStore((state) => state.setCurrency);

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
    // only initialize when in the browser
    if (typeof window !== "undefined") {
      LogRocket.init(process.env.NEXT_PUBLIC_LOGROCKET_KEY);
      setupLogRocketReact(LogRocket);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AuthProvider>
      <GoogleAnalytics
        trackPageViews={{ ignoreHashChange: true }}
        strategy="lazyOnload"
        gaMeasurementId={process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID}
      />
      {getLayout(<Component {...pageProps} />)}
    </AuthProvider>
  );
}

export default MyApp;
