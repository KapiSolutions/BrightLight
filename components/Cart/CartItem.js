import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthProvider";
import { Card, Button, Spinner, FloatingLabel, Form } from "react-bootstrap";
import { TbTrashX, TbArrowBackUp } from "react-icons/tb";
import { AiOutlineEdit, AiOutlineSave } from "react-icons/ai";
import { IoIosArrowForward } from "react-icons/io";
import styles from "../../styles/components/Cart/CartItem.module.scss";
import { getFileUrlStorage } from "../../firebase/Storage";

function CartItem(props) {
  const { authUserFirestore, updateProfile } = useAuth();
  const [showDetails, setShowDetails] = useState(false);
  const [loading, setLoading] = useState(false);
  const [edit, setEdit] = useState(false);
  const [loadingEdit, setLoadingEdit] = useState(false);
  const item = authUserFirestore.cart[props.idx];

  // Get url's for the item images
  useEffect(() => {
    getFileUrlStorage("images/cards", item.image)
      .then((url) => {
        const img = document.getElementById(`img-${props.idx.toString()}`);
        img.setAttribute("src", url);
      })
      .catch((error) => console.log(error));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function deleteItem(item) {
    try {
      setLoading(true);
      let cart = [...authUserFirestore.cart];
      cart.splice(item, 1);

      await updateProfile({ cart: cart });
      setLoading(false);
    } catch (e) {
      console.log(e);
      setLoading(false);
    }
  }
  async function handleEdit() {
    try {
      setLoadingEdit(true);
      const question = document.getElementById("questionFieldEdit").value;
      let cart = [...authUserFirestore.cart];
      cart[props.idx].question = question;

      await updateProfile({ cart: cart });
    } catch (e) {
      console.log(e);
    }
    setEdit(false);
    setLoadingEdit(false);
  }
  return (
    <div className={styles.OrderItem}>
      <div className={styles.OrderHeader}>
        <Card.Img
          className={styles.OrderImg}
          src="/img/placeholders/cartImage.webp"
          id={`img-${props.idx}`}
          alt="Item icon"
        />
        <div>
          <p className={styles.OrderItemName}>{item.name}</p>
          <p className={styles.OrderItemPrice}>
            <small>{item.price},00 PLN</small>
          </p>
        </div>
        <div
          className="pointer ms-auto"
          onClick={() => {
            setShowDetails(!showDetails);
            setEdit(false);
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
            <p className="mb-0">Your cards:</p>
            <div className="ms-2">
              <small>
                {Array.from({ length: item.cards.length }).map((_, idx) => (
                  <li key={idx} style={{ display: "inline", listStyleType: "none" }}>
                    {idx + 1}. {item.cards[idx]}{" "}
                  </li>
                ))}
              </small>
            </div>
          </div>

          <div className="w-100 opacity-50">
            <hr />
          </div>

          <div>
            <p className="mb-0">Your Question:</p>
            <div className="ms-2">
              {!edit && (
                <p>
                  <small>{item.question}</small>
                </p>
              )}

              {edit && (
                <>
                  <Form.Control
                    as="textarea"
                    id="questionFieldEdit"
                    defaultValue={item.question}
                    style={{ minHeight: "100px" }}
                    className="mt-2 text-dark"
                    autoFocus
                  />
                </>
              )}
            </div>
          </div>

          <div className="w-100 opacity-50">
            <hr />
          </div>

          {/* Footer control buttons */}
          <div className="text-end mb-2">
            {!edit && (
              <Button
                variant={`outline-${props.theme == "light" ? "dark" : "light"}`}
                size="sm"
                className="me-3 w-25"
                onClick={() => {
                  setEdit(true);
                }}
              >
                <AiOutlineEdit className={styles.icons} />
              </Button>
            )}
            {edit && (
              <>
                <Button
                  variant={`outline-${props.theme == "light" ? "dark" : "accent4"}`}
                  size="sm"
                  className="me-3 w-25"
                  onClick={() => {
                    setEdit(false);
                  }}
                >
                  <TbArrowBackUp className={styles.icons} />
                </Button>
                <Button
                  variant={`outline-${props.theme == "light" ? "dark" : "accent4"}`}
                  size="sm"
                  className="me-3 w-25"
                  onClick={() => {
                    handleEdit();
                  }}
                >
                  {loadingEdit ? (
                    <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                  ) : (
                    <AiOutlineSave className={styles.icons} />
                  )}
                </Button>
              </>
            )}
            <Button
              variant="primary"
              size="sm"
              className="w-25"
              onClick={() => {
                deleteItem(props.idx);
              }}
              disabled={loading}
            >
              {loading ? (
                <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
              ) : (
                <TbTrashX className={styles.icons} />
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default CartItem;
