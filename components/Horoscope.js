import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card, Spinner, Alert, Button } from "react-bootstrap";
import { RiAlertFill } from "react-icons/ri";
import { useAuth } from "../context/AuthProvider";
import { useRouter } from "next/router";
import { useDeviceStore } from "../stores/deviceStore";

function Horoscope() {
  const router = useRouter();
  const locale = router.locale;
  const { authUserFirestore } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [when, setWhen] = useState("today");
  const isMobile = useDeviceStore((state) => state.isMobile);
  const baseURL = "https://aztro.sameerkumar.website";
  const zodiacPath = "/img/zodiac/";
  const zodiac = authUserFirestore.zodiac;

  useEffect(() => {
    if (!authUserFirestore) {
      return;
    }
  }, [authUserFirestore]);

  function getHoroscope(day) {
    axios
      .post(baseURL, null, {
        params: {
          sign: zodiac,
          day: day,
        },
      })
      .then(async (res) => {
        const resPL = {
          current_date: await translateText(res.data.current_date, "en", "pl"),
          description: await translateText(res.data.description, "en", "pl"),
          compatibility: await translateText(res.data.compatibility, "en", "pl"),
          mood: await translateText(res.data.mood, "en", "pl"),
          color: await translateText(res.data.color, "en", "pl"),
          lucky_number: res.data.lucky_number,
          lucky_time: await translateText(res.data.lucky_time, "en", "pl"),
        };
        setData({ en: res.data, pl: resPL });
      })
      .catch((error) => {
        setError(error.message);
      });
    setWhen(day);
  }

  useEffect(() => {
    setError("");
    axios
      .post(baseURL, null, {
        params: {
          sign: zodiac,
          day: "today",
        },
      })
      .then(async (res) => {
        const resPL = {
          current_date: await translateText(res.data.current_date, "en", "pl"),
          description: await translateText(res.data.description, "en", "pl"),
          compatibility: await translateText(res.data.compatibility, "en", "pl"),
          mood: await translateText(res.data.mood, "en", "pl"),
          color: await translateText(res.data.color, "en", "pl"),
          lucky_number: res.data.lucky_number,
          lucky_time: await translateText(res.data.lucky_time, "en", "pl"),
        };
        setData({ en: res.data, pl: resPL });
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      compatibility: "Compatibility:",
      number: "Lucky Number:",
      time: "Lucky Time:",
      mood: "Mood",
      color: "Color:",
      yesterday: "Yesterday",
      today: "Today",
      tomorrow: "Tomorrow",
      error:
        "Error on the side of the horoscope provider. We hope that the provider will deal with the problem quickly and you will be able to use your daily horoscope again. ❤",
    },
    pl: {
      loading: "Ładuję...",
      compatibility: "Zgodność:",
      number: "Szczęśliwy numer:",
      time: "Szczęśliwa godzina:",
      mood: "Nastrój:",
      color: "Kolor:",
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
                <i>{data[locale].current_date}</i>
              </p>
              <p className="color-primary">{data[locale].description}</p>
              <div className="text-center color-primary mt-5">
                <strong>{t[locale].compatibility}</strong> {data[locale].compatibility} <br />
                <strong>{t[locale].number}</strong> {data[locale].lucky_number} <br />
                <strong>{t[locale].time}</strong> {data[locale].lucky_time} <br />
                <strong>{t[locale].mood}</strong> {data[locale].mood} <br />
                <strong>{t[locale].color}</strong> {data[locale].color} <br />
                {/* <strong>Date Range:</strong> {data.date_range} <br /> */}
              </div>
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
              <p className="text-muted">
                <small>
                  <i>Daily Horoscope provided by aztro - The astrology API</i>
                </small>
              </p>
            </>
          )}
        </>
      )}
    </div>
  );
}

export default Horoscope;
