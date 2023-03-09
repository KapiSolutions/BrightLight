import Image from "next/image";
import React, { useState } from "react";
import { useRouter } from "next/router";
import { Badge, Button, Spinner } from "react-bootstrap";
import { IoIosArrowForward } from "react-icons/io";
import styles from "../../styles/components/Users/OrderItem.module.scss";
import icon from "../../public/img/cards-light.png";
import { useDeviceStore } from "../../stores/deviceStore";

function OrderItem(props) {
  const order = props.order;
  const router = useRouter();
  const locale = router.locale;
  const theme = useDeviceStore((state) => state.themeState);
  const [showDetails, setShowDetails] = useState(false);
  const [loading, setLoading] = useState(false);

  const timeStampToDate = (time) => {
    return new Date(time.seconds * 1000 + time.nanoseconds / 100000);
  };

  const t = {
    en: {
      more: "more..",
      action: "Action",
      unpaid: "Unpaid",
      inRealization: "In Realization",
      done: "Done",
      orderID: "Order ID:",
      orderDate: "Creation Date:",
      paymentDate: "Payment Date:",
      completeDate: "Complete Date:",
      open: "Open in orders menager",
      redirecting: "Redirecting",
    },
    pl: {
      more: "więcej..",
      action: "Opcje",
      unpaid: "Nieopłacone",
      inRealization: "W realizacji",
      done: "Gotowe",
      orderID: "Nr Zamówienia:",
      orderDate: "Data Zamówienia:",
      paymentDate: "Data Płatności:",
      completeDate: "Data Ukończenia:",
      open: "Otwórz w panelu zamówień",
      redirecting: "Przekierowywanie",
    },
  };
  return (
    <div className={styles.OrderItem}>
      <div className={`text-${theme === "light" ? "dark" : "light"}`}>
        <div className={styles.OrderHeader}>
          <Image src={icon} width="58" height="58" alt="tarot cards" />
          <div onClick={() => setShowDetails(!showDetails)} className="pointer">
            <p className={styles.OrderItemName}>
              {order?.items[0].name[locale]}
              {order?.items.length > 1 && `, +${order?.items.length - 1} ${t[locale].more}`}
            </p>
            <div className="d-flex align-items-center gap-2">
              <p className={styles.OrderItemPrice}>
                <small>
                  {order.totalPrice}
                  <span className="text-uppercase ms-1">{order.currency}</span>
                </small>
              </p>
              <Badge
                bg={order.paid ? (order.status == "Done" ? "success" : "warning") : "primary"}
                className={order.status == "In realization" ? "text-dark" : ""}
              >
                {order.status === "Unpaid" && t[locale].unpaid}
                {order.status === "In realization" && t[locale].inRealization}
                {order.status === "Done" && t[locale].done}
              </Badge>
            </div>
          </div>
          <div className="pointer ms-auto" onClick={() => setShowDetails(!showDetails)}>
            <IoIosArrowForward
              style={{ height: "25px", width: "25px", transform: `rotate(${showDetails ? "90" : "0"}deg)` }}
            />
          </div>
        </div>
        {showDetails && (
          <div className="w-100">
            <div className="w-100 opacity-50">
              <hr />
            </div>

            <div>
              <p>
                <small>
                  <strong>{t[locale].orderID}</strong> {order.id}
                </small>
                <br />
                <small>
                  <strong>{t[locale].orderDate}</strong> {timeStampToDate(order.timeCreate).toLocaleString()}
                </small>
                {order.paid && (
                  <>
                    <br />
                    <small>
                      <strong>{t[locale].paymentDate}</strong> {timeStampToDate(order.timePayment).toLocaleString()}
                    </small>
                    {order.status == "Done" && (
                      <>
                        <br />
                        <small>
                          <strong>{t[locale].completeDate}</strong> {timeStampToDate(order.timeFinish).toLocaleString()}
                        </small>
                      </>
                    )}
                  </>
                )}
              </p>
              <div className="ms-2"></div>
            </div>

            <div className="w-100 opacity-50">
              <hr />
            </div>

            {/* Footer control buttons */}
            <div className="text-end mb-2">
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  router.push({
                    pathname: "/admin/orders",
                    hash: "main",
                    query: { id: order.id },
                  });
                  setLoading(true);
                }}
              >
                {loading ? (
                  <span>
                    {t[locale].redirecting}{" "}
                    <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                  </span>
                ) : (
                  <span>{t[locale].open}</span>
                )}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default OrderItem;
