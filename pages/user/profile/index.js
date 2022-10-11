import React, { useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { Container } from "react-bootstrap";
import { useAuth } from "../../../context/AuthProvider";
import UserProfile from "../../../components/UserProfile";

function UserProfilePage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  useEffect(() => {
    !isAuthenticated() && router.replace("/sign-in");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <>
      <Head>
        <title>BrightLight | Profile</title>
      </Head>
      <Container className="justify-content-center text-center mt-5">
        <h1 className="color-primary" >User Profile</h1>
        <UserProfile />
      </Container>
    </>
  );
}

export default UserProfilePage;
