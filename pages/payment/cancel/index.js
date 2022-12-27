import React, { useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { Container, Button } from "react-bootstrap";
import { useAuth } from "../../../context/AuthProvider";
import { useDeviceStore } from "../../../stores/deviceStore";
import { VscBracketError } from "react-icons/vsc";

function CancelPaymentPage() {
  const isMobile = useDeviceStore((state) => state.isMobile);
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated()) {
      document.getElementById("pc-ctx").scrollIntoView();
    } else {
      router.replace("/sign-in");
      return;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <>
      <Head>
        <title>BrightLight | Payment failure</title>
      </Head>
      <Container className="justify-content-center text-center mt-5 color-primary" id="pc-ctx">
        <h1>Payment failure</h1>
        <VscBracketError style={{width: "40px", height: "40px"}} className="mb-3"/>
        <p className="color-primary">
          Order placed but something went wrong with during the payment. Please try to pay again within 48 hours, otherwise the order will be canceled.
        </p>
        <Button variant="primary" className="mt-2" onClick={() => {router.push("/user/orders#main")}}>Go to My orders</Button>
      </Container>
    </>
  );
}

export default CancelPaymentPage;
