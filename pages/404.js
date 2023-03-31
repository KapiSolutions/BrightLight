import Image from "next/image";
import React from "react";
import { Container, Button } from "react-bootstrap";
import LayoutSign from "../components/layout/Sign/LayoutSign";
import Link from "next/link";
import Navigation from "../components/layout/Main/Header/Navigation";
import { useDeviceStore } from "../stores/deviceStore";
import { useRouter } from "next/router";
import { NextSeo } from "next-seo";

function ErrorPage() {
  const router = useRouter();
  const locale = router.locale;
  const theme = useDeviceStore((state) => state.themeState);
  const t = {
    en: {
      title: "Sign In",
      notFound: "Page not found",
      back: "Back to Home page",
    },
    pl: {
      title: "Logowanie",
      notFound: "Nie ma takiej strony",
      back: "Powrót",
    },
  };
  return (
    <>
      <NextSeo
        title={`BrightLight | ${t[locale].title}`}
        canonical={`https://www.brightlightgypsy.pl/${locale}/404`}
        languageAlternates={[
          {
            hrefLang: "en",
            href: "https://www.brightlightgypsy.pl/en/404",
          },
          {
            hrefLang: "pl",
            href: "https://www.brightlightgypsy.pl/pl/404",
          },
          {
            hrefLang: "x-default",
            href: "https://www.brightlightgypsy.pl/404",
          },
        ]}
      />

      <div className="landingBack w-100 d-flex align-items-center" style={{ position: "absolute", minHeight: "100vh" }}>
        <Navigation theme={theme} locale={locale} />

        <Container className="d-block text-center pt-5">
          <h1 className="color-primary text-uppercase">{t[locale].notFound}</h1>

          <Image src="/svg/404.svg" alt="404 page not found" width="350" height="350" />
          <br />
          <br />
          <Link href="/" passHref legacyBehavior>
            <Button variant="primary" size="lg">
              {t[locale].back}
            </Button>
          </Link>
        </Container>
      </div>
    </>
  );
}

export default ErrorPage;

ErrorPage.getLayout = function getLayout(page) {
  return <LayoutSign>{page}</LayoutSign>;
};
