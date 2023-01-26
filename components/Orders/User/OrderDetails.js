import React from "react";
import Item from "./Item";

function OrderDetails(props) {
  const timeStampToDate = (time) => {
    return new Date(time.seconds * 1000 + time.nanoseconds / 100000);
  };
  return (
    <div className="mt-4 mb-4 color-primary">
      {props.order.status == "Done" && (
        <div>
          <p>
            <strong>Completed:</strong> <u>{timeStampToDate(props.order.timeFinish).toLocaleString()}</u>
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
            <strong>Status</strong>
            <p>{props.order.status}</p>
          </small>
        </span>
        <span>
          <small>
            <strong>Order Date</strong>
            <p>{timeStampToDate(props.order.timeCreate).toLocaleString()}</p>
          </small>
        </span>
        <span>
          <small>
            <strong>Order ID</strong>
            <p>{props.order.id}</p>
          </small>
        </span>
      </div>

      <div className="w-100 opacity-50">
        <hr />
      </div>

      {/* Payment details */}
      {props.order.paid && (
        <div className={`d-flex gap-${props.isMobile ? "3" : "4"}`}>
          <span>
            <small>
              <strong>{props.isMobile ? "Amount" : "Amount Paid"}</strong> <p>{props.order.totalPrice},00 PLN</p>
            </small>
          </span>
          <span>
            <small>
              <strong>{props.isMobile ? "Method" : "Payment Method"}</strong>
              <p className="text-uppercase">{props.order.paymentMethod}</p>
            </small>
          </span>
          <span>
            <small>
              <strong>Payment Date</strong> <p>{timeStampToDate(props.order.timePayment).toLocaleString()}</p>
            </small>
          </span>
          <span>
            <small>
              <strong>Payment ID</strong>
              <p style={{ maxWidth: `${props.isMobile ? "100px" : "200px"}`, overflowWrap: "break-word" }}>
                {props.order.paymentID}
              </p>
            </small>
          </span>
        </div>
      )}

      {/* User Comments */}
      {props.order.userComments && (
        <>
          <p className="mb-0 mt-2">
            <strong>Your comments:</strong>
          </p>
          <div className="border rounded p-2">
            <p>
              <small>{props.order.userComments}</small>
            </p>
          </div>
        </>
      )}

      {/* Order items */}
      <div className="mt-4">
        <p>
          <strong>Order items:</strong>
        </p>
        {props.order.items.map((item, idx) => (
          <Item key={idx} idx={idx} item={item} order={props.order} />
        ))}
        <p className="text-end mt-3">Total: {props.order.totalPrice},00 PLN</p>
      </div>
    </div>
  );
}

export default OrderDetails;
