import React, { useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { Container, Button } from "react-bootstrap";
import { useAuth } from "../../../context/AuthProvider";
import { useDeviceStore } from "../../../stores/deviceStore";
import { IoCheckmarkDoneCircleOutline } from "react-icons/io5";

function SuccessPaymentPage() {
  const isMobile = useDeviceStore((state) => state.isMobile);
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated()) {
        document.getElementById("ps-ctx").scrollIntoView();
    } else {
      router.replace("/sign-in");
      return;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <>
      <Head>
        <title>BrightLight | Payment complete</title>
      </Head>
      <Container className="justify-content-center text-center mt-5 color-primary" id="ps-ctx">
        <h2>Payment complete!</h2>
        <IoCheckmarkDoneCircleOutline style={{width: "40px", height: "40px"}} className="mb-3"/>
        <p className="color-primary">Check your email for the order confirmation.</p> 
        <p className="color-primary">You can check also the status of your order and all other details below:</p>      
        <Button variant="primary" className="mt-2" onClick={() => {router.push("/user/orders#main")}}>Go to My orders</Button>
        
      </Container>
    </>
  );
}

export default SuccessPaymentPage;
