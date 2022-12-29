import React, { useState } from "react";
import Image from "next/image";
import axios from "axios";
import getStripe from "../utils/get-stripejs";
import { useAuth } from "../context/AuthProvider";
import { Badge, Button, Modal } from "react-bootstrap";
import { useRouter } from "next/router";
import { TbTrashX } from "react-icons/tb";
import { IoIosArrowForward } from "react-icons/io";
import { deleteDocInCollection } from "../firebase/Firestore";
import { useDeviceStore } from "../stores/deviceStore";

function UserOrderItem(props) {
  const router = useRouter();
  const isMobile = useDeviceStore((state) => state.isMobile);
  const { setErrorMsg, authUserFirestore, updateUserData } = useAuth();
  const [show, setShow] = useState(false);
  const cardsIcon = "/img/cards-light.png";

  async function handlePayment() {
    try {
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
    } catch (error) {
      console.log(error);
      setErrorMsg("Something went wrong, please try again later.");
      return;
    }
  }
  async function deleteOrder() {
    try {
      await deleteDocInCollection("orders", props.orders[props.idx].id);
      await updateUserData(authUserFirestore?.id, null, true); //update only orders
    } catch (error) {
      setErrorMsg("Something went wrong, please try again later.");
    }
  }

  const showDetails = () => {
    router.push({
      pathname: "/user/orders/[pid]",
      query: { pid: props.orders[props.idx].id },
      hash: "main",
    });
  };

  return (
    <>
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

      <div className="d-flex align-items-center text-start w-100">
        <div className="col-10 col-md-5 d-flex pointer" onClick={showDetails}>
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
              <span className="pointer Hover" onClick={showDetails}>
                Show details
              </span>
              {!props.orders[props.idx].paid && (
                <div className="d-flex flex-wrap mt-2 gap-3">
                  <Button
                    variant="outline-primary"
                    size="sm"
                    onClick={() => {
                      setShow(true);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button variant="primary" className="text-light" size="sm" onClick={handlePayment}>
                    Pay now
                  </Button>
                </div>
              )}
            </div>
          </>
        )}
        {isMobile && (
          <div className="col-2 text-center pointer" onClick={showDetails}>
            <IoIosArrowForward style={{ height: "25px", width: "25px" }} />
          </div>
        )}
      </div>
      <hr />

      {/* Modal which appears when user wants to cancel the order */}
      <Modal
        show={show}
        onHide={() => {
          setShow(false);
        }}
        centered
        animation={true}
        className="text-start"
      >
        <Modal.Header className="bg-secondary text-light" closeButton closeVariant="white">
          <Modal.Title>
            <TbTrashX className="mb-1 me-2" />
            Are you sure?
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          You are trying to cancel your order, after which all your tarot cards will be lost. Confirm or return to
          orders.
        </Modal.Body>
        <Modal.Footer>
          <Button
            className="me-3"
            variant="outline-secondary"
            onClick={() => {
              setShow(false);
            }}
          >
            Go Back
          </Button>
          <Button
            variant="secondary"
            onClick={() => {
              setShow(false);
              deleteOrder();
            }}
          >
            Cancel Order
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default UserOrderItem;
