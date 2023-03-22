import React, { useState, useEffect } from "react";
import { Alert, Button, Modal, Form, Stack, FloatingLabel, Spinner } from "react-bootstrap";
import { useRouter } from "next/router";
import { RiAlertFill } from "react-icons/ri";
import { IoCheckmarkDoneSharp } from "react-icons/io5";
import styles from "../../styles/components/MsgModals.module.scss";

function NewUserModal(props) {
  const router = useRouter();
  const locale = router.locale;
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [month, setMonth] = useState("");
  const [day, setDay] = useState(0);
  const [days, setDays] = useState(0);
  const [year, setYear] = useState(0);
  const years = new Date().getFullYear();
  const months = {
    en: [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ],
    pl: [
      "Styczeń",
      "Luty",
      "Marzec",
      "Kwiecień",
      "Maj",
      "Czerwiec",
      "Lipiec",
      "Sierpień",
      "Wrzesień",
      "Październik",
      "Listopad",
      "Grudzień",
    ],
  };

  function getZodiac(month, day) {
    let datecode = month * 1 + day; //this will give us a number represent month and day
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

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);
    let _month = months.en.indexOf(month) + 1;
    _month = _month < 10 ? "0" + _month.toString() : _month.toString();
    const _day = day < 10 ? "0" + day.toString() : day.toString();
    const fullDate = `${year.toString()}-${_month}-${_day}`;
    const zodiac = getZodiac(months.en.indexOf(month) + 1, day);
    try {
      await props.update({ age: fullDate, zodiac: zodiac });
      setLoading(false);
      setShow(false);
      props.resetMsg("");
    } catch (error) {
      setLoading(false);
      return setError(error);
    }
  }
  useEffect(() => {
    props.msg == "newUser" && setShow(true);
  }, [props.msg]);

  useEffect(() => {
    if (
      month === "January" ||
      month === "March" ||
      month === "May" ||
      month === "July" ||
      month === "August" ||
      month === "October" ||
      month === "December"
    ) {
      setDays(31);
    } else if (month === "April" || month === "June" || month === "September" || month === "November") {
      setDays(30);
    } else {
      new Date(year, 1, 29).getMonth() === 1 ? setDays(29) : setDays(28);
    }
  }, [year, month]);

  const t = {
    en: {
      h1: "WHAT'S YOUR BIRTH DATE?",
      year: "Year",
      month: "Month",
      day: "Day",
      loading: "Loading...",
      button: "Save",
      info: "Date of birth is needed for the correct interpretation of the tarots and also for the compilation of an individual horoscope.",
    },
    pl: {
      h1: "PODAJ SWOJĄ DATĘ URODZIN",
      year: "Rok",
      month: "Miesiąc",
      day: "Dzień",
      loading: "Ładuję...",
      button: "Zapisz",
      info: "Data urodzenia jest potrzebna do prawidłowej interpretacji kart tarota, a także do generowania indywidualnego horoskopu.",
    },
  };
  return (
    <Modal
      show={show}
      onHide={() => {
        setShow(false);
        props.resetMsg("");
        router.push("#main");
      }}
      centered
      animation={true}
      backdrop="static"
      keyboard={false}
      className="text-center"
    >
      {!message && !error && (
        <>
          <div className={`${styles.newUserBackground} text-light`}>
            <Modal.Header className={`border-0 justify-content-center `}>
              <h1 className="fs-2 mt-2 mb-2">
                <strong>{t[locale].h1}</strong>
              </h1>
            </Modal.Header>
            <Modal.Body>
              <Form onSubmit={handleSubmit}>
                <Stack className="justify-content-center mb-5" direction="horizontal" gap={2}>
                  <FloatingLabel controlId="SelectYear" label={t[locale].year} className="text-dark shadow">
                    <Form.Select aria-label="SelectYear" onChange={(e) => setYear(e.target.value)} required>
                      <option></option>
                      {Array.from({ length: 100 }).map((_, idx) => (
                        <option key={idx} value={years - idx}>
                          {years - idx}
                        </option>
                      ))}
                    </Form.Select>
                  </FloatingLabel>

                  <FloatingLabel controlId="SelectMonth" label={t[locale].month} className="text-dark shadow">
                    <Form.Select aria-label="SelectMonth" onChange={(e) => setMonth(e.target.value)} required>
                      <option></option>
                      {months.en.map((month, idx) => (
                        <option key={idx} value={month}>
                          {months[locale][idx]}
                        </option>
                      ))}
                    </Form.Select>
                  </FloatingLabel>

                  <FloatingLabel controlId="SelectDay" label={t[locale].day} className="text-dark shadow">
                    <Form.Select aria-label="SelectDay" onChange={(e) => setDay(e.target.value)} required>
                      <option></option>
                      {Array.from({ length: days }).map((_, idx) => (
                        <option key={idx} value={idx + 1}>
                          {idx + 1}
                        </option>
                      ))}
                    </Form.Select>
                  </FloatingLabel>
                </Stack>

                <Button size="lg" variant="primary" type="submit" className="w-50 mb-2 shadow" disabled={loading}>
                  {loading ? (
                    <>
                      <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                      <span>{t[locale].loading}</span>
                    </>
                  ) : (
                    <span>{t[locale].button}</span>
                  )}
                </Button>
              </Form>
            </Modal.Body>
          </div>

          <Modal.Footer className="text-start ">
            <small>{t[locale].info}</small>
          </Modal.Footer>
        </>
      )}
      {(message || error) && (
        <>
          <div className={`${styles.newUserBackground} text-light`}>
            <Modal.Header className={`border-0 justify-content-center `} closeButton>
              <h1 className="fs-2 mt-2 mb-2">
                <strong>SUCCESS!</strong>
              </h1>
            </Modal.Header>
            <Modal.Body>
              {error && (
                <Alert variant="danger">
                  <RiAlertFill className="me-2 mb-1 iconSizeAlert" />
                  <strong>Ups! </strong>
                  {error}
                </Alert>
              )}
              {message && (
                <Alert variant="success">
                  <IoCheckmarkDoneSharp className="me-2 mb-1 iconSizeAlert" />
                  <strong>Ok! </strong>
                  {message}
                </Alert>
              )}
            </Modal.Body>
          </div>
        </>
      )}
    </Modal>
  );
}

export default NewUserModal;
