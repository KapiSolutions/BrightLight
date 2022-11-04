import React from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { Container } from "react-bootstrap";

function UserOrderDetailsPage() {
  const router = useRouter();
  return (
    <>
      <Head>
        <title>BrightLight | Order details</title>
      </Head>
      <Container className="justify-content-center text-center mt-5">
        <h1 className="color-primary">Order Details</h1>
        <p>ID: {router.query.pid}</p>
      </Container>
    </>
  );
}

export default UserOrderDetailsPage;
