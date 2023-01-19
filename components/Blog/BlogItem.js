import React, { useState, useEffect } from "react";
import { Card, Button, Badge, OverlayTrigger, Tooltip, Spinner } from "react-bootstrap";
import { useRouter } from "next/router";
import Link from "next/link";
import { AiOutlineLike, AiFillLike, AiOutlineComment } from "react-icons/ai";
import { useAuth } from "../../context/AuthProvider";
import { getDocById, handleLikeBlog } from "../../firebase/Firestore";
const parse = require("html-react-parser");

function BlogItem(props) {
  const router = useRouter();
  const { authUserFirestore, setErrorMsg } = useAuth();
  const [loading, setLoading] = useState(false);
  const post = props.blogPost;
  const [likes, setLikes] = useState([]);
  const [comments, setComments] = useState([]);
  const [userLiked, setUserLiked] = useState(false);
  const likesToShow = 6;
  const blogContent = parse(post.content);

  const timeStampToDate = (time) => {
    return new Date(time.seconds * 1000 + time.nanoseconds / 100000);
  };

  useEffect(() => {
    //Get act list of the likes and comments
    getDocById("blog", post.id)
      .then((doc) => {
        setLikes(doc.likes.sort((a, b) => timeStampToDate(b.date) - timeStampToDate(a.date)));
        setComments(doc.comments);
      })
      .catch((error) => console.log(error));

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
      setLikes(data[1].sort((a, b) => timeStampToDate(b.date) - timeStampToDate(a.date)));
      data[0] ? setUserLiked(true) : setUserLiked(false); //data[0] contains info if user like or not this item
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
          style={{ objectFit: post.mainImg.style, height: "200px" }}
          src={post.mainImg.path}
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
                <i>
                  By {post.author} - {timeStampToDate(post.date).toLocaleDateString()}
                </i>
              </small>
            </p>
          </Card.Title>
          <div
            id={`text-${post.id}`}
            className="color-primary text-muted mb-0"
            style={{
              maxHeight: "80px",
              overflow: "hidden",
              textOverflow: "ellipsis",
              maskImage: "linear-gradient(180deg, #000 85%, transparent)",
            }}
          >
            {blogContent}
          </div>

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
                <AiFillLike style={{ width: "22px", height: "22px" }} className="pointer" onClick={handleLike} />
              ) : (
                <AiOutlineLike style={{ width: "22px", height: "22px" }} className="pointer" onClick={handleLike} />
              )}
              <OverlayTrigger
                placement="bottom"
                trigger={["hover", "focus", "click"]}
                overlay={
                  <Tooltip>
                    {likes.map((_, idx) => (
                      <section key={idx}>
                        {idx < likesToShow && (
                          <p className="m-1 text-start">
                            <strong>
                              {likes[idx].userName} {authUserFirestore?.id == likes[idx].userID && <small>(You)</small>}
                            </strong>
                          </p>
                        )}
                      </section>
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
              <span className="ms-1 p-1">{comments.length}</span>
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
