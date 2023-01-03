import React from "react";
import Head from "next/head";
import { Container } from "react-bootstrap";
import BlogItem from "../../components/BlogItem";

function BlogPage() {
  return (
    <>
      <Head>
        <title>BrightLight | Blog</title>
      </Head>
      <Container className="text-center mt-5 color-primary">
        <h1> BLOG </h1>
        <section className="d-flex justify-content-center gap-4 flex-wrap">
          <BlogItem id={"asd"} desc={"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,"} title={"Title"} />
          <BlogItem id={"asd"} desc={"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,"} title={"Title"} />
        </section>
      </Container>
    </>
  );
}

export default BlogPage;
