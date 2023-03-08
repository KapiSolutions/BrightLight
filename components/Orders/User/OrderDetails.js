import { useRouter } from "next/router";
import React from "react";
import Item from "./Item";

function OrderDetails(props) {
  const router = useRouter();
  const locale = router.locale;
  const order = props.order;

  const timeStampToDate = (time) => {
    return new Date(time.seconds * 1000 + time.nanoseconds / 100000);
  };

  const t = {
    en: {
      completed: "Completed:",
      status: "Status",
      unpaid: "Unpaid",
      inRealization: "In Realization",
      done: "Done",
      orderDate: "Order Date",
      orderID: "Order ID",
      paymentDate: "Date",
      paymentDateLong: "Payment Date",
      paymentID: "Payment ID",
      comments: "Your comments:",
      orderItems: "Order Items:",
      total: "Total:",
      amount: "Amount",
      method: "Method",
      amountLong: "Amount Paid",
      methodLong: "Payment Method",
    },
    pl: {
      completed: "Ukończono: ",
      status: "Status",
      unpaid: "Nieopłacone",
      inRealization: "W realizacji",
      done: "Gotowe",
      orderDate: "Data zamówienia",
      orderID: "Nr zamówienia",
      paymentDate: "Data",
      paymentDateLong: "Data płatności",
      paymentID: "Nr płatności",
      comments: "Uwagi do zamówienia:",
      orderItems: "Produkty:",
      total: "Razem:",
      amount: "Zapłacono",
      method: "Metoda",
      amountLong: "Zapłacono",
      methodLong: "Metoda płatności",
    },
  };
  return (
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
            <p>
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

      <div className="w-100 opacity-50">
        <hr />
      </div>

      {/* Payment details */}
      {order.paid && (
        <div className={`d-flex gap-${props.isMobile ? "3" : "4"}`}>
          <span>
            <small>
              <strong>{props.isMobile ? t[locale].amount : t[locale].amountLong}</strong>
              <p>
                {order.totalPrice}
                <span className="text-uppercase ms-1">{order.currency}</span>
              </p>
            </small>
          </span>
          <span>
            <small>
              <strong>{props.isMobile ? t[locale].method : t[locale].methodLong}</strong>
              <p className="text-uppercase">{order.paymentMethod}</p>
            </small>
          </span>
          <span>
            <small>
              <strong>{props.isMobile ? t[locale].paymentDate : t[locale].paymentDateLong}</strong>{" "}
              <p>{timeStampToDate(order.timePayment).toLocaleString()}</p>
            </small>
          </span>
          <span>
            <small>
              <strong>{t[locale].paymentID}</strong>
              <p style={{ maxWidth: `${props.isMobile ? "100px" : "200px"}`, overflowWrap: "break-word" }}>
                {order.paymentID}
              </p>
            </small>
          </span>
        </div>
      )}

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
      <div className="mt-4">
        <p>
          <strong>{t[locale].orderItems}</strong>
        </p>
        {order.items.map((item, idx) => (
          <Item key={idx} idx={idx} item={item} order={order} />
        ))}
        <p className="text-end mt-3">
          {t[locale].total} {order.totalPrice}
          <span className="text-uppercase ms-1">{order.currency}</span>
        </p>
      </div>
    </div>
  );
}

export default OrderDetails;
