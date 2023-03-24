import React, { useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { Container } from "react-bootstrap";
import { useAuth } from "../../../../context/AuthProvider";
import { useDeviceStore } from "../../../../stores/deviceStore";
import ProductTemplate from "../../../../components/Products/Admin/ProductTemplate";
import Link from "next/link";

function NewProductPage() {
  const router = useRouter();
  const locale = router.locale;
  const isMobile = useDeviceStore((state) => state.isMobile);
  const { isAuthenticated, isAdmin } = useAuth();

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

  const t = {
    en: {
      title: "Admin - New Product",
      h1: "Add new Product!",
      home: "Home",
      productsMenagement: "Products Menagment",
      newProduct: "New Product",
    },
    pl: {
      title: "Admin - Nowy Produkt",
      h1: "Kreator Produktu",
      home: "Strona Główna",
      productsMenagement: "Panel Produktów",
      newProduct: "Nowy Produkt",
    },
  };
  return (
    <>
      <Head>
        <title>BrightLight | {t[locale].title}</title>
      </Head>
      <Container className="justify-content-center text-center mt-4 color-primary" id="anp-ctx">
        <section className="d-flex gap-1 mb-2">
          <small>
            <Link href="/">{t[locale].home}</Link>
          </small>
          <small>&gt;</small>
          <small>
            <Link href="/admin/products#main">{t[locale].productsMenagement}</Link>
          </small>
          <small>&gt;</small>
          <small>{t[locale].newProduct}</small>
        </section>
        <h1>{t[locale].h1}</h1>
        <ProductTemplate product={null} />
      </Container>
    </>
  );
}

export default NewProductPage;
