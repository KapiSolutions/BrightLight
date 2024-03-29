import React, { useState } from "react";
import { Card, Button, Spinner } from "react-bootstrap";
import { useRouter } from "next/router";
import styles from "../../styles/components/CardTarot.module.scss";
import placeholder from "../../utils/placeholder";
import { useDeviceStore } from "../../stores/deviceStore";
import Image from "next/image";

function ProductCard(props) {
  const router = useRouter();
  const locale = router.locale;
  const product = props.product;
  const preview = props.preview; //true when creating new product or updating existing
  const currency = useDeviceStore((state) => state.currency);
  const theme = useDeviceStore((state) => state.themeState);
  const [fullDesc, setfullDesc] = useState(false);
  const [loading, setLoading] = useState(false);
  const truncLength = 60;
  const themeDarkStyle = theme == "dark" ? "bg-accent6 text-light border-accent7" : "";

  const t = {
    en: {
      button: "Get it!",
      loading: "Loading...",
    },
    pl: {
      button: "Wybieram!",
      loading: "Ładuję..",
    },
  };

  return (
    <Card style={{ width: "18rem" }} className={`background border shadow-sm rounded ${themeDarkStyle}`}>
      {/* init heigh 330px */}
      <div className="rounded" style={{ position: "relative", height: "250px" }}>
        <Image
          src={product.image.path}
          quality={100}
          fill
          placeholder="blur"
          blurDataURL={placeholder("light")}
          sizes="(max-width: 768px) 100vw, 33vw"
          className={`imgOpacity pointer rounded-top ${loading && "opacity-25"}`}
          alt={`${product.title} - Bright Light Gypsy Tarot`}
          title={`${product.title} - Bright Light Gypsy Tarot`}
          style={{ objectFit: "cover", objectPosition: "0px -20px" }}
          onClick={() => {
            if (!loading) {
              router.push({
                pathname: "/product/[pid]",
                query: { pid: product.id },
                hash: "main",
              });
            }
            setLoading(true);
          }}
        />
      </div>
      <Card.Body>
        <Card.Title className="color-primary">
          <strong>{product.title}</strong>
        </Card.Title>
        <Card.Text
          id={`text-${product.id}`}
          className={`${styles.cardText} color-primary pointer`}
          onClick={() => setfullDesc(!fullDesc)}
        >
          {fullDesc ? product.desc : `${product.desc.substring(0, truncLength)}`}
          {!fullDesc && product.desc.length > truncLength && "..."}
        </Card.Text>
      </Card.Body>
      <Card.Footer
        className={`d-flex align-items-center justify-content-between ${theme === "dark" && "border-top border-accent7"}`}
      >
        <span className={styles.cardText}>
          {product.price[currency].amount.replace(".", ",")}
          <span className="text-uppercase ms-1">{currency}</span>
        </span>
        <Button
          variant="primary"
          onClick={() => {
            if (!preview) {
              router.push({
                pathname: "/product/[pid]",
                query: { pid: product.id },
                hash: "main",
              });
              setLoading(true);
            }
          }}
          disabled={loading}
        >
          {loading ? (
            <>
              <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
              <span> {t[locale].loading}</span>
            </>
          ) : (
            <span> {t[locale].button} </span>
          )}
        </Button>
      </Card.Footer>
    </Card>
  );
}

export default ProductCard;
