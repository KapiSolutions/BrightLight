import React, { useState, useRef } from "react";
import Image from "next/image";
import axios from "axios";
import getStripe from "../utils/get-stripejs";
import { useAuth } from "../context/AuthProvider";
import { Badge, Button, Modal, Form, InputGroup } from "react-bootstrap";
import { useRouter } from "next/router";
import { TbTrashX } from "react-icons/tb";
import { IoIosArrowForward } from "react-icons/io";
import { FiSearch } from "react-icons/fi";
import { BsFilterRight } from "react-icons/bs";
import { deleteDocInCollection } from "../firebase/Firestore";
import { useDeviceStore } from "../stores/deviceStore";

function UserOrderItem(props) {
  const router = useRouter();
  const searchOrderRef = useRef();
  const isMobile = useDeviceStore((state) => state.isMobile);
  const { setErrorMsg, authUserFirestore, updateUserData } = useAuth();
  const [show, setShow] = useState(false);
  const cardsIcon = "/img/cards-light.png";

  async function handlePayment() {
    try {
      //prepare stripe product data
      const stripeCart = props.orders[props.idx].items.map((_, idx) => ({
        price: props.orders[props.idx].items[idx].s_id,
        quantity: 1,
      }));

      const orderData = {
        orderID: props.orders[props.idx].id,
        stripeCart: stripeCart,
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
              <div className="text-start mb-4">
                <FiSearch style={{ position: "relative", top: "59px", left: "11px", width: "20px", height: "20px" }} />
                <Form className="text-start d-flex gap-4">
                  <Form.Group controlId="findOrder" className="col-3">
                    <Form.Label className="mb-0">
                      <small>
                        <strong>Find order</strong>
                      </small>
                    </Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Find order by id"
                      ref={searchOrderRef}
                      style={{ paddingLeft: "40px" }}
                    />
                  </Form.Group>
                  <Form.Group controlId="filterByDate" className="col-2">
                    <Form.Label className="mb-0">
                      <small>
                        <strong>Filter by date</strong>
                      </small>
                    </Form.Label>
                    <Form.Select type="text" placeholder="Find order by id" ref={searchOrderRef}>
                      <option>All dates</option>
                      <option>Last 30 days</option>
                      <option>Last 60 days</option>
                      <option>Last 120 days</option>
                      <option>2022</option>
                    </Form.Select>
                  </Form.Group>
                  <Form.Group controlId="filterByType" className="col-2">
                    <Form.Label className="mb-0">
                      <small>
                        <strong>Filter by type</strong>
                      </small>
                    </Form.Label>
                    <Form.Select type="text" placeholder="Find order by id" ref={searchOrderRef}>
                      <option>All orders</option>
                      <option>Waiting for payment</option>
                      <option>In realization</option>
                      <option>Complete</option>
                    </Form.Select>
                  </Form.Group>
                  <Form.Group controlId="sortBy" className="col-2">
                    <Form.Label className="mb-0">
                      <small>
                        <strong>Sort orders</strong>
                      </small>
                    </Form.Label>
                    <Form.Select type="text" placeholder="Find order by id" ref={searchOrderRef}>
                      <option>Creation date</option>
                      <option>Total price</option>
                    </Form.Select>
                  </Form.Group>
                </Form>
              </div>
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
          {isMobile && (
            <div className="text-start">
              <FiSearch style={{ position: "relative", top: "32px", left: "11px", width: "20px", height: "20px" }} />
              <Form className="text-start d-flex">
                <Form.Control
                  type="text"
                  placeholder="Find order by id"
                  ref={searchOrderRef}
                  style={{ paddingLeft: "40px" }}
                  className="w-100"
                  title="Filter"
                />
                <InputGroup.Text className="pointer border ">
                  <BsFilterRight style={{ width: "20px", height: "20px" }} />
                </InputGroup.Text>
              </Form>
            </div>
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
                <Badge
                  bg={props.orders[props.idx].paid ? "warning" : "primary"}
                  className={props.orders[props.idx].paid ? "text-dark" : ""}
                >
                  {props.orders[props.idx].status}
                </Badge>
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
              <Badge
                bg={props.orders[props.idx].paid ? "warning" : "primary"}
                className={props.orders[props.idx].paid ? "text-dark" : ""}
              >
                {props.orders[props.idx].status}
              </Badge>
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
