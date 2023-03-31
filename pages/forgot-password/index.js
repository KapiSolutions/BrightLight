import React from 'react'
import { NextSeo } from "next-seo";
import LayoutSign from '../../components/layout/Sign/LayoutSign'
import ForgotPasswordForm from '../../components/ForgotPasswordForm'
import { useDeviceStore } from "../../stores/deviceStore";
import { useRouter } from "next/router";

function ForgotPassword() {
  const router = useRouter();
  const locale = router.locale;
  const theme = useDeviceStore((state) => state.themeState);
  const t = {
    en: {
      title: "Forgot password?",
    },
    pl: {
      title: "Resetowanie hasła",
    },
  };
  return (
    <>
      <NextSeo
        title={`BrightLight | ${t[locale].title}`}
        canonical={`https://www.brightlightgypsy.pl/${locale}/forgot-password`}
        languageAlternates={[
          {
            hrefLang: "en",
            href: "https://www.brightlightgypsy.pl/en/forgot-password",
          },
          {
            hrefLang: "pl",
            href: "https://www.brightlightgypsy.pl/pl/forgot-password",
          },
          {
            hrefLang: "x-default",
            href: "https://www.brightlightgypsy.pl/forgot-password",
          },
        ]}
      />
    
    <ForgotPasswordForm theme={theme} />
  </>
  )
}

export default ForgotPassword

ForgotPassword.getLayout = function getLayout(page) {
    return (
      <LayoutSign>
        {page}
      </LayoutSign>
    )
  }