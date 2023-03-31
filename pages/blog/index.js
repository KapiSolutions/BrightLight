import React, { useState } from "react";
import { NextSeo } from "next-seo";
import { Container } from "react-bootstrap";
import BlogItem from "../../components/Blog/BlogItem";
import { getDocsFromCollection } from "../../firebase/Firestore";
import FilterAndSortBar from "../../components/Blog/FilterAndSortBar";
import Link from "next/link";

function BlogPage(props) {
  const locale = props.locale;
  const [posts, setPosts] = useState([]);
  const [message, setMessage] = useState("");
  const idForSortingBar = "BlogUser" + locale;

  const t = {
    en: {
      title: "Blog",
      home: "Home",
    },
    pl: {
      title: "Blog",
      home: "Strona Główna",
    },
  };
  return (
    <>
      <NextSeo
        title={`BrightLight | ${t[locale].title}`}
        canonical={`https://www.brightlightgypsy.pl/${locale}/blog`}
        languageAlternates={[
          {
            hrefLang: "en",
            href: "https://www.brightlightgypsy.pl/en/blog",
          },
          {
            hrefLang: "pl",
            href: "https://www.brightlightgypsy.pl/pl/blog",
          },
          {
            hrefLang: "x-default",
            href: "https://www.brightlightgypsy.pl/blog",
          },
        ]}
      />
      <Container className="text-center mt-4 color-primary">
        <nav className="d-flex gap-2">
          <small>
            <Link href="/#main">{t[locale].home}</Link>
          </small>
          <small>&gt;</small>
          <small>{t[locale].title}</small>
        </nav>
        <h1 className="mb-0 text-uppercase"> {t[locale].title} </h1>
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
      locale: locale,
    },
    revalidate: false, //on demand revalidation
  };
}
