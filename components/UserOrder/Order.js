import React, { useState } from "react";
import Image from "next/image";
import axios from "axios";
import getStripe from "../../utils/get-stripejs";
import { useAuth } from "../../context/AuthProvider";
import { Badge, Button, Modal, Spinner } from "react-bootstrap";
import { useRouter } from "next/router";
import { TbTrashX } from "react-icons/tb";
import { IoIosArrowForward } from "react-icons/io";
import { deleteDocInCollection } from "../../firebase/Firestore";
import { useDeviceStore } from "../../stores/deviceStore";
import OrderDetails from "./OrderDetails";
import ConfirmActionModal from "../Modals/ConfirmActionModal";

function Order(props) {
  const router = useRouter();
  const isMobile = useDeviceStore((state) => state.isMobile);
  const { setErrorMsg, authUserFirestore, updateUserData } = useAuth();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [loading, setLoading] = useState(undefined);
  const [showDetails, setShowDetails] = useState(false);
  const cardsIcon = "/img/cards-light.png";

  async function handlePayment() {
    try {
      setLoading(true);
      const localeLanguage = window.navigator.userLanguage || window.navigator.language; //to display the date in the email in the client's language format
      const localeTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone; //to display the date in the email in the client's time zone

      //prepare stripe product data
      const stripeCart = props.orders[props.idx].items.map((_, idx) => ({
        price: props.orders[props.idx].items[idx].s_id,
        quantity: 1,
      }));

      const orderData = {
        sendOrderConfirmEmail: false,
        orderID: props.orders[props.idx].id,
        stripeCart: stripeCart,
        localeLanguage: localeLanguage,
        localeTimeZone: localeTimeZone,
      };

      //start checkoutSession
      const checkoutSession = await axios.post("/api/stripe/checkout_session", orderData);
      if (checkoutSession.statusCode === 500) {
        console.error(checkoutSession.message);
        return;
      }
      router.push(checkoutSession.data.url);
      // Redirect to checkout
      const stripe = await getStripe();
      const { error } = await stripe.redirectToCheckout({ sessionId: checkoutSession.data.id });
      console.warn(error.message);
      if (error) {
        setErrorMsg("Something went wrong, please try again later.");
      }
      setLoading(undefined);
    } catch (error) {
      console.log(error);
      setErrorMsg("Something went wrong, please try again later.");
      setLoading(undefined);
      return;
    }
  }
  async function deleteOrder() {
    try {
      await deleteDocInCollection("orders", props.orders[props.idx].id);
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
                    ({props.orders[props.idx]?.items[0].name}
                    {props.orders[props.idx]?.items.length > 1 &&
                      `, +${props.orders[props.idx]?.items.length - 1} more..`}
                    )
                  </small>
                </p>
                {props.orders[props.idx].status != "Done" ? (
                  <Badge
                    bg={props.orders[props.idx].paid ? "warning" : "primary"}
                    className={props.orders[props.idx].paid ? "text-dark" : ""}
                  >
                    {props.orders[props.idx].status}
                  </Badge>
                ) : (
                  <Badge bg="success">{props.orders[props.idx].status}!</Badge>
                )}
              </>
            ) : (
              <>
                <p className="mb-0">
                  Tarot ({props.orders[props.idx]?.items[0].name}
                  {props.orders[props.idx]?.items.length > 1 &&
                    `, +${props.orders[props.idx]?.items.length - 1} more..`}
                  )
                </p>
                <small className="text-muted">{props.orders[props.idx].id}</small>
              </>
            )}
          </div>
        </div>

        {!isMobile && (
          <>
            <div className="col-3 text-uppercase">
              {props.orders[props.idx].status != "Done" ? (
                <Badge
                  bg={props.orders[props.idx].paid ? "warning" : "primary"}
                  className={props.orders[props.idx].paid ? "text-dark" : ""}
                >
                  {props.orders[props.idx].status}
                </Badge>
              ) : (
                <Badge bg="success">{props.orders[props.idx].status}!</Badge>
              )}
            </div>
            <div className="col-2">{props.orders[props.idx].totalPrice} PLN</div>
            <div className="col-2">
              <span className="pointer Hover" onClick={showDetailsFunc}>
                {showDetails ? "Hide details" : "Show details"}
              </span>
              {!props.orders[props.idx].paid && (
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
                  <Button variant="primary" className="text-light" size="sm" onClick={handlePayment} disabled={loading}>
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

        {/* Details of the order */}
        {showDetails && (
          <div className="w-100">
            {isMobile && !props.orders[props.idx].paid && (
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
                  <Button variant="primary" className="text-light" size="sm" onClick={handlePayment} disabled={loading}>
                    {loading ? (
                      <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                    ) : (
                      "Pay now"
                    )}
                  </Button>
                </div>
                <span>Total: {props.orders[props.idx].totalPrice},00 PLN</span>
              </div>
            )}
            {/* Order Details */}
            <OrderDetails order={props.orders[props.idx]} isMobile={isMobile} />

            <div className="text-center mt-4 mb-4">
              <Button variant="outline-accent4" className="pointer" onClick={showDetailsFunc}>
                Hide details
              </Button>
            </div>
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
