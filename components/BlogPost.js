import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Badge, Form, Button, Container, Spinner, OverlayTrigger, Tooltip } from "react-bootstrap";
import { AiOutlineLike, AiFillLike, AiOutlineComment } from "react-icons/ai";
import { useDeviceStore } from "../stores/deviceStore";
import { useAuth } from "../context/AuthProvider";
import { getDocById, handleLikeBlog, updateDocFields } from "../firebase/Firestore";
import { v4 as uuidv4 } from "uuid";
import ConfirmActionModal from "../components/Modals/ConfirmActionModal";
import styles from "../styles/components/BlogPost.module.scss";
const parse = require("html-react-parser");

function BlogPost(props) {
  const post = props.post;
  const previewMode = props.preview ? true : false;
  const commentRef = useRef();
  //setErrorMsg if contains message then fires a modal with that error - Layout.js and ErrorModal.js
  const { authUserFirestore, setErrorMsg } = useAuth();
  const isMobile = useDeviceStore((state) => state.isMobile);
  const [likes, setLikes] = useState(post.likes);
  const [comments, setComments] = useState(post.comments);
  const [userLiked, setUserLiked] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState({ msg: "", itemID: "" });
  const [loading, setLoading] = useState(false);
  const likesToShow = 6;

  useEffect(() => {
    if (authUserFirestore && !previewMode) {
      //check if user have already liked a blog post(during initialization of the page)
      handleLikeBlog("check", post.id, authUserFirestore.id, authUserFirestore.name)
        .then((data) => {
          data ? setUserLiked(true) : setUserLiked(false);
        })
        .catch((error) => console.log(error));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authUserFirestore]);

  const handleLike = async () => {
    if (!previewMode) {
      if (authUserFirestore) {
        const data = await handleLikeBlog("update", post.id, authUserFirestore.id, authUserFirestore.name);
        setLikes(data[1]);
        data[0] ? setUserLiked(true) : setUserLiked(false);
      } else {
        // show popup with sign in info
        setErrorMsg("sign");
      }
    }
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    const newComment = {
      id: uuidv4().slice(0, 13),
      date: new Date(),
      userID: authUserFirestore.id,
      userName: authUserFirestore.name,
      content: commentRef.current.value,
    };
    try {
      //get the latest comment list from the Firestore
      const actPost = await getDocById("blog", post.id);
      let updatedComments = actPost.comments;
      updatedComments.push(newComment);

      //update the comment list
      const data = await updateDocFields("blog", post.id, { comments: updatedComments });
      setComments(data.comments);
      commentRef.current.value = "";
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  }

  const deleteComment = async () => {
    try {
      //get the latest comment list from the Firestore
      const actPost = await getDocById("blog", post.id);
      let updatedComments = actPost.comments;
      //get the index of the comment
      const idx = updatedComments.findIndex((comment) => comment.id == showConfirmModal.itemID);
      updatedComments.splice(idx, 1);
      //update the comment list
      const data = await updateDocFields("blog", post.id, { comments: updatedComments });
      setComments(data.comments);
      setShowConfirmModal({ msg: "", itemID: "" });
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <section className="d-flex gap-1">
        <small>
          <Link href="/blog#main">Blog</Link>
        </small>
        <small>&gt;</small>
        <small>{post.title}</small>
      </section>
      <div className="text-start">
        <h1 className="color-primary mb-0"> {post.title} </h1>
        <p className="ms-2 text-muted">
          <i>
            By {post.author} - {post.date}
          </i>
        </p>
      </div>
      <div className="w-100" style={{ minHeight: "200px", position: "relative" }}>
        <Image src={post.mainImg} fill alt={post.title} style={{ objectFit: "cover", borderRadius: ".25rem" }} />
      </div>
      {post.mainImgSource && (
        <p className="text-start mb-0">
          <small>
            <i>
              Source: <Link href={post.mainImgSource}> {post.mainImgSource} </Link>
            </i>
          </small>
        </p>
      )}

      {/* Content of the Blog post */}
      <div className={styles.contentWrapper}>{parse(post.content)}</div>

      {/* Tags */}
      {post.tags.length > 0 && (
        <section className="text-start mt-2">
          <p className="mb-0">Tags:</p>
          <div className="d-inline-flex gap-2 flex-wrap">
            {post.tags.map((tag, idx) => (
              <Badge key={tag + idx} bg="dark" className="pointer">
                <Link href={`https://www.google.com/search?q=${tag}`} target="_blank" rel="noopener noreferrer">
                  <span className="text-light">#{tag}</span>{" "}
                </Link>
              </Badge>
            ))}
          </div>
        </section>
      )}

      <div className="m-1">
        <hr />
      </div>

      {/* Actions */}
      <div className="d-inline-flex align-items-center justify-content-between w-100">
        <div className="d-flex">
          <div>
            {userLiked ? (
              <AiFillLike style={{ width: "22px", height: "22px" }} className="pointer me-1" onClick={handleLike} />
            ) : (
              <AiOutlineLike style={{ width: "22px", height: "22px" }} className="pointer me-1" onClick={handleLike} />
            )}

            <OverlayTrigger
              placement="bottom"
              trigger={["hover", "focus", "click"]}
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
              <span className="me-2 p-1 pointer">{likes.length}</span>
            </OverlayTrigger>
          </div>

          <div>
            <AiOutlineComment style={{ width: "22px", height: "22px" }} className="pointer me-1" />
            <span className="p-1">{comments.length}</span>
          </div>
        </div>
        {previewMode ? (
          <div className="text-end">
            <span className="pointer color-primary"> Write a Comment! &#10084;</span>
          </div>
        ) : (
          <div className="text-end">
            <Link href="#postCom" passHref>
              <span className="pointer color-primary"> Write a Comment! &#10084;</span>
            </Link>
          </div>
        )}
      </div>

      {/* Comments */}
      {!previewMode && (
        <section className="mt-5 d-flex flex-column gap-3">
          {comments.map((comment) => (
            <div key={comment.id}>
              <div className="d-flex">
                <p className={`text-uppercase  ${authUserFirestore?.id == comment.userID && "col-9"}`}>
                  <strong>{comment.userName} wrote:</strong>
                </p>
                {authUserFirestore?.id == comment.userID && (
                  <div className="col-3 text-end">
                    <Button
                      size="sm"
                      variant="primary"
                      className="pointer"
                      onClick={() =>
                        setShowConfirmModal({
                          msg: "You are trying to delete your comment. Please confirm.",
                          itemID: comment.id,
                        })
                      }
                    >
                      <strong>X</strong>
                    </Button>
                  </div>
                )}
              </div>
              <p className={`mb-0 `}>{comment.content}</p>

              <p className="text-muted text-end">
                {new Date(comment.date.seconds * 1000 + comment.date.nanoseconds / 100000).toLocaleString()}
              </p>
              <hr className="m-1" />
            </div>
          ))}
          {/* Write Comment section */}
          <div id="postCom">
            <h4 className="mt-3">Write a Comment</h4>
            <Form onSubmit={handleSubmit}>
              <Form.Control
                as="textarea"
                id="commentsField"
                placeholder={authUserFirestore ? "Your Comment..." : "Please sign in first to write a comment."}
                style={{ minHeight: "80px" }}
                ref={commentRef}
                disabled={!authUserFirestore}
                required
              />
              <div className="mt-3 text-end">
                {authUserFirestore ? (
                  <Button type="submit" disabled={loading}>
                    {loading ? (
                      <>
                        <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                        <span>Loading...</span>
                      </>
                    ) : (
                      <span> Send </span>
                    )}
                  </Button>
                ) : (
                  <Link href="/sign-in" passHref>
                    <Button>Sign In</Button>
                  </Link>
                )}
              </div>
            </Form>
          </div>
        </section>
      )}
      {/* Fires when user is trying do delete comment */}
      <ConfirmActionModal
        msg={showConfirmModal.msg}
        closeModal={() => setShowConfirmModal({ msg: "", itemID: "" })}
        action={deleteComment}
      />
    </>
  );
}

export default BlogPost;
