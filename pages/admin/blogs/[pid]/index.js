import React, { useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { Button, Container } from "react-bootstrap";
import { useAuth } from "../../../../context/AuthProvider";
import { useDeviceStore } from "../../../../stores/deviceStore";
import BlogTemplate from "../../../../components/Blog/BlogTemplate";
import { getDocById, getDocsFromCollection } from "../../../../firebase/Firestore";
import { VscBracketError } from "react-icons/vsc";

function AdminEditBlogPage(props) {
  const router = useRouter();
  const locale = router.locale;
  const isMobile = useDeviceStore((state) => state.isMobile);
  const themeState = useDeviceStore((state) => state.themeState);
  const { isAuthenticated, isAdmin } = useAuth();
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

  const t = {
    en: {
      title: "Admin - Edit Blog",
      h1: "Edit Blog",
      noBlog: "Blog does not exist.",
      button: "Go back",
    },
    pl: {
      title: "Admin - Edytuj Wpis",
      h1: "Edytuj Wpis",
      noBlog: "Wpis nie istnieje.",
      button: "Wróć",
    },
  };

  return (
    <>
      <Head>
        <title>BrightLight | {t[locale].title}</title>
      </Head>
      <Container className="justify-content-center text-center mt-5 color-primary" id="abe-ctx">
        <h1>{t[locale].h1}</h1>
        {props.post ? (
          <BlogTemplate post={props.post} />
        ) : (
          <div className="text-center">
            <VscBracketError style={{ width: "40px", height: "40px" }} className="mb-3" />
            <h4 className="mt-0 mb-4">{t[locale].noBlog}</h4>
            <Button variant="outline-primary" onClick={() => router.replace("/admin/blogs#main")}>
              {t[locale].button}
            </Button>
          </div>
        )}
      </Container>
    </>
  );
}

export default AdminEditBlogPage;

export async function getStaticProps(context) {
  const pid = context.params.pid;
  const blogPost = await getDocById("blog", pid);

  return {
    props: {
      post: blogPost ? JSON.parse(JSON.stringify(blogPost)) : null,
    },
    revalidate: 30, //1 - 1 second
  };
}

export async function getStaticPaths() {
  const docs = await getDocsFromCollection("blog", true); //true - get only Id's
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
