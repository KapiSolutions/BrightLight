import React, { useEffect, useRef, useState } from "react";
import { Button, Card, Form, Spinner } from "react-bootstrap";
import { useDeviceStore } from "../../stores/deviceStore";
import { useAuth } from "../../context/AuthProvider";
import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";
import coinImg from "../../public/img/coins/coins.webp";
import visaSvg from "../../public/img/pay_methods/visa.svg";
import mcardSvg from "../../public/img/pay_methods/mcard.svg";
import amexSvg from "../../public/img/pay_methods/amex.svg";
import p24Svg from "../../public/img/pay_methods/p24.svg";
import blikSvg from "../../public/img/pay_methods/blik.svg";
import { getDocsFromCollection } from "../../firebase/Firestore";
import getStripe from "../../utils/get-stripejs";
import axios from "axios";

function CoinsCard() {
  const router = useRouter();
  const locale = router.locale;
  const coinsRef = useRef();
  const theme = useDeviceStore((state) => state.themeState);
  const isMobile = useDeviceStore((state) => state.isMobile);
  const currency = useDeviceStore((state) => state.currency);
  const [coins, setCoins] = useState();
  const [coinsErr, setCoinsErr] = useState(false); //true when incorrect value
  const [loaded, setLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [amountToPay, setAmountToPay] = useState();
  const [idToken, setIdToken] = useState(undefined);
  const { authUserFirestore, authUserCredential, setErrorMsg } = useAuth();
  const themeDarkInput = theme == "dark" ? "bg-accent6 text-light border-accent4" : "";

  const getCoins = async () => {
    try {
      const docs = await getDocsFromCollection("coins");
      setCoins(docs[0]);
      setAmountToPay((docs[0].quantity.min * docs[0].price[currency].amount).toFixed(2));
      setLoaded(true);
      return;
    } catch (e) {
      console.log(e);
      setErrorMsg(t[locale].sthWrong);
      return;
    }
  };

  const getToken = async () => {
    const token = await authUserCredential.getIdToken(true);
    setIdToken(token.toString());
  };

  useEffect(() => {
    getToken();
    getCoins();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (coins) {
      if (coinsRef.current?.value > coins.quantity.max || coinsRef.current?.value < coins.quantity.min) {
        setCoinsErr(true);
      } else {
        setCoinsErr(false);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [coinsRef.current?.value]);

  useEffect(() => {
    if (coins) {
      const quantity =
        coins.quantity.min == Number(coinsRef?.current?.value) ? coins.quantity.min : Number(coinsRef.current.value);
      setAmountToPay((quantity * coins.price[currency].amount).toFixed(2));
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currency]);

  const t = {
    en: {
      inputLabel: "Enter the amount of coins",
      accept: "I accept the",
      terms: "Terms of service",
      declare: "and I declare that I am over 18 years old.",
      coinsErrLow: "The minimum number of coins is ",
      coinsErrHigh: "The maximum number of coins is ",
      coin: "Bright Coin",
      buy: "Buy Now",
      total: "Total:",
      loading: "Loading...",
    },
    pl: {
      inputLabel: "Wybierz ilość monet",
      accept: "Akceptuje",
      terms: "Regulamin",
      declare: "i oświadczam, że mam skończone 18lat.",
      coinsErrLow: "Minimalna liczba monet to ",
      coinsErrHigh: "Maksymalna liczba monet to ",
      coin: "Moneta",
      buy: "Kup teraz",
      total: "Razem:",
      loading: "Ładuję...",
    },
  };

  const buyCoins = async (e) => {
    e.preventDefault();
    setCoinsErr(false);
    setLoading(true);
    if (coinsRef.current?.value > coins.quantity.max || coinsRef.current?.value < coins.quantity.min) {
      setCoinsErr(true);
      document.getElementsByName("coinsAmountBuyField")[0].focus();
      document.getElementsByName("coinsAmountBuyField")[0].scrollIntoView({ block: "center", inline: "nearest" });
      return;
    }

    try {
      const localeTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone; //to display the date in the email in the client's time zone
      //prepare stripe product data
      const stripeCart = [
        {
          price: coins.price[currency].s_id,
          quantity: Number(coinsRef.current?.value),
        },
      ];

      const payload = {
        secret: process.env.NEXT_PUBLIC_API_KEY,
        idToken: idToken,
        data: {
          sendOrderConfirmEmail: false, //dont send order confirmation email (send only payment confirmation by webhook)
          stripeCart: stripeCart,
          language: locale,
          coinsToBuy: Number(coinsRef.current?.value), //how many coins to add
        },
        redirects: {
          success: "user/coins?success=true",
          cancel: "user/coins?success=false",
        },
        metadata: {
          localeLanguage: locale,
          localeTimeZone: localeTimeZone,
          coinsBuy: true, //true for payment for the coins
          userID: authUserFirestore.id,
          coinsToAdd: Number(coinsRef.current?.value), //how many coins to add
          coinsAlreadyHave: Number(authUserFirestore.coins.amount), //how many coins already have user
        },
      };

      //start checkoutSession
      const res = await axios.post("/api/stripe/checkout_session/", payload);
      if (res.status === 500) {
        console.error(res.message);
        return;
      }
      // Redirect to checkout
      const stripe = await getStripe();
      router.push(res.data.url);
      const { error } = await stripe.redirectToCheckout({ sessionId: res.data.id });
      if (error) {
        console.error(error.message);
        setErrorMsg(t[locale].sthWrong);
      }
    } catch (error) {
      console.log(error);
      setErrorMsg(t[locale].sthWrong);
    }
    setLoading(false);
  };
  return (
    <section className="d-flex justify-content-center">
      {loaded ? (
        <Card style={{ maxWidth: isMobile ? "90%" : "320px" }} className="background border rounded shadow-sm w-100">
          <div className="rounded" style={{ position: "relative", height: "120px" }}>
            <Image
              src={coinImg}
              fill
              placeholder="blur"
              sizes="(max-width: 768px) 100vw, 33vw"
              alt={`${t[locale].title} - Bright Light Gypsy Tarot`}
              title={`${t[locale].title} - Bright Light Gypsy Tarot`}
              style={{ objectFit: "cover" }}
              className="rounded-top"
            />
          </div>
          <Card.Header className="color-primary border-bottom border-top border-accent4">
            <strong>
              1 {t[locale].coin} = {coins.price[currency].amount.toFixed(2)}{" "}
              <span className="text-uppercase">{currency}</span>
            </strong>
          </Card.Header>
          <Card.Body>
            <Form onSubmit={buyCoins}>
              <Form.Label htmlFor="coinsAmountBuyField">{t[locale].inputLabel}</Form.Label>
              <Form.Control
                type="number"
                min={coins.quantity.min}
                max={coins.quantity.max}
                step={1}
                name="coinsAmountBuyField"
                ref={coinsRef}
                onChange={() =>
                  setAmountToPay(
                    (
                      (coinsRef.current?.value ? coinsRef.current?.value : coins.quantity.min) *
                      coins.price[currency].amount
                    ).toFixed(2)
                  )
                }
                defaultValue={coins.quantity.min}
                className={`${themeDarkInput} m-auto`}
                style={{ width: "80px" }}
              />

              {coinsRef.current?.value < coins.quantity.min && (
                <small className="text-danger">
                  {t[locale].coinsErrLow} {coins.quantity.min}.
                </small>
              )}
              {coinsRef.current?.value > coins.quantity.max && (
                <small className="text-danger">
                  {t[locale].coinsErrHigh} {coins.quantity.max}.
                </small>
              )}
              {!coinsErr && (
                <p className="mt-3">
                  <span>{t[locale].total} </span>
                  <span className="text-uppercase">
                    <strong>
                      {amountToPay} {currency}
                    </strong>
                  </span>
                </p>
              )}

              <Form.Check id="coinsCheckAgreement" className="d-flex justify-content-center">
                <Form.Check.Input type="checkbox" className="pointer" required />
                <Form.Check.Label>
                  <sup>
                    {t[locale].accept}{" "}
                    <Link
                      href="/terms-of-service#main"
                      passHref
                      className="text-decoration-underline text-primary pointer"
                    >
                      {t[locale].terms}
                    </Link>{" "}
                    {t[locale].declare}
                  </sup>
                </Form.Check.Label>
              </Form.Check>

              <Button type="submit" disabled={loading}>
                {loading ? (
                  <span>
                    <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />{" "}
                    {t[locale].loading}
                  </span>
                ) : (
                  t[locale].buy
                )}
              </Button>
            </Form>
          </Card.Body>
          <Card.Footer className={`${theme === "dark" && "border-top border-dark"}`}>
            <section className="d-flex justify-content-center gap-1">
              <Image src={visaSvg} width="32" height="32" alt="Visa" />
              <Image src={mcardSvg} width="32" height="32" alt="Master card" />
              <Image src={amexSvg} width="30" height="32" alt="American express" />
              <Image src={p24Svg} width="32" height="32" alt="Przelewy24" />
              <Image src={blikSvg} width="36" height="32" alt="blik" />
            </section>
          </Card.Footer>
        </Card>
      ) : (
        "Loading..."
      )}
    </section>
  );
}

export default CoinsCard;
