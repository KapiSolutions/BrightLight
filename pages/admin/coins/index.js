import React, { useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { Button, Container, Spinner } from "react-bootstrap";
import { useAuth } from "../../../context/AuthProvider";
import { useDeviceStore } from "../../../stores/deviceStore";
import { getDocsFromCollection } from "../../../firebase/Firestore";
import { FiRefreshCcw } from "react-icons/fi";
import CoinsItem from "../../../components/Coins/Admin/CoinsItem";
import { BiCoin } from "react-icons/bi";
import { setup } from "../../../config/csrf";
import Link from "next/link";

function AdminCoinsPage() {
  const router = useRouter();
  const locale = router.locale;
  const isMobile = useDeviceStore((state) => state.isMobile);
  const { isAuthenticated, isAdmin, authUserCredential, setErrorMsg } = useAuth();
  const [coins, setCoins] = useState([]);
  const [idToken, setIdToken] = useState(undefined);
  const [loading, setLoading] = useState(false);

  const sleep = (milliseconds) => {
    return new Promise((resolve) => setTimeout(resolve, milliseconds));
  };
  async function scroll() {
    await sleep(300);
    document.getElementById("ac-ctx").scrollIntoView();
  }

  const timeStampToDate = (time) => {
    return new Date(time.seconds * 1000 + time.nanoseconds / 100000);
  };

  const getToken = async () => {
    const token = await authUserCredential.getIdToken(true);
    setIdToken(token.toString());
  };

  const getCoins = async () => {
    setLoading(true);
    try {
      const docs = await getDocsFromCollection("coins");
      const sortedDocs = docs.sort((a, b) => timeStampToDate(a.timeCreate) - timeStampToDate(b.timeCreate));
      setCoins(sortedDocs);
    } catch (e) {
      console.log(e);
      setErrorMsg(t[locale].sthWrong);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (isAuthenticated()) {
      if (isAdmin) {
        isMobile && scroll();
        getToken();
        getCoins();
      } else {
        router.replace("/");
        return;
      }
    } else {
      router.replace("/sign-in");
      return;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const t = {
    en: {
      title: "Admin - Coins",
      h1: "Menage Coins",
      loading: "Loading...",
      button: "Refresh",
      sthWrong: "Something went wrong, please try again later.",
      home: "Home",
      coinsPage: "Bright Coins",
    },
    pl: {
      title: "Admin - Monety",
      h1: "Zarządzaj Monetami",
      loading: "Ładuje...",
      button: "Odśwież",
      sthWrong: "Coś poszło nie tak, spróbuj ponownie później.",
      home: "Strona Główna",
      coinsPage: "Zarządzanie Monetami",
    },
  };

  return (
    <>
      <Head>
        <title>BrightLight | {t[locale].title}</title>
      </Head>
      <Container className="justify-content-center text-center mt-4 color-primary" id="ac-ctx">
        <nav className="d-flex gap-2">
          <small>
            <Link href="/#main">{t[locale].home}</Link>
          </small>
          <small>&gt;</small>
          <small>{t[locale].coinsPage}</small>
        </nav>
        <h1 className="mb-0">{t[locale].h1}</h1>
        <span>
          <BiCoin style={{ width: "30px", height: "30px" }} />
        </span>
        <div className="text-end">
          <Button onClick={getCoins} variant="outline-primary" className={isMobile && "mt-3"} disabled={loading}>
            {loading ? (
              <>
                <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                <span className="ms-1">{t[locale].loading}</span>
              </>
            ) : (
              <>
                <span className="me-2">{t[locale].button}</span>
                <FiRefreshCcw style={{ width: "22px", height: "22px" }} />
              </>
            )}
          </Button>
        </div>
        {coins.map((coin, idx) => (
          <CoinsItem key={idx} idx={idx} coin={coin} refresh={getCoins} idToken={idToken} />
        ))}
      </Container>
    </>
  );
}

export default AdminCoinsPage;

export const getServerSideProps = setup(async ({ req, res }) => {
  return { props: {} };
});
