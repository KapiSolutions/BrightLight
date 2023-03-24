import React, { useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { Button, Container } from "react-bootstrap";
import { useAuth } from "../../../../context/AuthProvider";
import { useDeviceStore } from "../../../../stores/deviceStore";
import ProductTemplate from "../../../../components/Products/Admin/ProductTemplate";
import { VscBracketError } from "react-icons/vsc";
import { getDocById, getDocsFromCollection } from "../../../../firebase/Firestore";
import Link from "next/link";

function EditProductPage(props) {
  const router = useRouter();
  const locale = router.locale;
  const isMobile = useDeviceStore((state) => state.isMobile);
  const { isAuthenticated, isAdmin } = useAuth();
  const sleep = (milliseconds) => {
    return new Promise((resolve) => setTimeout(resolve, milliseconds));
  };
  async function scroll() {
    await sleep(300);
    document.getElementById("aep-ctx").scrollIntoView();
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
      title: "Admin - Edit Product",
      h1: "Edit Product",
      noProduct: "Product does not exist.",
      button: "Go Back",
      home: "Home",
      productsMenagement: "Products Menagment",
    },
    pl: {
      title: "Admin - Edycja Produktu",
      h1: "Edycja Produktu",
      noProduct: "Produkt nie istnieje.",
      button: "Wróć",
      home: "Strona Główna",
      productsMenagement: "Panel Produktów",
    },
  };
  return (
    <>
      <Head>
        <title>BrightLight | {t[locale].title}</title>
      </Head>
      <Container className="justify-content-center text-center mt-4 color-primary" id="aep-ctx">
        <section className="d-flex gap-1 mb-2">
          <small>
            <Link href="/">{t[locale].home}</Link>
          </small>
          <small>&gt;</small>
          <small>
            <Link href="/admin/products#main">{t[locale].productsMenagement}</Link>
          </small>
          <small>&gt;</small>
          <small>{props.product.id}</small>
        </section>
        <h1>{t[locale].h1}</h1>
        {props.product ? (
          <ProductTemplate product={props.product} />
        ) : (
          <div className="text-center">
            <VscBracketError style={{ width: "40px", height: "40px" }} className="mb-3" />
            <h4 className="mt-0 mb-4">{t[locale].noProduct}</h4>
            <Button variant="outline-primary" onClick={() => router.replace("/admin/products#main")}>
              {t[locale].button}
            </Button>
          </div>
        )}
      </Container>
    </>
  );
}

export default EditProductPage;

export async function getStaticProps(context) {
  const pid = context.params.pid;
  const doc = await getDocById("products", pid);

  return {
    props: {
      product: doc ? JSON.parse(JSON.stringify(doc)) : null,
    },
    revalidate: 30, //1 - 1 second
  };
}

export async function getStaticPaths() {
  const docs = await getDocsFromCollection("products", true); //true - get only Id's
  return {
    paths: docs.map((doc) => {
      return {
        params: {
          pid: doc,
        },
      };
    }),
    fallback: "blocking",
  };
}
