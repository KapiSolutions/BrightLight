import Image from "next/image";
import React from "react";
import { Container, Button } from "react-bootstrap";
import LayoutSign from "../components/layout/Sign/LayoutSign";
import Link from "next/link";
import Navigation from "../components/layout/Main/Header/Navigation";
import useLocalStorageState from "use-local-storage-state";

function ErrorPage() {
  const [theme, setTheme] = useLocalStorageState("theme", {
    ssr: true,
    defaultValue: "light",
  });
  return (
    <div className="landingBack w-100 d-flex align-items-center" style={{ position: "absolute", minHeight: "100vh" }}>
      <Navigation theme={theme} />

      <Container className="d-block text-center pt-5">
        <h1 className="color-primary">PAGE NOT FOUND</h1>

        <Image src="/svg/404.svg" alt="404 page not found" width="350" height="350" />
        <br />
        <br />
        <Link href="/" passHref>
          <Button variant="primary" size="lg">
            Back to Home
          </Button>
        </Link>
      </Container>
    </div>
  );
}

export default ErrorPage;

ErrorPage.getLayout = function getLayout(page) {
  return <LayoutSign>{page}</LayoutSign>;
};
