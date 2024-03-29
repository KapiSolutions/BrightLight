import React from "react";
import Link from "next/link";
import { Container, Nav, Navbar } from "react-bootstrap";
import styles from "../../../styles/layout/main/Footer.module.scss";
import { RiInstagramFill } from "react-icons/ri";
import { SiAuthy } from "react-icons/si";
import { useDeviceStore } from "../../../stores/deviceStore";

function Footer(props) {
  const locale = props.locale;
  const isMobile = useDeviceStore((state) => state.isMobile);
  const t = {
    en: {
      cookies: "Cookies Policy",
      cookiesMobile: "Cookies",
      service: "Terms of service",
      privacy: "Privacy Policy",
      privacyMobile: "Privacy",
      contributors: "Contributors",
      hashTags: "#tarot online ",
    },
    pl: {
      cookies: "Polityka Cookies",
      cookiesMobile: "Cookies",
      service: "Regulamin",
      privacy: "Polityka prywatności",
      privacyMobile: "Prywatność",
      contributors: "Współtwórcy",
    },
  };
  return (
    <footer>
      <div className="mt-5 backgroundFooter">
        <div className={styles.shapeDivider}>
          {/* className='svgDividerColorFill' */}
          <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path
              d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
              opacity=".25"
              className="svgDividerColorFill"
            ></path>
            <path
              d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z"
              opacity=".5"
              className="svgDividerColorFill"
            ></path>
            <path
              d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z"
              className="svgDividerColorFill"
            ></path>
          </svg>
        </div>

        <Container name="footer" className="mt-3">
          <div className={`${styles.container} color-primary`}>
            <div className={styles.content}>
              <div className="d-flex flex-column gap-2 mb-3">
                <Link href="https://www.instagram.com" passHref className="pointer color-primary">
                  <RiInstagramFill style={{ width: "20px", height: "20px" }} /> Instagram
                </Link>
                <Link href="/contributors#main" passHref className="pointer color-primary">
                  <SiAuthy style={{ width: "20px", height: "20px" }} /> {t[locale].contributors}
                </Link>
              </div>

              <p>
                <a
                  href="mailto:brightlightgypsy@gmail.com"
                  className="color-primary pointer"
                  style={{ textDecoration: "underline" }}
                >
                  brightlightgypsy@gmail.com
                </a>
              </p>

              <nav className="d-flex justify-content-center align-items-center mb-4">
                <div className="text-center col-4 col-md-3 col-lg-2">
                  <Link href="/cookies-policy#main" passHref>
                    <span className="color-primary">{isMobile ? t[locale].cookiesMobile : t[locale].cookies}</span>
                  </Link>
                </div>
                <div className="text-center col-4 col-md-3 col-lg-2">
                  <Link href="/terms-of-service#main" passHref>
                    <span className="color-primary">{t[locale].service}</span>
                  </Link>
                </div>
                <div className="text-center col-4 col-md-3 col-lg-2">
                  <Link href="/privacy-policy#main" passHref>
                    <span className="color-primary">{isMobile ? t[locale].privacyMobile : t[locale].privacy}</span>
                  </Link>
                </div>
              </nav>
            </div>
            <div className={styles.signature}>
              <p className={isMobile ? "w-100 mb-0" : ""}>©2022 - {new Date().getFullYear()} Bright Light Gypsy</p>
              {!isMobile && <p>|</p>}
              <p className="mt-0">
                WebDesign:{" "}
                <Link
                  href="https://kapisolutions.pl"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="color-primary"
                >
                  <u>Kapisolutions.</u>
                </Link>
              </p>
            </div>
          </div>
        </Container>
      </div>
    </footer>
  );
}

export default Footer;
