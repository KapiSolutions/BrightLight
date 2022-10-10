import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { Card, Spinner } from "react-bootstrap";
import { useAuth } from "../context/AuthProvider";

function Horoscope() {
  const router = useRouter();
  const { authUserFirestore } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [zodiac, setZodiac] = useState(null);
  const baseURL = "https://aztro.sameerkumar.website";
  const month = authUserFirestore.age.slice(5, 7);
  const day = authUserFirestore.age.slice(8, 10);
  const zodiacPath = "/img/zodiac/";

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

  useEffect(() => {
    setZodiac(getZodiac(month, day));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (zodiac) {
      axios
        .post(baseURL, null, {
          params: {
            sign: "Libra",
            day: "today",
          },
        })
        .then((response) => {
          setData(response.data);
          setLoading(false);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [zodiac]);

  return (
    <>
      {loading ? (
        <div className="color-primary">
          <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
          <span> Loading...</span>
        </div>
      ) : (
        <>
          <div style={{ width: "150px", height: "150px" }} className="ms-auto me-auto mt-4 mb-2">
            <Card.Img src={`${zodiacPath + zodiac}.png`} variant="top" alt={`zodiac sign ${zodiac}`} />
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
        </>
      )}
    </>
  );
}

export default Horoscope;
