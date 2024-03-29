import React, { useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { Container, Button, Spinner } from "react-bootstrap";
import { useAuth } from "../../../context/AuthProvider";
import { useDeviceStore } from "../../../stores/deviceStore";
import { getDocsFromCollection } from "../../../firebase/Firestore";
import BlogItemAdmin from "../../../components/Blog/BlogItemAdmin";
import FilterAndSortBar from "../../../components/Blog/FilterAndSortBar";
import { FiRefreshCcw } from "react-icons/fi";
import Link from "next/link";
import { setup } from "../../../config/csrf";

function AdminBlogsPage({ blogPosts }) {
  const [posts, setPosts] = useState([]);
  const [refPosts, setRefPosts] = useState([]);
  const [message, setMessage] = useState("");
  const [loadingNew, setLoadingNew] = useState(false);
  const [loadingRfs, setLoadingRfs] = useState(false);
  const isMobile = useDeviceStore((state) => state.isMobile);
  const themeState = useDeviceStore((state) => state.themeState);
  const { isAuthenticated, isAdmin } = useAuth();
  const router = useRouter();
  const locale = router.locale;
  const idForSortingBar = "BlogAdmin";

  const t = {
    en: {
      title: "Blog Menagment",
      new: "Create New Blog!",
      loading: "Loading",
      home: "Home",
      blogPage: "Blog Menagment",
    },
    pl: {
      title: "Zarządzaj Blogiem",
      new: "Dodaj nowy Wpis!",
      loading: "Ładuję",
      home: "Strona Główna",
      blogPage: "Zarządzanie Blogiem",
    },
  };

  const sleep = (milliseconds) => {
    return new Promise((resolve) => setTimeout(resolve, milliseconds));
  };
  async function scroll() {
    await sleep(300);
    document.getElementById("abn-ctx").scrollIntoView();
  }

  const timeStampToDate = (time) => {
    return new Date(time.seconds * 1000 + time.nanoseconds / 100000);
  };

  useEffect(() => {
    if (isAuthenticated()) {
      if (isAdmin) {
        isMobile && scroll();
        setRefPosts(blogPosts.map((doc) => ({ ...doc, content: doc.content[locale], title: doc.title[locale] })))
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

  // refresh the blog list after deleting the blog item
  const refreshBlogList = async () => {
    setLoadingRfs(true);
    try {
      const docs = await getDocsFromCollection("blog");
      docs.map((doc) => {
        doc.content = doc.content[locale];
        doc.title = doc.title[locale];
      });
      setPosts(JSON.parse(JSON.stringify(docs)).sort((a, b) => timeStampToDate(b.date) - timeStampToDate(a.date)));
      setLoadingRfs(false);
    } catch (e) {
      console.log(e);
      setLoadingRfs(false);
    }
  };

  return (
    <>
      <Head>
        <title>BrightLight | Admin - {t[locale].title}</title>
      </Head>
      <Container className="justify-content-center text-center mt-4 color-primary" id="abn-ctx">
        <nav className="d-flex gap-2">
          <small>
            <Link href="/#main">{t[locale].home}</Link>
          </small>
          <small>&gt;</small>
          <small>{t[locale].blogPage}</small>
        </nav>
        <h1>{t[locale].title}</h1>
        <div className="d-flex justify-content-end gap-2 text-end mt-4">
          <Button
            size="md"
            variant="outline-primary"
            className={`${isMobile && "w-100"}`}
            onClick={() => {
              router.push("/admin/blogs/new#main");
              setLoadingNew(true);
            }}
            disabled={loadingNew}
          >
            {loadingNew ? (
              <span>
                <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> {t[locale].loading}
              </span>
            ) : (
              <span>{t[locale].new}</span>
            )}
          </Button>
          <Button
            variant={`outline-${themeState == "light" ? "dark" : "accent3"}`}
            size="md"
            onClick={refreshBlogList}
            disabled={loadingRfs}
            title="Refresh list"
          >
            {loadingRfs ? (
              <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
            ) : (
              <FiRefreshCcw style={{ width: "22px", height: "22px" }} />
            )}
          </Button>
        </div>

        <FilterAndSortBar
          id={idForSortingBar}
          refArray={refPosts}
          inputArray={posts}
          outputArray={setPosts}
          msg={setMessage}
          resetSettings={loadingRfs}
        />

        <div>
          {posts.map((post, idx) => (
            <BlogItemAdmin key={idx} idx={idx} post={post} refresh={refreshBlogList} />
          ))}

          {/* Message as output after finding item in array */}
          {message && <div className="mt-3">{message}</div>}
        </div>
      </Container>
    </>
  );
}

export default AdminBlogsPage;

export const getServerSideProps = setup(async () => {
  const docs = await getDocsFromCollection("blog");
  return {
    props: {
      blogPosts: JSON.parse(JSON.stringify(docs)),
    },
  };
});
