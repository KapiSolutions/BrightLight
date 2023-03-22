import React, { useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { Button, Container, Spinner } from "react-bootstrap";
import { useAuth } from "../../../context/AuthProvider";
import { useDeviceStore } from "../../../stores/deviceStore";
import { getDocsFromCollection } from "../../../firebase/Firestore";
import User from "../../../components/Users/Admin/User";
import axios from "axios";

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
    const docs = await getDocsFromCollection("users");
    const sortedDocs = docs.sort((a, b) => timeStampToDate(a.timeCreate) - timeStampToDate(b.timeCreate))
    setUsers(sortedDocs);
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
      button: "Get users",
    },
    pl: {
      title: "Admin - Użytkownicy",
      h1: "Panel Użytkowników",
      loading: "Ładuje...",
      button: "Pobierz listę",
    },
  };
  const getUsersAuth = async () => {
    setLoading(true);
    try {
      const payload = {
        secret: process.env.NEXT_PUBLIC_API_KEY,
        idToken: idToken,
        // mode: "set-admin",
        mode: "unset-admin",
        // mode: "check-admin",
        data: {
          id: "oxkq7jiA7RS1JWk1GkhO0w4eIC83"
        }
      };
      const res = await axios.post("/api/admin/firebase/", payload);
      console.log(res.data.users);
      // console.log(res.data);
      setLoading(false);
    } catch (error) {
      // setErrorMsg(t[locale].sthWrong);
      // console.log(error.response.data);
      setErrorMsg(error.response.status === 404 ? "Bad request, error code: 404" : error.response.data);
      setLoading(false);
    }
  };
  return (
    <>
      <Head>
        <title>BrightLight | {t[locale].title}</title>
      </Head>
      <Container className="justify-content-center text-center mt-5 color-primary" id="au-ctx">
        <h1>{t[locale].h1}</h1>

        <Button onClick={getUsersAuth} disabled={loading}>
          {loading ? (
            <>
              <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
              <span>{t[locale].loading}</span>
            </>
          ) : (
            <span>{t[locale].button}</span>
          )}
        </Button>

        {users.map((user, idx) => (
          <User key={idx} idx={idx} user={user} refresh={getUserList} />
        ))}
      </Container>
    </>
  );
}

export default UserProfilePage;
