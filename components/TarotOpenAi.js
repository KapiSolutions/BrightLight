import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthProvider";
import { useRouter } from "next/router";
import { useDeviceStore } from "../stores/deviceStore";
import { Button, FloatingLabel, Form } from "react-bootstrap";

function TarotOpenAi(props) {
  const router = useRouter();
  const locale = router.locale;
  const { authUserFirestore, setErrorMsg, authUserCredential } = useAuth();
  const [cards, setCards] = useState("");
  const [loading, setLoading] = useState(false);
  const [idToken, setIdToken] = useState(undefined);
  const isMobile = useDeviceStore((state) => state.isMobile);
  const currency = useDeviceStore((state) => state.currency);
  const theme = useDeviceStore((state) => state.themeState);
  const themeDarkInput = theme == "dark" ? "bg-accent6 text-light" : "";
  const questionRef = useRef();
  const [sex, setSex] = useState(false);
  const [zodiac, setZodiac] = useState(false);

  const getToken = async () => {
    const token = await authUserCredential.getIdToken(true);
    setIdToken(token.toString());
  };

  useEffect(() => {
    getToken();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const t = {
    en: {
      new: "New!",
      txtAreaLabel: "Provide short question.",
      txtAreaPlaceholder: "(I got a new job offer, should I take it?)",
      attach: "Attach to the question:",
      zodiac: "Zodiac sign",
      sex: "Sex",
    },
    pl: {
      new: "Nowość!",
      txtAreaLabel: "Wprowadź krótkie pytanie.",
      txtAreaPlaceholder: "(przykład: dostałem ofertę nowej pracy, powinienem ją przyjąć?)",
      attach: "Dołącz do pytania:",
      zodiac: "Znak zodiaku",
      sex: "Płeć",
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
    const title = await translateText(props.tarotTitle, "pl", "en");
    const question =
      locale == "pl"
        ? await translateText(questionRef.current.value.trim(), "pl", "en")
        : questionRef.current.value.trim();

    const readyQuestion = `${sex ? `I am ${authUserFirestore.sex}.` : ""}${
      zodiac ? `My zodiac is ${authUserFirestore.zodiac}. ` : ""
    }I did the ${title} tarot with question:${question}. My cards: ${props.cards.join(",")}. What does it mean?`;

    console.log(readyQuestion);
    try {
      const payload = {
        secret: process.env.NEXT_PUBLIC_API_KEY,
        idToken: idToken,
        data: readyQuestion,
      };
      //   await axios.post("/api/openai/", payload);
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
      <h4>{t[locale].new}</h4>

      <Form className="m-auto color-primary" style={{ maxWidth: "500px" }} onSubmit={getOpenAiAnswers}>
        <FloatingLabel label={t[locale].txtAreaLabel} className="text-start">
          <Form.Control
            as="textarea"
            type="text"
            ref={questionRef}
            maxLength="100"
            className={`${themeDarkInput} `}
            style={{ minHeight: isMobile ? "150px" : "80px" }}
            required
          />
        </FloatingLabel>
        <p className="mt-2 mb-1">{t[locale].attach}</p>
        <Form.Check inline label={t[locale].zodiac} checked={zodiac} onChange={()=>setZodiac(!zodiac)} />
        <Form.Check inline label={t[locale].sex} checked={sex} onChange={()=>setSex(!sex)} />
        <div className="w-100">
          <Button className="mt-3" type="submit">
            Get Ai Reading!
          </Button>
        </div>
      </Form>
    </div>
  );
}

export default TarotOpenAi;
