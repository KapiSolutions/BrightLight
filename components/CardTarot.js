import React, { useState, useEffect } from "react";
import { Card, Button } from "react-bootstrap";
import { useRouter } from "next/router";
import styles from "../styles/components/CardTarot.module.scss";
import { getFileUrlStorage } from "../firebase/Storage";

function CardTarot(props) {
  const router = useRouter();
  const [fullDesc, setfullDesc] = useState(false);
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
        variant="top"
        className="imgOpacity pointer"
        alt={props.title}
        onClick={() => {
          router.push({
            pathname: "/card/[pid]",
            query: { pid: props.id },
            hash: "main",
          });
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
          }}
        >
          Get it
        </Button>
      </Card.Body>
    </Card>
  );
}

export default CardTarot;
