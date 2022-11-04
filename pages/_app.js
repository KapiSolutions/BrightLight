import React, { useEffect } from "react";
import "../styles/main.scss";
import "@fontsource/k2d";
import "@fontsource/ms-madi";
import "@fontsource/nothing-you-could-do";
import Layout from "../components/layout/Main/Layout";
import AuthProvider from "../context/AuthProvider";
import { useDeviceStore } from "../stores/deviceStore";

function MyApp({ Component, pageProps }) {
  const getLayout = Component.getLayout || ((page) => <Layout>{page}</Layout>);
  const setMobile = useDeviceStore((state) => state.setMobile);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <AuthProvider>{getLayout(<Component {...pageProps} />)}</AuthProvider>;
}

export default MyApp;
