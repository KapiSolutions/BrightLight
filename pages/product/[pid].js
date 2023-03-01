import React from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { Container, Button } from "react-bootstrap";
import TarotLottery from "../../components/TarotLottery";
import { getDocById, getDocsFromCollection } from "../../firebase/Firestore";
import { VscBracketError } from "react-icons/vsc";
import { useDeviceStore } from "../../stores/deviceStore";

function ProductPage(props) {
  const router = useRouter();
  const lang = useDeviceStore((state) => state.lang);
  return (
    <>
      <Head>
        <title>BrightLight | {props.product ? props.product.title[lang] : "404 Error"}</title>
      </Head>
      <Container className="justify-content-center text-center mt-5">
        {props.product ? (
          <TarotLottery product={props.product} />
        ) : (
          <div className="text-center">
            <VscBracketError style={{ width: "40px", height: "40px" }} className="mb-3" />
            <h4 className="mt-0 mb-4">Tarot does not exist.</h4>
            <Button variant="outline-primary" onClick={() => router.replace("/#main")}>
              Go Back
            </Button>
          </div>
        )}
      </Container>
    </>
  );
}

export default ProductPage;

export async function getStaticProps(context) {
  const id = context.params.pid;
  const doc = await getDocById("products", id);

  return {
    props: {
      product: doc ? JSON.parse(JSON.stringify(doc)) : null,
    },
    revalidate: 30,
  };
}

export async function getStaticPaths() {
  const docs = await getDocsFromCollection("products", true); //true - get only Id's
  return {
    paths: docs.map((doc) => {
      return {
        params: {
          pid: doc,
        },
      };
    }),
    fallback: "blocking",
  };
}
