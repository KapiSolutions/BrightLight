import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card, Spinner, Alert, Button } from "react-bootstrap";
import { RiAlertFill } from "react-icons/ri";
import { useAuth } from "../context/AuthProvider";

function Horoscope() {
  const { authUserFirestore } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [zodiac, setZodiac] = useState(null);
  const [when, setWhen] = useState("today");
  const baseURL = "https://aztro.sameerkumar.website";
  const month = authUserFirestore?.age.slice(5, 7);
  const day = authUserFirestore?.age.slice(8, 10);
  const zodiacPath = "/img/zodiac/";

  useEffect(() => {
  if(!authUserFirestore){
    return;
  }
  }, [authUserFirestore])
  

  function getZodiac(month, day) {
    var datecode = month * 1 + day; //this will give us a number represent month and day
    if (datecode <= 120) {
      // Jan 20
      return "Capricorn";
    } else if (datecode <= 219) {
      // Feb 19
      return "Aquarius";
    } else if (datecode <= 320) {
      // Mar 20
      return "Pisces";
    } else if (datecode <= 420) {
      // Apr 20
      return "Aries";
    } else if (datecode <= 520) {
      // May 20
      return "Taurus";
    } else if (datecode <= 621) {
      // Jun 21
      return "Gemini";
    } else if (datecode <= 722) {
      // Jul 22
      return "Cancer";
    } else if (datecode <= 822) {
      // Aug 22
      return "Leo";
    } else if (datecode <= 921) {
      // Sept 21
      return "Virgo";
    } else if (datecode <= 1022) {
      // Oct 22
      return "Libra";
    } else if (datecode <= 1121) {
      // Nov 21
      return "Scorpio";
    } else if (datecode <= 1221) {
      // Dec 21
      return "Sagittarius";
    } else {
      //if we hit this case it means we hava greater date code than Dec 21
      return "Capricorn";
    }
  }
  function getHoroscope(day) {
    axios
      .post(baseURL, null, {
        params: {
          sign: zodiac,
          day: day,
        },
      })
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        setError(error.message);
      });
    setWhen(day);
  }
  useEffect(() => {
    const zodiakSign = getZodiac(month, day);
    setError("");
    setZodiac(zodiakSign);
    axios
      .post(baseURL, null, {
        params: {
          sign: zodiakSign,
          day: "today",
        },
      })
      .then((response) => {
        setData(response.data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div style={{minHeight: "200px"}}>
      {loading ? (
        <div className="color-primary">
          <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
          <span> Loading...</span>
        </div>
      ) : (
        <>
          {error && (
            <Alert variant="danger">
              <RiAlertFill className="me-2 mb-1 iconSizeAlert" />
              <strong>Ups! </strong>
              {error}
            </Alert>
          )}
          {!error && (
            <>
              <div style={{ width: "150px", height: "150px" }} className="ms-auto me-auto mt-4 mb-2">
                <Card.Img src={`${zodiacPath + zodiac}.png`} variant="top" alt={`zodiac sign ${zodiac}`}/>
              </div>
              <p className="text-muted">
                <i>{data.current_date}</i>
              </p>
              <p className="color-primary">{data.description}</p>
              <div className="text-center color-primary mt-5">
                <strong>Compatibility:</strong> {data.compatibility} <br />
                <strong>Lucky Number:</strong> {data.lucky_number} <br />
                <strong>Lucky Time:</strong> {data.lucky_time} <br />
                <strong>Mood:</strong> {data.mood} <br />
                <strong>Color:</strong> {data.color} <br />
                {/* <strong>Date Range:</strong> {data.date_range} <br /> */}
              </div>
              <section className="d-flex justify-content-center mt-5 gap-3">
                <Button
                  variant={when === "yesterday" ? "outline-primary" : "primary"}
                  onClick={() => getHoroscope("yesterday")}
                  disabled={when === "yesterday"}
                >
                  &#60; Yesterday
                </Button>
                <Button variant={when === "today" ? "outline-primary" : "primary"} onClick={() => getHoroscope("today")} disabled={when === "today"}>
                  Today
                </Button>
                <Button
                  variant={when === "tomorrow" ? "outline-primary" : "primary"}
                  onClick={() => getHoroscope("tomorrow")}
                  disabled={when === "tomorrow"}
                >
                  Tommorrow &#62;
                </Button>
              </section>
              <p className="text-muted"><small><i>Daily Horoscope provided by aztro - The astrology API</i></small></p>
            </>
          )}
        </>
      )}
    </div>
  );
}

export default Horoscope;
