import React, { useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { Container, Button } from "react-bootstrap";
import { useAuth } from "../../../context/AuthProvider";
import { IoCheckmarkDoneCircleOutline } from "react-icons/io5";

function SuccessPaymentPage() {
  const router = useRouter();
  const locale = router.locale;
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated()) {
      document.getElementById("ps-ctx").scrollIntoView();
    } else {
      router.replace("/sign-in");
      return;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const t = {
    en: {
      title: "Payment complete",
      checkEmail: "Check your email for the order confirmation.",
      checkOrders: "You can check also the status of your order and all other details below:",
      button: "Go to My orders",
    },
    pl: {
      title: "Płatność zaakceptowana",
      checkEmail: "Potwierdzenie zamówienia oraz płatności zostało przesłane na Twój e-mail.",
      checkOrders: "Możesz również sprawdzić status swojego zamówienia i wszystkie inne szczegóły poniżej:",
      button: "Moje zamówenia",
    },
  };
  return (
    <>
      <Head>
        <title>BrightLight | {t[locale].title}</title>
      </Head>
      <Container className="justify-content-center text-center mt-5 color-primary" id="ps-ctx">
        <h2>{t[locale].title}!</h2>
        
        <p className="color-primary">{t[locale].checkEmail}</p>
        <p className="color-primary">{t[locale].checkOrders}</p>
        <Button
          variant="primary"
          className="mt-2"
          onClick={() => {
            router.push("/user/orders#main");
          }}
        >
          {t[locale].button}
        </Button>
        <br />
        <IoCheckmarkDoneCircleOutline style={{ width: "40px", height: "40px" }} className="mt-4" />
      </Container>
    </>
  );
}

export default SuccessPaymentPage;
