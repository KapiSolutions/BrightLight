import React, { useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { Container } from "react-bootstrap";
import { useAuth } from "../../../../context/AuthProvider";
import { useDeviceStore } from "../../../../stores/deviceStore";
import ProductTemplate from "../../../../components/Products/Admin/ProductTemplate";

function NewProductPage() {
    const isMobile = useDeviceStore((state) => state.isMobile);
    const themeState = useDeviceStore((state) => state.themeState);
    const { isAuthenticated, isAdmin } = useAuth();
    const router = useRouter();
    const sleep = (milliseconds) => {
      return new Promise((resolve) => setTimeout(resolve, milliseconds));
    };
    async function scroll() {
      await sleep(300);
      document.getElementById("anp-ctx").scrollIntoView();
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
        <title>BrightLight | Admin - New Product</title>
      </Head>
      <Container className="justify-content-center text-center mt-5 color-primary" id="anp-ctx">
        <h1>Add new Product!</h1>
        <ProductTemplate product={null}/>
      </Container>
    </>
  )
}

export default NewProductPage