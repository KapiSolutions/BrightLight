import React, { useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { Button, Container, Spinner } from "react-bootstrap";
import { useAuth } from "../../../context/AuthProvider";
import { useDeviceStore } from "../../../stores/deviceStore";
import FilterAndSortBar from "../../../components/Orders/FilterAndSortBar_Orders";
import Order from "../../../components/Orders/Admin/Order";
import { getDocsFromCollection } from "../../../firebase/Firestore";
import { FiRefreshCcw } from "react-icons/fi";

function UserProfilePage() {
  const router = useRouter();
  const isMobile = useDeviceStore((state) => state.isMobile);
  const theme = useDeviceStore((state) => state.themeState);
  const { isAuthenticated, isAdmin } = useAuth();
  const [loadingRfs, setLoadingRfs] = useState(false);
  const [ordersRef, setOrdersRef] = useState([]); //reference list used for backup for sorting and filtering methods
  const [orders, setOrders] = useState([]);
  const [message, setMessage] = useState("");
  const idForSortingBar = "AdminOrders";

  
  const sleep = (milliseconds) => {
    return new Promise((resolve) => setTimeout(resolve, milliseconds));
  };
  async function scroll() {
    await sleep(300);
    document.getElementById("ao-ctx").scrollIntoView();
  }

  useEffect(() => {
    if (isAuthenticated()) {
      if (isAdmin) {
        isMobile && scroll();
        refreshOrderList();
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

  const refreshOrderList = async () => {
    setLoadingRfs(true);
    try {
      const docs = await getDocsFromCollection("orders");
      setOrdersRef(JSON.parse(JSON.stringify(docs)));
      setLoadingRfs(false);
    } catch (e) {
      console.log(e);
      setLoadingRfs(false);
    }
  };

  return (
    <>
      <Head>
        <title>BrightLight | Admin - Orders</title>
      </Head>
      <Container className="justify-content-center text-center mt-5 color-primary" id="ao-ctx">
        <h1>Orders Menagment</h1>
        {ordersRef?.length == 0 ? (
          <p className="color-primary">No orders yet.</p>
        ) : (
          <>
            <div className="text-end">
              <Button
                variant={`outline-${theme == "light" ? "dark" : "accent3"}`}
                size="md"
                onClick={refreshOrderList}
                disabled={loadingRfs}
                title="Refresh list"
                className={isMobile ? "w-100" : ""}
              >
                {loadingRfs ? (
                  <>
                    Loading <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                  </>
                ) : (
                  <>
                    Refresh List <FiRefreshCcw style={{ width: "20px", height: "20px" }} />
                  </>
                )}
              </Button>
            </div>
            <section className={`text-center  ${isMobile ? "" : "mt-2"}`}>
              <FilterAndSortBar
                id={idForSortingBar}
                refArray={ordersRef}
                inputArray={orders}
                outputArray={setOrders}
                msg={setMessage}
                resetSettings={loadingRfs}
                autoFind={router.query.id}//find order by id on init when redirect eg from user management page
              />

              {message && <p className="color-primary mt-5">{message}</p>}

              {orders.map((order, idx) => (
                <Order key={idx} idx={idx} order={order} refresh={refreshOrderList} />
              ))}
            </section>
          </>
        )}
      </Container>
    </>
  );
}

export default UserProfilePage;
