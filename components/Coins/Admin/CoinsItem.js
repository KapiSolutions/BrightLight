import React, { useRef, useState } from "react";
import { useRouter } from "next/router";
import { BiCoin } from "react-icons/bi";
import { useDeviceStore } from "../../../stores/deviceStore";
import { Button, Form, Spinner } from "react-bootstrap";
import { BsCurrencyExchange } from "react-icons/bs";
import axios from "axios";

function CoinsItem(props) {
  const router = useRouter();
  const locale = router.locale;
  const coin = props.coin;
  const priceRef_usd = useRef();
  const priceRef_pln = useRef();
  const quantityRef_min = useRef();
  const quantityRef_max = useRef();
  const [edit, setEdit] = useState(false);
  const [loadingExc, setLoadingExc] = useState(false);
  const theme = useDeviceStore((state) => state.themeState);
  const isMobile = useDeviceStore((state) => state.isMobile);
  const currency = useDeviceStore((state) => state.currency);
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
    },
  };

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
    }
    setLoadingExc(false);
  };

  const saveChanges = async (e) => {
    e.preventDefault();
    console.log("save");
  };
  return (
    <section className="d-flex flex-column justify-content-center">
      <div className="d-flex flex-wrap flex-column w-100 justify-content-center align-items-center mt-3 mb-2 gap-2">
        <p>
          {t[locale].quantity} <strong>{coin.quantity.min}-{coin.quantity.max}</strong> {t[locale].pcs}
        </p>
        <p>
        {t[locale].price} <strong>{coin.price.usd.amount.toFixed(2)} USD / {coin.price.pln.amount.toFixed(2)} PLN</strong>
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
            <Button type="submit">{t[locale].save}</Button>
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
