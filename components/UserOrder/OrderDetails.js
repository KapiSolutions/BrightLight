import React from "react";
import Item from "./Item";

function OrderDetails(props) {
  return (
    <div className="mt-4 mb-4 color-primary">
      <div className="d-flex gap-4">
        <span>
          <small>
            <strong>Order ID</strong>
            <p>{props.order.id}</p>
          </small>
        </span>
        <span>
          <small>
            <strong>Order status</strong>
            <p>{props.order.status}</p>
          </small>
        </span>
        <span>
          <small>
            <strong>Order Date</strong>
            <p>{props.order.timeCreate.toDate().toLocaleString()}</p>
          </small>
        </span>
      </div>
      {props.order.paid && (
        <div className={`d-flex gap-${props.isMobile ? "3" : "4"}`}>
          <span>
            <small>
              <strong>Payment ID</strong>
              <p style={{ maxWidth: `${props.isMobile ? "100px" : "200px"}`, overflowWrap: "break-word" }}>
                {props.order.paymentID}
              </p>
            </small>
          </span>
          <span>
            <small>
              <strong>{props.isMobile ? "Amount" : "Amount Paid"}</strong> <p>{props.order.totalPrice},00 PLN</p>
            </small>
          </span>
          <span >
            <small>
              <strong>{props.isMobile ? "Method" : "Payment Method"}</strong> <p>{props.order.paymentMethod}</p>
            </small>
          </span>
          <span>
            <small>
              <strong>Payment Date</strong> <p>{props.order.timePayment.toDate().toLocaleString()}</p>
            </small>
          </span>
        </div>
      )}

      <div className="mt-4">
        <p>
          <strong>Order items:</strong>
        </p>
        {props.order.items.map((item, idx) => (
          <Item key={idx} idx={idx} item={item} order={props.order}/>
        ))}
        <p className="text-end mt-3">Total: {props.order.totalPrice},00 PLN</p>
      </div>
    </div>
  );
}

export default OrderDetails;
