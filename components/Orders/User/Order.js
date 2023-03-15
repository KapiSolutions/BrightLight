import React, { useState, useEffect } from "react";
import Image from "next/image";
import axios from "axios";
import getStripe from "../../../utils/get-stripejs";
import { useAuth } from "../../../context/AuthProvider";
import { Badge, Button, Spinner } from "react-bootstrap";
import { useRouter } from "next/router";
import { IoIosArrowForward } from "react-icons/io";
import { deleteDocInCollection } from "../../../firebase/Firestore";
import { useDeviceStore } from "../../../stores/deviceStore";
import OrderDetails from "./OrderDetails";
import ConfirmActionModal from "../../Modals/ConfirmActionModal";
import cardsIcon from "../../../public/img/cards-light.png";
import { BsClockHistory } from "react-icons/bs";
import appConfig from "../../../config/appConfig";

function Order(props) {
  const router = useRouter();
  const locale = router.locale;
  const order = props.order;
  const config = appConfig();
  const isMobile = useDeviceStore((state) => state.isMobile);
  const { setErrorMsg, authUserFirestore, updateUserData } = useAuth();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [loading, setLoading] = useState(undefined);
  const [showDetails, setShowDetails] = useState(false);
  const [timeOver, setTimeOver] = useState(false);
  const [notificationSended, setNotificationSended] = useState(false);
  const [paymentDisabled, setPaymentDisabled] = useState(false);
  //paymentDisabled: user have an extra [x] hours for payment after getting an notification, after that time the payment isn't available -> admin can safely delete the order

  const t = {
    en: {
      sthWrong: "Something went wrong, please try again later.",
      order: "Order",
      status: "Status",
      total: "Total",
      action: "Action",
      unpaid: "Unpaid",
      inRealization: "In Realization",
      done: "Done",
      extraTime: "Extra Time: ",
      timesUp: "Time's Up:",
      deadline: "Deadline: ",
      hurryUp: "Hurry Up! ",
      finishIn: "Finish in: ",
      paymentExpired: "Payment time has expired!",
      tryDelete: "You are trying to cancel your order, after which all your tarot cards will be lost. Confirm or return to orders.",
      pay: "Pay now",
      loading: "Loading...",
      cancel: "Cancel",
      hide: "Hide details",
      show: "Show details",
      more: "more..",
    },
    pl: {
      sthWrong: "Coś poszło nie tak, spróbuj ponownie później.",
      order: "Zamówienie",
      status: "Status",
      total: "Razem",
      action: "Opcje",
      unpaid: "Nieopłacone",
      inRealization: "W realizacji",
      done: "Gotowe",
      extraTime: "Dodatkowy czas: ",
      timesUp: "Po czasie:",
      deadline: "Pozostało: ",
      hurryUp: "Szybko! ",
      finishIn: "Zakończ w: ",
      paymentExpired: "Czas na płatność upłynął!",
      tryDelete: "Próbujesz anulować zamówienie, co spowoduje utratę kart i zadanego pytania. Potwierdź lub wróć do zamówień.",
      pay: "Zapłać",
      loading: "Ładuję...",
      cancel: "Anuluj",
      hide: "Ukryj szczegóły",
      show: "Pokaż szczegóły",
      more: "wiecej..",
    },
  };

  const timeStampToDate = (time) => {
    return new Date(time.seconds * 1000 + time.nanoseconds / 100000);
  };

  useEffect(() => {
    if (order.notificationTime) {
      setNotificationSended(true);
    } else {
      setNotificationSended(false);
      setPaymentDisabled(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handlePayment() {
    try {
      setLoading(true);
      const localeLanguage = window.navigator.userLanguage || window.navigator.language; //to display the date in the email in the client's language format
      const localeTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone; //to display the date in the email in the client's time zone

      //prepare stripe product data
      const stripeCart = order.items.map((item) => ({
        price: item.price[order.currency].s_id,
        quantity: 1,
      }));

      const payload = {
        secret: process.env.NEXT_PUBLIC_API_KEY,
        data: {
          sendOrderConfirmEmail: false,
          orderID: order.id,
          stripeCart: stripeCart,
          language: order.language,
          localeLanguage: localeLanguage,
          localeTimeZone: localeTimeZone,
        },
      };

      //start checkoutSession
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
        setErrorMsg(t[locale].sthWrong);
      }
      setLoading(undefined);
    } catch (error) {
      console.log(error);
      setErrorMsg(t[locale].sthWrong);
      setLoading(undefined);
      return;
    }
  }
  async function deleteOrder() {
    try {
      await deleteDocInCollection("orders", order.id);
      await updateUserData(authUserFirestore?.id, null, true); //update only orders
      setShowConfirmModal({ msg: "", itemID: "" });
    } catch (error) {
      setShowConfirmModal({ msg: "", itemID: "" });
      setErrorMsg(t[locale].sthWrong);
    }
  }

  const showDetailsFunc = () => {
    setShowDetails(!showDetails);
  };

  const remainingTime = () => {
    const startDate = order.paid ? timeStampToDate(order.timePayment) : timeStampToDate(order.timeCreate);
    const endDate = new Date();
    const msInHour = 1000 * 60 * 60;
    const deadline = !order.paid ? config.timePayment : config.timeRealization;
    const diff = Math.round(deadline - (endDate.getTime() - startDate.getTime()) / msInHour);
    let extraTime;
    if (!order.paid && notificationSended) {
      extraTime = checkDeadline();
    }
    if (diff < 0 && !timeOver) {
      setTimeOver(true);
    } else if (diff >= 0 && timeOver) {
      setTimeOver(false);
    }

    return extraTime ? extraTime : diff;
  };

  const checkDeadline = () => {
    const startDate = timeStampToDate(order.notificationTime);
    const endDate = new Date();
    const msInHour = 1000 * 60 * 60;
    const diff = Math.round(config.timeExtraPayment - (endDate.getTime() - startDate.getTime()) / msInHour);
    if (diff <= 0 && !paymentDisabled) {
      setPaymentDisabled(true);
    } else if (diff > 0 && paymentDisabled) {
      setPaymentDisabled(false);
    }
    return diff;
  };

  return (
    <div className="color-primary">
      {props.idx === 0 && (
        <>
          {!isMobile && (
            <>
              <div className="d-flex text-start w-100">
                <div className="col-5">
                  <strong>{t[locale].order}</strong>
                </div>
                <div className="col-3">
                  <strong>{t[locale].status}</strong>
                </div>
                <div className="col-2">
                  <strong>{t[locale].total}</strong>
                </div>
                <div className="col-2">
                  <strong>{t[locale].action}</strong>
                </div>
              </div>
            </>
          )}
          <hr />
        </>
      )}

      <div className="d-flex align-items-center text-start w-100 flex-wrap">
        <div className="col-10 col-md-5 d-flex pointer" onClick={showDetailsFunc}>
          <div>
            <Image src={cardsIcon} width="58" height="58" alt="tarot cards" />
          </div>
          <div>
            {isMobile ? (
              <>
                <p className="mb-0">
                  Tarot
                  <small>
                    {" "}
                    ({order?.items[0].name[locale]}
                    {order?.items.length > 1 && `, +${order?.items.length - 1} ${t[locale].more}`})
                  </small>
                </p>
                {order.status != "Done" ? (
                  <div className="d-flex align-items-center">
                    <Badge bg={order.paid ? "warning" : "primary"} className={order.paid ? "text-dark" : ""}>
                      <span className="text-uppercase">
                        {order.status === "Unpaid" && t[locale].unpaid}
                        {order.status === "In realization" && t[locale].inRealization}
                      </span>
                    </Badge>
                    {!order.paid && paymentDisabled && <small className="ms-1">{t[locale].paymentExpired}</small>}
                    {!order.paid && !paymentDisabled && (
                      <div className="ms-2">
                        <span className={timeOver ? "text-danger" : ""}>
                          <small className="me-1">
                            {timeOver ? (notificationSended ? t[locale].extraTime : t[locale].timesUp) : t[locale].deadline}
                            <strong>{remainingTime()}H</strong>
                          </small>
                          <BsClockHistory />
                        </span>
                      </div>
                    )}
                  </div>
                ) : (
                  <Badge bg="success">
                    <span className="text-uppercase">{t[locale].done}!</span>
                  </Badge>
                )}
              </>
            ) : (
              <>
                <p className="mb-0">
                  Tarot ({order?.items[0].name[locale]}
                  {order?.items.length > 1 && `, +${order?.items.length - 1} more..`})
                </p>
                <small className="text-muted">{timeStampToDate(order.timeCreate).toLocaleString()}</small>
              </>
            )}
          </div>
        </div>

        {!isMobile && (
          <>
            <div className="col-3 text-uppercase">
              {order.status != "Done" ? (
                <>
                  <Badge bg={order.paid ? "warning" : "primary"} className={order.paid ? "text-dark" : ""}>
                    <span className="text-uppercase">
                      {order.status === "Unpaid" && t[locale].unpaid}
                      {order.status === "In realization" && t[locale].inRealization}
                    </span>
                  </Badge>
                  {!order.paid && (
                    <div className="ms-1">
                      {paymentDisabled ? (
                        <small className="me-2">{t[locale].paymentExpired}</small>
                      ) : (
                        <span className={timeOver ? "text-danger" : ""}>
                          <small className="me-1">
                            {order.paid
                              ? timeOver
                                ? t[locale].hurryUp
                                : t[locale].finishIn
                              : timeOver
                              ? notificationSended
                                ? t[locale].extraTime
                                : t[locale].timesUp
                              : t[locale].deadline}
                            <strong>{remainingTime()}H</strong>
                          </small>
                          <BsClockHistory />
                        </span>
                      )}
                    </div>
                  )}
                </>
              ) : (
                <Badge bg="success">
                  <span className="text-uppercase">{t[locale].done}!</span>
                </Badge>
              )}
            </div>
            <div className="col-2">
              {order.totalPrice}
              <span className="text-uppercase ms-1">{order.currency}</span>
            </div>
            <div className="col-2">
              <span className="pointer Hover" onClick={showDetailsFunc}>
                {showDetails ? t[locale].hide : t[locale].show}
              </span>
              {!order.paid && !paymentDisabled && (
                <div className="d-flex flex-wrap mt-2 gap-3">
                  <Button
                    variant="outline-primary"
                    size="sm"
                    onClick={() => {
                      setShowConfirmModal({
                        msg: t[locale].tryDelete,
                        itemID: "",
                      });
                    }}
                  >
                    {t[locale].cancel}
                  </Button>

                  <Button variant="primary" className="text-light" size="sm" onClick={handlePayment} disabled={loading}>
                    {loading ? (
                      <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                    ) : (
                      t[locale].pay
                    )}
                  </Button>
                </div>
              )}
            </div>
          </>
        )}
        {isMobile && (
          <div className="col-2 text-center pointer" onClick={showDetailsFunc}>
            <IoIosArrowForward
              style={{ height: "25px", width: "25px", transform: `rotate(${showDetails ? "90" : "0"}deg)` }}
            />
          </div>
        )}

        {/* Details of the order */}
        {showDetails && (
          <div className="w-100">
            {isMobile && !order.paid && !paymentDisabled && (
              <div className="d-flex mt-3 mb-5 justify-content-between gap-4">
                <div className="d-flex gap-3 ms-2">
                  <Button
                    variant="outline-primary"
                    size="sm"
                    onClick={() => {
                      setShowConfirmModal({
                        msg: t[locale].tryDelete,
                        itemID: "",
                      });
                    }}
                  >
                    {t[locale].cancel}
                  </Button>
                  <Button variant="primary" className="text-light" size="sm" onClick={handlePayment} disabled={loading}>
                    {loading ? (
                      <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                    ) : (
                      t[locale].pay
                    )}
                  </Button>
                </div>
                <span>
                {t[locale].total}: {order.totalPrice}
                  <span className="text-uppercase ms-1">{order.currency}</span>
                </span>
              </div>
            )}

            {/* Order Details */}
            <OrderDetails order={order} isMobile={isMobile} />
            {isMobile && (
              <div className="text-center mt-4 mb-4">
                <Button variant="outline-accent4" className="pointer" onClick={showDetailsFunc}>
                {t[locale].hide}
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
      <hr />

      {/* Modal which appears when user wants to cancel the order */}
      <ConfirmActionModal
        msg={showConfirmModal.msg}
        closeModal={() => setShowConfirmModal({ msg: "", itemID: "" })}
        action={deleteOrder}
      />
    </div>
  );
}

export default Order;
