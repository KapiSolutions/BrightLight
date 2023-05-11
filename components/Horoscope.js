import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card, Spinner, Alert, Button } from "react-bootstrap";
import { RiAlertFill } from "react-icons/ri";
import { useAuth } from "../context/AuthProvider";
import { useRouter } from "next/router";
import { useDeviceStore } from "../stores/deviceStore";
const parse = require("html-react-parser");
import DOMPurify from "dompurify";

function Horoscope() {
  const router = useRouter();
  const locale = router.locale;
  const { authUserFirestore } = useAuth();
  const [horoscope, setHoroscope] = useState({ en: "", pl: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [when, setWhen] = useState("today");
  const [date, setDate] = useState(null);
  const isMobile = useDeviceStore((state) => state.isMobile);
  const zodiacPath = "/img/zodiac/";

  const getZodiacNumber = (zodiac) => {
    switch (zodiac) {
      case "Aries":
        return 1;
      case "Taurus":
        return 2;
      case "Gemini":
        return 3;
      case "Cancer":
        return 4;
      case "Leo":
        return 5;
      case "Virgo":
        return 6;
      case "Libra":
        return 7;
      case "Scorpio":
        return 8;
      case "Sagittarius":
        return 9;
      case "Capricorn":
        return 10;
      case "Aquarius":
        return 11;
      case "Pisces":
        return 12;
      default:
        return 1;
    }
  };

  useEffect(() => {
    if (!authUserFirestore) {
      return;
    } else {
      setError("");
      getHoroscope("today");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authUserFirestore]);

  const zodiac = authUserFirestore.zodiac;

  const getHoroscope = async (day) => {
    // day = "yesterday" / "today" / "tomorrow"
    setLoading(true);
    const sign = getZodiacNumber(zodiac);
    let dateNow = new Date();
    switch (day) {
      case "yesterday":
        dateNow.setDate(dateNow.getDate() - 1);
        setDate(dateNow);
        break;
      case "today":
        setDate(dateNow);
        break;
      case "tomorrow":
        dateNow.setDate(dateNow.getDate() + 1);
        setDate(dateNow);
        break;
      default:
        setDate(dateNow);
        break;
    }
    try {
      const res = await axios.get(`/api/horoscope/?when=${day}&sign=${sign}`);
      const general = DOMPurify.sanitize(res.data.general);
      const generalPL = await translateText(general, "en", "pl");
      const love = DOMPurify.sanitize(res.data.love);
      const lovePL = await translateText(love, "en", "pl");
      const wellness = DOMPurify.sanitize(res.data.wellness);
      const wellnessPL = await translateText(wellness, "en", "pl");
      const career = DOMPurify.sanitize(res.data.career);
      const careerPL = await translateText(career, "en", "pl");
      setHoroscope({
        en: {
          general: general,
          love: love,
          wellness: wellness,
          career: career,
        },
        pl: {
          general: generalPL,
          love: lovePL,
          wellness: wellnessPL,
          career: careerPL,
        },
      });
    } catch (error) {
      setError(error.message);
    } finally {
      setWhen(day);
      setLoading(false);
    }
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

  const t = {
    en: {
      loading: "Loading...",
      general: "General",
      love: "Love",
      wellness: "Health",
      career: "Career",
      yesterday: "Yesterday",
      today: "Today",
      tomorrow: "Tomorrow",
      error:
        "Error on the side of the horoscope provider. We hope that the provider will deal with the problem quickly and you will be able to use your daily horoscope again. ❤",
    },
    pl: {
      loading: "Ładuję...",
      general: "Ogólnie",
      love: "Miłość",
      wellness: "Zdrowie",
      career: "Kariera",
      yesterday: "Wczoraj",
      today: "Dzisiaj",
      tomorrow: "Jutro",
      error:
        "Błąd po stronie dostawcy horoskopu. Mamy nadzieję, że dostawca szybko upora się z problemem i będziesz mógł znów korzystać z codziennego horoskopu. ❤",
    },
  };
  return (
    <div style={{ minHeight: "200px" }}>
      {loading ? (
        <div className="color-primary">
          <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
          <span> {t[locale].loading}</span>
        </div>
      ) : (
        <>
          {error && (
            <div className={isMobile ? "w-100" : "w-50 m-auto"}>
              <Alert variant="danger">
                <RiAlertFill className="me-2 mb-1 iconSizeAlert" />
                <strong>Ups! </strong>
                {error}
              </Alert>
              <p>{t[locale].error}</p>
            </div>
          )}
          {!error && (
            <>
              <div style={{ width: "150px", height: "150px" }} className="ms-auto me-auto mt-4 mb-2">
                <Card.Img src={`${zodiacPath + zodiac}.png`} variant="top" alt={`zodiac sign ${zodiac}`} />
              </div>
              <p className="text-muted">
                <i>{date.toLocaleDateString()}</i>
              </p>
              <section className={`d-flex flex-column color-primary m-auto ${isMobile ? "w-100" : "w-75"}`}>
                <p>{parse(horoscope[locale].general)}</p>
                <section className="w-50 m-auto mb-2">
                  <hr />
                </section>

                <h4 className="mt-1 mb-1">{t[locale].love}</h4>
                <p>{parse(horoscope[locale].love)}</p>
                <section className="w-50 m-auto mb-2">
                  <hr />
                </section>
                <h4 className="mt-1 mb-1">{t[locale].career}</h4>
                <p>{parse(horoscope[locale].career)}</p>
                <section className="w-50 m-auto mb-2">
                  <hr />
                </section>
                <h4 className="mt-1 mb-1">{t[locale].wellness}</h4>
                <p>{parse(horoscope[locale].wellness)}</p>
              </section>

              <section className="d-flex justify-content-center mt-5 gap-3">
                <Button
                  variant={when === "yesterday" ? "outline-primary" : "primary"}
                  onClick={() => getHoroscope("yesterday")}
                  disabled={when === "yesterday"}
                >
                  &#60; {t[locale].yesterday}
                </Button>
                <Button
                  variant={when === "today" ? "outline-primary" : "primary"}
                  onClick={() => getHoroscope("today")}
                  disabled={when === "today"}
                >
                  {t[locale].today}
                </Button>
                <Button
                  variant={when === "tomorrow" ? "outline-primary" : "primary"}
                  onClick={() => getHoroscope("tomorrow")}
                  disabled={when === "tomorrow"}
                >
                  {t[locale].tomorrow} &#62;
                </Button>
              </section>
            </>
          )}
        </>
      )}
    </div>
  );
}

export default Horoscope;
