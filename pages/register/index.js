import React from "react";
import { NextSeo } from "next-seo";
import LayoutSign from "../../components/layout/Sign/LayoutSign";
import RegisterForm from "../../components/RegisterForm";
import { useDeviceStore } from "../../stores/deviceStore";
import { useRouter } from "next/router";

function Register() {
  const router = useRouter();
  const locale = router.locale;
  const theme = useDeviceStore((state) => state.themeState);
  const t = {
    en: {
      title: "Sign Up",
    },
    pl: {
      title: "Rejestracja",
    },
  };
  return (
    <>
      <NextSeo
        title={`BrightLight | ${t[locale].title}`}
        canonical={`https://www.brightlightgypsy.pl/${locale}/register`}
        languageAlternates={[
          {
            hrefLang: "en",
            href: "https://www.brightlightgypsy.pl/en/register",
          },
          {
            hrefLang: "pl",
            href: "https://www.brightlightgypsy.pl/pl/register",
          },
          {
            hrefLang: "x-default",
            href: "https://www.brightlightgypsy.pl/register",
          },
        ]}
      />

      <RegisterForm theme={theme} />
    </>
  );
}

export default Register;

Register.getLayout = function getLayout(page) {
  return <LayoutSign>{page}</LayoutSign>;
};
