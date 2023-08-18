import React from "react";
import { BreadcrumbJsonLd, NextSeo } from "next-seo";
import { Container, Row, Col } from "react-bootstrap";
import ProductCard from "../components/Products/ProductCard";
import { getDocsFromCollection } from "../firebase/Firestore";
import Link from "next/link";
import HowItWorks from "../components/HowItWorks";
import LatestPostsItem from "../components/Blog/LatestPostsItem";
import { useDeviceStore } from "../stores/deviceStore";
// import AdBanner from "../components/AdBanner";
// import Script from "next/script";

export default function Home(props) {
  const locale = props.locale;
  const isMobile = useDeviceStore((state) => state.isMobile);
  const t = {
    en: {
      title: "Home",
      h1: "Your Cards",
      choose: "Choose one or more to get what you need.",
      findIt: "Find it out!",
      aboutMe: "About me",
      oracle: "Oracle of Love",
      latestPosts: "Latest posts",
    },
    pl: {
      title: "Strona Główna",
      h1: "Twoje karty",
      choose: "Wybierz jedną lub kilka by dowiedzieć się tego czego potrzebujesz.",
      findIt: "Poznaj ją teraz!",
      aboutMe: "O mnie",
      oracle: "Wyrocznia miłości",
      latestPosts: "Najnowsze wpisy",
    },
  };
  return (
    <>
      <NextSeo
        title="BrightLight | Tarot Online"
        canonical={`https://www.brightlightgypsy.pl/${locale}`}
        languageAlternates={[
          {
            hrefLang: "en",
            href: "https://www.brightlightgypsy.pl/en",
          },
          {
            hrefLang: "pl",
            href: "https://www.brightlightgypsy.pl/pl",
          },
          {
            hrefLang: "x-default",
            href: "https://www.brightlightgypsy.pl",
          },
        ]}
      />

      {/* <Script
        async
        src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_GOOGLE_ADS_CLIENT_ID}`}
        strategy="lazyOnload"
        crossorigin="anonymous"
      /> */}

      {/* Breadcrumbs SEO */}
      <BreadcrumbJsonLd
        itemListElements={[
          {
            position: 1,
            name: "Tarot Online",
            item: `https://www.brightlightgypsy.pl/${locale == "default" ? "" : locale}`,
          },
          {
            position: 2,
            name: t[locale == "default" ? "en" : locale].oracle,
            item: `https://www.brightlightgypsy.pl/${
              locale == "default" ? "" : locale + "/"
            }product/d58647bd-056d#main`,
          },
          {
            position: 3,
            name: "Blog",
            item: `https://www.brightlightgypsy.pl/${locale == "default" ? "" : locale + "/"}blog`,
          },
          {
            position: 4,
            name: t[locale == "default" ? "en" : locale].aboutMe,
            item: `https://www.brightlightgypsy.pl/${locale == "default" ? "" : locale + "/"}about`,
          },
        ]}
      />

      {/* Breadcrumbs */}
      <nav>
        <ol
          itemScope=""
          itemType="http://schema.org/BreadcrumbList"
          style={{ listStyleType: "none" }}
          className="d-flex flex-row ps-3 mb-0 mt-2"
        >
          <li itemProp="itemListElement" itemScope="" itemType="http://schema.org/ListItem">
            <span itemScope="" itemType="http://schema.org/Thing" itemProp="item" itemID="/">
              <small itemProp="name" className="text-muted">
                {t[locale].title}
              </small>
            </span>
            <meta itemProp="position" content="0" />
          </li>
        </ol>
      </nav>

      <Container className="d-flex mt-3 flex-column align-items-center justify-content-center">
        <Row className="d-flex mb-2 text-center">
          <h1 className="color-primary">{t[locale].h1}</h1>
          <p className="color-primary small">{t[locale].choose}</p>
        </Row>
        {/* Display cards */}
        <Row sm={2} md={2} lg={3} className="g-4 justify-content-center">
          {props.products.map(
            (product) =>
              product.active && (
                <Col key={product.id} className="d-flex justify-content-center">
                  <ProductCard product={product} preview={false} />
                </Col>
              )
          )}
        </Row>
      </Container>

      <HowItWorks locale={locale} />

      <div className="w-50 mt-5 m-auto color-primary">
        <hr />
      </div>

      {/* Latest Posts */}
      <section className="mt-4 color-primary w-100">
        <h2 className="text-center">{t[locale].latestPosts}</h2>
        <div
          className={`d-flex gap-4 align-items-center pb-4 justify-content-md-center overflow-auto m-auto 
          ${isMobile && "ps-2 pe-0"}`}
        >
          {props.posts.map((post, idx) => (
            <LatestPostsItem key={idx} locale={locale} post={post} isMobile={isMobile} />
          ))}
        </div>
      </section>
    </>
  );
}

export async function getStaticProps({ locale }) {
  // Get all products
  let products = await getDocsFromCollection("products");
  products.map((product) => {
    product.desc = product.desc[locale == "default" ? "en" : locale];
    product.title = product.title[locale == "default" ? "en" : locale];
  });
  // sort by price
  const sortedProduct = products.sort((a, b) => a.price.pln.amount - b.price.pln.amount);

  // Get latest Blog Posts
  const timeStampToDate = (time) => {
    return new Date(time.seconds * 1000 + time.nanoseconds / 100000);
  };

  let posts = await getDocsFromCollection("blog");
  posts = JSON.parse(JSON.stringify(posts));
  posts = posts.sort((a, b) => timeStampToDate(b.date) - timeStampToDate(a.date));
  posts.map((post) => {
    post.content = post.content[locale == "default" ? "en" : locale];
    post.title = post.title[locale == "default" ? "en" : locale];
  });
  const latestPosts = posts.slice(0, 4);

  return {
    props: {
      products: JSON.parse(JSON.stringify(sortedProduct)),
      posts: latestPosts,
      locale: locale,
    },
    revalidate: false, //on demand revalidation
  };
}
