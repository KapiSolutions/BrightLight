import React from "react";
import Item from "./Item";

function OrderDetails(props) {
  const order = props.order;
  const timeStampToDate = (time) => {
    return new Date(time.seconds * 1000 + time.nanoseconds / 100000);
  };
  return (
    <div className="mt-4 mb-4 color-primary">
      <div className="d-flex gap-4">
        <span>
          <small>
            <strong>Order ID</strong>
            <p>{order.id}</p>
          </small>
        </span>
        <span>
          <small>
            <strong>Status</strong>
            <p style={{whiteSpace: "nowrap"}}>{order.status}</p>
          </small>
        </span>
        <span>
          <small>
            <strong>Order Date</strong>
            <p>{timeStampToDate(order.timeCreate).toLocaleString()}</p>
          </small>
        </span>
      </div>

      <div className="w-100 opacity-50">
        <hr />
      </div>

      <div className={`d-flex gap-${props.isMobile ? "3" : "4"}`}>
        <span>
          <small>
            <strong>Payment ID</strong>
            <p style={{ maxWidth: `${props.isMobile ? "100px" : "200px"}`, overflowWrap: "break-word" }}>
              {order.paymentID}
            </p>
          </small>
        </span>
        <span>
          <small>
            <strong>{props.isMobile ? "Amount" : "Amount Paid"}</strong> <p>{order.totalPrice},00 PLN</p>
          </small>
        </span>
        <span>
          <small>
            <strong>{props.isMobile ? "Method" : "Payment Method"}</strong> <p>{order.paymentMethod}</p>
          </small>
        </span>
        <span>
          <small>
            <strong>Payment Date</strong> <p>{timeStampToDate(order.timePayment).toLocaleString()}</p>
          </small>
        </span>
      </div>

      <div className="w-100 opacity-50">
        <hr />
      </div>

      <div className="d-flex gap-3">
        <span>
          <small>
            <strong>Client</strong> <p>{order.userName}</p>
          </small>
        </span>
        <span>
          <small>
            <strong>Email</strong> <p>{order.userEmail}</p>
          </small>
        </span>
        <span>
          <small>
            <strong>Client ID</strong>{" "}
            <p style={{ maxWidth: `${props.isMobile ? "130px" : "300px"}`, overflowWrap: "break-word" }}>
              {order.userID}
            </p>
          </small>
        </span>
      </div>

      <div className="mt-4">
        <p>
          <strong>Order items:</strong>
        </p>
        {order.items.map((item, idx) => (
          <Item key={idx} idx={idx} item={item} order={order} />
        ))}
        <p className="text-end mt-3">Total: {order.totalPrice},00 PLN</p>
      </div>
    </div>
  );
}

export default OrderDetails;
