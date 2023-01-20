import React, { useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { Container } from "react-bootstrap";
import { useAuth } from "../../../../context/AuthProvider";
import { useDeviceStore } from "../../../../stores/deviceStore";
import BlogTemplate from "../../../../components/Blog/BlogTemplate";
import { getDocById, getDocsFromCollection } from "../../../../firebase/Firestore";

function AdminEditBlogPage(props) {
  const isMobile = useDeviceStore((state) => state.isMobile);
  const themeState = useDeviceStore((state) => state.themeState);
  const { isAuthenticated, isAdmin } = useAuth();
  const router = useRouter();
  const sleep = (milliseconds) => {
    return new Promise((resolve) => setTimeout(resolve, milliseconds));
  };
  async function scroll() {
    await sleep(300);
    document.getElementById("abe-ctx").scrollIntoView();
  }

  useEffect(() => {
    if (isAuthenticated()) {
      if (isAdmin) {
        isMobile && scroll();
      } else {
        router.replace("/");
        return;
      }
    } else {
      router.replace("/sign-in");
      return;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Head>
        <title>BrightLight | Admin - Edit Blog</title>
      </Head>
      <Container className="justify-content-center text-center mt-5 color-primary" id="abe-ctx">
        <h1>Edit Blog</h1>
        <BlogTemplate post={props.post}/>
      </Container>
    </>
  );
}

export default AdminEditBlogPage;


export async function getStaticProps(context) {
  const pid = context.params.pid;
  const blogPost = await getDocById("blog",pid);
  return {
    props: {
      post: JSON.parse(JSON.stringify(blogPost)),
    },
    revalidate: 30, //1 - 1 second
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

