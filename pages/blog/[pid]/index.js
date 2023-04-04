import React from "react";
import { ArticleJsonLd, NextSeo } from "next-seo";
import { useRouter } from "next/router";
import { Button, Container } from "react-bootstrap";
import BlogPost from "../../../components/Blog/BlogPost";
import { getDocById, getDocsFromCollection } from "../../../firebase/Firestore";
import { VscBracketError } from "react-icons/vsc";
import Link from "next/link";

function BlogPage(props) {
  const router = useRouter();
  const locale = props.locale;
  const t = {
    en: {
      noBlog: "Blog does not exist.",
      button: "Back",
      home: "Home",
      blog: "Blog",
    },
    pl: {
      noBlog: "Wpis nie istnieje",
      button: "Wróć",
      home: "Strona Główna",
      blog: "Blog",
    },
  };

  const timeStampToDate = (time) => {
    return new Date(time.seconds * 1000 + time.nanoseconds / 100000);
  };

  return (
    <>
      <NextSeo
        title={`BrightLight | ${props.post?.title}`}
        canonical={`https://www.brightlightgypsy.pl/${locale}${router.asPath}`}
        languageAlternates={[
          {
            hrefLang: "en",
            href: `https://www.brightlightgypsy.pl/en${router.asPath}`,
          },
          {
            hrefLang: "pl",
            href: `https://www.brightlightgypsy.pl/pl${router.asPath}`,
          },
          {
            hrefLang: "x-default",
            href: `https://www.brightlightgypsy.pl${router.asPath}`,
          },
        ]}
      />
      <ArticleJsonLd
        type="BlogPosting"
        url={`https://www.brightlightgypsy.pl/${locale}${router.asPath}`}
        title={props.post?.title}
        images={[props.post?.mainImg.source]}
        datePublished={timeStampToDate(props.post?.date)}
        dateModified={timeStampToDate(props.post?.date)}
        authorName={props.post?.author}
        description={props.post?.title + "- Blog Bright Light Gypsy, Tarot Online"}
      />
      {/* Breadcrumbs */}
      <nav>
        <ol
          itemScope=""
          itemType="http://schema.org/BreadcrumbList"
          style={{ listStyleType: "none" }}
          className="d-flex flex-row gap-2 ps-3 mb-0 mt-2 color-primary"
        >
          <li itemProp="itemListElement" itemScope="" itemType="http://schema.org/ListItem">
            <Link href="/#main" itemScope="" itemType="http://schema.org/Thing" itemProp="item" itemID="/" passHref>
              <small itemProp="name">{t[locale].home}</small>
            </Link>
            <meta itemProp="position" content="0" />
          </li>
          <li>
            <small>&gt;</small>
          </li>
          <li itemProp="itemListElement" itemScope="" itemType="http://schema.org/ListItem">
            <Link
              href="/blog#main"
              itemScope=""
              itemType="http://schema.org/Thing"
              itemProp="item"
              itemID="/blog"
              passHref
            >
              <small itemProp="name">{t[locale].blog}</small>
            </Link>
            <meta itemProp="position" content="1" />
          </li>
          <li>
            <small>&gt;</small>
          </li>
          <li itemProp="itemListElement" itemScope="" itemType="http://schema.org/ListItem">
            <span itemScope="" itemType="http://schema.org/Thing" itemProp="item" itemID={`/blog${router.asPath}`}>
              <small itemProp="name">{props.post?.title}</small>
            </span>
            <meta itemProp="position" content="2" />
          </li>
        </ol>
      </nav>
      <Container className="color-primary justify-content-center text-start mt-3">
        {props.post ? (
          <BlogPost post={props.post} />
        ) : (
          <div className="text-center mt-5">
            <VscBracketError style={{ width: "40px", height: "40px" }} className="mb-3" />
            <h4 className="mt-0 mb-4">{t[locale].noBlog}</h4>
            <Button variant="outline-primary" onClick={() => router.replace("/blog#main")}>
              {t[locale].button}
            </Button>
          </div>
        )}
      </Container>
    </>
  );
}

export default BlogPage;

export async function getStaticProps(context) {
  const pid = context.params.pid;
  const locale = context.locale;
  const doc = await getDocById("blog", pid);
  if (doc !== undefined) {
    doc.content = doc.content[locale];
    doc.title = doc.title[locale];
  }

  return {
    props: {
      post: doc ? JSON.parse(JSON.stringify(doc)) : null,
      locale: locale,
    },
    revalidate: false, //on demand revalidation
  };
}

export async function getStaticPaths({ locales }) {
  const docs = await getDocsFromCollection("blog", true); //true - get only Id's
  return {
    paths: docs.flatMap((doc) => {
      return locales.map((locale) => {
        return {
          params: { pid: doc },
          locale: locale,
        };
      });
    }),
    fallback: "blocking",
  };
}
