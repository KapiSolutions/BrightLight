import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthProvider";
import { Card, Button, Spinner } from "react-bootstrap";
import { TbTrashX } from "react-icons/tb";
import { getFileUrlStorage } from "../firebase/Storage";


function CartSummaryItem(props) {
  const { authUserFirestore, updateProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [fullDesc, setfullDesc] = useState(false);
  const truncLength = 40;

  useEffect(() => {
    getFileUrlStorage("images/cards", authUserFirestore?.cart[props.idx].image)
      .then((url) => {
        const img = document.getElementById(`cart-img-${props.idx}`);
        img.setAttribute("src", url);
      })
      .catch((error) => console.log(error));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authUserFirestore?.cart]);

  async function deleteItem(item) {
    try {
      setLoading(true);
      let cart = [...authUserFirestore?.cart];
      cart.splice(item, 1);

      await updateProfile({ cart: cart });
      setLoading(false);
    } catch (e) {
      console.log(e);
      setLoading(false);
    }
  }

  return (
    <Card
      className={`
              bg-bg${props.theme} 
              text-${props.theme == "light" ? "dark" : "light"} 
              border${props.theme == "light" ? "" : "-dark"}  
              mb-3
              `}
    >
      <Card.Body className="pt-3 pb-3 text-start color-primary ">
        <div className="pointer" onClick={() => setfullDesc(!fullDesc)}>
          <div className="d-flex">
            <section style={{ width: "60px" }}>
              <Card.Img id={`cart-img-${props.idx}`} src={undefined}></Card.Img>
            </section>

            <section className="d-flex flex-wrap ms-2 w-100">
              <section className="col-6">
                <p className="mb-0 mt-0">{authUserFirestore.cart[props.idx].name}</p>
              </section>

              <section className="col-6">
                <p className="mb-0 text-end">{authUserFirestore.cart[props.idx].price} PLN</p>
              </section>

              <section className="col-9">
                <p className="mt-0 mb-0">
                  <small>
                    <i>&quot;{authUserFirestore.cart[props.idx].question.substring(0, truncLength)}...&quot;</i>
                  </small>
                </p>
              </section>
            </section>
          </div>
          <section className="col-10">
            {fullDesc && (
              <>
                <p className="mb-0">
                  <small>Your cards:</small>
                </p>
                <ul className="ps-1 mb-0">
                  <small>
                    {Array.from({ length: authUserFirestore.cart[props.idx].cards.length }).map((_, idx) => (
                      <li key={idx} style={{ display: "inline", listStyleType: "none" }}>
                        {idx + 1}. {authUserFirestore.cart[props.idx].cards[idx]}{" "}
                      </li>
                    ))}
                  </small>
                </ul>
              </>
            )}
          </section>
        </div>
        <div className="text-end Hover" style={{ height: "1px" }}>
          <Button
            variant="primary"
            size="sm"
            onClick={() => {
              deleteItem(props.idx);
            }}
            style={{ position: "relative", bottom: "30px" }}
            disabled={loading}
          >
            {loading ? (
              <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
            ) : (
              <TbTrashX style={{ height: "20px", width: "20px" }} />
            )}
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
}

export default CartSummaryItem;
