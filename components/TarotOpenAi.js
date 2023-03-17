import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthProvider";
import { useRouter } from "next/router";
import { useDeviceStore } from "../stores/deviceStore";
import { Button, FloatingLabel, Form, Spinner } from "react-bootstrap";
import { GiGlassHeart } from "react-icons/gi";

function TarotOpenAi(props) {
  const router = useRouter();
  const locale = router.locale;
  const { authUserFirestore, setErrorMsg, authUserCredential } = useAuth();
  const [loading, setLoading] = useState(false);
  const [idToken, setIdToken] = useState(undefined);
  const isMobile = useDeviceStore((state) => state.isMobile);
  const currency = useDeviceStore((state) => state.currency);
  const theme = useDeviceStore((state) => state.themeState);
  const themeDarkInput = theme == "dark" ? "bg-accent6 text-light" : "";
  const questionRef = useRef();
  const [sex, setSex] = useState(false);
  const [zodiac, setZodiac] = useState(false);
  const [answer, setAnswer] = useState("");
  const [question, setQuestion] = useState("");
  const [chars, setChars] = useState(0);
  const qMaxLen = 100;

  const getToken = async () => {
    const token = await authUserCredential.getIdToken(true);
    setIdToken(token.toString());
  };

  useEffect(() => {
    getToken();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    answer && props.aiReady(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [answer]);

  const t = {
    en: {
      new: "New!",
      txtAreaLabel: "Provide short question.",
      txtAreaPlaceholder: "(I got a new job offer, should I take it?)",
      attach: "Attach to the question:",
      zodiac: "Zodiac sign",
      sex: "Sex",
      loading: "Loading...",
      button: "Get Ai Reading!",
      aiDesc: "Artificial intelligence will interpret your tarot along with selected cards and asked question!",
      yourAnswer: "Your answer is ready!",
      back: "Home",
    },
    pl: {
      new: "Nowość!",
      txtAreaLabel: "Wprowadź krótkie pytanie.",
      txtAreaPlaceholder: "(przykład: dostałem ofertę nowej pracy, powinienem ją przyjąć?)",
      attach: "Dołącz do pytania:",
      zodiac: "Znak zodiaku",
      sex: "Płeć",
      loading: "Ładuję...",
      button: "Zdobądź odpowiedź!",
      aiDesc: "Twojego tarota wraz z wybranymi kartami i zadanym pytaniem zinterpretuje sztuczna inteligencja!",
      yourAnswer: "Interpretacja gotowa!",
      back: "Strona Główna",
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
    setLoading(true);
    setAnswer("");
    setQuestion(questionRef.current.value.trim());
    const title = await translateText(props.tarotTitle, "pl", "en");
    const question =
      locale == "pl"
        ? await translateText(questionRef.current.value.trim(), "pl", "en")
        : questionRef.current.value.trim();

    const readyQuestion = `${sex ? `I am ${authUserFirestore.sex}.` : ""}${
      zodiac ? `My zodiac is ${authUserFirestore.zodiac}. ` : ""
    }I did the ${title} tarot with question:${question}. My cards: ${props.cards.join(",")}. What does it mean?`;

    try {
      const payload = {
        secret: process.env.NEXT_PUBLIC_API_KEY,
        idToken: idToken,
        data: readyQuestion,
      };
      const res = await axios.post("/api/openai/", payload);
      const generatedAnswer = locale == "pl" ? await translateText(res.data.answer, "en", "pl") : res.data.answer;
      setAnswer(generatedAnswer);
      setLoading(false);
      //? Add answer and data to the "ai readings page?"
    } catch (error) {
      console.log(error);
      setErrorMsg(t[locale].sthWrong);
      setLoading(false);
      throw error;
    }
  };

  return (
    <div className="color-primary">
      {!answer ? (
        <Form className="m-auto mt-4 color-primary" style={{ maxWidth: "500px" }} onSubmit={getOpenAiAnswers}>
          <FloatingLabel label={t[locale].txtAreaLabel} className="text-start">
            <Form.Control
              as="textarea"
              type="text"
              ref={questionRef}
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
          <p className="mt-4 mb-1">{t[locale].attach}</p>
          <Form.Check inline label={t[locale].zodiac} checked={zodiac} onChange={() => setZodiac(!zodiac)} />
          <Form.Check inline label={t[locale].sex} checked={sex} onChange={() => setSex(!sex)} />
          <div className="w-100">
            <Button className="mt-3" type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                  <span> {t[locale].loading}</span>
                </>
              ) : (
                <span>{t[locale].button}</span>
              )}
            </Button>
          </div>
        </Form>
      ) : (
        <section>
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
    </div>
  );
}

export default TarotOpenAi;
