import React from "react";
import Head from "next/head";
import { Container } from "react-bootstrap";
import BlogPost from "../../../components/BlogPost";
import { getDocById, getDocsFromCollection } from "../../../firebase/Firestore";

function BlogPage(props) {
  return (
    <>
      <Head>
        <title>BrightLight | Blog</title>
      </Head>
      <Container className="color-primary justify-content-center text-start mt-3">
       <BlogPost post={props.post}/>
      </Container>
    </>
  );
}

export default BlogPage;

export async function getStaticProps(context) {
  const pid = context.params.pid;
  const blogPost = await getDocById("blog",pid);
  return {
    props: {
      post: JSON.parse(JSON.stringify(blogPost)),
    },
    revalidate: 60,
  };
}

export async function getStaticPaths() {
const docs = await getDocsFromCollection("blog", true);//true - get only Id's
  return {
    paths: docs.map((doc) => {
      return {
        params: {
          pid: doc,
        },
      };
    }),
    fallback: false,
  };
}
