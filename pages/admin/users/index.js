import React, { useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { Button, Container, Spinner } from "react-bootstrap";
import { useAuth } from "../../../context/AuthProvider";
import { useDeviceStore } from "../../../stores/deviceStore";
import { getDocsFromCollection } from "../../../firebase/Firestore";
import User from "../../../components/Users/Admin/User";
import { FiRefreshCcw } from "react-icons/fi";
import Link from "next/link";

function UserProfilePage() {
  const router = useRouter();
  const locale = router.locale;
  const isMobile = useDeviceStore((state) => state.isMobile);
  const { isAuthenticated, isAdmin, authUserCredential, setErrorMsg } = useAuth();
  const [users, setUsers] = useState([]);
  const [idToken, setIdToken] = useState(undefined);
  const [loading, setLoading] = useState(false);

  const sleep = (milliseconds) => {
    return new Promise((resolve) => setTimeout(resolve, milliseconds));
  };
  async function scroll() {
    await sleep(300);
    document.getElementById("au-ctx").scrollIntoView();
  }

  const timeStampToDate = (time) => {
    return new Date(time.seconds * 1000 + time.nanoseconds / 100000);
  };

  const getToken = async () => {
    const token = await authUserCredential.getIdToken(true);
    setIdToken(token.toString());
  };

  const getUserList = async () => {
    setLoading(true);
    try {
      const docs = await getDocsFromCollection("users");
      const sortedDocs = docs.sort((a, b) => timeStampToDate(a.timeCreate) - timeStampToDate(b.timeCreate));
      setUsers(sortedDocs);
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
        getUserList();
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
      title: "Admin - Users",
      h1: "Menage Users",
      loading: "Loading...",
      button: "Refresh",
      sthWrong: "Something went wrong, please try again later.",
      home: "Home",
    },
    pl: {
      title: "Admin - Użytkownicy",
      h1: "Panel Użytkowników",
      loading: "Ładuje...",
      button: "Odśwież",
      sthWrong: "Coś poszło nie tak, spróbuj ponownie później.",
      home: "Strona Główna",
    },
  };

  return (
    <>
      <Head>
        <title>BrightLight | {t[locale].title}</title>
      </Head>
      <Container className="justify-content-center text-center mt-4 color-primary" id="au-ctx">
        <nav className="d-flex gap-2">
          <small>
            <Link href="/#main">{t[locale].home}</Link>
          </small>
          <small>&gt;</small>
          <small>{t[locale].h1}</small>
        </nav>
        <h1>{t[locale].h1}</h1>
        <div className="text-end">
          <Button
            onClick={getUserList}
            variant="outline-primary"
            className={isMobile ? "w-100" : "mb-2"}
            disabled={loading}
          >
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
        {users.map((user, idx) => (
          <User key={idx} idx={idx} user={user} refresh={getUserList} idToken={idToken} />
        ))}
      </Container>
    </>
  );
}

export default UserProfilePage;
