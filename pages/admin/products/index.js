import React, { useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { Button, Container, Spinner } from "react-bootstrap";
import { useAuth } from "../../../context/AuthProvider";
import { useDeviceStore } from "../../../stores/deviceStore";
import { FiRefreshCcw } from "react-icons/fi";
import Product from "../../../components/Products/Admin/Product";
import FilterAndSortBar from "../../../components/Products/Admin/FilterAndSortBar";
import { getDocsFromCollection } from "../../../firebase/Firestore";
import Link from "next/link";
import { setup } from "../../../config/csrf";

function AdminProductsPage({productList}) {
  const router = useRouter();
  const locale = router.locale;
  const isMobile = useDeviceStore((state) => state.isMobile);
  const theme = useDeviceStore((state) => state.themeState);
  const { isAuthenticated, isAdmin } = useAuth();
  const [products, setProducts] = useState([]);
  const [refProducts, setRefProducts] = useState(productList);
  const [message, setMessage] = useState("");
  const [loadingNew, setLoadingNew] = useState(false);
  const [loadingRfs, setLoadingRfs] = useState(false);
  const idForSortingBar = "ProductsAdmin";

  const sleep = (milliseconds) => {
    return new Promise((resolve) => setTimeout(resolve, milliseconds));
  };
  async function scroll() {
    await sleep(300);
    document.getElementById("ap-ctx").scrollIntoView();
  }

  const timeStampToDate = (time) => {
    return new Date(time.seconds * 1000 + time.nanoseconds / 100000);
  };

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

  // refresh the product list after deleting the product
  const refreshProductList = async () => {
    setLoadingRfs(true);
    try {
      const docs = await getDocsFromCollection("products");
      setRefProducts(JSON.parse(JSON.stringify(docs)));
      setProducts(
        JSON.parse(JSON.stringify(docs)).sort((a, b) => timeStampToDate(b.createDate) - timeStampToDate(a.createDate))
      );
      setLoadingRfs(false);
    } catch (e) {
      console.log(e);
      setLoadingRfs(false);
    }
  };

  const t = {
    en: {
      title: "Admin - Products",
      h1: "Product Menagment",
      loading: "Loading",
      newProduct: "Create new Product!",
      refresh: "Refresh Product List",
      home: "Home",
      productPage: "Product Menagment",
    },
    pl: {
      title: "Admin - Produkty",
      h1: "Panel Produktów",
      loading: "Ładuję",
      newProduct: "Dodaj nowy Produkt!",
      refresh: "Odśwież listę produktów",
      home: "Strona Główna",
      productPage: "Panel Produktów",
    },
  };
  return (
    <>
      <Head>
        <title>BrightLight | {t[locale].title}</title>
      </Head>
      <Container className="justify-content-center text-center mt-4 color-primary" id="ap-ctx">
        <nav className="d-flex gap-2">
          <small>
            <Link href="/#main">{t[locale].home}</Link>
          </small>
          <small>&gt;</small>
          <small>{t[locale].productPage}</small>
        </nav>
        <h1>{t[locale].h1}</h1>
        <div className="d-flex justify-content-end gap-2 text-end mt-4">
          <Button
            size="md"
            variant="outline-primary"
            className={`${isMobile && "w-100"}`}
            onClick={() => {
              router.push("/admin/products/new#main");
              setLoadingNew(true);
            }}
            disabled={loadingNew}
          >
            {loadingNew ? (
              <span>
                <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> {t[locale].loading}
              </span>
            ) : (
              t[locale].newProduct
            )}
          </Button>
          <Button
            variant={`outline-${theme == "light" ? "dark" : "accent3"}`}
            size="md"
            onClick={refreshProductList}
            disabled={loadingRfs}
            title={t[locale].refresh}
          >
            {loadingRfs ? (
              <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
            ) : (
              <FiRefreshCcw style={{ width: "22px", height: "22px" }} />
            )}
          </Button>
        </div>

        <FilterAndSortBar
          id={idForSortingBar}
          refArray={refProducts}
          inputArray={products}
          outputArray={setProducts}
          msg={setMessage}
          resetSettings={loadingRfs}
        />

        <div>
          {products.map((product, idx) => (
            <Product key={idx} idx={idx} product={product} refresh={refreshProductList} />
          ))}

          {/* Message as output after finding item in array */}
          {message && <div className="mt-3">{message}</div>}
        </div>
      </Container>
    </>
  );
}

export default AdminProductsPage;

export const getServerSideProps = setup(async () => {
  const docs = await getDocsFromCollection("products");
  return {
    props: {
      productList: JSON.parse(JSON.stringify(docs)),
    }
  };
});
