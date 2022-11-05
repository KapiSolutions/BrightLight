import React, { useEffect } from "react";
import Head from "next/head";
import { Container } from "react-bootstrap";
import { useRouter } from "next/router";
import { useDeviceStore } from "../../../stores/deviceStore";
import { useAuth } from "../../../context/AuthProvider";
import UserOrderItem from "../../../components/UserOrderItem";

function UserOrdersPage() {
  const router = useRouter();
  const isMobile = useDeviceStore((state) => state.isMobile);
  const { isAuthenticated, authUserFirestore, userOrders, updateUserData } = useAuth();
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
            <section className={`text-center color-primary ${isMobile? "" : "mt-2"}`}>
              {Array.from({ length: userOrders?.length }).map((_, idx) => (
                <UserOrderItem key={idx} idx={idx} orders={userOrders} />
              ))}
            </section>
          </>
        )}
      </Container>
    </>
  );
}

export default UserOrdersPage;
