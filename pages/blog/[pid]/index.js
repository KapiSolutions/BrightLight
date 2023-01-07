import React from "react";
import Head from "next/head";
import { OverlayTrigger, Popover, FloatingLabel, Form, Button, Container, Spinner } from "react-bootstrap";
import { db } from "../../../config/firebase";
import { doc, getDoc, getDocs, collection } from "firebase/firestore";
import Image from "next/image";
import Link from "next/link";
import { AiOutlineLike, AiOutlineComment } from "react-icons/ai";
import { useDeviceStore } from "../../../stores/deviceStore";

function BlogPage(props) {
  const post = props.post;
  const isMobile = useDeviceStore((state) => state.isMobile);
  return (
    <>
      <Head>
        <title>BrightLight | Blog</title>
      </Head>
      <Container className="color-primary justify-content-center text-start mt-3">
        <section className="d-flex gap-1">
          <small>
            <Link href="/blog#main">Blog</Link>
          </small>
          <small>&gt;</small>
          <small>{post.title}</small>
        </section>
        <h1 className="color-primary mb-0"> {post.title} </h1>
        <p className="ms-2 text-muted">
          <i>By BrightLightGypsy - 2022.01.06</i>
        </p>
        <div className="w-100 border" style={{ minHeight: "200px", position: "relative" }}>
          <Image src="/img/blog/main.jpg" fill alt={post.title} style={{ objectFit: "cover" }} />
        </div>
        <p>
          <small>
            <i>
              Source: <Link href="https://t.ly/oHwI"> https://t.ly/oHwI </Link>
            </i>
          </small>
        </p>
        <p>&emsp; &ensp;{post.content}</p>
        <div className="m-1">
          <hr />
        </div>
        <div className="d-inline-flex align-items-center justify-content-between w-100">
            <div>
          <AiOutlineLike style={{ width: "22px", height: "22px" }} className="pointer me-1" />
          <span className="me-3">{post.likes.length}</span>
          <AiOutlineComment style={{ width: "22px", height: "22px" }} className="pointer me-1" />
          <span className="me-3">{post.comments.length}</span>
          </div>
          <div className="text-end">
          <Link href="#postCom" passHref><span className="pointer color-primary"> Write comment! &#10084;</span></Link>
          </div>
          
        </div>

        <section className="mt-5 d-flex flex-column gap-3">
          <div>
            <p className="text-uppercase">
              <strong>Kuba wrote:</strong>
            </p>
            <p className="mb-0">Lorem ipsum lalala la.</p>
            <p className="text-muted text-end">2022.01.06</p>
            <hr />
          </div>
          <div>
            <p className="text-uppercase">
              <strong>Kuba wrote:</strong>
            </p>
            <p className="mb-0">Lorem ipsum lalala la.</p>
            <p className="text-muted text-end">2022.01.06</p>
            <hr />
          </div>
          <div id="postCom">
            <h4 className="mt-3">Write a Comment</h4>
            <Form.Control
              as="textarea"
              id="commentsField"
              placeholder="Your Comment..."
              style={{ minHeight: "80px" }}
            />
            <div className="mt-3 text-end">
              <Button>Send</Button>
            </div>
          </div>
        </section>
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
    error = "Error: card doesnt exist";
  }

  return {
    props: {
      post: blogPost,
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
