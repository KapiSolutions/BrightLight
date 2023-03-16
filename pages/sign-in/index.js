import React from "react";
import Head from "next/head";
import LayoutSign from "../../components/layout/Sign/LayoutSign";
import SignInForm from "../../components/SignInForm";
import { setup } from '../../config/csrf';
import { useDeviceStore } from "../../stores/deviceStore";

function SignIn() {
  const theme = useDeviceStore((state) => state.themeState);
  return (
    <>
      <Head>
        <title>BrightLight | Sign In</title>
      </Head>

      <SignInForm theme={theme} />
    </>
  );
}

export default SignIn;

SignIn.getLayout = function getLayout(page) {
  return <LayoutSign>{page}</LayoutSign>;
};

export const getServerSideProps = setup(async ({req, res}) => {
  return { props: {}}
});
