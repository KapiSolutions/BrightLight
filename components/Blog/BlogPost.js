import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Badge, Form, Button, Spinner, OverlayTrigger, Tooltip } from "react-bootstrap";
import { AiOutlineLike, AiFillLike, AiOutlineComment } from "react-icons/ai";
import { useAuth } from "../../context/AuthProvider";
import { getDocById, handleLikeBlog, updateDocFields } from "../../firebase/Firestore";
import { v4 as uuidv4 } from "uuid";
import ConfirmActionModal from "../Modals/ConfirmActionModal";
import styles from "../../styles/components/Blog/BlogPost.module.scss";
const parse = require("html-react-parser");
import DOMPurify from "dompurify";
import handlebars from "handlebars/dist/handlebars.min.js"; // instead of: import handlebars from "handlebars"; - the second causes errors wtf
import { getFileUrlStorage } from "../../firebase/Storage";
import { useRouter } from "next/router";

function BlogPost(props) {
  const router = useRouter();
  const locale = router.locale;
  const post = props.post;
  const previewMode = props.preview ? true : false;
  const commentRef = useRef();
  //setErrorMsg if contains message then fires a modal with that error - Layout.js and ErrorModal.js
  const { authUserFirestore, setErrorMsg } = useAuth();
  const [likes, setLikes] = useState([]);
  const [comments, setComments] = useState([]);
  const [userLiked, setUserLiked] = useState(false);
  const [content, setContent] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState({ msg: "", itemID: "" });
  const [loading, setLoading] = useState(false);
  const likesToShow = 6;

  const timeStampToDate = (time) => {
    return new Date(time.seconds * 1000 + time.nanoseconds / 100000);
  };

  const convertHtml = async () => {
    let replacements = {};
    const template = handlebars.compile(post.content);
    await Promise.all(
      post.contentImages.map(async (img, idx) => {
        const url = await getFileUrlStorage(`images/blog/${post.id}`, img.fileName);
        const prop = img.fileName.slice(0, img.fileName.indexOf(".")); //img.FileName is eg. name.jpg => here take only the name
        const imgTag = `<img src="${url}" alt="${post.title} - ${t[locale].alt}" ${img.attributes.imgWidth}>`;
        replacements = {
          ...replacements,
          [prop]: imgTag,
        };
      })
    );
    setContent(DOMPurify.sanitize(template(replacements)));
  };

  useEffect(() => {
    if (!previewMode || (previewMode && props.editMode)) {
      if (post.contentImages.length > 0) {
        convertHtml();
      }
      //Get and sort act list of the likes and comments
      getDocById("blog", post.id)
        .then((doc) => {
          setLikes(doc.likes.sort((a, b) => timeStampToDate(b.date) - timeStampToDate(a.date)));
          setComments(doc.comments.sort((a, b) => timeStampToDate(b.date) - timeStampToDate(a.date)));
        })
        .catch((error) => console.log(error));

      //check if user have already liked a blog post
      if (authUserFirestore) {
        handleLikeBlog("check", post.id, authUserFirestore.id, authUserFirestore.name)
          .then((data) => {
            data ? setUserLiked(true) : setUserLiked(false);
          })
          .catch((error) => console.log(error));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authUserFirestore]);

  const handleLike = async () => {
    if (!previewMode) {
      if (authUserFirestore) {
        const data = await handleLikeBlog("update", post.id, authUserFirestore.id, authUserFirestore.name);
        setLikes(data[1].sort((a, b) => timeStampToDate(b.date) - timeStampToDate(a.date)));
        data[0] ? setUserLiked(true) : setUserLiked(false);
      } else {
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
      //get act. comments from the Firestore
      const actPost = await getDocById("blog", post.id);
      let updatedComments = actPost.comments;
      updatedComments.push(newComment);

      //update and sort the comments
      const data = await updateDocFields("blog", post.id, { comments: updatedComments });
      setComments(data.comments.sort((a, b) => timeStampToDate(b.date) - timeStampToDate(a.date)));
      commentRef.current.value = "";
      setLoading(false);
    } catch (error) {
      console.log(error);
      setErrorMsg(t[locale].sthWrong);
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
      setErrorMsg(t[locale].sthWrong);
    }
  };

  const t = {
    en: {
      alt: "tarot online, Bright Light",
      home: "Home",
      by: "By ",
      source: "Source:",
      tags: "Tags:",
      you: "You",
      sthWrong: "Something went wrong, please try again later.",
      writeComment: "Write a comment!",
      tryDelete: "You are trying to delete your comment. Please confirm.",
      yourComment: "Your comment...",
      pleaseSignIn: "Please sign in first to write a comment.",
      loading: "Loading...",
      send: "Send",
      signIn: "Sign in",
    },
    pl: {
      alt: "tarot online, Bright Light",
      home: "Strona Główna",
      by: "Autor: ",
      source: "Źródło:",
      tags: "Tagi:",
      you: "Ty",
      sthWrong: "Coś poszło nie tak, spróbuj ponownie później",
      writeComment: "Dodaj komentarz!",
      tryDelete: "Próbujesz usunąć swój komentarz. Proszę potwierdzić.",
      yourComment: "Napisz coś..",
      pleaseSignIn: "Zaloguj się, aby móc napisać komentarz.",
      loading: "Ładuję...",
      send: "Dodaj",
      signIn: "Zaloguj",
    },
  };
  return (
    <>
      <section className="d-flex gap-1">
        <small>
          <Link href="/">{t[locale].home}</Link>
        </small>
        <small>&gt;</small>
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
            {t[locale].by} {post.author} -{" "}
            {previewMode ? post.date.toLocaleDateString() : timeStampToDate(post.date).toLocaleDateString()}
          </i>
        </p>
      </div>
      <div className="w-100" style={{ minHeight: "200px", position: "relative" }}>
        <Image
          src={post.mainImg.path}
          fill
          alt={post.title}
          style={{ objectFit: post.mainImg.style, borderRadius: ".25rem" }}
        />
      </div>
      {post.mainImg.source && (
        <p className="text-start mb-0">
          <small>
            <i>
              {t[locale].source} <Link href={post.mainImg.source}> {post.mainImg.source} </Link>
            </i>
          </small>
        </p>
      )}

      {/* Content of the Blog post */}
      {/* when includes images then download them and modify html, if not then display raw content */}
      <div className={styles.contentWrapper}>{content ? parse(content) : parse(post.content)}</div>

      {/* Tags */}
      {post.tags.length > 0 && (
        <section className="text-start mt-2">
          <p className="mb-0">{t[locale].tags}</p>
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
                  {likes.map((_, idx) => (
                    <section key={idx}>
                      {idx < likesToShow && (
                        <p className="m-1 text-start">
                          <strong>
                            {likes[idx].userName}{" "}
                            {authUserFirestore?.id == likes[idx].userID && <small>({t[locale].you})</small>}
                          </strong>
                        </p>
                      )}
                    </section>
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
            <span className="pointer color-primary"> {t[locale].writeComment} &#10084;</span>
          </div>
        ) : (
          <div className="text-end">
            <Link href="#postCom" passHref>
              <span className="pointer color-primary"> {t[locale].writeComment} &#10084;</span>
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
                      onClick={() => {
                        setShowConfirmModal({
                          msg: t[locale].tryDelete,
                          itemID: comment.id,
                        });
                      }}
                    >
                      <strong>X</strong>
                    </Button>
                  </div>
                )}
              </div>
              <p className={`mb-0 `}>{comment.content}</p>

              <p className="text-muted text-end">{timeStampToDate(comment.date).toLocaleString()}</p>
              <hr className="m-1" />
            </div>
          ))}
          {/* Write Comment section */}
          <div id="postCom">
            <h4 className="mt-3">{t[locale].writeComment}</h4>
            <Form onSubmit={handleSubmit}>
              <Form.Control
                as="textarea"
                id="commentsField"
                placeholder={authUserFirestore ? t[locale].yourComment : t[locale].pleaseSignIn}
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
                        <span>{t[locale].loading}</span>
                      </>
                    ) : (
                      <span>{t[locale].send}</span>
                    )}
                  </Button>
                ) : (
                  <Link href="/sign-in" passHref>
                    <Button>{t[locale].signIn}</Button>
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
