import React, { useState, useEffect } from "react";
import { Card, Button, Badge, OverlayTrigger, Tooltip, Spinner } from "react-bootstrap";
import { useRouter } from "next/router";
import Link from "next/link";
import { AiOutlineLike, AiFillLike, AiOutlineComment } from "react-icons/ai";
import { useAuth } from "../context/AuthProvider";
import { handleLikeBlog } from "../firebase/Firestore";
const parse = require("html-react-parser");

function BlogItem(props) {
  const router = useRouter();
  const { authUserFirestore, setErrorMsg } = useAuth();
  const [loading, setLoading] = useState(false);
  const truncLength = 100;
  const post = props.blogPost;
  const [likes, setLikes] = useState(post.likes);
  const [userLiked, setUserLiked] = useState(false);
  const likesToShow = 6;
  const blogContent = parse(post.content);

  useEffect(() => {
    //check if user have already liked a blog post(during initialization of the page)
    if (authUserFirestore) {
      handleLikeBlog("check", post.id, authUserFirestore.id, authUserFirestore.name)
        .then((data) => {
          data ? setUserLiked(true) : setUserLiked(false);
        })
        .catch((error) => console.log(error));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authUserFirestore]);

  const handleLike = async () => {
    if (authUserFirestore) {
      const data = await handleLikeBlog("update", post.id, authUserFirestore.id, authUserFirestore.name);
      setLikes(data[1]);
      data[0] ? setUserLiked(true) : setUserLiked(false);
    } else {
      // show popup with sign in info
      setErrorMsg("sign");
    }
  };

  return (
    <>
      <Card className="background border shadow-sm color-primary col-12 col-sm-6 col-md-5 col-lg-4">
        <Card.Img
          id={post.id}
          alt={post.title}
          variant="top"
          className={`imgOpacity pointer ${loading && "opacity-25"}`}
          style={{ objectFit: "cover", height: "200px" }}
          src={post.mainImg}
          onClick={() => {
            setLoading(true);
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
                <i>By {post.author} - {post.date}</i>
              </small>
            </p>
          </Card.Title>
          <Card.Text id={`text-${post.id}`} className="color-primary text-muted mb-0" style={{maxHeight: "80px", overflow: "hidden"}}>
          {blogContent}
          </Card.Text>

          {/* Tags */}
          <section className="d-flex gap-2 mt-3 overflow-auto noScrollBar" style={{ maxWidth: "80vw" }}>
            {post.tags.map((tag, idx) => (
              <Badge key={tag + idx} bg="dark" className="pointer">
                <Link href={`https://www.google.com/search?q=${tag}`} target="_blank" rel="noopener noreferrer">
                  <span className="text-light">#{tag}</span>
                </Link>
              </Badge>
            ))}
          </section>
        </Card.Body>
        <Card.Footer className="d-flex justify-content-between align-items-center">
          <div className="d-flex gap-1">
            <div>
              {userLiked ? (
                <AiFillLike style={{ width: "22px", height: "22px" }} className="pointer" onClick={handleLike}/>
              ) : (
                <AiOutlineLike style={{ width: "22px", height: "22px" }} className="pointer" onClick={handleLike}/>
              )}
              <OverlayTrigger
                placement="bottom"
                trigger={['hover', 'focus', 'click']}
                overlay={
                  <Tooltip>
                    {Array.from({ length: likes.length > likesToShow ? likesToShow : likes.length }).map((_, idx) => (
                      <p key={idx} className="m-1 text-start">
                        <strong>{likes[idx].userName}</strong>
                      </p>
                    ))}
                    {likes.length > likesToShow && <p className="m-1 text-start">...</p>}
                  </Tooltip>
                }
              >
                <span className="ms-1 p-1 me-2 pointer">{likes.length}</span>
              </OverlayTrigger>
            </div>

            <div>
              <AiOutlineComment style={{ width: "22px", height: "22px" }} className="pointer" />
              <span className="ms-1 p-1">{post.comments.length}</span>
            </div>
          </div>
          <Button
            variant="primary"
            className="float-end"
            onClick={() => {
              setLoading(true);
              router.push({
                pathname: "/blog/[pid]",
                query: { pid: post.id },
                hash: "main",
              });
            }}
          >
            {loading ? (
            <>
              <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
              <span> Loading...</span>
            </>
          ) : (
            <span> Read More </span>
          )}
          </Button>
        </Card.Footer>
      </Card>
    </>
  );
}

export default BlogItem;
