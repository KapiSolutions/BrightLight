import React, { useState, useEffect } from "react";
import Image from "next/image";
import axios from "axios";
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

function Order(props) {
  const router = useRouter();
  const order = props.order;
  const isMobile = useDeviceStore((state) => state.isMobile);
  const { setErrorMsg, authUserFirestore, updateUserData } = useAuth();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [loading, setLoading] = useState(undefined);
  const [showDetails, setShowDetails] = useState(false);
  const [timeRemains, setTimeRemains] = useState("");

  const timeStampToDate = (time) => {
    return new Date(time.seconds * 1000 + time.nanoseconds / 100000);
  };

  async function deleteOrder() {
    try {
      await deleteDocInCollection("orders", order.id);
      await updateUserData(authUserFirestore?.id, null, true); //update only orders
      setShowConfirmModal({ msg: "", itemID: "" });
    } catch (error) {
      setShowConfirmModal({ msg: "", itemID: "" });
      setErrorMsg("Something went wrong, please try again later.");
    }
  }

  const showDetailsFunc = () => {
    setShowDetails(!showDetails);
  };

  useEffect(() => {
    //if paid then count from the payment time, if not then count from the order creation time
    const startDate = order.paid ? timeStampToDate(order.timePayment) : timeStampToDate(order.timeCreate);
    const endDate = new Date()
    const msInHour = 1000 * 60 * 60;
    const diff = (endDate.getTime() - startDate.getTime())/ msInHour;
    setTimeRemains(Math.round(diff))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  
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
                    {" "}
                    ({order?.items[0].name}
                    {order?.items.length > 1 && `, +${order?.items.length - 1} more..`})
                  </small>
                </p>
                {order.status != "Done" ? (
                  <div className="d-flex align-items-center">
                  <Badge bg={order.paid ? "warning" : "primary"} className={order.paid ? "text-dark" : ""}>
                    {order.status}
                  </Badge>
                  <div className="ms-2">
                    <span>
                      <small className="me-1">Left..<strong>{timeRemains}H</strong></small>
                      <BsClockHistory />
                    </span>
                  </div>
                  </div>
                ) : (
                  <Badge bg="success">{order.status}!</Badge>
                )}
              </>
            ) : (
              <>
                <p className="mb-0">
                  Tarot ({order?.items[0].name}
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
                    <span>
                      <small className="me-2">Remains: <strong>{timeRemains}H</strong></small>
                      <BsClockHistory />
                    </span>
                  </div>
                </div>
              ) : (
                <Badge bg="success">{order.status}!</Badge>
              )}
            </div>
            <div className="col-2">{order.totalPrice} PLN</div>
            <div className="col-2">
              <span className="pointer Hover" onClick={showDetailsFunc}>
                {showDetails ? "Hide details" : "Show details"}
              </span>

              {false && (
                <div className="d-flex flex-wrap mt-2 gap-3">
                  <Button
                    variant="outline-primary"
                    size="sm"
                    onClick={() => {
                      setShowConfirmModal({
                        msg: "You are trying to cancel your order, after which all your tarot cards will be lost. Confirm or return to orders.",
                        itemID: "",
                      });
                    }}
                  >
                    Cancel
                  </Button>
                  <Button variant="primary" className="text-light" size="sm" disabled={loading}>
                    {loading ? (
                      <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                    ) : (
                      "Pay now"
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
            {isMobile && !order.paid && false && (
              <div className="d-flex mt-3 mb-5 justify-content-between gap-4">
                <div className="d-flex gap-3 ms-2">
                  <Button
                    variant="outline-primary"
                    size="sm"
                    onClick={() => {
                      setShowConfirmModal({
                        msg: "You are trying to cancel your order, after which all your tarot cards will be lost. Confirm or return to orders.",
                        itemID: "",
                      });
                    }}
                  >
                    Cancel
                  </Button>
                  <Button variant="primary" className="text-light" size="sm" disabled={loading}>
                    {loading ? (
                      <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                    ) : (
                      "Pay now"
                    )}
                  </Button>
                </div>
                <span>Total: {order.totalPrice},00 PLN</span>
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
