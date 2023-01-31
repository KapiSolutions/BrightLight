import Image from "next/image";
import React, { useState } from "react";
import { Badge, Button } from "react-bootstrap";
import { IoIosArrowForward } from "react-icons/io";
import styles from "../../styles/components/Users/OrderItem.module.scss";
import icon from "../../public/img/cards-light.png";
import { useDeviceStore } from "../../stores/deviceStore";

function OrderItem(props) {
  const order = props.order;
  const theme = useDeviceStore((state) => state.themeState);
  const [showDetails, setShowDetails] = useState(false);

  const timeStampToDate = (time) => {
    return new Date(time.seconds * 1000 + time.nanoseconds / 100000);
  };
  return (
    <div className={styles.OrderItem}>
      <div className={`text-${theme === "light" ? "dark" : "light"}`}>
        <div className={styles.OrderHeader}>
          <Image src={icon} width="58" height="58" alt="tarot cards"/>
          <div>
            <p className={styles.OrderItemName}>
              {order?.items[0].name}
              {order?.items.length > 1 && `, +${order?.items.length - 1} more..`}
            </p>
            <div className="d-flex align-items-center gap-2">
              <p className={styles.OrderItemPrice}>
                <small>{order.totalPrice},00 PLN</small>
              </p>
              <Badge bg={order.paid ? "warning" : "primary"} className={order.paid ? "text-dark" : ""}>
                {order.status}
              </Badge>
            </div>
          </div>
          <div
            className="pointer ms-auto"
            onClick={() => {
              setShowDetails(!showDetails);
            }}
          >
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
                  <strong>Order ID:</strong> {order.id}
                </small>
                <br />
                <small>
                  <strong>Creation Date:</strong> {timeStampToDate(order.timeCreate).toLocaleString()}
                </small>
                {order.paid && (
                  <>
                    <br />
                    <small>
                      <strong>Creation Date:</strong> {timeStampToDate(order.timePayment).toLocaleString()}
                    </small>
                    {order.status == "Done" && (
                      <>
                        <br />
                        <small>
                          <strong>Creation Date:</strong> {timeStampToDate(order.timeFinish).toLocaleString()}
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
              <Button variant="primary" size="sm" onClick={() => {}}>
                Open in orders menager
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default OrderItem;
