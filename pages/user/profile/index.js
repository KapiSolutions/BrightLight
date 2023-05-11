import React, { useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { Container } from "react-bootstrap";
import { useAuth } from "../../../context/AuthProvider";
import UserProfile from "../../../components/Users/User/UserProfile";
import { useDeviceStore } from "../../../stores/deviceStore";
import Link from "next/link";

function UserProfilePage() {
  const isMobile = useDeviceStore((state) => state.isMobile);
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const locale = router.locale;
  const sleep = (milliseconds) => {
    return new Promise((resolve) => setTimeout(resolve, milliseconds));
  };
  async function scroll() {
    await sleep(300);
    document.getElementById("up-ctx").scrollIntoView();
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
      title: "Profile",
      h1: "User Profile",
      home: "Home",
    },
    pl: {
      title: "Profil",
      h1: "Mój Profil",
      home: "Strona Główna",
    },
  };
  return (
    <>
      <Head>
        <title>BrightLight | {t[locale].title}</title>
      </Head>
      <Container className="justify-content-center text-center mt-5 color-primary" id="up-ctx">
      <nav className="d-flex gap-2">
          <small>
            <Link href="/#main">{t[locale].home}</Link>
          </small>
          <small>&gt;</small>
          <small>{t[locale].title}</small>
        </nav>
        <h1 className="color-primary">{t[locale].h1}</h1>
        <UserProfile />
      </Container>
    </>
  );
}

export default UserProfilePage;
