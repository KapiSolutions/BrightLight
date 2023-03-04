import React from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { Button, Container } from "react-bootstrap";
import BlogPost from "../../../components/Blog/BlogPost";
import { getDocById, getDocsFromCollection } from "../../../firebase/Firestore";
import { VscBracketError } from "react-icons/vsc";

function BlogPage(props) {
  const router = useRouter();
  return (
    <>
      <Head>
        <title>BrightLight | {props.post.title} </title>
      </Head>
      <Container className="color-primary justify-content-center text-start mt-3">
        {props.post ? (
          <BlogPost post={props.post} />
        ) : (
          <div className="text-center mt-5">
            <VscBracketError style={{ width: "40px", height: "40px" }} className="mb-3" />
            <h4 className="mt-0 mb-4">Blog does not exist.</h4>
            <Button variant="outline-primary" onClick={() => router.replace("/blog#main")}>
              Blogs page
            </Button>
          </div>
        )}
      </Container>
    </>
  );
}

export default BlogPage;

export async function getStaticProps(context) {
  const pid = context.params.pid;
  const locale = context.locale;
  const doc = await getDocById("blog", pid);

  doc.content = doc.content[locale];
  doc.title = doc.title[locale];

  return {
    props: {
      post: doc ? JSON.parse(JSON.stringify(doc)) : null,
    },
    revalidate: false, //on demand revalidation
  };
}

export async function getStaticPaths({ locales }) {
  const docs = await getDocsFromCollection("blog", true); //true - get only Id's
  return {
    paths: docs.flatMap((doc) => {
      return locales.map((locale) => {
        return {
          params: { pid: doc },
          locale: locale,
        };
      });
    }),
    fallback: "blocking",
  };
}
