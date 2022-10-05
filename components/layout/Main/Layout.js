import React from "react";
import Head from "next/head";
import Header from "./Header/Header";
import Footer from "./Footer";
import styles from "../../../styles/layout/main/grid.module.scss";
import { SSRProvider } from "react-bootstrap";
import useLocalStorageState from "use-local-storage-state";
import { useAuth } from "../../../context/AuthProvider";
import NewUserModal from "../../Modals/NewUserModal";
import DeleteUserModal from "../../Modals/DeleteUserModal";
import ErrorModal from "../../Modals/ErrorModal";

function Layout({ children }) {
  const { authUserFirestore, errorMsg, setErrorMsg, successMsg, setSuccessMsg, updateProfile } = useAuth();
  const [theme, setTheme] = useLocalStorageState("theme", {
    ssr: true,
    defaultValue: "light",
  });
  return (
    <>
      <Head>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>

      <SSRProvider>
        <div className={theme}>
          <div className={styles.container}>
            <NewUserModal msg={successMsg} resetMsg={setSuccessMsg} user={authUserFirestore} update={updateProfile} />
            <DeleteUserModal msg={successMsg} resetMsg={setSuccessMsg} />
            <ErrorModal msg={errorMsg} resetMsg={setErrorMsg} />

            <Header className={styles.header} theme={theme} />
            <main name="main" className={`${styles.main} `}>
              {children}
            </main>
            <Footer className={`${styles.footer}`} theme={theme} />
          </div>
        </div>
      </SSRProvider>
    </>
  );
}

export default Layout;
