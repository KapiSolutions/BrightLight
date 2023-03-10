import { useRouter } from "next/router";
import React from "react";
import { useDeviceStore } from "../stores/deviceStore";

function ChangeLocale() {
  const router = useRouter();
  const locale = router.locale;
  const setCurrency = useDeviceStore((state) => state.setCurrency);

  const toggleLanguage = (newLocale) => {
    const { pathname, asPath, query } = router;
    router.push({ pathname, query }, asPath, { locale: newLocale });
    setCurrency(newLocale == "pl" ? "pln" : "usd");
  };
  return (
    <span
      onClick={() => {
        toggleLanguage(locale === "en" ? "pl" : "en");
      }}
      className={`text-uppercase`}
      style={{ whiteSpace: "nowrap" }}
    >
      {locale === "en" ? "pl" : "en"}
    </span>
  );
}

export default ChangeLocale;
