import React, { useEffect, useState, useRef } from "react";
import { Card, Form, Button, Spinner } from "react-bootstrap";
import { getFileUrlStorage } from "../../../firebase/Storage";
import styles from "../../../styles/components/Orders/Item.module.scss";
import { useAuth } from "../../../context/AuthProvider";
import { IoIosArrowForward } from "react-icons/io";
import { getDocById, updateDocFields } from "../../../firebase/Firestore";
import { useRouter } from "next/router";

function Item(props) {
  const router = useRouter();
  const locale = router.locale;
  const { setErrorMsg } = useAuth();
  const order = props.order;
  const [showDetails, setShowDetails] = useState(false);
  const [loadingAdd, setLoadingAdd] = useState(false);
  const [lockAnswer, setLockAnswer] = useState(false);
  const item = props.item;
  const answerRef = useRef();

  const t = {
    en: {
      cards: "Cards:",
      question: "Question:",
      answer: "Answer:",
      yourAnswer: "Your answer...",
      sthWrong: "Something went wrong, please try again later.",
      adding: "Adding...",
      addAnswer: "Add Answer!",
      editAnswer: "Edit Answer",
    },
    pl: {
      cards: "Karty:",
      question: "Pytanie:",
      answer: "Odpowiedź:",
      yourAnswer: "Twoja odpowiedź...",
      sthWrong: "Coś poszło nie tak, spróbuj ponownie później",
      adding: "Dodawanie...",
      addAnswer: "Dodaj odpowiedź!",
      editAnswer: "Edytuj odpowiedź",
    },
  };

  useEffect(() => {
    if (item.answer) {
      setLockAnswer(true);
      props.answersQt(props.idx);
    }
    // Get url's for the item images
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

  // Add answer to the item
  const addAnswer = async (e) => {
    e.preventDefault();
    setLoadingAdd(true);
    const answer = answerRef.current.value;
    const tmpOrder = await getDocById("orders", order.id);
    let tmpItems = [];
    try {
      tmpOrder.items.map((item, idx) => {
        if (idx == props.idx) {
          item = { ...item, answer: answer };
        }
        tmpItems.push(item);
      });
      await updateDocFields("orders", order.id, { items: tmpItems });
      props.answersQt(props.idx);
      setLockAnswer(true);
    } catch (err) {
      console.log(err);
      setErrorMsg(t[locale].sthWrong);
    }

    setLoadingAdd(false);
  };
  return (
    <div className={`${styles.OrderItem} ${lockAnswer && "border border-success"}`}>
      <div className={styles.OrderHeader}>
        <Card.Img
          className={styles.OrderImg}
          src="/img/placeholders/cartImage.webp"
          id={`${order.id}-${props.idx}`}
          alt="Item icon"
        />
        <div className="w-50">
          <p className={styles.OrderItemName}>{item.name[locale]}</p>
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
            <p className="mb-0">{t[locale].cards}</p>
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
            <p className="mb-0">{t[locale].question}</p>
            <div className="ms-2">
              <p>
                <small>{item.question}</small>
              </p>
            </div>
          </div>

          <div className="w-100 opacity-50">
            <hr />
          </div>
          <div>
            <p className="mb-0">
              <strong>{t[locale].answer}</strong>
            </p>
            <div className="ms-2">
              <Form onSubmit={addAnswer}>
                <Form.Control
                  as="textarea"
                  id="adminOrderItemField"
                  placeholder={t[locale].yourAnswer}
                  style={{ minHeight: "80px" }}
                  className={`${lockAnswer && "border border-success"} ${order.status == "Done" && "mb-2"}`}
                  ref={answerRef}
                  defaultValue={item.answer ? item.answer : ""}
                  disabled={lockAnswer}
                  required
                />
                {order.status != "Done" && (
                  <>
                    {!lockAnswer && (
                      <div className="text-end mt-2 mb-2">
                        <Button type="submit" disabled={loadingAdd}>
                          {loadingAdd ? (
                            <>
                              <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                              <span> {t[locale].adding}</span>
                            </>
                          ) : (
                            <span> {t[locale].addAnswer} </span>
                          )}
                        </Button>
                      </div>
                    )}
                  </>
                )}
              </Form>
              {order.status != "Done" && (
                <>
                  {lockAnswer && (
                    <div className="text-end mt-2 mb-2">
                      <Button
                        variant="outline-success"
                        onClick={() => {
                          setLockAnswer(false);
                        }}
                      >
                        {t[locale].editAnswer}
                      </Button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Item;
