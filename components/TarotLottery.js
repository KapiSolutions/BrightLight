import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import ReactCardFlip from "react-card-flip";
import { Row, Col, Card, Button, FloatingLabel, Form, ButtonGroup, Spinner, Badge } from "react-bootstrap";
import styles from "../styles/components/TarotLotteryDesktop.module.scss";
import { useDeviceStore } from "../stores/deviceStore";
import { useAuth } from "../context/AuthProvider";
import { GiGlassHeart } from "react-icons/gi";
import randomCards from "../public/img/cards/randomCards.gif";
import cardBackUrl from "../public/img/cards/back.png";
import cardBackMin from "../public/img/cards/cardBackMin.png";
import placeholder from "../utils/placeholder";
import { getDocById } from "../firebase/Firestore";
import tarotCards from "../utils/tarotCards";
import TarotOpenAi from "./TarotOpenAi";
import VerifyEmailModal from "./Modals/VerifyEmailModal";

function TarotLotteryDesktop(props) {
  const router = useRouter();
  const locale = props.locale;
  const product = props.product;
  const questionRef = useRef();
  const isMobile = useDeviceStore((state) => state.isMobile);
  const theme = useDeviceStore((state) => state.themeState);
  const currency = useDeviceStore((state) => state.currency);
  const { authUserFirestore, authUserCredential, setTempCart, updateProfile, setErrorMsg } = useAuth();
  const [flipCards, setFlipCards] = useState([]);
  const [userCards, setUserCards] = useState([]);
  const [userCardsEn, setUserCardsEn] = useState([]); //in english for the ai reading
  const [cardsSet, setcardsSet] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingBuy, setLoadingBuy] = useState(false);
  const [noQuestion, setNoQuestion] = useState(false);
  const [chars, setChars] = useState(0);
  const [aiGenTarot, setAiGenTarot] = useState(false);
  const [aiReady, setAiReady] = useState(false);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const themeDarkInput = theme == "dark" ? "bg-accent6 text-light" : "";
  const cardsUrl = "/img/cards/";
  const cardNames = tarotCards();
  let cardStyleBack = {};
  let cardStyleFront = {};
  const qMaxLen = 500;

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
      msgUnregistered: "Only registered users can get a private interpretation.",
      msgSuccessCart: `The ${product.title} tarot successfully added to the cart!`,
      addQuestion: "Please add your question.",
      back: "Back",
      standardDesc:
        "Your tarot along with selected cards and question will be interpreted by an experienced esotericist - Bright Light Gypsy!",
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
      msgUnregistered: "Tylko zarejestrowani użytkownicy mogą otrzymać prywatną interpretację.",
      msgSuccessCart: `Tarot "${product.title}" pomyślnie dodany do koszyka!`,
      addQuestion: "Dodaj proszę swoje pytanie.",
      back: "Wróć",
      standardDesc:
        "Twojego tarota wraz z wybranymi kartami i zadanym pytaniem zinterpretuje doświadczona ezoteryczka, czyli ja - Bright Light Gypsy!",
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
      setUserCardsEn((prev) => [...prev, cardNames.en[cardNo]]);
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
    const question = questionRef.current.value;
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
    if (!authUserCredential.emailVerified) {
      setShowVerifyModal(true);
      return;
    }
    const question = questionRef.current.value;
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
        await router.push("/cart-summary#main");
        setLoadingBuy(false);
      } catch (error) {
        setErrorMsg(error);
        setLoadingBuy(false);
      }
    } else {
      setNoQuestion(true);
      document.getElementById("questionField").focus();
      document.getElementById("questionField").scrollIntoView({ block: "center", inline: "nearest" });
    }
  };

  const handleAddToCart = async () => {
    setMessage("");
    if (!authUserCredential.emailVerified) {
      setShowVerifyModal(true);
      return;
    }
    setLoading(true);
    const question = questionRef.current.value;
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
    <div className="color-primary">
      <Row className="d-flex mb-3 text-center">
        <h1 className="mb-3"> {product.title} </h1>
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
          <p>
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
          <p>
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
          <p>
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

        {/* This section is shown after choosing all the cards by user and closed after adding item to cart */}
        {flipCards.length == product.cardSet && !message && !aiReady && (
          <section>
            <h4 className="mt-0">{t[locale].okay}</h4>
            <p>{product.cardSet == "1" ? t[locale].msgInterpretationOneCard : t[locale].msgInterpretation}</p>

            {/* Switch */}
            <div className="d-flex align-items-center justify-content-center gap-3 mt-4">
              <span className="ms-5 pointer" onClick={() => setAiGenTarot(false)}>
                Standard
              </span>
              <span className="pointer">
                <Form.Check
                  type="switch"
                  role="switch"
                  checked={aiGenTarot}
                  onChange={() => setAiGenTarot(!aiGenTarot)}
                />
              </span>
              <span className="pointer" onClick={() => setAiGenTarot(true)}>
                AI Generated
                <span style={{ position: "relative", top: "-8px", left: "5px", width: "1px" }}>
                  <small>
                    <Badge bg="danger">New!</Badge>
                  </small>
                </span>
              </span>
            </div>

            {!aiGenTarot && (
              <Form className="mt-4 m-auto" style={{ maxWidth: "500px" }} onSubmit={handleSubmit}>
                <FloatingLabel label={t[locale].txtAreaLabel}>
                  <Form.Control
                    as="textarea"
                    id="questionField"
                    ref={questionRef}
                    maxLength={qMaxLen}
                    onChange={() => setChars(questionRef.current.value.length)}
                    className={`${themeDarkInput} ${noQuestion && "border-danger"}`}
                    style={{ minHeight: "150px" }}
                    required
                  />
                  <div className="d-flex justify-content-between">
                    <span>{noQuestion && <small className="ms-0 text-danger">{t[locale].addQuestion}</small>}</span>
                    <small className="text-muted">
                      {chars}/{qMaxLen}
                    </small>
                  </div>

                  <small>{t[locale].standardDesc}</small>
                </FloatingLabel>
                {authUserFirestore ? (
                  <>
                    <ButtonGroup onClick={handleBuy} className={`pointer mt-4 ${styles.animatedBorderLight} rounded`}>
                      <Button size="lg" variant="primary">
                        {loadingBuy ? (
                          <>
                            <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                            <span> {t[locale].loading}</span>
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
                          <span> {t[locale].loading}</span>
                        </>
                      ) : (
                        <span>{t[locale].addToCart}</span>
                      )}
                    </Button>
                  </>
                ) : (
                  <>
                    <Button className="mt-4 mb-2" type="submit" onClick={handleSaveAndSignIn}>
                      {t[locale].save}
                    </Button>
                    <br />
                    <small><strong>{t[locale].msgUnregistered}</strong></small>
                  </>
                )}
              </Form>
            )}
          </section>
        )}
        {/* Successfuly added to cart! */}
        {flipCards.length == product.cardSet && message && (
          <section className="mt-1">
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

        {/* OpenAi component */}
        {flipCards.length == product.cardSet && !message && aiGenTarot && (
          <section className="mt-0">
            <TarotOpenAi
              tarotTitle={product.title}
              coins={product.coins}
              cards={userCardsEn}
              aiReady={setAiReady}
              styles={styles}
              showVerifyModal={setShowVerifyModal}
            />
          </section>
        )}
      </Row>
      <VerifyEmailModal locale={locale} show={showVerifyModal} closeModal={setShowVerifyModal} />
    </div>
  );
}

export default TarotLotteryDesktop;
