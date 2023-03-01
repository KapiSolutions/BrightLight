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

function TarotLotteryDesktop(props) {
  const router = useRouter();
  const currencyRef = useRef();
  const product = props.product;
  const isMobile = useDeviceStore((state) => state.isMobile);
  const theme = useDeviceStore((state) => state.themeState);
  const lang = useDeviceStore((state) => state.lang);
  const { authUserFirestore, setTempCart, updateProfile, setErrorMsg } = useAuth();
  const [flipCards, setFlipCards] = useState([]);
  const [userCards, setUserCards] = useState([]);
  const [cardsSet, setcardsSet] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingBuy, setLoadingBuy] = useState(false);
  const themeDarkInput = theme == "dark" ? "bg-accent6 text-light" : "";

  const cardsUrl = "/img/cards/";
  const cardNames = [
    "fool",
    "magician",
    "high-priestess",
    "empress",
    "empreror",
    "hierophant",
    "lovers",
    "chariot",
    "strength",
    "hermit",
    "wheel-of-fortune",
    "justice",
    "hanged-man",
    "death",
    "temperance",
    "devil",
    "tower",
    "star",
    "moon",
    "sun",
    "judgement",
    "world",
    "ace-of-wands",
    "two-of-wands",
    "three-of-wands",
    "four-of-wands",
    "five-of-wands",
    "six-of-wands",
    "seven-of-wands",
    "eight-of-wands",
    "nine-of-wands",
    "ten-of-wands",
    "princess-of-wands",
    "knight-of-wands",
    "queen-of-wands",
    "king-of-wands",
    "ace-of-cups",
    "two-of-cups",
    "three-of-cups",
    "four-of-cups",
    "five-of-cups",
    "six-of-cups",
    "seven-of-cups",
    "eight-of-cups",
    "nine-of-cups",
    "ten-of-cups",
    "princess-of-cups",
    "knight-of-cups",
    "queen-of-cups",
    "king-of-cups",
    "ace-of-swords",
    "two-of-swords",
    "three-of-swords",
    "four-of-swords",
    "five-of-swords",
    "six-of-swords",
    "seven-of-swords",
    "eight-of-swords",
    "nine-of-swords",
    "ten-of-swords",
    "princess-of-swords",
    "knight-of-swords",
    "queen-of-swords",
    "king-of-swords",
    "ace-of-pentacles",
    "two-of-pentacles",
    "three-of-pentacles",
    "four-of-pentacles",
    "five-of-pentacles",
    "six-of-pentacles",
    "seven-of-pentacles",
    "eight-of-pentacles",
    "nine-of-pentacles",
    "ten-of-pentacles",
    "princess-of-pentacles",
    "knight-of-pentacles",
    "queen-of-pentacles",
    "king-of-pentacles",
  ];

  let cardStyleBack = {};
  let cardStyleFront = {};

  if (product.cardSet < 10) {
    cardStyleBack = {
      postion: "relative",
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
      postion: "relative",
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
      const cardName = cardNames[cardNo];
      img.setAttribute("src", `${cardsUrl}/${cardName}.png`);
      setUserCards((prev) => [...prev, cardName]);

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

  function handleSaveAndSignIn() {
    const question = document.getElementById("questionField").value;
    if (question) {
      const cartItem = {
        name: product.title,
        product_id: product.id,
        cards: userCards,
        question: question,
        choosenCurrency: "",
        price: product.price,
        image: product.image.name,
      };
      setTempCart(cartItem);
      router.push("/sign-in");
    }
  }
  async function handleBuy() {
    const question = document.getElementById("questionField").value;
    if (question) {
      setErrorMsg("");
      setLoadingBuy(true);
      const cartItem = {
        name: product.title,
        product_id: product.id,
        cards: userCards,
        question: question,
        choosenCurrency: "",
        price: product.price,
        image: product.image.name,
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
    }
  }
  async function handleAddToCart() {
    setMessage("");
    setLoading(true);
    const question = document.getElementById("questionField").value;
    if (question) {
      const cartItem = {
        name: product.title,
        product_id: product.id,
        cards: userCards,
        question: question,
        choosenCurrency: "",
        price: product.price,
        image: product.image.name,
      };
      let cart = [...authUserFirestore.cart];
      cart.push(cartItem);
      try {
        await updateProfile({ cart: cart });
        setMessage(`The ${product.title[lang]} tarot successfully added to the cart!`);
      } catch (error) {
        setErrorMsg(error);
      }
    }
    setLoading(false);
  }
  function handleSubmit(e) {
    e.preventDefault();
  }
  return (
    <>
      <section className="d-flex gap-1 mb-2">
        <small>
          <Link href="/#main">Home</Link>
        </small>
        <small>&gt;</small>
        <small>{product.title[lang]}</small>
      </section>
      <Row className="d-flex mb-3 text-center">
        <h1 className="color-primary mb-3"> {product.title[lang]} </h1>
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
            Focus deeply on your question and {window.innerWidth < 768 && "TAP below to"}{" "}
            <strong>choose {product.cardSet} cards</strong>
          </p>
        )}
        {flipCards.length > 0 && flipCards.length < product.cardSet - 1 && (
          <p className="color-primary">
            <strong>Okay, {product.cardSet - flipCards.length} more left..</strong>
          </p>
        )}
        {flipCards.length == product.cardSet - 1 && (
          <p className="color-primary">
            <strong>And the last one.</strong>
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
              >
                <Image src={cardBackMin} placeholder="blur" alt={`back-${card}`} />
              </div>
            ))}
          </div>
        )}

        {flipCards.length == product.cardSet && !message && (
          <div>
            <h4 className="mt-0 color-primary">Okay!</h4>
            <p className="color-primary">
              Now, if you are curious about what your cards say, you can get your own private interpretation!
            </p>
            <Form className="mt-4 m-auto" style={{ maxWidth: "500px" }} onSubmit={handleSubmit}>
              <FloatingLabel label="Your Question..">
                <Form.Control
                  as="textarea"
                  id="questionField"
                  placeholder="Leave a comment here"
                  style={{ minHeight: "150px" }}
                  required
                />
              </FloatingLabel>
              {!!authUserFirestore ? (
                <>
                  <ButtonGroup className={`pointer mt-4 ${styles.animatedBorderLight} rounded`}>
                    <Button className="btn-lg" variant="primary" onClick={handleBuy}>
                      {loadingBuy ? (
                        <>
                          <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                          <span>Loading...</span>
                        </>
                      ) : (
                        <span> Buy now </span>
                      )}
                    </Button>
                    <Button
                      variant="outline-primary"
                      type="submit"
                      onClick={handleBuy}
                      style={{ pointerEvents: "none" }}
                    >
                      <span>
                        {product.price[lang].amount}{" "}
                        <span className="text-uppercase">{product.price[lang].currency}</span>
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
                        <span>Loading...</span>
                      </>
                    ) : (
                      <span> Add to cart </span>
                    )}
                  </Button>
                </>
              ) : (
                <>
                  <Button className="btn-lg mt-4" type="submit" onClick={handleSaveAndSignIn}>
                    Save & Sign In
                  </Button>
                  <br />
                  <small className="color-primary">Only registered users can ask for the private interpretation.</small>
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
              Back
            </Button>
          </section>
        )}
      </Row>
    </>
  );
}

export default TarotLotteryDesktop;
