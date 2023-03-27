import React, { useRef, useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useDeviceStore } from "../../../stores/deviceStore";
import { Button, Form, Spinner } from "react-bootstrap";
import { BsCurrencyExchange } from "react-icons/bs";
import axios from "axios";
import { useAuth } from "../../../context/AuthProvider";
import { updateDocFields } from "../../../firebase/Firestore";

function CoinsItem(props) {
  const router = useRouter();
  const locale = router.locale;
  const coin = props.coin;
  const priceRef_usd = useRef();
  const priceRef_pln = useRef();
  const quantityRef_min = useRef();
  const quantityRef_max = useRef();
  const [edit, setEdit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingExc, setLoadingExc] = useState(false);
  const theme = useDeviceStore((state) => state.themeState);
  const isMobile = useDeviceStore((state) => state.isMobile);
  const currency = useDeviceStore((state) => state.currency);
  const { setErrorMsg, authUserCredential } = useAuth();
  const [idToken, setIdToken] = useState(undefined);
  const themeDarkInput = theme == "dark" ? "bg-accent6 text-light border-accent4" : "";

  const t = {
    en: {
      coins: "Bright Coin",
      price: "Price:",
      wrongPrice: "Wrong value",
      quantity: "How many coins to buy at once:",
      convertTitle: "Convert price to the choosen currency USD/PLN",
      converting: "Converting...",
      pcs: "pcs.",
      save: "Save Changes",
      edit: "Edit",
      closeEdit: "Don't save and close",
      sthWrong: "Something went wrong, please try again later.",
      loading: "Loading...",
    },
    pl: {
      coins: "Moneta",
      price: "Cena:",
      wrongPrice: "Nieprawidłowa wartość",
      quantity: "Ilość monet do kupienia jednorazowo:",
      convertTitle: "Przelicz cenę zgodnie z kursem USD/PLN",
      converting: "Konwertuję...",
      pcs: "szt.",
      save: "Zapisz zmiany",
      edit: "Edytuj",
      closeEdit: "Nie zapisuj i zamknij",
      sthWrong: "Coś poszło nie tak, spróbuj ponownie później.",
      loading: "Ładuję...",
    },
  };

  const getToken = async () => {
    const token = await authUserCredential.getIdToken(true);
    setIdToken(token.toString());
  };

  useEffect(() => {
    getToken();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const exchangeAmount = async () => {
    setLoadingExc(true);
    const pln = priceRef_pln.current.value;
    const usd = priceRef_usd.current.value;
    const have = usd > 0 ? "USD" : pln > 0 ? "PLN" : "USD";
    const want = have === "USD" ? "PLN" : "USD";
    const amount = have === "USD" ? usd : pln;

    const options = {
      method: "GET",
      url: "https://api.api-ninjas.com/v1/convertcurrency",
      params: { have: have, want: want, amount: amount, origin: "origin" },
      headers: {
        "X-Api-Key": process.env.NEXT_PUBLIC_NINJAS_KEY,
      },
    };

    try {
      const res = await axios.request(options);
      if (want === "USD") {
        priceRef_usd.current.value = res.data.new_amount;
      } else {
        priceRef_pln.current.value = res.data.new_amount;
      }
    } catch (error) {
      console.log(error);
      setErrorMsg(t[locale].sthWrong);
    }
    setLoadingExc(false);
  };

  const stripeUpdate = async (ccy) => {
    const tmpData = null;
    const price = ccy == "usd" ? priceRef_usd.current.value : priceRef_pln.current.value;
    const tmpPrice = {
      product: coin.price[ccy].prod_id,
      unit_amount: Math.trunc(price * 100), //price in cents, eg. 2000 means 20$ or 20pln etc.
      currency: ccy,
    };
    const payload = {
      secret: process.env.NEXT_PUBLIC_API_KEY,
      idToken: idToken,
      mode: "update",
      data: { prod: tmpData, price: tmpPrice, id: coin.price[ccy].prod_id },
    };
    try {
      return await axios.post("/api/stripe/products/", payload);
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  const prepareData = async () => {
    let coinData = {
      price: {...coin.price},
      quantity: {...coin.quantity},
    };

    if (coin.quantity.min != Number(quantityRef_min.current.value)) {
      coinData.quantity.min = Number(quantityRef_min.current.value);
    }
    if (coin.quantity.max != Number(quantityRef_max.current.value)) {
      coinData.quantity.max = Number(quantityRef_max.current.value);
    }

    if (coin.price.usd.amount != Number(priceRef_usd.current.value)) {
      try {
        const res = await stripeUpdate("usd");
        if (res) {
          coinData.price.usd.s_id = res.data.default_price;
          coinData.price.usd.amount = Number(priceRef_usd.current.value);
        }
      } catch (e) {
        throw e;
      }
    }
    if (coin.price.pln.amount != Number(priceRef_pln.current.value)) {
      try {
        const res = await stripeUpdate("pln");
        if (res) {
          coinData.price.pln.s_id = res.data.default_price;
          coinData.price.pln.amount = Number(priceRef_pln.current.value);
        }
      } catch (e) {
        throw e;
      }
    }
    return coinData;
  };

  const saveChanges = async (e) => {
    e.preventDefault();
    setLoading(true);
    let data = null;

    try {
      //prepare data and update Stripe coins
      data = await prepareData();
    } catch (e) {
      console.log(e);
      setLoading(false);
      return;
    }

    try {
      //if stripe updates successfull then update the data in the firestore
      await updateDocFields("coins", coin.id, data);
      props.refresh();
      setEdit(false)
    } catch (e) {
      console.log(e);
      setErrorMsg(t[locale].sthWrong);
    }

    setLoading(false);
  };

  return (
    <section className="d-flex flex-column justify-content-center">
      <div className="d-flex flex-wrap flex-column w-100 justify-content-center align-items-center mt-3 mb-2 gap-2">
        <p>
          {t[locale].quantity}{" "}
          <strong>
            {coin.quantity.min}-{coin.quantity.max}
          </strong>{" "}
          {t[locale].pcs}
        </p>
        <p>
          {t[locale].price}{" "}
          <strong>
            {coin.price.usd.amount.toFixed(2)} USD / {coin.price.pln.amount.toFixed(2)} PLN
          </strong>
        </p>
      </div>
      {edit ? (
        <div>
          <Form
            className={`${
              isMobile ? "w-100 mt-3" : "w-25"
            } m-auto d-flex flex-column justify-content-center p-3 border rounded`}
            style={{ minWidth: "350px" }}
            onSubmit={saveChanges}
          >
            {/* Prices */}
            <div className="mb-3">
              <Form.Label>{t[locale].quantity}</Form.Label>
              <div className="d-flex gap-1">
                <Form.Control
                  type="number"
                  min="0"
                  step="any"
                  ref={quantityRef_min}
                  defaultValue={coin.quantity.min}
                  className={`${false && "border border-danger"} ${themeDarkInput}`}
                />
                <span className="text-muted" style={{ position: "relative", right: "70px", top: "4px", width: "0px" }}>
                  Min
                </span>
                <Form.Control
                  type="number"
                  min="0"
                  step="any"
                  ref={quantityRef_max}
                  defaultValue={coin.quantity.max}
                  className={`${false && "border border-danger"} ${themeDarkInput}`}
                />
                <span className="text-muted" style={{ position: "relative", right: "70px", top: "4px", width: "0px" }}>
                  Max
                </span>
              </div>
              {false && <small className="text-danger">{t[locale].wrongPrice}</small>}
            </div>

            {/* Prices */}
            <div>
              <Form.Label>{t[locale].price}</Form.Label>
              <div className="d-flex gap-1">
                <Form.Control
                  type="number"
                  min="0"
                  step="any"
                  ref={priceRef_usd}
                  defaultValue={coin.price.usd.amount}
                  className={`${false && "border border-danger"} ${themeDarkInput}`}
                />
                <span className="text-muted" style={{ position: "relative", right: "70px", top: "4px", width: "0px" }}>
                  USD
                </span>
                <Form.Control
                  type="number"
                  min="0"
                  step="any"
                  ref={priceRef_pln}
                  defaultValue={coin.price.pln.amount}
                  className={`${false && "border border-danger"} ${themeDarkInput}`}
                />
                <span className="text-muted" style={{ position: "relative", right: "70px", top: "4px", width: "0px" }}>
                  PLN
                </span>
              </div>
              {false && <small className="text-danger">{t[locale].wrongPrice}</small>}
            </div>
            <div className="d-flex mt-2">
              <Button
                className={`w-100`}
                variant={`outline-${theme == "dark" ? "light" : "dark"}`}
                onClick={exchangeAmount}
                disabled={loadingExc}
                title={t[locale].convertTitle}
              >
                {loadingExc ? (
                  <>
                    <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                    <span> {t[locale].converting}</span>
                  </>
                ) : (
                  <>
                    USD <BsCurrencyExchange /> PLN
                  </>
                )}
              </Button>
            </div>
            <hr />
            <Button type="submit">
              {loading ? (
                <>
                  <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                  <span> {t[locale].loading}</span>
                </>
              ) : (
                <span>{t[locale].save}</span>
              )}
            </Button>
          </Form>
          <Button
            variant={`outline-${theme === "light" ? "dark" : "light"}`}
            className="mt-4"
            onClick={() => setEdit(false)}
          >
            {t[locale].closeEdit}
          </Button>
        </div>
      ) : (
        <div>
          <Button onClick={() => setEdit(true)}>{t[locale].edit}</Button>
        </div>
      )}
    </section>
  );
}

export default CoinsItem;
