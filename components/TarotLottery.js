import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import ReactCardFlip from "react-card-flip";
import { Row, Col, Card, Button, FloatingLabel, Form, ButtonGroup, Spinner } from "react-bootstrap";
import styles from "../styles/components/TarotLotteryDesktop.module.scss";
import { useDeviceStore } from "../stores/deviceStore";
import { useAuth } from "../context/AuthProvider";
import { GiGlassHeart } from "react-icons/gi";
import randomCards from "../public/img/randomCards.gif";
import cardBackUrl from "../public/img/cards/back.png";
import cardBackMin from "../public/img/cardBackMin.png";
import placeholder from "../utils/placeholder";
import Link from "next/link";
import { getDocById } from "../firebase/Firestore";
import tarotCards from "../utils/tarotCards";

function TarotLotteryDesktop(props) {
  const router = useRouter();
  const locale = props.locale;
  const product = props.product;
  const isMobile = useDeviceStore((state) => state.isMobile);
  const theme = useDeviceStore((state) => state.themeState);
  const currency = useDeviceStore((state) => state.currency);
  const { authUserFirestore, setTempCart, updateProfile, setErrorMsg } = useAuth();
  const [flipCards, setFlipCards] = useState([]);
  const [userCards, setUserCards] = useState([]);
  const [cardsSet, setcardsSet] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingBuy, setLoadingBuy] = useState(false);
  const [noQuestion, setNoQuestion] = useState(false);
  const themeDarkInput = theme == "dark" ? "bg-accent6 text-light" : "";
  const cardsUrl = "/img/cards/";
  const cardNames = tarotCards();
  let cardStyleBack = {};
  let cardStyleFront = {};

  const t = {
    en: {
      home: "Home",
      lastOne: "And the last one.",
      okay: "Okay!",
      msgInterpretation:
        "Now, if you are curious about what your cards say, you can get your own private interpretation!",
      msgInterpretationOneCard:
        "Now, if you are curious about what your card says, you can get your own private interpretation!",
      txtAreaLabel: "Please describe your Question in detail.",
      loading: "Loading...",
      buy: "Buy now",
      addToCart: "Add to cart",
      save: "Save & Sign In",
      msgUnregistered: "Only registered users can ask for the private interpretation.",
      msgSuccessCart: `The ${product.title} tarot successfully added to the cart!`,
      addQuestion: "Please add your question.",
      back: "Back",
    },
    pl: {
      home: "Strona główna",
      lastOne: "I ostatnia.",
      okay: "Super!",
      msgInterpretation: "Jesteś ciekawy co mówią Twoje karty? Otrzymaj prywatną interpetację!",
      msgInterpretationOneCard: "Jesteś ciekawy co mówi Twoja karta? Otrzymaj prywatną interpetację!",
      txtAreaLabel: "Opisz dokładnie swoje pytanie.",
      loading: "Ładuję..",
      buy: "Kup teraz",
      addToCart: "Dodaj do koszyka",
      save: "Zapisz i Zaloguj się",
      msgUnregistered: "Tylko zarejestrowani użytkownicy mogą dostać prywatną interpretację.",
      msgSuccessCart: `Tarot "${product.title}" pomyślnie dodany do koszyka!`,
      addQuestion: "Dodaj proszę swoje pytanie.",
      back: "Wróć",
    },
  };

  if (product.cardSet < 10) {
    cardStyleBack = {
      position: "relative",
      opacity: 0.5,
      width: `${isMobile ? "93px" : "118px"}`,
      height: `${isMobile ? "158px" : "200px"}`,
    };
    cardStyleFront = {
      width: `${isMobile ? "93px" : "118px"}`,
      height: `${isMobile ? "158px" : "200px"}`,
    };
  } else {
    //cards must be smaller for better view
    cardStyleBack = {
      position: "relative",
      opacity: 0.5,
      width: `${isMobile ? "60px" : "93px"}`,
      height: `${isMobile ? "102px" : "158px"}`,
    };
    cardStyleFront = {
      width: `${isMobile ? "60px" : "93px"}`,
      height: `${isMobile ? "102px" : "158px"}`,
    };
  }

  //Menage the display of the choosen cards
  useEffect(() => {
    if (flipCards.length > 0) {
      const img = document.getElementById(`product-card-${flipCards.length - 1}`);
      const cardNo = flipCards[flipCards.length - 1];
      const cardName = cardNames.en[cardNo];
      img.setAttribute("src", `${cardsUrl}/${cardName}.png`);
      setUserCards((prev) => [...prev, cardNames[locale][cardNo]]);

      if (!isMobile) {
        document.getElementById(cardNo).style.display = "none";
      }
    }
    if (flipCards.length == product.cardSet && !isMobile) {
      document.getElementById("cardSetContainer").style.display = "none";
    } else if (flipCards.length == product.cardSet && isMobile) {
      document.getElementById("cardMobile").style.display = "none";
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flipCards]);

  //Create and shuffle product cards array
  useEffect(() => {
    const cardsArr = [];
    for (let i = 0; i < 78; i++) {
      cardsArr[i] = i;
    }
    function shuffle(array) {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    }
    const cards = shuffle(cardsArr);
    setcardsSet(cards);
  }, []);

  const handleSaveAndSignIn = async () => {
    const question = document.getElementById("questionField").value;
    const doc = await getDocById("products", product.id); //get title in both languages
    if (question) {
      const cartItem = {
        name: doc.title,
        product_id: product.id,
        cards: userCards,
        question: question,
        price: product.price,
        image: product.image,
      };
      setTempCart(cartItem);
      router.push("/sign-in");
    }
  };
  const handleBuy = async () => {
    const question = document.getElementById("questionField").value;
    const doc = await getDocById("products", product.id); //get title in both languages
    if (question) {
      setErrorMsg("");
      setNoQuestion(false);
      setLoadingBuy(true);
      const cartItem = {
        name: doc.title,
        product_id: product.id,
        cards: userCards,
        question: question,
        price: product.price,
        image: product.image,
      };
      let cart = [...authUserFirestore.cart];
      cart.push(cartItem);
      try {
        await updateProfile({ cart: cart });
        router.push("/cart-summary#main");
      } catch (error) {
        setErrorMsg(error);
      }
      setLoadingBuy(false);
    } else {
      setNoQuestion(true);
      document.getElementById("questionField").focus();
      document.getElementById("questionField").scrollIntoView({ block: "center", inline: "nearest" });
    }
  };

  const handleAddToCart = async () => {
    setMessage("");
    setLoading(true);
    const question = document.getElementById("questionField").value;
    const doc = await getDocById("products", product.id); //get title in both languages
    if (question) {
      const cartItem = {
        name: doc.title,
        product_id: product.id,
        cards: userCards,
        question: question,
        price: product.price,
        image: product.image,
      };
      let cart = [...authUserFirestore.cart];
      cart.push(cartItem);
      try {
        await updateProfile({ cart: cart });
        setMessage(t[locale].msgSuccessCart);
      } catch (error) {
        setErrorMsg(error);
      }
    }
    setLoading(false);
  };
  function handleSubmit(e) {
    e.preventDefault();
  }

  return (
    <>
      <section className="d-flex gap-1 mb-2">
        <small>
          <Link href="/#main">{t[locale].home}</Link>
        </small>
        <small>&gt;</small>
        <small>{product.title}</small>
      </section>
      <Row className="d-flex mb-3 text-center">
        <h1 className="color-primary mb-3"> {product.title} </h1>
      </Row>
      <Row className="d-flex mb-4 justify-content-center gap-2">
        {Array.from({ length: product.cardSet }).map((_, idx) => (
          <Col
            key={idx}
            className={`d-flex ms-1 me-1 mb-2 justify-content-center ${
              product.cardSet > 10 ? "col-2 col-sm-1 col-md-2 col-lg-1" : "col-3 col-sm-2 col-md-2 col-lg-2"
            }   
          ${isMobile ? "" : product.cardSet < 10 && idx > 0 && idx < product.cardSet - 1 && "pt-3"} 
          `}
          >
            <ReactCardFlip
              isFlipped={flipCards.length > idx}
              flipDirection="horizontal"
              flipSpeedFrontToBack="2"
              flipSpeedBackToFront="2"
            >
              <div style={cardStyleBack}>
                <Image src={cardBackUrl} fill alt={`back-of-card-${idx}`} />
              </div>
              <div style={cardStyleFront}>
                <Card.Img id={`product-card-${idx}`} variant="top" alt={`product-card-${idx}`} />
              </div>
            </ReactCardFlip>
          </Col>
        ))}
      </Row>

      <Row className="d-flex justify-content-center">
        {flipCards.length === 0 && (
          <p className="color-primary">
            {locale === "pl" ? (
              <>
                Zastanów się głęboko nad swoim pytaniem i{" "}
                {window.innerWidth < 768 ? "KLIKNIJ niżej aby wybrać" : "wybierz"}{" "}
                <strong>
                  {product.cardSet} {product.cardSet == "1" ? "kartę." : product.cardSet < 5 ? "karty." : "kart."}
                </strong>
              </>
            ) : (
              <>
                Focus deeply on your question and {window.innerWidth < 768 && "TAP below to"}{" "}
                <strong>choose {product.cardSet} cards</strong>
              </>
            )}
          </p>
        )}
        {flipCards.length > 0 && flipCards.length < product.cardSet - 1 && (
          <p className="color-primary">
            {locale === "pl" ? (
              <strong>
                Dobrze, jeszcze {product.cardSet - flipCards.length}{" "}
                {product.cardSet - flipCards.length < 5 ? "karty." : "kart."}..
              </strong>
            ) : (
              <strong>Okay, {product.cardSet - flipCards.length} more left..</strong>
            )}
          </p>
        )}
        {flipCards.length == product.cardSet - 1 && product.cardSet != "1" && (
          <p className="color-primary">
            <strong>{t[locale].lastOne}</strong>
          </p>
        )}
        {window.innerWidth < 768 ? (
          <div id="cardMobile">
            <Image
              src={randomCards}
              alt={`product-card`}
              className="rounded"
              placeholder="blur"
              blurDataURL={placeholder("light")}
              onClick={() => {
                const random = Math.floor(Math.random() * cardsSet.length);
                const card = cardsSet[random];
                cardsSet.splice(random, 1); //remove card from array
                setFlipCards((prev) => [...prev, card]);
              }}
            />
          </div>
        ) : (
          <div id="cardSetContainer" className={`${styles.cardsContainer}  justify-content-center`}>
            {cardsSet.map((card) => (
              <div
                key={card}
                id={card}
                className={`${styles.smallCard} pointer`}
                onClick={() => setFlipCards([...flipCards, card])}
                style={{ position: "relative" }}
              >
                <Image src={cardBackMin} placeholder="blur" alt={`back-${card}`} />
              </div>
            ))}
          </div>
        )}

        {flipCards.length == product.cardSet && !message && (
          <div>
            <h4 className="mt-0 color-primary">{t[locale].okay}</h4>
            <p className="color-primary">
              {product.cardSet == "1" ? t[locale].msgInterpretationOneCard : t[locale].msgInterpretation}
            </p>
            <Form className="mt-4 m-auto color-primary" style={{ maxWidth: "500px" }} onSubmit={handleSubmit}>
              <FloatingLabel label={t[locale].txtAreaLabel}>
                <Form.Control
                  as="textarea"
                  id="questionField"
                  className={`${themeDarkInput} ${noQuestion && "border-danger"}`}
                  style={{ minHeight: "150px" }}
                  required
                />
                {noQuestion && <small className="ms-0 text-danger">{t[locale].addQuestion}</small>}
              </FloatingLabel>
              {!!authUserFirestore ? (
                <>
                  <ButtonGroup onClick={handleBuy} className={`pointer mt-4 ${styles.animatedBorderLight} rounded`}>
                    <Button className="btn-lg" variant="primary">
                      {loadingBuy ? (
                        <>
                          <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                          <span>{t[locale].loading}</span>
                        </>
                      ) : (
                        <span>{t[locale].buy}</span>
                      )}
                    </Button>
                    <Button variant="outline-primary" style={{ pointerEvents: "none" }}>
                      <span>
                        {product.price[currency].amount} <span className="text-uppercase">{currency}</span>
                      </span>
                    </Button>
                  </ButtonGroup>
                  <br />
                  <Button
                    variant="outline-primary"
                    type="submit"
                    className="mt-4"
                    onClick={handleAddToCart}
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                        <span>{t[locale].loading}</span>
                      </>
                    ) : (
                      <span>{t[locale].addToCart}</span>
                    )}
                  </Button>
                </>
              ) : (
                <>
                  <Button className="btn-lg mt-4" type="submit" onClick={handleSaveAndSignIn}>
                    {t[locale].save}
                  </Button>
                  <br />
                  <small className="color-primary">{t[locale].msgUnregistered}</small>
                </>
              )}
            </Form>
          </div>
        )}
        {flipCards.length == product.cardSet && message && (
          <section className="color-primary mt-1">
            <p>{message}</p>
            <GiGlassHeart style={{ width: "30px", height: "30px" }} />
            <br />
            <Button
              variant="primary"
              size="md"
              className="mt-4"
              onClick={() => {
                router.push("/#main");
              }}
            >
              {t[locale].back}
            </Button>
          </section>
        )}
      </Row>
    </>
  );
}

export default TarotLotteryDesktop;
