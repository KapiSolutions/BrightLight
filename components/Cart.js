import React, { useState } from "react";
import { useAuth } from "../context/AuthProvider";
import { Card, Button, Spinner } from "react-bootstrap";
import { IoBagCheckOutline } from "react-icons/io5";
import { TbTrashX } from "react-icons/tb";
import { AiOutlineEdit } from "react-icons/ai";

function Cart(props) {
  const { authUserFirestore, updateProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [fullDesc, setfullDesc] = useState(false);
  const revTheme = props.theme === "light" ? "dark" : "light";
  const truncLength = 100;
  async function handleCheckout() {}

  async function deleteItem(item) {
    try {
      setLoading(true);
      authUserFirestore.cart.splice(item, 1);
      await updateProfile({ cart: authUserFirestore.cart });
      setLoading(false);
    } catch (e) {
      console.log(e);
      setLoading(false);
    }
  }
  return (
    <>
      <div className="ms-auto">
        {authUserFirestore.cart.length > 0 ? (
          <>
            {Array.from({ length: authUserFirestore.cart.length }).map((_, idx) => (
              <Card
                key={idx}
                className={`
              bg-bg${props.theme} 
              text-${props.theme == "light" ? "dark" : "light"} 
              border-${props.theme == "light" ? "dark" : "accent4"}  
              shadow-sm mb-3
              `}
              >
                <Card.Body className="pt-1 pb-2">
                  <Card.Text className="color-primary mb-0">
                    <p className="fs-4 mb-0">{authUserFirestore.cart[idx].name}</p>
                  </Card.Text>
                  <section>
                    <p className="mt-0 mb-0">
                      <small>
                        <i>
                          &quot;
                          {authUserFirestore.cart[idx].question.substring(0, truncLength)}
                          ...&quot;
                        </i>
                      </small>
                    </p>
                  </section>
                  <p className="mb-0 text-end">{authUserFirestore.cart[idx].price} PLN</p>
                </Card.Body>

                <Card.Footer className={`border-${props.theme == "light" ? "dark" : "accent4"} text-end`}>
                  <Button
                    variant={`outline-${props.theme == "light" ? "dark" : "accent4"}`}
                    size="sm"
                    className="me-3 w-25"
                  >
                    <AiOutlineEdit style={{ width: "23px", height: "23px" }} />
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    className="w-25"
                    onClick={() => {
                      deleteItem(idx);
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
            ))}

            <hr className={`text-${revTheme}`} />
            <div
              onClick={handleCheckout}
              className={`text-${props.theme === "light" ? "dark" : "light"} pointer text-center fs-5`}
            >
              <IoBagCheckOutline
                className="color-primary me-1 mb-1"
                title="Checkout"
                style={{ width: "23px", height: "23px" }}
              />
              Checkout
            </div>
          </>
        ) : (
          <>No items in the cart..</>
        )}
      </div>
    </>
  );
}

export default Cart;
