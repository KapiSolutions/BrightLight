import React, { useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { Container, Button } from "react-bootstrap";
import { useAuth } from "../../../context/AuthProvider";
import { VscBracketError } from "react-icons/vsc";

function CancelPaymentPage() {
  const router = useRouter();
  const locale = router.locale;
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated()) {
      document.getElementById("pc-ctx").scrollIntoView();
    } else {
      router.replace("/sign-in");
      return;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const t = {
    en: {
      title: "Payment failure",
      text: "Order placed but something went wrong with during the payment. Please try to pay again within 48 hours, otherwise the order will be canceled.",
      button: "Go to My orders",
    },
    pl: {
      title: "Błąd płatności",
      text: "Zamówienie złożone, ale coś poszło nie tak podczas płatności. Dokonaj płatności w ciągu 48 godzin, w przeciwnym razie zamówienie zostanie anulowane.",
      button: "Moje zamówenia",
    },
  };
  return (
    <>
      <Head>
        <title>BrightLight | {t[locale].title}</title>
      </Head>
      <Container className="justify-content-center text-center mt-5 color-primary" id="pc-ctx">
        <h1>{t[locale].title}</h1>
        <VscBracketError style={{ width: "40px", height: "40px" }} className="mb-3" />
        <p className="color-primary">{t[locale].text}</p>
        <Button
          variant="primary"
          className="mt-2"
          onClick={() => {
            router.push("/user/orders#main");
          }}
        >
          {t[locale].button}
        </Button>
      </Container>
    </>
  );
}

export default CancelPaymentPage;
