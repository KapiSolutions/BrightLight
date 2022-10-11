import React from "react";
import Head from "next/head";
import { Container } from "react-bootstrap";
import Horoscope from "../../../components/Horoscope";

function HoroscopePage() {
  return (
    <>
      <Head>
        <title>BrightLight | Daily horoscope</title>
      </Head>
      <Container className="justify-content-center text-center mt-5">
        <h1 className="color-primary">Horoscope</h1>
        <Horoscope />
      </Container>
    </>
  );
}

export default HoroscopePage;
