import React, { useEffect, useState } from "react";
import { Card } from "react-bootstrap";
import { getFileUrlStorage } from "../../../firebase/Storage";
import styles from "../../../styles/components/Orders/Item.module.scss";
import { IoIosArrowForward } from "react-icons/io";
import { useDeviceStore } from "../../../stores/deviceStore";

function Item(props) {
  const [showDetails, setShowDetails] = useState(false);
  const lang = useDeviceStore((state) => state.lang);
  const item = props.item;
  const order = props.order;

  // Get url's for the item images
  useEffect(() => {
    getFileUrlStorage(`images/products/${item.product_id}`, item.image.name)
      .then((url) => {
        const img = document.getElementById(`${order.id}-${props.idx.toString()}`);
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
    <div className={`${styles.OrderItem} ${order.status == "Done" && "border border-success"}`}>
      <div className={styles.OrderHeader}>
        <Card.Img
          className={styles.OrderImg}
          src="/img/placeholders/cartImage.webp"
          id={`${order.id}-${props.idx}`}
          alt="Item icon"
        />
        <div className="w-50">
          <p className={styles.OrderItemName}>{item.name[lang]}</p>
          <p className={styles.OrderItemPrice}>
            <small>
              {item.price[order.currency].amount}
              <span className="text-uppercase ms-1">{order.currency}</span>
            </small>
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
          {order.status == "Done" && (
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
