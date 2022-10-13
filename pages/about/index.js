import React from "react";
import Head from "next/head";
import Image from "next/image";
import { Container } from "react-bootstrap";
import { useDeviceStore } from "../../stores/deviceStore";
import useLocalStorageState from "use-local-storage-state";
import styles from "../../styles/pages/About.module.scss";
import { SiHellofresh } from "react-icons/si";

function AboutPage() {
  const avatarPath = "/img/about/avatar.png";
  const diamondPath = "/img/about/diamond.png";
  const tarotPath = "/img/about/tarot-cards.png";
  const japanPath = "/img/about/japan-sticker.png";
  const isMobile = useDeviceStore((state) => state.isMobile);
  const [theme, setTheme] = useLocalStorageState("theme", {
    ssr: true,
    defaultValue: "light",
  });
  return (
    <>
      <Head>
        <title>BrightLight | About</title>
      </Head>
      <Container className="justify-content-center text-center mt-5 color-primary">
        {!isMobile &&<div style={{height: "80px"}}>
        <h1 className="mt-0 color-primary text-center">About Me</h1>
        <SiHellofresh style={{width: "25px", height: "25px", position: "relative", top: "-90px", left: "120px"}}/>
        </div> }
      
        <section className="d-flex flex-wrap justify-content-center mb-3 p-2">
          <div className={`text-${isMobile ? "center" : "end"} col-md-3 col-sm-12 m-auto`}>
            <Image src={avatarPath} width="170" height="170" alt="Avatar" />
          </div>
          {isMobile && <h1 className="mt-0 color-primary text-center">About Me</h1>}
          <div className={`col-md-7 col-sm-12 align-self-center ${!isMobile && "pe-5"}`}>
            <p className={`text-${isMobile ? "center" : "start"}`}>
              I&apos;m a tarotist with several years of experience. Since I was a child, I have also had visions and
              highly developed intuition. My other passion is music, especially singing. &#10084;
            </p>
          </div>
        </section>

        <section
          className={`d-flex flex-wrap rounded mb-3 p-2 ${
            theme == "light" ? "bg-accent5 text-dark" : "bg-accent6 text-light"
          }`}
        >
          <div
            className={`d-${isMobile ? "none" : "block"} ${!isMobile && "ps-5"} col-md-7 col-sm-12 align-self-center`}
          >
            <p className={`text-${isMobile ? "center" : "end"}`}>
              Tarot cards allow you to indicate the probable course of life. Let us remember that as a result of
              introducing certain changes in our life, we can change the predicted future.
            </p>
          </div>
          <div className={`text-${isMobile ? "center" : "center"} col-md-4 col-sm-12 m-auto`}>
            <Image src={tarotPath} width="170" height="170" alt="Tarot cards roses" />
          </div>
          <div className={`d-${isMobile ? "block" : "none"} col-md-8 col-sm-12 align-self-center`}>
            <p className={`text-${isMobile ? "center" : "end"}`}>
              Tarot cards allow you to indicate the probable course of life. Let us remember that as a result of
              introducing certain changes in our life, we can change the predicted future.
            </p>
          </div>
        </section>

        <section className="d-flex flex-wrap mb-2 p-2">
          <div className={`text-${isMobile ? "center" : "end"} col-md-3 col-sm-12 m-auto`}>
            <Image src={diamondPath} width="170" height="170" alt="Diamond flower" />
          </div>
          <div className={`col-md-7 col-sm-12 align-self-center ${!isMobile && "pe-5"}`}>
            <p className={`text-${isMobile ? "center" : "start"}`}>
              Therefore, in addition to learning about the upcoming future and other people&apos;s intentions, it is
              also worth asking them for advice.
            </p>
          </div>
        </section>
        <hr className="color-primary w-50 m-auto mt-4 mb-5"/>
        <section className="mt-5">
          <div className={`${styles.japanBackLight} rounded pt-4 pb-1 mb-3`}>
            <Image src={japanPath} width="170" height="170" alt="Diamond flower" />
            <h2 className="mt-0 text-dark">Japan Dream</h2>
          </div>
          <p>One of my biggest dreams is to travel to Japan. Discovering beautiful nature and local culture.</p>
          <p>(...)</p>
        </section>
      </Container>
    </>
  );
}

export default AboutPage;
