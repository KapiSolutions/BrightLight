import React, { useState, useEffect } from "react";
import Image from "next/image";
import axios from "axios";
import { useAuth } from "../../../context/AuthProvider";
import { Badge, Button, Spinner } from "react-bootstrap";
import { useRouter } from "next/router";
import { IoIosArrowForward } from "react-icons/io";
import { IoCheckmarkDone } from "react-icons/io5";
import { deleteDocInCollection, updateDocFields } from "../../../firebase/Firestore";
import { useDeviceStore } from "../../../stores/deviceStore";
import OrderDetails from "./OrderDetails";
import ConfirmActionModal from "../../Modals/ConfirmActionModal";
import cardsIcon from "../../../public/img/cards-light.png";
import { BsClockHistory } from "react-icons/bs";
import { MdOutlineNotificationsActive } from "react-icons/md";
import { getFileUrlStorage } from "../../../firebase/Storage";
import appConfig from "../../../config/appConfig";

function Order(props) {
  const router = useRouter();
  const locale = router.locale;
  const order = props.order;
  const config = appConfig();
  const isMobile = useDeviceStore((state) => state.isMobile);
  const [tmpOrder, setTmpOrder] = useState(null);
  const { setErrorMsg } = useAuth();
  const [errorEmail, setErrorEmail] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [loading, setLoading] = useState(false); //used for notification sending
  const [showDetails, setShowDetails] = useState(false);
  const [timeOver, setTimeOver] = useState(false);
  const [notificationSended, setNotificationSended] = useState(false);
  const [paymentDisabled, setPaymentDisabled] = useState(false);
  //paymentDisabled: user have an extra [x] hours for payment after getting an notification, after that time the payment isn't available -> admin can safely delete the order

  const timeStampToDate = (time) => {
    return new Date(time.seconds * 1000 + time.nanoseconds / 100000);
  };

  useEffect(() => {
    if (order.notificationTime || tmpOrder?.notificationTime) {
      setNotificationSended(true);
    } else {
      setNotificationSended(false);
      setPaymentDisabled(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function deleteOrder() {
    try {
      await deleteDocInCollection("orders", order.id);
      //send email to the client due to order cancellation
      await sendEmail({ orderID: order.id, userName: order.userName, userEmail: order.userEmail, language: order.language});
      setShowConfirmModal({ msg: "", itemID: "" });
      props.refresh(); //refresh the order list
    } catch (error) {
      console.log(error);
      setShowConfirmModal({ msg: "", itemID: "" });
      setErrorMsg("Something went wrong, please try again later.");
    }
  }

  const sendEmail = async (data) => {
    const payload = {
      secret: process.env.NEXT_PUBLIC_API_KEY,
      data: data,
      type: "orderCancelled",
    };
    try {
      await axios.post("/api/email/", payload);
      setErrorEmail(false);
    } catch (error) {
      console.log(error);
      setErrorEmail(true);
      setErrorMsg("Order deleted but an error occurred during sending an email to the client.");
    }
  };

  const sendNotification = async () => {
    setLoading(true);
    try {
      let items = [];
      await Promise.all(
        order.items.map(async (item) => {
          items.push(...items, {
            name: item.name[locale],
            price: item.price[order.currency].amount,
            currency: order.currency,
            image: await getFileUrlStorage(`images/products/${item.product_id}`, item.image.name),
          });
        })
      );

      const data = {
        orderID: order.id,
        userName: order.userName,
        userEmail: order.userEmail,
        totalPrice: order.totalPrice,
        currency: order.currency,
        language: order.language,
        items: items,
        timeCreate: timeStampToDate(order.timeCreate).toLocaleDateString(),
      };
      const payload = {
        secret: process.env.NEXT_PUBLIC_API_KEY,
        data: data,
        type: "unpaidNotification",
      };

      await axios.post("/api/email/", payload);

      const updatedOrder = await updateDocFields("orders", order.id, { notificationTime: new Date() });
      setTmpOrder(updatedOrder);
      setNotificationSended(true);
    } catch (error) {
      console.log(error);
      setErrorMsg("An error occurred during sending an email to the client.");
    }
    setLoading(false);
  };

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
    const startDate = order.notificationTime
      ? timeStampToDate(order.notificationTime)
      : timeStampToDate(tmpOrder.notificationTime);
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
                  <strong>Order</strong>
                </div>
                <div className="col-3">
                  <strong>Status</strong>
                </div>
                <div className="col-2">
                  <strong>Total</strong>
                </div>
                <div className="col-2">
                  <strong>Action</strong>
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
                    ({order?.items[0].name[locale]}
                    {order?.items.length > 1 && `, +${order?.items.length - 1} more..`})
                  </small>
                </p>
                {order.status != "Done" ? (
                  <div className="d-flex align-items-center">
                    <Badge bg={order.paid ? "warning" : "primary"} className={order.paid ? "text-dark" : ""}>
                      {order.status}
                    </Badge>
                    <div className="ms-2">
                      {paymentDisabled ? (
                        <small className="me-2 text-success text-uppercase">Delete the order.</small>
                      ) : (
                        <span className={timeOver ? "text-danger" : ""}>
                          <small className="me-1">
                            {order.paid
                              ? timeOver
                                ? "Hurry up! "
                                : "Finish in: "
                              : timeOver
                              ? notificationSended
                                ? "Extra time: "
                                : "Time's up: "
                              : "Deadline: "}
                            <strong>{remainingTime()}H</strong>
                          </small>
                          <BsClockHistory />
                        </span>
                      )}
                    </div>
                  </div>
                ) : (
                  <Badge bg="success">{order.status}!</Badge>
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
                <div>
                  <Badge bg={order.paid ? "warning" : "primary"} className={order.paid ? "text-dark" : ""}>
                    {order.status}
                  </Badge>
                  <div className="ms-1">
                    <span className={timeOver ? "text-danger" : ""}>
                      {paymentDisabled ? (
                        <small className="me-2 text-success">You can delete the order.</small>
                      ) : (
                        <>
                          <small className="me-1">
                            {order.paid
                              ? timeOver
                                ? "Hurry up! "
                                : "Finish in: "
                              : timeOver
                              ? notificationSended
                                ? "Extra time: "
                                : "Time's up: "
                              : "Deadline: "}
                            <strong>{remainingTime()}H</strong>
                          </small>
                          <BsClockHistory />
                        </>
                      )}
                    </span>
                  </div>
                </div>
              ) : (
                <Badge bg="success">{order.status}!</Badge>
              )}
            </div>
            <div className="col-2">
              {order.totalPrice}
              <span className="text-uppercase ms-1">{order.currency}</span>
            </div>
            <div className="col-2">
              <span className="pointer Hover" onClick={showDetailsFunc}>
                {showDetails ? "Hide details" : "Show details"}
              </span>

              {timeOver && !order.paid && (
                <div className="d-flex align-items-center mt-2 gap-3">
                  <Button
                    variant={`outline-${paymentDisabled ? "success" : "primary"}`}
                    title={paymentDisabled ? "You can safely delete an Order" : "Delete an Order"}
                    size="sm"
                    onClick={() => {
                      setShowConfirmModal({
                        msg: "You are trying to delete this order. Please confirm.",
                        itemID: "",
                      });
                    }}
                  >
                    Delete
                  </Button>
                  <Button
                    variant={notificationSended ? "success" : "primary"}
                    className="text-light"
                    size="sm"
                    disabled={loading || notificationSended || order.notificationTime}
                    title="Send email notification to the client."
                    onClick={sendNotification}
                  >
                    {notificationSended || order.notificationTime ? (
                      <div className="d-flex align-items-center">
                        Sended
                        <IoCheckmarkDone />
                      </div>
                    ) : (
                      <>
                        {loading ? (
                          <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                        ) : (
                          <span>
                            Email <MdOutlineNotificationsActive />
                          </span>
                        )}
                      </>
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

        {/* Details actions on Mobile */}
        {showDetails && (
          <div className="w-100">
            {/* Mobile actions */}
            {isMobile && !order.paid && timeOver && (
              <div className="d-flex mt-4 mb-4 justify-content-end gap-4">
                <Button
                  variant={`outline-${paymentDisabled ? "success" : "primary"}`}
                  size="sm"
                  onClick={() => {
                    setShowConfirmModal({
                      msg: "You are trying to delete this order. Please confirm.",
                      itemID: "",
                    });
                  }}
                >
                  Delete Order
                </Button>
                <Button
                  variant={notificationSended ? "success" : "primary"}
                  className="text-light"
                  size="sm"
                  onClick={sendNotification}
                  disabled={loading || notificationSended || order.notificationTime}
                >
                  {notificationSended || order.notificationTime ? (
                    <div className="d-flex gap-1 align-items-center">
                      Notification sended
                      <IoCheckmarkDone />
                    </div>
                  ) : (
                    <>
                      {loading ? (
                        <span>
                          Sending <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                        </span>
                      ) : (
                        <span>
                          Send notification <MdOutlineNotificationsActive />
                        </span>
                      )}
                    </>
                  )}
                </Button>
              </div>
            )}

            {/* Order Details */}
            <OrderDetails order={order} isMobile={isMobile} refresh={props.refresh} />
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
