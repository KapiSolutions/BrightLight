import Image from "next/image";
import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import { Button, Modal } from "react-bootstrap";
import styles from "../../styles/components/CookieModal.module.scss";
import cookie from "../../public/img/cookies/cookie.webp";
import { useDeviceStore } from "../../stores/deviceStore";
import { getCookie, setCookie } from "cookies-next";

function CookieModal() {
  const router = useRouter();
  const locale = router.locale;
  const [show, setShow] = useState(false);
  const isMobile = useDeviceStore((state) => state.isMobile);
  const footerHeight = "60px";
  // Set session expiration to 120 days.
  const expiresIn = 60 * 60 * 24 * 120 * 1000;
  const botPattern =
    "(googlebot/|bot|Googlebot-Mobile|Googlebot-Image|Google favicon|Mediapartners-Google|bingbot|slurp|java|wget|curl|Commons-HttpClient|Python-urllib|libwww|httpunit|nutch|phpcrawl|msnbot|jyxobot|FAST-WebCrawler|FAST Enterprise Crawler|biglotron|teoma|convera|seekbot|gigablast|exabot|ngbot|ia_archiver|GingerCrawler|webmon |httrack|webcrawler|grub.org|UsineNouvelleCrawler|antibot|netresearchserver|speedy|fluffy|bibnum.bnf|findlink|msrbot|panscient|yacybot|AISearchBot|IOI|ips-agent|tagoobot|MJ12bot|dotbot|woriobot|yanga|buzzbot|mlbot|yandexbot|purebot|Linguee Bot|Voyager|CyberPatrol|voilabot|baiduspider|citeseerxbot|spbot|twengabot|postrank|turnitinbot|scribdbot|page2rss|sitebot|linkdex|Adidxbot|blekkobot|ezooms|dotbot|Mail.RU_Bot|discobot|heritrix|findthatfile|europarchive.org|NerdByNature.Bot|sistrix crawler|ahrefsbot|Aboundex|domaincrawler|wbsearchbot|summify|ccbot|edisterbot|seznambot|ec2linkfinder|gslfbot|aihitbot|intelium_bot|facebookexternalhit|yeti|RetrevoPageAnalyzer|lb-spider|sogou|lssbot|careerbot|wotbox|wocbot|ichiro|DuckDuckBot|lssrocketcrawler|drupact|webcompanycrawler|acoonbot|openindexspider|gnam gnam spider|web-archive-net.com.bot|backlinkcrawler|coccoc|integromedb|content crawler spider|toplistbot|seokicks-robot|it2media-domain-crawler|ip-web-crawler.com|siteexplorer.info|elisabot|proximic|changedetection|blexbot|arabot|WeSEE:Search|niki-bot|CrystalSemanticsBot|rogerbot|360Spider|psbot|InterfaxScanBot|Lipperhey SEO Service|CC Metadata Scaper|g00g1e.net|GrapeshotCrawler|urlappendbot|brainobot|fr-crawler|binlar|SimpleCrawler|Livelapbot|Twitterbot|cXensebot|smtbot|bnf.fr_bot|A6-Indexer|ADmantX|Facebot|Twitterbot|OrangeBot|memorybot|AdvBot|MegaIndex|SemanticScholarBot|ltx71|nerdybot|xovibot|BUbiNG|Qwantify|archive.org_bot|Applebot|TweetmemeBot|crawler4j|findxbot|SemrushBot|yoozBot|lipperhey|y!j-asr|Domain Re-Animator Bot|AddThis)";
  const re = new RegExp(botPattern, "i");

  const showModal = () => {
    const userAgent = navigator.userAgent;
    if (!re.test(userAgent)) {
      //detect bot crawlers
      if (router.route != "/cookies-policy") {
        setShow(true);
      } else {
        setShow(false);
      }
    } else {
      console.log("the user agent is a crawler!");
    }
  };

  useEffect(() => {
    if (!getCookie("allow-cookies")) {
      let timer1 = setTimeout(() => showModal(), 3000);
      return () => {
        clearTimeout(timer1);
      };
    } else {
      return;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  const t = {
    en: {
      cookies: "Cookies!",
      weUse: "We use cookies to make your experience better",
      policy: "Cookies Policy",
      confirm: "OK",
    },
    pl: {
      cookies: "Ciasteczka!",
      weUse: "Używamy plików cookie, aby poprawić Twoje wrażenia",
      policy: "Polityka Cookies",
      confirm: "OK",
    },
  };
  return (
    <Modal
      show={show}
      onHide={() => {
        setShow(false);
      }}
      centered
      size="sm"
      animation={true}
      backdrop="static"
      keyboard={false}
      contentClassName={styles.modal}
    >
      <Modal.Body className="rounded-0 text-center">
        <div className="text-center" style={{ position: "relative", height: isMobile ? "150px" : "200px" }}>
          <Image src={cookie} alt="coockie" fill style={{ objectFit: "contain" }} />
        </div>
        <p className="mt-1 fs-4">
          <strong>{t[locale].cookies}</strong>
        </p>
        <p>{t[locale].weUse}</p>
      </Modal.Body>
      <Modal.Footer className="p-0 m-0 d-flex justify-content-between" style={{ height: footerHeight }}>
        <Button
          className="m-0"
          style={{ height: footerHeight, width: "50%", borderRadius: "0px 0px 0px 20px" }}
          variant="outline-secondary"
          onClick={() => {
            setShow(false);
            router.push("/cookies-policy#main");
          }}
        >
          <small>{t[locale].policy}</small>
        </Button>
        <Button
          className="m-0 border-none"
          style={{ height: footerHeight, width: "50%", borderRadius: "0px 0px 20px 0px" }}
          variant="secondary"
          onClick={() => {
            setCookie("allow-cookies", true, { maxAge: expiresIn, sameSite: "strict" });
            setShow(false);
          }}
        >
          <span className="fs-5">{t[locale].confirm}</span>
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default CookieModal;
