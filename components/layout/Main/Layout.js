import React from "react";
import Head from "next/head";
import Header from "./Header/Header";
import Footer from "./Footer";
import styles from "../../../styles/layout/main/grid.module.scss";
import { SSRProvider } from "react-bootstrap";
import { useAuth } from "../../../context/AuthProvider";
import NewUserModal from "../../Modals/NewUserModal";
import DeleteUserModal from "../../Modals/DeleteUserModal";
import ErrorModal from "../../Modals/ErrorModal";
import { useRouter } from "next/router";
import { useDeviceStore } from "../../../stores/deviceStore";

function Layout({ children }) {
  const router = useRouter();
  const locale = router.locale;
  const { authUserFirestore, errorMsg, setErrorMsg, successMsg, setSuccessMsg, updateProfile } = useAuth();
  const theme = useDeviceStore((state) => state.themeState);
  return (
    <>
      <Head>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>

      <SSRProvider>
        <div className={theme}>
          <div className={styles.container}>
            <NewUserModal locale={locale} msg={successMsg} resetMsg={setSuccessMsg} user={authUserFirestore} update={updateProfile} />
            <DeleteUserModal locale={locale} msg={successMsg} resetMsg={setSuccessMsg} />
            <ErrorModal locale={locale} msg={errorMsg} closeModal={setErrorMsg} />

            <Header locale={locale} className={styles.header} theme={theme} />
            <main name="main" className={`${styles.main} `}>
              {children}
            </main>
            <Footer locale={locale} className={`${styles.footer}`} theme={theme} />
          </div>
        </div>
      </SSRProvider>
    </>
  );
}

export default Layout;
