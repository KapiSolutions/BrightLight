import React, { useState, useEffect } from "react";
import { Card, Button } from "react-bootstrap";
import { useRouter } from "next/router";
import { getFileUrlStorage } from "../firebase/Storage";
import { AiOutlineLike, AiOutlineComment } from "react-icons/ai";

function BlogItem(props) {
  const router = useRouter();
  const [fullDesc, setfullDesc] = useState(false);
  const truncLength = 100;
  const post = props.blogPost;

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
        id={post.id}
        alt={post.title}
        variant="top"
        className="imgOpacity pointer"
        src="/img/placeholders/Blog.webp"
        onClick={() => {
          router.push({
            pathname: "/blog/[pid]",
            query: { pid: post.id },
            hash: "main",
          });
        }}
      />
      <Card.Body className="text-start">
        <Card.Title className="color-primary">
          <p>
            <strong>{post.title}</strong>
            <br />
            <small>
              <i>{post.date}</i>
            </small>
          </p>
        </Card.Title>
        <Card.Text id={`text-${post.id}`} className="color-primary text-muted">
          {fullDesc ? post.content : `${post.content.substring(0, truncLength)}...`}
        </Card.Text>
      </Card.Body>
      <Card.Footer className="d-flex justify-content-between align-items-center">
        <div>
          <AiOutlineLike style={{ width: "22px", height: "22px" }} className="pointer" />{" "}
          <span className="me-2">{post.likes.length}</span>
          <AiOutlineComment style={{ width: "22px", height: "22px" }} className="pointer" /> <span>{post.comments.length}</span>
        </div>

        <Button
          variant="primary"
          className="float-end"
          onClick={() => {
            router.push({
              pathname: "/blog/[pid]",
              query: { pid: post.id },
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
