import React from "react";
import Head from "next/head";
import { Container } from "react-bootstrap";
import BlogItem from "../../components/BlogItem";
import { getDocsFromCollection } from "../../firebase/Firestore";

function BlogPage(props) {
  return (
    <>
      <Head>
        <title>BrightLight | Blog</title>
      </Head>
      <Container className="text-center mt-5 color-primary">
        <h1> BLOG </h1>
        <section className="d-flex justify-content-center gap-4 flex-wrap">
          {props.blogPosts.map((post) => (
            <BlogItem key={post.id} blogPost={post} />
          ))}
        </section>
      </Container>
    </>
  );
}

export default BlogPage;

export async function getStaticProps() {
  const docs = await getDocsFromCollection("blog");
  
  return {
    props: {
      blogPosts: JSON.parse(JSON.stringify(docs)),
    },
    revalidate: 60, //1minute
  };
}
