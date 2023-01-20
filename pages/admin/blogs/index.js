import React, { useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { Container, Button } from "react-bootstrap";
import { useAuth } from "../../../context/AuthProvider";
import { useDeviceStore } from "../../../stores/deviceStore";
import { getDocsFromCollection } from "../../../firebase/Firestore";
import BlogItemAdmin from "../../../components/Blog/BlogItemAdmin";
import FilterAndSortBar from "../../../components/FilterAndSortBar";

function AdminBlogsPage(props) {
  const [posts, setPosts] = useState(props.blogPosts);
  const isMobile = useDeviceStore((state) => state.isMobile);
  const { isAuthenticated, isAdmin } = useAuth();
  const router = useRouter();
  const sleep = (milliseconds) => {
    return new Promise((resolve) => setTimeout(resolve, milliseconds));
  };
  async function scroll() {
    await sleep(300);
    document.getElementById("abn-ctx").scrollIntoView();
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

  // refresh the blog list after deleting the blog item
  const refreshBlogList = async () => {
    const docs = await getDocsFromCollection("blog");
    setPosts(JSON.parse(JSON.stringify(docs)));
  };
  return (
    <>
      <Head>
        <title>BrightLight | Admin - Blog Menagment</title>
      </Head>
      <Container className="justify-content-center text-center mt-5 color-primary" id="abn-ctx">
        <h1>Blog Menagment</h1>
        <div className="text-end mb-5">
          <Button
            onClick={() => {
              router.push("/admin/blogs/new#main");
            }}
          >
            Create new Blog
          </Button>
        </div>
        <div>
          {/* <FilterAndSortBar /> */}
        </div>
        <div>
          {posts.map((post, idx) => (
            <BlogItemAdmin key={idx} idx={idx} post={post} refresh={refreshBlogList} />
          ))}
        </div>
      </Container>
    </>
  );
}

export default AdminBlogsPage;

export async function getStaticProps() {
  const docs = await getDocsFromCollection("blog");

  return {
    props: {
      blogPosts: JSON.parse(JSON.stringify(docs)),
    },
    revalidate: 30, //1 - 1 second
  };
}
