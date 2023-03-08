import React, { useEffect, useState, useReducer } from "react";
import Head from "next/head";
import { Container, Form, InputGroup } from "react-bootstrap";
import { useRouter } from "next/router";
import { useDeviceStore } from "../../../stores/deviceStore";
import { useAuth } from "../../../context/AuthProvider";
import Order from "../../../components/Orders/User/Order";
import FilterAndSortBar from "../../../components/Orders/FilterAndSortBar_Orders";

function UserOrdersPage() {
  const router = useRouter();
  const locale = router.locale;
  const [orders, setOrders] = useState([]);
  const [message, setMessage] = useState("");
  const [resetFilterBar, setResetFilterBar] = useState(false);
  const isMobile = useDeviceStore((state) => state.isMobile);
  const { isAuthenticated, authUserFirestore, userOrders, updateUserData } = useAuth();
  const idForSortingBar = "UserOrders";

  useEffect(() => {
    if (isAuthenticated()) {
      isMobile && scroll();
      authUserFirestore && updateUserData(authUserFirestore?.id, null, true); //update only orders
    } else {
      router.replace("/sign-in");
      return;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const t = {
    en: {
      title: "My orders",
      noOrders: "No orders yet.",
    },
    pl: {
      title: "Moje zamówienia",
      noOrders: "Brak zamówień.",

    },
  };

  const sleep = (milliseconds) => {
    return new Promise((resolve) => setTimeout(resolve, milliseconds));
  };
  async function scroll() {
    await sleep(300);
    document.getElementById("uo-ctx").scrollIntoView();
  }
  const timeStampToDate = (time) => {
    return new Date(time.seconds * 1000 + time.nanoseconds / 100000);
  };

//update and sort orders after eg. deletetion of the order
  useEffect(() => {
    setOrders(userOrders.sort((a, b) => timeStampToDate(b.timeCreate) - timeStampToDate(a.timeCreate)));
    setResetFilterBar(!resetFilterBar);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userOrders]);
  


  return (
    <>
      <Head>
        <title>BrightLight | {t[locale].title}</title>
      </Head>
      <Container className="justify-content-center text-center mt-5" id="uo-ctx">
        <h1 className="color-primary">{t[locale].title}</h1>
        {userOrders?.length == 0 ? (
          <p className="color-primary">{t[locale].noOrders}</p>
        ) : (
          <>
            <section className={`text-center  ${isMobile ? "" : "mt-2"}`}>
              <FilterAndSortBar
                id={idForSortingBar}
                refArray={userOrders}
                inputArray={orders}
                outputArray={setOrders}
                msg={setMessage}
                resetSettings={resetFilterBar}
              />

              {message && <p className="color-primary mt-5">{message}</p>}

              {orders.map((order, idx) => (
                <Order key={idx} idx={idx} order={order} />
              ))}
            </section>
          </>
        )}
      </Container>
    </>
  );
}

export default UserOrdersPage;
