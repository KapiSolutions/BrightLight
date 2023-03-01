import React, { useState } from "react";
import { Card, Button, Spinner } from "react-bootstrap";
import { useRouter } from "next/router";
import styles from "../../styles/components/CardTarot.module.scss";
import placeholder from "../../utils/placeholder";
import { useDeviceStore } from "../../stores/deviceStore";
import Image from "next/image";

function ProductCard(props) {
  const router = useRouter();
  const product = props.product;
  const preview = props.preview; //true when creating new product or updating existing
  const lang = useDeviceStore((state) => state.lang);
  const currency = "usd";
  const theme = useDeviceStore((state) => state.themeState);
  const [fullDesc, setfullDesc] = useState(false);
  const [loading, setLoading] = useState(false);
  const truncLength = 60;

  return (
    <Card style={{ width: "18rem" }} className="background border shadow-sm">
      <div className="rounded" style={{ position: "relative", height: "330px" }}>
        <Image
          src={product.image.path}
          // variant="top"
          fill
          placeholder="blur"
          blurDataURL={placeholder("dark")}
          sizes="(max-width: 768px) 100vw, 33vw"
          className={`imgOpacity pointer ${loading && "opacity-25"}`}
          alt={`${product.title[lang]} - Bright Light Gypsy Tarot`}
          title={`${product.title[lang]} - Bright Light Gypsy Tarot`}
          style={{ objectFit: "cover" }}
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
          <strong>{product.title.en}</strong>
        </Card.Title>
        <Card.Text
          id={`text-${product.id}`}
          className={`${styles.cardText} color-primary pointer`}
          onClick={() => setfullDesc(!fullDesc)}
        >
          {fullDesc ? product.desc[lang] : `${product.desc[lang].substring(0, truncLength)}`}
          {!fullDesc && product.desc[lang].length > truncLength && "..."}
        </Card.Text>
        
      </Card.Body>
      <Card.Footer className={`d-flex align-items-center justify-content-between ${theme === "dark" && "border-top border-dark"}`}>
        <span className="text-muted">
          {product.price[currency].amount.replace('.', ',')}
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
              <span> Loading...</span>
            </>
          ) : (
            <span> Get it! </span>
          )}
        </Button>
      </Card.Footer>
    </Card>
  );
}

export default ProductCard;
