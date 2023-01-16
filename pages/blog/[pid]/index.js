import React from "react";
import Head from "next/head";
import { Container } from "react-bootstrap";
import { db } from "../../../config/firebase";
import { doc, getDoc, getDocs, collection } from "firebase/firestore";
import BlogPost from "../../../components/BlogPost";

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
  let blogPost;

  const ref = doc(db, "blog", pid);
  const docSnap = await getDoc(ref);
  if (docSnap.exists()) {
    blogPost = docSnap.data();
  } else {
    error = "Error: data doesnt exist";
  }

  return {
    props: {
      post: JSON.parse(JSON.stringify(blogPost)),
    },
    revalidate: 60,
  };
}

export async function getStaticPaths() {
  const BlogPostIds = [];
  const querySnapshot = await getDocs(collection(db, "blog"));
  querySnapshot.forEach((doc) => {
    const blogID = {
      pid: doc.data().id,
    };
    BlogPostIds.push(blogID);
  });

  return {
    paths: BlogPostIds.map((blogID) => {
      return {
        params: {
          pid: blogID.pid,
        },
      };
    }),
    fallback: false,
  };
}
