import React, {useEffect} from "react";
import Head from "next/head";
import { Container } from "react-bootstrap";
import Horoscope from "../../../components/Horoscope";

function HoroscopePage() {
const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
}
async function scroll () {
  await sleep(300)
  document.getElementById("uh-ctx").scrollIntoView();
  }

  useEffect(() => {
    scroll();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  

  return (
    <>
      <Head>
        <title>BrightLight | Daily horoscope</title>
      </Head>
      <Container className="justify-content-center text-center mt-5" id="uh-ctx">
        <h1 className="color-primary">Horoscope</h1>
        <Horoscope />
      </Container>
    </>
  );
}

export default HoroscopePage;
