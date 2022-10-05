import React, { useState } from "react";
import { useAuth } from "../context/AuthProvider";
import { Card, Button, Spinner, FloatingLabel, Form } from "react-bootstrap";
import { TbTrashX, TbArrowBackUp } from "react-icons/tb";
import { AiOutlineEdit, AiOutlineSave } from "react-icons/ai";
import styles from "../styles/components/CartItem.module.scss";
import { async } from "@firebase/util";

function CartItem(props) {
  const { authUserFirestore, updateProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [fullDesc, setfullDesc] = useState(false);
  const [edit, setEdit] = useState(false);
  const [loadingEdit, setLoadingEdit] = useState(false);
  const truncLength = 100;

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
    setLoadingEdit(true)
    try {

    }catch (e) {
        console.log(e)
    }
    setEdit(false);
    setfullDesc(false);
    setLoadingEdit(false)
  }
  return (
    <Card
      className={`
              bg-bg${props.theme} 
              text-${props.theme == "light" ? "dark" : "light"} 
              border-${props.theme == "light" ? "dark" : "accent4"}  
              shadow-sm mb-3
              `}
    >
      <Card.Body className="pt-1 pb-2">
        <Card.Text className="color-primary mb-0">
          <p className="fs-4 mb-0">{authUserFirestore.cart[props.idx].name}</p>
        </Card.Text>
        <section className="pointer" onClick={() => !edit && setfullDesc(!fullDesc)}>
          <p className="mt-0 mb-0">
            <small>
              <i>
                {!edit && (
                  <>
                    {fullDesc ? (
                      <>&quot;{authUserFirestore.cart[props.idx].question}&quot;</>
                    ) : (
                      <>&quot;{authUserFirestore.cart[props.idx].question.substring(0, truncLength)}...&quot;</>
                    )}
                  </>
                )}
              </i>
            </small>
          </p>
          {edit && (
            <>
              <FloatingLabel label="Your Question:">
                <Form.Control
                  as="textarea"
                  id="questionFieldEdit"
                  defaultValue={authUserFirestore.cart[props.idx].question}
                  style={{ minHeight: "150px" }}
                  className="mt-2"
                  required
                />
              </FloatingLabel>
            </>
          )}
          {fullDesc && (
            <>
              <p>
                <small>Your cards:</small>
              </p>
              <ul>
                <small>
                  {Array.from({ length: authUserFirestore.cart[props.idx].cards.length }).map((_, idx) => (
                    <li key={idx} className={styles.cardList}>
                      {idx + 1}. {authUserFirestore.cart[props.idx].cards[idx]}
                    </li>
                  ))}
                </small>
              </ul>
            </>
          )}
        </section>
        <p className="mb-0 text-end">{authUserFirestore.cart[props.idx].price} PLN</p>
      </Card.Body>

      <Card.Footer className={`border-${props.theme == "light" ? "dark" : "accent4"} text-end`}>
        {!edit && (
          <Button
            variant={`outline-${props.theme == "light" ? "dark" : "accent4"}`}
            size="sm"
            className="me-3 w-25"
            onClick={() => {
              setEdit(true);
              setfullDesc(true);
            }}
          >
            <AiOutlineEdit style={{ width: "23px", height: "23px" }} />
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
                setfullDesc(false);
              }}
            >
              <TbArrowBackUp style={{ width: "23px", height: "23px" }} />
            </Button>
            <Button
              variant={`outline-${props.theme == "light" ? "dark" : "accent4"}`}
              size="sm"
              className="me-3 w-25"
              onClick={() => {
                handleEdit();
              }}
            >
              <AiOutlineSave style={{ width: "23px", height: "23px" }} />
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
            <TbTrashX style={{ width: "23px", height: "23px" }} />
          )}
        </Button>
      </Card.Footer>
    </Card>
  );
}

export default CartItem;
