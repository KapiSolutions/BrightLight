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
  const [orders, setOrders] = useState([]);
  const [message, setMessage] = useState("");
  const isMobile = useDeviceStore((state) => state.isMobile);
  const { isAuthenticated, authUserFirestore, userOrders, updateUserData } = useAuth();
  const idForSortingBar = "UserOrders";

  const sleep = (milliseconds) => {
    return new Promise((resolve) => setTimeout(resolve, milliseconds));
  };
  async function scroll() {
    await sleep(300);
    document.getElementById("uo-ctx").scrollIntoView();
  }

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

  return (
    <>
      <Head>
        <title>BrightLight | My orders</title>
      </Head>
      <Container className="justify-content-center text-center mt-5" id="uo-ctx">
        <h1 className="color-primary">My orders</h1>
        {userOrders?.length == 0 ? (
          <p className="color-primary">No orders yet.</p>
        ) : (
          <>
            <section className={`text-center  ${isMobile ? "" : "mt-2"}`}>
              <FilterAndSortBar
                id={idForSortingBar}
                refArray={userOrders}
                inputArray={orders}
                outputArray={setOrders}
                msg={setMessage}
                // resetSettings={loadingRfs}
              />

              {message && <p className="color-primary mt-5">{message}</p>}

              {orders.map((_, idx) => (
                <Order key={idx} idx={idx} orders={orders} />
              ))}
            </section>
          </>
        )}
      </Container>
    </>
  );
}

export default UserOrdersPage;
