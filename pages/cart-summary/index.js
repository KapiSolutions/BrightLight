import React, { useState, useEffect } from "react";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import getStripe from "../../utils/get-stripejs";
import CartSummaryItem from "../../components/CartSummaryItem";
import useLocalStorageState from "use-local-storage-state";
import { useRouter } from "next/router";
import { useAuth } from "../../context/AuthProvider";
import { OverlayTrigger, Popover, FloatingLabel, Form, Button, Container, Spinner } from "react-bootstrap";
import { BsInfoCircle } from "react-icons/bs";
import { useDeviceStore } from "../../stores/deviceStore";
import { createOrderFirestore } from "../../firebase/Firestore";
import { getFileUrlStorage } from "../../firebase/Storage";

function CartSummaryPage() {
  const router = useRouter();
  const { isAuthenticated, authUserFirestore, setErrorMsg, updateProfile } = useAuth();
  const isMobile = useDeviceStore((state) => state.isMobile);
  const [totalPrice, setTotalPrice] = useState(0);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(undefined);
  const [paymentStart, setPaymentStart] = useState(false);
  const [theme, setTheme] = useLocalStorageState("theme", {
    ssr: true,
    defaultValue: "light",
  });

  useEffect(() => {
    if (isAuthenticated()) {
      authUserFirestore?.cart.length == 0 && !loading && router.replace("/");
    } else {
      router.replace("/sign-in");
      return;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    let total = 0;
    authUserFirestore?.cart.forEach((item) => {
      total = total + item.price;
    });
    setTotalPrice(total);

    total == 0 && !loading && router.replace("/");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authUserFirestore?.cart]);

  async function handleCheckout(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    setPaymentStart(true);
    let order = null;
    const localeLanguage = window.navigator.userLanguage || window.navigator.language; //to display the date in the email in the client's language format
    const localeTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone; //to display the date in the email in the client's time zone

    //create order
    try {
      order = await createOrderFirestore(
        authUserFirestore?.id,
        authUserFirestore?.name,
        authUserFirestore?.age,
        authUserFirestore?.email,
        authUserFirestore?.cart,
        totalPrice
      );
    } catch (error) {
      setErrorMsg("Something went wrong, please try again later.");
      setLoading(undefined);
      return;
    }

    try {
      //prepare stripe product data
      const stripeCart = authUserFirestore?.cart.map((_, idx) => ({
        price: authUserFirestore?.cart[idx].s_id,
        quantity: 1,
      }));
      //prepare cart items data for email notification
      const cartItems = await Promise.all(
        authUserFirestore?.cart.map(async (_, idx) => ({
          name: authUserFirestore?.cart[idx].name,
          price: authUserFirestore?.cart[idx].price,
          image: await getFileUrlStorage("images/cards", authUserFirestore?.cart[idx].image),
        }))
      );

      const orderData = {
        sendOrderConfirmEmail: true,
        orderID: order.id,
        userName: order.userName,
        userEmail: order.userEmail,
        totalPrice: order.totalPrice,
        cartItems: cartItems,
        stripeCart: stripeCart,
        localeLanguage: localeLanguage,
        localeTimeZone: localeTimeZone,
        timeCreate: order.timeCreate.toDate().toLocaleString(localeLanguage, { timeZone: localeTimeZone }),
      };

      //clean cart
      await updateProfile({ cart: [] });

      //start checkoutSession
      const checkoutSession = await axios.post("/api/stripe/checkout_session", orderData);
      if (checkoutSession.statusCode === 500) {
        console.error(checkoutSession.message);
        return;
      }
      router.push(checkoutSession.data.url);
      // Redirect to checkout
      const stripe = await getStripe();
      const { error } = await stripe.redirectToCheckout({ sessionId: checkoutSession.data.id });
      console.warn(error.message);

      setLoading(undefined);
      if (error) {
        setLoading(undefined);
        setErrorMsg(
          "Order placed but something went wrong with redirecting to the payment. Try again within 48 hours, after that time the order will be canceled."
        );
        router.replace("/user/orders#main");
      }
    } catch (error) {
      console.log(error);
      setLoading(undefined);
      setErrorMsg(
        "Order placed but something went wrong with redirecting to the payment. Try again within 48 hours, after that time the order will be canceled."
      );

      router.replace("/user/orders#main");
      return;
    }
  }

  return (
    <Container className="mt-2 color-primary">
      <section className="d-flex gap-1">
        <small>Cart</small>
        <small>&gt;</small>
        <small>Summary</small>
        <small>&gt;</small>
        <small className="text-muted">Payment</small>
        <small>&gt;</small>
        <small className="text-muted">Done!</small>
      </section>
      <div className="d-flex flex-wrap">
        <div className="col-sm-12 col-md-7">
          <section>
            <Form className="mt-4 color-primary">
              <small>
                <strong>Personal data:</strong>
              </small>
              <FloatingLabel controlId="Name" label="Your name" className="mb-3 text-dark">
                <Form.Control type="text" defaultValue={authUserFirestore?.name} disabled required />
              </FloatingLabel>
              <FloatingLabel controlId="Bdate" label="Your birth date" className="mb-3 text-dark">
                <Form.Control type="date" defaultValue={authUserFirestore?.age} disabled required />
              </FloatingLabel>
              <FloatingLabel controlId="Email" label="Your email address" className="mb-3 text-dark">
                <Form.Control type="email" defaultValue={authUserFirestore?.email} disabled required />
                <div className="d-flex justify-content-end">
                  <OverlayTrigger
                    trigger="click"
                    placement="left"
                    overlay={
                      <Popover id="popover-basic">
                        <Popover.Body>
                          You will receive all the answers to the given email address. They will also be available here
                          in the <i>Profile -&gt; My orders</i> tab.
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

          <section className="text-center mt-4">
            <p className="text-start justify-self-start mb-0">
              <small>
                <strong>Cart items:</strong>
              </small>
            </p>
            {Array.from({ length: authUserFirestore?.cart.length }).map((_, idx) => (
              <CartSummaryItem key={idx} idx={idx} theme={theme} />
            ))}
          </section>

          <section className="mt-4" style={{ maxHeight: "215px" }}>
            <small>
              <strong>When and How?</strong>
            </small>
            <div className={`rounded p-2 ${theme == "light" ? "border" : "border border-dark"}`}>
              <p className="m-0">
                <small>
                  You will receive all the answers to the given email address. They will also be available here in the{" "}
                  <i>Profile -&gt; My orders</i> tab.
                </small>
              </p>
              <p className="mt-2 mb-0 w-75">
                <small>Everything will be ready within 48 hours after successful payment :)</small>
              </p>
            </div>
            <div
              className="text-end"
              style={{ position: "relative", bottom: isMobile ? "80px" : "90px", right: isMobile ? "-12px" : "-25px" }}
            >
              <Image
                src="/img/delivery_info.png"
                width={isMobile ? "100" : "130"}
                height={isMobile ? "100" : "130"}
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
                      I accept the{" "}
                      <Link
                        href="/terms-of-service#main"
                        passHref
                        className="text-decoration-underline text-primary pointer"
                      >
                        Terms of service
                      </Link>{" "}
                      and I declare that I am over 18 years old.
                    </sup>
                  </Form.Check.Label>
                </Form.Check>
              </div>
              <h5 className="color-primary mt-4">Total Price: {totalPrice} PLN</h5>
              <Button type="submit" className="mt-2" disabled={loading}>
                {loading ? (
                  <>
                    <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                    <span>Loading...</span>
                  </>
                ) : (
                  <span> Buy and Pay </span>
                )}
              </Button>
              <section className="d-flex justify-content-center gap-1 mt-3 ">
                <Image src="/img/pay_methods/visa.svg" width="32" height="32" alt="Visa" />
                <Image src="/img/pay_methods/mcard.svg" width="32" height="32" alt="Master card" />
                <Image src="/img/pay_methods/amex.svg" width="30" height="32" alt="American express" />
                <Image src="/img/pay_methods/p24.svg" width="32" height="32" alt="Przelewy24" />
                <Image src="/img/pay_methods/blik.svg" width="36" height="32" alt="blik" />
              </section>
            </Form>
          </section>
        </div>
      </div>
    </Container>
  );
}

export default CartSummaryPage;
