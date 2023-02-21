import React from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { Container, Button } from "react-bootstrap";
import TarotLottery from "../../components/TarotLottery";
import { getDocById, getDocsFromCollection } from "../../firebase/Firestore";
import { VscBracketError } from "react-icons/vsc";

function CardPage(props) {
  const router = useRouter();
  return (
    <>
      <Head>
        <title>BrightLight | {props.tarot ? props.tarot.title : "404 Error"}</title>
      </Head>
      <Container className="justify-content-center text-center mt-5">
        {props.tarot ? (
          <TarotLottery
            id={router.query.pid}
            title={props.tarot.title}
            price={props.tarot.price}
            cardSet={props.tarot.cardSet}
            s_id={props.tarot.s_id}
            image={props.tarot.image}
          />
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

export default CardPage;

export async function getStaticProps(context) {
  const id = context.params.pid;
  const doc = await getDocById("tarot", id);

  return {
    props: {
      tarot: doc ? JSON.parse(JSON.stringify(doc)) : null,
    },
    revalidate: 30,
  };
}

export async function getStaticPaths() {
  const docs = await getDocsFromCollection("tarot", true); //true - get only Id's
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
