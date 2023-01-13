import React, { useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { Container } from "react-bootstrap";
import { useAuth } from "../../../context/AuthProvider";
import { useDeviceStore } from "../../../stores/deviceStore";
import TextEditor from "../../../components/TextEditor";

function UserProfilePage() {
  const isMobile = useDeviceStore((state) => state.isMobile);
  const { isAuthenticated, isAdmin } = useAuth();
  const router = useRouter();
  const sleep = (milliseconds) => {
    return new Promise((resolve) => setTimeout(resolve, milliseconds));
  };
  async function scroll() {
    await sleep(300);
    document.getElementById("ab-ctx").scrollIntoView();
  }

  useEffect(() => {
    if (isAuthenticated()) {
      if (isAdmin) {
        isMobile && scroll();
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
  return (
    <>
      <Head>
        <title>BrightLight | Admin - Blog Posts</title>
      </Head>
      <Container className="justify-content-center text-center mt-5 color-primary" id="ab-ctx">
        <h1>Blog Menagment</h1>
        <TextEditor />
      </Container>
    </>
  );
}

export default UserProfilePage;
