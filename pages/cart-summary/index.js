import React, { useState, useEffect } from "react";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import getStripe from "../../utils/get-stripejs";
import { useRouter } from "next/router";
import { useAuth } from "../../context/AuthProvider";
import { OverlayTrigger, Popover, FloatingLabel, Form, Button, Container, Spinner } from "react-bootstrap";
import { BsInfoCircle } from "react-icons/bs";
import { useDeviceStore } from "../../stores/deviceStore";
import { getFileUrlStorage } from "../../firebase/Storage";
import CartItem from "../../components/Cart/CartItem";
import visaSvg from "../../public/img/pay_methods/visa.svg";
import mcardSvg from "../../public/img/pay_methods/mcard.svg";
import amexSvg from "../../public/img/pay_methods/amex.svg";
import p24Svg from "../../public/img/pay_methods/p24.svg";
import blikSvg from "../../public/img/pay_methods/blik.svg";
import { v4 as uuidv4 } from "uuid";
import { setup } from "../../config/csrf";

export default function CartSummaryPage() {
  const router = useRouter();
  const locale = router.locale;
  const { isAuthenticated, authUserFirestore, setErrorMsg, updateProfile, authUserCredential } = useAuth();
  const [totalPrice, setTotalPrice] = useState(0);
  const [loading, setLoading] = useState(undefined);
  const [idToken, setIdToken] = useState(undefined);
  const isMobile = useDeviceStore((state) => state.isMobile);
  const currency = useDeviceStore((state) => state.currency);
  const theme = useDeviceStore((state) => state.themeState);

  const getToken = async () => {
    const token = await authUserCredential.getIdToken(true);
    setIdToken(token.toString());
  };

  useEffect(() => {
    if (isAuthenticated()) {
      if (authUserFirestore?.cart.length == 0 && !loading) {
        router.replace("/");
      } else {
        getToken();
      }
    } else {
      router.replace("/sign-in");
      return;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    let total = 0;
    authUserFirestore?.cart.forEach((item) => {
      total = total + parseFloat(item.price[currency].amount);
    });
    setTotalPrice(total.toFixed(2));

    total == 0 && !loading && router.replace("/");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authUserFirestore?.cart, currency]);

  const t = {
    en: {
      home: "Home",
      summary: "Summary",
      payment: "Payment",
      done: "Done!",
      personalData: "Personal data:",
      name: "Name",
      age: "Birth Date",
      email: "E-mail address",
      pop1: "The date of birth is very important in tarot. It helps to get answers in the most accurate way.",
      pop2: "You will receive all the answers to the given email address. They will also be available",
      here: "here.",
      cartItems: "Cart items:",
      comments: "Comments to order:",
      yourComments: "Your comments...",
      when: "When and How?",
      receive: "You will receive all the answers to the given email address.",
      answers: "Answers will be also available",
      everything: "Everything will be ready within 48 hours of successful payment :)",
      accept: "I accept the",
      terms: "Terms of service",
      declare: "and I declare that I am over 18 years old.",
      total: "Total Price:",
      loading: "Loading...",
      buy: "Buy And Pay",
      sthWrong: "Something went wrong, please try again later.",
      redirectingFail:
        "Order placed but something went wrong with redirecting to the payment. Try again within 48 hours, after that time the order will be canceled.",
    },
    pl: {
      home: "Strona Główna",
      summary: "Podsumowanie koszyka",
      payment: "Płatność",
      done: "Koniec!",
      personalData: "Twoje dane:",
      name: "Imię",
      age: "Data urodzenia",
      email: "Adres e-mail",
      pop1: "Data urodzenia jest bardzo ważna w tarocie. Pomaga uzyskać odpowiedzi w najdokładniejszy sposób.",
      pop2: "Wszystkie odpowiedzi otrzymasz na podany adres e-mail. Będą również dostępne",
      here: "tutaj.",
      cartItems: "Produkty:",
      comments: "Uwagi do zamówienia:",
      yourComments: "Twoje uwagi...",
      when: "Kiedy i jak?",
      receive: "Wszystkie odpowiedzi otrzymasz na podany adres e-mail.",
      answers: "Odpowiedzi będą dostępne również",
      everything: "Wszystko będzie gotowe w ciągu 48 godzin od pomyślnej płatności :)",
      accept: "Akceptuje",
      terms: "Regulamin",
      declare: "i oświadczam, że mam skończone 18lat.",
      total: "Razem:",
      loading: "Ładuję...",
      buy: "Kupuje i Płacę",
      sthWrong: "Coś poszło nie tak. Spróbuj ponownie później.",
      redirectingFail:
        "Zamówienie złożone, ale coś poszło nie tak z przekierowaniem do płatności. Spróbuj ponownie w ciągu 48 godzin, po tym czasie zamówienie zostanie anulowane.",
    },
  };

  async function handleCheckout(e) {
    e.preventDefault();
    setLoading(true);
    // const localeLanguage = window.navigator.userLanguage || window.navigator.language; //to display the date in the email in the client's language format
    const localeTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone; //to display the date in the email in the client's time zone
    const comments = document.getElementById("commentsField").value;
    const orderID = uuidv4().slice(0, 13);
    const order = {
      id: orderID,
      userID: authUserFirestore?.id,
      userName: authUserFirestore?.name,
      userAge: authUserFirestore?.age,
      userEmail: authUserFirestore?.email,
      items: authUserFirestore?.cart,
      zodiac: authUserFirestore?.zodiac,
      status: "Unpaid",
      paid: false,
      totalPrice: totalPrice,
      currency: currency,
      language: locale,
      userComments: comments,
      timeCreate: new Date(),
      //timeCreate will be added on the server side
    };
    //CREATE ORDER IN THE FIRESTORE
    try {
      const payload = {
        secret: process.env.NEXT_PUBLIC_API_KEY,
        idToken: idToken,
        mode: "create-order",
        data: order,
      };
      await axios.post("/api/admin/firebase/", payload);
      //Clean the cart
      await updateProfile({ cart: [] });
    } catch (error) {
      // console.log(error.response.data);
      setErrorMsg(t[locale].sthWrong);
      setLoading(undefined);
      return;
    }

    //START STRIPE CHECKOUT SESSION
    try {
      //prepare stripe product data
      const stripeCart = order.items.map((item) => ({
        price: item.price[currency].s_id,
        quantity: 1,
      }));
      //prepare cart items data for email notification
      const cartItems = await Promise.all(
        order.items.map(async (item) => ({
          name: item.name[locale],
          price: item.price[currency].amount,
          currency: currency,
          image: await getFileUrlStorage(`images/products/${item.product_id}`, item.image.name),
        }))
      );

      const payload = {
        secret: process.env.NEXT_PUBLIC_API_KEY,
        idToken: idToken,
        data: {
          sendOrderConfirmEmail: true, //send order confirmation email
          orderID: order.id,
          userName: order.userName,
          userEmail: order.userEmail,
          totalPrice: order.totalPrice,
          currency: order.currency,
          cartItems: cartItems,
          stripeCart: stripeCart,
          language: order.language,
          timeCreate: order.timeCreate.toLocaleString(order.language, { timeZone: localeTimeZone }),
        },
        redirects: {
          success: "payment/success",
          cancel: "payment/cancel",
        },
        metadata: {
          orderID: order.id,
          localeLanguage: order.language,
          localeTimeZone: localeTimeZone,
          coinsBuy: false, //true for payment for the coins
        },
      };
      //Start checkoutSession
      const res = await axios.post("/api/stripe/checkout_session", payload);
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
        setErrorMsg(t[locale].redirectingFail);
        router.replace("/user/orders#main");
      }
      setLoading(undefined);
    } catch (error) {
      console.log(error);
      setLoading(undefined);
      setErrorMsg(t[locale].redirectingFail);
      router.replace("/user/orders#main");
      return;
    }
  }

  return (
    <Container className="mt-2 color-primary">
      <section className="d-flex gap-1">
        <small>
          <Link href="/#main">{t[locale].home}</Link>
        </small>
        <small>&gt;</small>
        <small>{t[locale].summary}</small>
        <small>&gt;</small>
        <small className="text-muted">{t[locale].payment}</small>
        <small>&gt;</small>
        <small className="text-muted">{t[locale].done}</small>
      </section>
      <div className="d-flex flex-wrap">
        <div className="col-sm-12 col-md-7">
          <section>
            <Form className="mt-4 color-primary">
              <small>
                <strong>{t[locale].personalData}</strong>
              </small>
              <FloatingLabel controlId="Name" label={t[locale].name} className="mb-3 text-dark">
                <Form.Control type="text" defaultValue={authUserFirestore?.name} disabled required />
              </FloatingLabel>
              <FloatingLabel controlId="Bdate" label={t[locale].age} className="mb-3 text-dark">
                <Form.Control type="date" defaultValue={authUserFirestore?.age} disabled required />
                <div className="d-flex justify-content-end">
                  <OverlayTrigger
                    trigger="click"
                    placement="left"
                    overlay={
                      <Popover id="popover-basic">
                        <Popover.Body>{t[locale].pop1}</Popover.Body>
                      </Popover>
                    }
                  >
                    <div className="text-end pe-3" style={{ position: "relative", top: "-46px", maxHeight: "0px" }}>
                      <BsInfoCircle className="pointer" style={{ height: "20px", width: "20px" }} />
                    </div>
                  </OverlayTrigger>
                </div>
              </FloatingLabel>
              <FloatingLabel controlId="Email" label={t[locale].email} className="mb-3 text-dark">
                <Form.Control type="email" defaultValue={authUserFirestore?.email} disabled required />
                <div className="d-flex justify-content-end">
                  <OverlayTrigger
                    trigger="click"
                    placement="left"
                    overlay={
                      <Popover id="popover-basic">
                        <Popover.Body>
                          {t[locale].pop2}{" "}
                          <Link href="/user/orders#main" passHref className="pointer">
                            {t[locale].here}
                          </Link>
                        </Popover.Body>
                      </Popover>
                    }
                  >
                    <div className="text-end pe-3" style={{ position: "relative", top: "-46px", maxHeight: "0px" }}>
                      <BsInfoCircle className="pointer" style={{ height: "20px", width: "20px" }} />
                    </div>
                  </OverlayTrigger>
                </div>
              </FloatingLabel>
            </Form>
          </section>

          <section className="mt-4">
            <p className="text-start justify-self-start mb-0">
              <small>
                <strong>{t[locale].cartItems}</strong>
              </small>
            </p>
            {Array.from({ length: authUserFirestore?.cart.length }).map((_, idx) => (
              <CartItem key={idx} idx={idx} theme={theme} />
            ))}
          </section>

          {/* Comments to order */}
          <section className="text-center mt-4">
            <p className="text-start justify-self-start mb-0">
              <small>
                <strong>{t[locale].comments}</strong>
              </small>
            </p>
            <Form.Control
              as="textarea"
              id="commentsField"
              placeholder={t[locale].yourComments}
              style={{ minHeight: "80px" }}
            />
          </section>

          {/* Where and How section */}
          <section className="mt-4 mb-4" style={{ maxHeight: "200px" }}>
            <small>
              <strong>{t[locale].when}</strong>
            </small>
            <div className={`rounded p-2 ${theme == "light" ? "border" : "border border-dark"}`}>
              <p className="m-0">
                <small>
                  {t[locale].receive}
                  {isMobile ? (
                    " "
                  ) : (
                    <>
                      <br />
                    </>
                  )}
                  {t[locale].answers}{" "}
                  <Link href="/user/orders#main" passHref className="pointer">
                    {t[locale].here}
                  </Link>
                </small>
              </p>
              <p className="mb-0 mt-2 w-75">
                <small>{t[locale].everything}</small>
              </p>
            </div>
            <div
              className="text-end w-25 float-end mb-0"
              style={{
                position: "relative",
                bottom: isMobile ? "80px" : "90px",
                right: isMobile ? "-5px" : "-25px",
                maxHeight: "1px",
              }}
            >
              <Image
                src="/img/delivery_info.png"
                width={isMobile ? "90" : "130"}
                height={isMobile ? "90" : "130"}
                alt="Delivery unicorn with laptop"
              />
            </div>
          </section>
        </div>

        <div
          className={`
            col-sm-12 col-md-4 
            ${isMobile && "w-100"}
            ${!isMobile && `h-75 p-3 ms-5 mt-5 rounded ${theme == "light" ? "border" : "border border-dark"}`}
            `}
          style={!isMobile ? { position: "sticky", top: "70px" } : {}}
        >
          <section className="text-center">
            <Form onSubmit={handleCheckout}>
              <div className="text-start">
                <Form.Check id="checkbox summary 1">
                  <Form.Check.Input type="checkbox" required />
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
              </div>
              <h5 className="color-primary mt-4">
                {t[locale].total} {totalPrice}
                <span className="text-uppercase ms-1">{currency}</span>
              </h5>
              <Button type="submit" className="mt-2" disabled={loading}>
                {loading ? (
                  <>
                    <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                    <span>{t[locale].loading}</span>
                  </>
                ) : (
                  <span>{t[locale].buy}</span>
                )}
              </Button>
              <section className="d-flex justify-content-center gap-1 mt-3 ">
                <Image src={visaSvg} width="32" height="32" alt="Visa" />
                <Image src={mcardSvg} width="32" height="32" alt="Master card" />
                <Image src={amexSvg} width="30" height="32" alt="American express" />
                <Image src={p24Svg} width="32" height="32" alt="Przelewy24" />
                <Image src={blikSvg} width="36" height="32" alt="blik" />
              </section>
            </Form>
          </section>
        </div>
      </div>
    </Container>
  );
}

export const getServerSideProps = setup(async ({ req, res }) => {
  return { props: {} };
});
