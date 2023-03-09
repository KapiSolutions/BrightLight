import React, { useState, useEffect } from "react";
import { Button, Form, Spinner } from "react-bootstrap";
import { getDocById, updateDocFields } from "../../../firebase/Firestore";
import { useAuth } from "../../../context/AuthProvider";
import { useDeviceStore } from "../../../stores/deviceStore";
import Item from "./Item";
import { getFileUrlStorage } from "../../../firebase/Storage";
import axios from "axios";
import SuccessModal from "../../Modals/SuccessModal";
import { useRouter } from "next/router";

function OrderDetails(props) {
  const router = useRouter();
  const locale = router.locale;
  const order = props.order;
  const { setErrorMsg } = useAuth();
  const isMobile = useDeviceStore((state) => state.isMobile);
  const [answersQt, setAnswersQt] = useState(Array.from(Array(order.items.length), () => false)); //[false,false...], set tu true when item is answered
  const [readyToFinish, setReadyToFinish] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorEmail, setErrorEmail] = useState(false);
  const [showSuccess, setShowSuccess] = useState("");
  const timeStampToDate = (time) => {
    return new Date(time.seconds * 1000 + time.nanoseconds / 100000);
  };

  const t = {
    en: {
      sthWrong: "Something went wrong, please try again later.",
      finishedWithoutEmail: "Order finished but an error occurred during sending an email to the client.",
      orderCompleted: "Order successfully Completed!",
      completed: "Completed!",
      status: "Status",
      unpaid: "Unpaid",
      inRealization: "In Realization",
      done: "Done",
      orderDate: "Order Date",
      orderID: "Order ID",
      paymentDate: "Date",
      paymentDateLong: "Payment Date",
      paymentID: "Payment ID",
      amount: "Amount",
      method: "Method",
      amountLong: "Amount Paid",
      methodLong: "Payment Method",
      client: "Client",
      clientID: "Client ID",
      comments: "Client comments:",
      orderItems: "Order Items:",
      total: "Total:",
      great: "Great! Let's..",
      processing: "Processing...",
      finishOrder: "Finish The Order!",
      modalButton: "Great!",
    },
    pl: {
      sthWrong: "Coś poszło nie tak, spróbuj ponownie później.",
      finishedWithoutEmail:
        "Zamówienie zrealizowane, ale wystąpił błąd podczas wysyłania wiadomości e-mail do klienta.",
      orderCompleted: "Zamówienie pomyślnie zakończone!",
      completed: "Ukończono!",
      status: "Status",
      unpaid: "Nieopłacone",
      inRealization: "W realizacji",
      done: "Gotowe",
      orderDate: "Data zamówienia",
      orderID: "Nr zamówienia",
      paymentDate: "Data",
      paymentDateLong: "Data płatności",
      paymentID: "Nr płatności",
      amount: "Zapłacono",
      method: "Metoda",
      amountLong: "Zapłacono",
      methodLong: "Metoda płatności",
      client: "Klient",
      clientID: "Identyfikator Klienta",
      comments: "Uwagi do zamówienia:",
      orderItems: "Produkty:",
      total: "Razem:",
      great: "Yeah! Teraz..",
      processing: "Ładuję...",
      finishOrder: "Ukończ Zamówienie!",
      modalButton: "Super!",
    },
  };

  const answersQtFunc = (idx) => {
    let arr = [...answersQt];
    arr[idx] = true;
    setAnswersQt(arr);
  };

  useEffect(() => {
    let ready = true;
    answersQt.map((answer) => {
      if (!answer) {
        ready = false;
      }
    });
    if (ready) {
      setReadyToFinish(true);
    }
  }, [answersQt]);

  const finishOrder = async () => {
    setLoading(true);
    try {
      const tmpOrder = await getDocById("orders", order.id);
      const update = {
        items: tmpOrder.items,
        status: "Done",
        timeFinish: new Date(),
      };
      await updateDocFields("orders", order.id, update);
      const emailData = await prepareDataForEmail({
        orderID: tmpOrder.id,
        userName: tmpOrder.userName,
        userEmail: tmpOrder.userEmail,
        totalPrice: tmpOrder.totalPrice,
        currency: tmpOrder.currency,
        items: tmpOrder.items,
        language: tmpOrder.language,
      });
      await sendEmail(emailData);
      setShowSuccess(t[locale].orderCompleted);
      //refresh the order list:
      props.refresh();
    } catch (error) {
      console.log(error);
      setErrorMsg(t[locale].sthWrong);
    }
    setLoading(false);
  };

  //Get url's of the item images and convert array of cards to the formated string
  const prepareDataForEmail = async (data) => {
    try {
      await Promise.all(
        data.items.map(async (item, idx) => {
          const url = await getFileUrlStorage(`images/products/${item.product_id}`, item.image.name);
          let cards = "";
          data.items[idx].cards.map((card, idx) => {
            cards += `${idx + 1}. ${styledCardName(card)} `;
          });
          data.items[idx].cards = cards;
          data.items[idx].image = url;
        })
      );
      return data;
    } catch (e) {
      console.log(e);
      setErrorEmail(true);
      setErrorMsg(t[locale].finishedWithoutEmail);
    }
  };

  const styledCardName = (card) => {
    card = card[0].toUpperCase() + card.slice(1);
    card = card.replaceAll("-", " ");
    return card;
  };

  const sendEmail = async (data) => {
    const payload = {
      secret: process.env.NEXT_PUBLIC_API_KEY,
      data: data,
      type: "orderFinished",
    };
    try {
      await axios.post("/api/email/", payload);
      setErrorEmail(false);
    } catch (error) {
      console.log(e);
      setErrorEmail(true);
      setErrorMsg(t[locale].finishedWithoutEmail);
    }
  };

  return (
    <>
      <div className="mt-4 mb-4 color-primary">
        {order.status == "Done" && (
          <div>
            <p>
              <strong>{t[locale].completed}</strong> <u>{timeStampToDate(order.timeFinish).toLocaleString()}</u>
            </p>
            <div className="w-100 opacity-50">
              <hr />
            </div>
          </div>
        )}

        {/* Order details */}
        <div className="d-flex gap-4">
          <span>
            <small>
              <strong>{t[locale].status}</strong>
              <p style={{ whiteSpace: "nowrap" }}>
                {order.status === "Unpaid" && t[locale].unpaid}
                {order.status === "In realization" && t[locale].inRealization}
                {order.status === "Done" && t[locale].done}
              </p>
            </small>
          </span>
          <span>
            <small>
              <strong>{t[locale].orderDate}</strong>
              <p>{timeStampToDate(order.timeCreate).toLocaleString()}</p>
            </small>
          </span>
          <span>
            <small>
              <strong>{t[locale].orderID}</strong>
              <p>{order.id}</p>
            </small>
          </span>
        </div>

        {/* Payment details */}
        {order.paid && (
          <>
            <div className="w-100 opacity-50">
              <hr />
            </div>
            <div className={`d-flex gap-${isMobile ? "3" : "4"}`}>
              <span>
                <small>
                  <strong>{isMobile ? t[locale].amount : t[locale].amountLong}</strong>{" "}
                  <p>
                    {order.totalPrice}
                    <span className="text-uppercase ms-1">{order.currency}</span>
                  </p>
                </small>
              </span>
              <span>
                <small>
                  <strong>{isMobile ? t[locale].method : t[locale].methodLong}</strong>
                  <p className="text-uppercase">{order.paymentMethod}</p>
                </small>
              </span>
              <span>
                <small>
                  <strong>{t[locale].paymentDate}</strong> <p>{timeStampToDate(order.timePayment).toLocaleString()}</p>
                </small>
              </span>
              <span>
                <small>
                  <strong>{t[locale].paymentID}</strong>
                  <p style={{ maxWidth: `${isMobile ? "100px" : "200px"}`, overflowWrap: "break-word" }}>
                    {order.paymentID}
                  </p>
                </small>
              </span>
            </div>
          </>
        )}

        <div className="w-100 opacity-50">
          <hr />
        </div>

        {/* Client details */}
        <div className="d-flex gap-3">
          <span>
            <small>
              <strong>{t[locale].client}</strong> <p>{order.userName}</p>
            </small>
          </span>
          <span>
            <small>
              <strong>Email</strong>{" "}
              <p type="email" style={{ maxWidth: `${isMobile ? "120px" : "300px"}`, overflowWrap: "break-word" }}>
                {order.userEmail}
              </p>
            </small>
          </span>
          <span>
            <small>
              <strong>{t[locale].clientID}</strong>{" "}
              <p style={{ maxWidth: `${isMobile ? "120px" : "300px"}`, overflowWrap: "break-word" }}>{order.userID}</p>
            </small>
          </span>
        </div>

        {/* User Comments */}
        {order.userComments && (
          <>
            <p className="mb-0 mt-2">
              <strong>{t[locale].comments}</strong>
            </p>
            <div className="border rounded p-2">
              <p>
                <small>{order.userComments}</small>
              </p>
            </div>
          </>
        )}

        {/* Order items */}
        <div className="mt-3">
          <p>
            <strong>{t[locale].orderItems}</strong>
          </p>
          {order.items.map((item, idx) => (
            <Item key={idx} idx={idx} item={item} order={order} answersQt={answersQtFunc} />
          ))}
          <p className="text-end mt-3">
            {t[locale].total} {order.totalPrice}
            <span className="text-uppercase ms-1">{order.currency}</span>
          </p>
        </div>

        {/* Finish order Button */}
        {order.status == "Done" ? (
          <div className="text-end">
            <p className="fs-5">
              <strong>{t[locale].completed}</strong>
            </p>
          </div>
        ) : (
          <>
            {readyToFinish && (
              <div className="d-flex gap-3 justify-content-end align-items-center">
                <span className="fs-5">{t[locale].great} </span>
                <Button variant="primary" onClick={finishOrder} disabled={loading}>
                  {loading ? (
                    <>
                      <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                      <span> {t[locale].processing}</span>
                    </>
                  ) : (
                    <span> {t[locale].finishOrder} </span>
                  )}
                </Button>
              </div>
            )}
          </>
        )}
      </div>

      {showSuccess && (
        <SuccessModal
          msg={showSuccess}
          btn={t[locale].modalButton}
          closeFunc={() => {
            setShowSuccess("");
          }}
        />
      )}
    </>
  );
}

export default OrderDetails;
