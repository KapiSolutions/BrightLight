import React, {useState} from "react";
import Head from "next/head";
import { Container } from "react-bootstrap";
import BlogItem from "../../components/Blog/BlogItem";
import { getDocsFromCollection } from "../../firebase/Firestore";
import FilterAndSortBar from "../../components/Blog/FilterAndSortBar";

function BlogPage(props) {
  const [posts, setPosts] = useState([]);
  const [message, setMessage] = useState("");
  const idForSortingBar = "BlogUser";
  return (
    <>
      <Head>
        <title>BrightLight | Blog</title>
      </Head>
      <Container className="text-center mt-5 color-primary">
        <h1 className="mb-0"> BLOG </h1>
        <div className="mb-4">
        <FilterAndSortBar
          id={idForSortingBar}
          refArray={props.blogPosts}
          inputArray={posts}
          outputArray={setPosts}
          msg={setMessage}
        />
        </div>
        <section className="d-flex justify-content-center gap-4 flex-wrap">
          {posts.map((post) => (
            <BlogItem key={post.id} blogPost={post} />
          ))}

          {/* Message as output after finding item in array */}
          {message && <div className="mt-3">{message}</div>}
        </section>
      </Container>
    </>
  );
}

export default BlogPage;

export async function getStaticProps({ locale }) {
  let docs = await getDocsFromCollection("blog");

  docs.map((doc) => {
    doc.content = doc.content[locale];
    doc.title = doc.title[locale];
  });
  
  return {
    props: {
      blogPosts: JSON.parse(JSON.stringify(docs)),
    },
    revalidate: false, //on demand revalidation
  };
}
