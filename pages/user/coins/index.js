import React, { useEffect, useRef, useState } from "react";
import Head from "next/head";
import { Button, Card, Container, Form } from "react-bootstrap";
import { useDeviceStore } from "../../../stores/deviceStore";
import { useAuth } from "../../../context/AuthProvider";
import { useRouter } from "next/router";
import Link from "next/link";
import { BiCoin } from "react-icons/bi";
import Image from "next/image";
import coinImg from "../../../public/img/coins/coins2.jpg";
import visaSvg from "../../../public/img/pay_methods/visa.svg";
import mcardSvg from "../../../public/img/pay_methods/mcard.svg";
import amexSvg from "../../../public/img/pay_methods/amex.svg";
import p24Svg from "../../../public/img/pay_methods/p24.svg";
import blikSvg from "../../../public/img/pay_methods/blik.svg";

function CoinsPage() {
  const router = useRouter();
  const locale = router.locale;
  const defAmount = 5;
  const price = 2;
  const coinsRef = useRef();
  const [amountToPay, setAmountToPay] = useState((defAmount * price).toFixed(2));
  const theme = useDeviceStore((state) => state.themeState);
  const isMobile = useDeviceStore((state) => state.isMobile);
  const currency = useDeviceStore((state) => state.currency);
  const { isAuthenticated, authUserFirestore } = useAuth();
  const themeDarkInput = theme == "dark" ? "bg-accent6 text-light border-accent4" : "";

  const sleep = (milliseconds) => {
    return new Promise((resolve) => setTimeout(resolve, milliseconds));
  };
  async function scroll() {
    await sleep(300);
    document.getElementById("uc-ctx").scrollIntoView();
  }

  useEffect(() => {
    if (isAuthenticated()) {
      isMobile && scroll();
    } else {
      router.replace("/sign-in");
      return;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const t = {
    en: {
      title: "Bright Coins",
      home: "Home",
      whatIsCoin:
        "Bright Coins are a virtual currency that allows you to use artificial intelligence in the form of Tarot interpretations.",
      yourCoins: "Your Bright Coins: ",
      inputLabel: "Enter the amount of coins",
      accept: "I accept the",
      terms: "Terms of service",
      declare: "and I declare that I am over 18 years old.",
    },
    pl: {
      title: "Moje Monety",
      home: "Strona Główna",
      whatIsCoin:
        "Monety to wirtualna waluta pozwalająca na korzystanie z sztucznej inteligencji w formie interpretacji Tarota.",
      yourCoins: "Twoje monety: ",
      inputLabel: "Wybierz ilość monet",
      accept: "Akceptuje",
      terms: "Regulamin",
      declare: "i oświadczam, że mam skończone 18lat.",
    },
  };

  const buyCoins = async (e) =>{
    e.preventDefault();
  }
  return (
    <>
      <Head>
        <title>BrightLight | {t[locale].title}</title>
      </Head>
      <Container className="justify-content-center color-primary text-center mt-4" id="uc-ctx">
        <nav className="d-flex gap-2">
          <small>
            <Link href="/#main">{t[locale].home}</Link>
          </small>
          <small>&gt;</small>
          <small>{t[locale].title}</small>
        </nav>
        <h1>{t[locale].title}</h1>
        <p>{t[locale].whatIsCoin}</p>

        <section className="text-center mt-4">
          <p>
            {t[locale].yourCoins}
            <span className="ms-1">
              {authUserFirestore?.coins.amount}
              <BiCoin className="ms-1" style={{ width: "22px", height: "22px", position: "relative", bottom: "1px" }} />
            </span>
          </p>
        </section>
        <section className="d-flex justify-content-center">
          <Card style={{ maxWidth: isMobile ? "90%" : "320px" }} className="background border rounded shadow-sm w-100">
            <div className="rounded" style={{ position: "relative", height: "120px" }}>
              <Image
                src={coinImg}
                // variant="top"
                fill
                placeholder="blur"
                //   blurDataURL={placeholder("dark")}
                sizes="(max-width: 768px) 100vw, 33vw"
                alt={`${t[locale].title} - Bright Light Gypsy Tarot`}
                title={`${t[locale].title} - Bright Light Gypsy Tarot`}
                style={{ objectFit: "cover" }}
                className="rounded-top"
              />
            </div>
            <Card.Header className="color-primary border-bottom border-top border-accent4">
                <strong>1 moneta = 2zł</strong>
              </Card.Header>
            <Card.Body>
              <Form onSubmit={buyCoins}>
                <Form.Label htmlFor="coinsAmountBuyField">{t[locale].inputLabel}</Form.Label>
                <Form.Control
                  type="number"
                  min={5}
                  max={30}
                  step={1}
                  name="coinsAmountBuyField"
                  ref={coinsRef}
                  onChange={() => setAmountToPay((coinsRef.current.value * price).toFixed(2))}
                  defaultValue={defAmount}
                  className={`${themeDarkInput} m-auto mb-4`}
                  style={{ width: "80px" }}
                />
                <p>
                  <span>Razem: </span>
                  <span className="text-uppercase">
                    <strong>
                      {amountToPay} {currency}
                    </strong>
                  </span>
                </p>

                <Form.Check id="coinsCheckAgreement" className="d-flex justify-content-center">
                  <Form.Check.Input type="checkbox" className="pointer" required />
                  <Form.Check.Label>
                    <sup>
                      {t[locale].accept}{" "}
                      <Link
                        href="/terms-of-service#main"
                        passHref
                        className="text-decoration-underline text-primary pointer"
                      >
                        {t[locale].terms}
                      </Link>{" "}
                      {t[locale].declare}
                    </sup>
                  </Form.Check.Label>
                </Form.Check>

                <Button type="submit">Kup teraz</Button>

              </Form>
            </Card.Body>
            <Card.Footer className={`${theme === "dark" && "border-top border-dark"}`}>
              <section className="d-flex justify-content-center gap-1">
                <Image src={visaSvg} width="32" height="32" alt="Visa" />
                <Image src={mcardSvg} width="32" height="32" alt="Master card" />
                <Image src={amexSvg} width="30" height="32" alt="American express" />
                <Image src={p24Svg} width="32" height="32" alt="Przelewy24" />
                <Image src={blikSvg} width="36" height="32" alt="blik" />
              </section>
            </Card.Footer>
          </Card>
        </section>
      </Container>
    </>
  );
}

export default CoinsPage;
