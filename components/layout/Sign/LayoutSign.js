import React from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { IoReturnDownBack } from "react-icons/io5";
import { SSRProvider } from "react-bootstrap";
import styles from "../../../styles/layout/sign/Sign.module.scss";
import { useDeviceStore } from "../../../stores/deviceStore";

function LayoutSign({ children }) {
  const router = useRouter();
  const isMobile = useDeviceStore((state) => state.isMobile);
  const theme = useDeviceStore((state) => state.themeState);

  return (
    <>
      <Head>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <SSRProvider>
        <div className={theme}>
          <div className={styles.container}>
            {isMobile && (
              <div className={`${styles.backButton} pointer background`} onClick={() => router.back()}>
                <IoReturnDownBack style={{ width: "40px", height: "40px" }} className="color-primary" />
              </div>
            )}

            {children}
          </div>
        </div>
      </SSRProvider>
    </>
  );
}

export default LayoutSign;
