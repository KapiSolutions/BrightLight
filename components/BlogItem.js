import React, { useState, useEffect } from "react";
import { Card, Button } from "react-bootstrap";
import { useRouter } from "next/router";
import styles from "../styles/components/CardTarot.module.scss";
import { getFileUrlStorage } from "../firebase/Storage";
import { AiOutlineLike, AiOutlineComment } from "react-icons/ai";

function BlogItem(props) {
  const router = useRouter();
  const [fullDesc, setfullDesc] = useState(false);
  const truncLength = 100;

  useEffect(() => {
    // getFileUrlStorage("images/cards", props.img)
    //   .then((url) => {
    //     const img = document.getElementById(props.id);
    //     img.setAttribute("src", url);
    //   })
    //   .catch((error) => console.log(error));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Card className="background border shadow-sm color-primary col-12 col-sm-6 col-md-5 col-lg-4">
      <Card.Img
        id={props.id}
        alt={props.title}
        variant="top"
        className="imgOpacity pointer"
        src="/img/placeholders/Blog.webp"
        onClick={() => {
          router.push({
            pathname: "/blog/[pid]",
            query: { pid: props.id },
            hash: "main",
          });
        }}
      />
      <Card.Body className="text-start">
        <Card.Title className="color-primary">
          <strong>{props.title}</strong>
        </Card.Title>
        <Card.Text id={`text-${props.id}`} className={`${styles.cardText} color-primary`}>
          {fullDesc ? props.desc : `${props.desc.substring(0, truncLength)}...`}
        </Card.Text>
      </Card.Body>
      <Card.Footer className="d-flex justify-content-between align-items-center">
        <div>
          <AiOutlineLike style={{ width: "22px", height: "22px" }} className="pointer"/> <span className="me-2">12</span>
          <AiOutlineComment style={{ width: "22px", height: "22px" }} className="pointer"/> <span>12</span>
        </div>

        <Button
          variant="primary"
          className="float-end"
          onClick={() => {
            router.push({
              pathname: "/blog/[pid]",
              query: { pid: props.id },
              hash: "main",
            });
          }}
        >
          Read More
        </Button>
      </Card.Footer>
    </Card>
  );
}

export default BlogItem;
