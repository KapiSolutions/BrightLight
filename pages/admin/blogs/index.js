import React, { useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { Container, Button } from "react-bootstrap";
import { useAuth } from "../../../context/AuthProvider";
import { useDeviceStore } from "../../../stores/deviceStore";

function AdminBlogsPage() {
  const isMobile = useDeviceStore((state) => state.isMobile);
  const { isAuthenticated, isAdmin } = useAuth();
  const router = useRouter();
  const sleep = (milliseconds) => {
    return new Promise((resolve) => setTimeout(resolve, milliseconds));
  };
  async function scroll() {
    await sleep(300);
    document.getElementById("abn-ctx").scrollIntoView();
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
        <title>BrightLight | Admin - Blog Menagment</title>
      </Head>
      <Container className="justify-content-center text-center mt-5 color-primary" id="abn-ctx">
        <h1>Blog Menagment</h1>
        <div className="text-end mb-5">
          <Button onClick={() => {
            router.push("/admin/blogs/new#main")
          }}>Create new Blog</Button>
        </div>
        <p>Here will be the list of actual added blogs.</p>
        
      </Container>
    </>
  );
}

export default AdminBlogsPage;
