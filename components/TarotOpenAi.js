import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthProvider";
import { useRouter } from "next/router";
import { useDeviceStore } from "../stores/deviceStore";
import { Button, ButtonGroup, FloatingLabel, Form, Spinner } from "react-bootstrap";
import { GiGlassHeart } from "react-icons/gi";
import { RiCoinsFill, RiCopperCoinLine } from "react-icons/ri";
import { BiCoin } from "react-icons/bi";
import styles from "../styles/components/loader.module.scss";
import Link from "next/link";

function TarotOpenAi(props) {
  const router = useRouter();
  const locale = router.locale;
  const stylesParent = props.styles;
  const { authUserFirestore, setErrorMsg, authUserCredential, updateProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [idToken, setIdToken] = useState(undefined);
  const isMobile = useDeviceStore((state) => state.isMobile);
  const theme = useDeviceStore((state) => state.themeState);
  const themeDarkInput = theme == "dark" ? "bg-accent6 text-light" : "";
  const questionRef = useRef();
  const [answer, setAnswer] = useState("");
  const [question, setQuestion] = useState("");
  const [chars, setChars] = useState(0);
  const qMaxLen = 100;
  const zodiac = authUserFirestore?.zodiac;

  const getToken = async () => {
    const token = await authUserCredential.getIdToken(true);
    setIdToken(token.toString());
  };

  useEffect(() => {
    authUserCredential && getToken();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authUserCredential]);

  useEffect(() => {
    answer && props.aiReady(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [answer]);

  const t = {
    en: {
      new: "New!",
      txtAreaLabel: "Provide short question.",
      txtAreaPlaceholder: "(I got a new job offer, should I take it?)",
      loading: "Loading...",
      button: "Get Ai Reading!",
      aiDesc: "Artificial intelligence will interpret your tarot along with selected cards and asked question!",
      yourAnswer: "Your answer is ready!",
      back: "Home",
      sthWrong: "Something went wrong, please try again later.",
      signedUsers: "Only available for signed users.",
      signButton: "Sign In",
      notEnoughCoins: "You don't have enough coins.",
      buyHere: "Get 'em here.",
      howManyCoins: `${props.coins} coin${props.coins > 1 ? "s" : ""} will be used. You have ${
        authUserFirestore?.coins.amount
      }.`,
    },
    pl: {
      new: "Nowość!",
      txtAreaLabel: "Wprowadź krótkie pytanie.",
      txtAreaPlaceholder: "(przykład: dostałem ofertę nowej pracy, powinienem ją przyjąć?)",
      loading: "Ładuję...",
      button: "Zdobądź odpowiedź!",
      aiDesc: "Twojego tarota wraz z wybranymi kartami i zadanym pytaniem zinterpretuje sztuczna inteligencja!",
      yourAnswer: "Interpretacja gotowa!",
      back: "Strona Główna",
      sthWrong: "Coś poszło nie tak, spróbuj ponownie później.",
      signedUsers: "Dostępne tylko dla zalogowanych użytkowników.",
      signButton: "Zaloguj się",
      notEnoughCoins: "Nie masz wystarczającej ilości monet.",
      buyHere: "Dokup je tutaj.",
      howManyCoins: `${props.coins > 1 ? "Zostaną wykorzystane" : "Zostanie wykorzystana"} ${props.coins} 
      ${props.coins == 1 ? "moneta" : ""}
      ${props.coins > 1 && props.coins < 5 ? "monety" : ""}
      ${props.coins > 5 ? "monet" : ""}. Posiadasz ${authUserFirestore?.coins.amount}.`,
    },
  };
  const translateText = async (inputText, from, to) => {
    let translatedTxt = "";
    if (inputText != "") {
      try {
        const res = await axios.get(
          `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${from}&tl=${to}&dt=t&q=${encodeURI(
            inputText
          )}`
        );
        res.data[0].map((text) => {
          translatedTxt += text[0];
        });
        return translatedTxt;
      } catch (error) {
        console.log(error);
      }
    } else {
      return "";
    }
  };

  const getOpenAiAnswers = async (e) => {
    e.preventDefault();
    if (!authUserCredential.emailVerified) {
      props.showVerifyModal(true);
      return;
    }
    setAnswer("");
    const inputQuest = questionRef.current.value.trim();
    setQuestion(inputQuest);
    setLoading(true);

    const title = await translateText(props.tarotTitle, "pl", "en");
    const question = locale == "pl" ? await translateText(inputQuest, "pl", "en") : inputQuest;

    const readyQuestion = `${
      zodiac ? `My zodiac is ${authUserFirestore.zodiac}. ` : ""
    }I did the ${title} tarot with question:${question}. My cards: ${props.cards.join(",")}. What does it mean?`;

    // Get AI reading
    try {
      const payload = {
        secret: process.env.NEXT_PUBLIC_API_KEY,
        idToken: idToken,
        data: readyQuestion,
      };
      const res = await axios.post("/api/openai/", payload);
      const generatedAnswer = locale == "pl" ? await translateText(res.data, "en", "pl") : res.data;
      setAnswer(generatedAnswer);
    } catch (error) {
      setErrorMsg(t[locale].sthWrong);
      setLoading(false);
      return;
    }
    // Update user coins
    try {
      const payload = {
        secret: process.env.NEXT_PUBLIC_API_KEY,
        idToken: idToken,
        data: {
          id: authUserFirestore.id,
          coinsToTake: props.coins,
        },
      };
      await axios.post("/api/coins/", payload);
      updateProfile();
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };
  return (
    <div className="color-primary">
      <>
        {authUserCredential ? (
          <>
            {/* Content for signed in users */}
            {!answer ? (
              <>
                {/* Display Loader when request starts */}
                {loading ? (
                  <section
                    className={styles.fadeLoader}
                    style={{ position: "relative", top: "-30px", maxWidth: "100vw", overflowX: "hidden" }}
                  >
                    <div className="d-flex justify-content-center pt-2">
                      <div className={styles.loader}>
                        <div className={styles.planet}>
                          <div className={styles.ring}></div>
                          <div className={styles.coverRing}></div>
                          <div className={styles.spots}>
                            <span></span>
                            <span></span>
                            <span></span>
                            <span></span>
                            <span></span>
                            <span></span>
                            <span></span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <p className="mt-0">{t[locale].loading}</p>
                  </section>
                ) : (
                  <Form className="m-auto mt-4 color-primary" style={{ maxWidth: "500px" }} onSubmit={getOpenAiAnswers}>
                    {/* Display question form */}
                    <FloatingLabel label={t[locale].txtAreaLabel} className="text-start">
                      <Form.Control
                        as="textarea"
                        type="text"
                        ref={questionRef}
                        defaultValue={question ? question : ""}
                        maxLength={qMaxLen}
                        onChange={() => setChars(questionRef.current.value.length)}
                        className={`${themeDarkInput} `}
                        style={{ minHeight: isMobile ? "150px" : "90px" }}
                        required
                      />
                      <div className="text-end">
                        <small className="text-muted">
                          {chars}/{qMaxLen}
                        </small>
                      </div>
                      <div className="text-center">
                        <small>{t[locale].aiDesc}</small>
                      </div>
                    </FloatingLabel>

                    <div className="w-100">
                      <ButtonGroup className={`pointer mt-4 ${stylesParent.animatedBorderLight} rounded`}>
                        <Button
                          variant="primary"
                          type="submit"
                          disabled={authUserFirestore?.coins.amount < props.coins}
                        >
                          {loading ? (
                            <>
                              <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                              <span>{t[locale].loading}</span>
                            </>
                          ) : (
                            <span>{t[locale].button}</span>
                          )}
                        </Button>
                        <Button
                          variant="outline-primary ps-2 pe-1"
                          type="submit"
                          style={{ pointerEvents: "none" }}
                          disabled={authUserFirestore?.coins.amount < props.coins}
                        >
                          <span>
                            <span className="me-1">
                              <strong>{props.coins}</strong>
                            </span>
                            <BiCoin style={{ width: "22px", height: "22px", position: "relative", bottom: "1px" }} />
                          </span>
                        </Button>
                      </ButtonGroup>
                      {authUserFirestore?.coins.amount < props.coins ? (
                        <p className="mt-2">
                          {t[locale].notEnoughCoins}
                          <br />
                          <Link href="/user/coins#main" passHref>
                            <u className="color-secondary">{t[locale].buyHere}</u>
                          </Link>
                        </p>
                      ) : (
                        <p className="mt-2">
                          <small>{t[locale].howManyCoins}</small>
                        </p>
                      )}
                    </div>
                  </Form>
                )}
              </>
            ) : (
              <section>
                {/* Display received answer */}
                <p className="fs-4">{t[locale].yourAnswer}</p>
                <p className="text-muted">
                  {" "}
                  <i>&ldquo;{question}&rdquo;</i>{" "}
                </p>
                <div className={`text-start m-auto ${!isMobile && "w-75"}`}>
                  <span style={{ whiteSpace: "pre-wrap", lineHeight: "0.5" }}>{answer}</span>
                </div>
                <div className="mt-4">
                  <GiGlassHeart style={{ width: "30px", height: "30px" }} />
                  <br />
                  <Button
                    variant="primary"
                    size="md"
                    className="mt-3"
                    onClick={() => {
                      router.push("/#main");
                    }}
                  >
                    {t[locale].back}
                  </Button>
                </div>
              </section>
            )}
          </>
        ) : (
          <section className="mt-4">
            {/* Display message for non signed in users */}
            <p>
              <strong>{t[locale].signedUsers}</strong>
            </p>
            <Button
              variant="primary"
              size="md"
              className="mt-3"
              onClick={() => {
                router.push("/sign-in");
              }}
            >
              {t[locale].signButton}
            </Button>
          </section>
        )}
      </>
    </div>
  );
}

export default TarotOpenAi;
