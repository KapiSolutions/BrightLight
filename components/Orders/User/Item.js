import React, { useEffect, useState } from "react";
import { Card } from "react-bootstrap";
import { getFileUrlStorage } from "../../../firebase/Storage";
import styles from "../../../styles/components/Orders/Item.module.scss";
import { IoIosArrowForward } from "react-icons/io";

function Item(props) {
  const [showDetails, setShowDetails] = useState(false);
  const item = props.item;
  
  // Get url's for the item images
  useEffect(() => {
    getFileUrlStorage("images/cards", item.image)
      .then((url) => {
        const img = document.getElementById(`${props.order.id}-${props.idx.toString()}`);
        img.setAttribute("src", url);
      })
      .catch((error) => console.log(error));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const styledCardName = (card) => {
    card = card[0].toUpperCase() + card.slice(1);
    card = card.replaceAll("-", " ");
    return card;
  };
  return (
    <div className={`${styles.OrderItem} ${props.order.status == "Done" && "border border-success"}`}>
      <div className={styles.OrderHeader}>
        <Card.Img
          className={styles.OrderImg}
          src="/img/placeholders/cartImage.webp"
          id={`${props.order.id}-${props.idx}`}
          alt="Item icon"
        />
        <div className="w-50">
          <p className={styles.OrderItemName}>{item.name}</p>
          <p className={styles.OrderItemPrice}>
            <small>{item.price},00 PLN</small>
          </p>
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
            <p className="mb-0">Your cards:</p>
            <div className="ms-2">
              <small>
                {item.cards.map((card, idx) => (
                  <li key={idx} style={{ display: "inline", listStyleType: "none" }}>
                    {idx + 1}. {styledCardName(card)}{" "}
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
              <p>
                <small>{item.question}</small>
              </p>
            </div>
          </div>
          {props.order.status == "Done" && (
            <>
              <div className="w-100 opacity-50">
                <hr />
              </div>
              <div>
                <p className="mb-0">
                  <strong>Answer:</strong>
                </p>
                <div className="ms-2">
                  <p>
                    <small>{item.answer}</small>
                  </p>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default Item;
