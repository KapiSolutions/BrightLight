import React from "react";
import { NextSeo } from "next-seo";
import LayoutSign from "../../components/layout/Sign/LayoutSign";
import SignInForm from "../../components/SignInForm";
import { setup } from "../../config/csrf";
import { useDeviceStore } from "../../stores/deviceStore";
import { useRouter } from "next/router";

function SignIn() {
  const router = useRouter();
  const locale = router.locale;
  const theme = useDeviceStore((state) => state.themeState);
  const t = {
    en: {
      title: "Sign In",
    },
    pl: {
      title: "Logowanie",
    },
  };
  return (
    <>
      <NextSeo
        title={`BrightLight | ${t[locale].title}`}
        canonical={`https://www.brightlightgypsy.pl/${locale}/sign-in`}
        languageAlternates={[
          {
            hrefLang: "en",
            href: "https://www.brightlightgypsy.pl/en/sign-in",
          },
          {
            hrefLang: "pl",
            href: "https://www.brightlightgypsy.pl/pl/sign-in",
          },
          {
            hrefLang: "x-default",
            href: "https://www.brightlightgypsy.pl/sign-in",
          },
        ]}
      />

      <SignInForm theme={theme} />
    </>
  );
}

export default SignIn;

SignIn.getLayout = function getLayout(page) {
  return <LayoutSign>{page}</LayoutSign>;
};

export const getServerSideProps = setup(async ({ req, res }) => {
  return { props: {} };
});
