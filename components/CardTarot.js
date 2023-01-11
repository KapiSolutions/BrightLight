import React, { useState, useEffect } from "react";
import { Card, Button, Spinner } from "react-bootstrap";
import { useRouter } from "next/router";
import styles from "../styles/components/CardTarot.module.scss";
import { getFileUrlStorage } from "../firebase/Storage";
import placeholder from "../utils/placeholder";

function CardTarot(props) {
  const router = useRouter();
  const [fullDesc, setfullDesc] = useState(false);
  const [loading, setLoading] = useState(false);
  const truncLength = 60;

  useEffect(() => {
    getFileUrlStorage("images/cards", props.img)
      .then((url) => {
        const img = document.getElementById(props.title);
        img.setAttribute("src", url);
      })
      .catch((error) => console.log(error));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Card style={{ width: "18rem" }} className="background border shadow-sm">
      <Card.Img
        id={props.title}
        src={placeholder("light")}
        variant="top"
        className={`imgOpacity pointer ${loading && "opacity-25"}`}
        alt={props.title}
        onClick={() => {
          if (!loading) {
            router.push({
              pathname: "/card/[pid]",
              query: { pid: props.id },
              hash: "main",
            });
          }
          setLoading(true);
        }}
      />
      <Card.Body>
        <Card.Title className="color-primary">
          <strong>{props.title}</strong>
        </Card.Title>
        <Card.Text id={`text-${props.id}`} className={`${styles.cardText} color-primary`}>
          {fullDesc ? props.desc : `${props.desc.substring(0, truncLength)}...`}
        </Card.Text>
        <Button variant="outline-accent3" className="float-start" onClick={() => setfullDesc(!fullDesc)}>
          {fullDesc ? "Read Less" : "Read more"}
        </Button>
        <Button
          variant="primary"
          className="float-end"
          onClick={() => {
            router.push({
              pathname: "/card/[pid]",
              query: { pid: props.id },
              hash: "main",
            });
            setLoading(true);
          }}
          disabled={loading}
        >
          {loading ? (
            <>
              <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
              <span> Loading...</span>
            </>
          ) : (
            <span> Get it </span>
          )}
        </Button>
      </Card.Body>
    </Card>
  );
}

export default CardTarot;
