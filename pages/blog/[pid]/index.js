import React, { useState, useEffect, useRef } from "react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { Badge, Form, Button, Container, Spinner, OverlayTrigger, Tooltip } from "react-bootstrap";
import { db } from "../../../config/firebase";
import { doc, getDoc, getDocs, collection } from "firebase/firestore";
import { AiOutlineLike, AiFillLike, AiOutlineComment } from "react-icons/ai";
import { useDeviceStore } from "../../../stores/deviceStore";
import { useAuth } from "../../../context/AuthProvider";
import { getDocById, handleLikeBlog, queryByFirestore, updateDocFields } from "../../../firebase/Firestore";
import ErrorModal from "../../../components/Modals/ErrorModal";
import { v4 as uuidv4 } from "uuid";

function BlogPage(props) {
  const post = props.post;
  const commentRef = useRef();
  const { authUserFirestore } = useAuth();
  const isMobile = useDeviceStore((state) => state.isMobile);
  const [likes, setLikes] = useState(post.likes);
  const [comments, setComments] = useState(post.comments);
  const [userLiked, setUserLiked] = useState(false);
  const [showModal, setShowModal] = useState("");
  const [loading, setLoading] = useState(false);
  const likesToShow = 6;

  useEffect(() => {
    if (authUserFirestore) {
      //check if user have already liked a blog post(during initialization of the page)
      handleLikeBlog("check", post.id, authUserFirestore.id, authUserFirestore.name)
        .then((data) => {
          data ? setUserLiked(true) : setUserLiked(false);
        })
        .catch((error) => console.log(error));
    }
    // getFileUrlStorage("images/cards", props.img)
    //   .then((url) => {
    //     const img = document.getElementById(props.id);
    //     img.setAttribute("src", url);
    //   })
    //   .catch((error) => console.log(error));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authUserFirestore]);

  const handleLike = async () => {
    if (authUserFirestore) {
      const data = await handleLikeBlog("update", post.id, authUserFirestore.id, authUserFirestore.name);
      setLikes(data[1]);
      data[0] ? setUserLiked(true) : setUserLiked(false);
    } else {
      // show popup with sign in info
      setShowModal("sign");
    }
  };

  const closeModal = () => {
    setShowModal("");
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
  return (
    <>
      <Head>
        <title>BrightLight | Blog</title>
      </Head>
      <Container className="color-primary justify-content-center text-start mt-3">
        <section className="d-flex gap-1">
          <small>
            <Link href="/blog#main">Blog</Link>
          </small>
          <small>&gt;</small>
          <small>{post.title}</small>
        </section>
        <h1 className="color-primary mb-0"> {post.title} </h1>
        <p className="ms-2 text-muted">
          <i>By BrightLightGypsy - 2022.01.06</i>
        </p>
        <div className="w-100 border" style={{ minHeight: "200px", position: "relative" }}>
          <Image src="/img/blog/main.jpg" fill alt={post.title} style={{ objectFit: "cover" }} />
        </div>
        <p>
          <small>
            <i>
              Source: <Link href="https://t.ly/oHwI"> https://t.ly/oHwI </Link>
            </i>
          </small>
        </p>
        <p>&emsp; &ensp;{post.content}</p>

        {/* Tags */}
        <section>
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

        <div className="m-1">
          <hr />
        </div>

        {/* Actions */}
        <div className="d-inline-flex align-items-center justify-content-between w-100">
          <div className="d-flex">
            <div>
              {userLiked ? (
                <AiFillLike style={{ width: "22px", height: "22px" }} className="pointer me-1" onClick={handleLike}/>
              ) : (
                <AiOutlineLike style={{ width: "22px", height: "22px" }} className="pointer me-1" onClick={handleLike}/>
              )}

              <OverlayTrigger
                placement="bottom"
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
          <div className="text-end">
            <Link href="#postCom" passHref>
              <span className="pointer color-primary"> Write a Comment! &#10084;</span>
            </Link>
          </div>
        </div>

        {/* Comments */}
        <section className="mt-5 d-flex flex-column gap-3">
          {comments.map((comment) => (
            <div key={comment.id}>
              <p className="text-uppercase">
                <strong>{comment.userName} wrote:</strong>
              </p>
              <p className="mb-0">{comment.content}</p>
              <p className="text-muted text-end">
                {new Date(comment.date.seconds * 1000 + comment.date.nanoseconds / 100000).toLocaleString()}
              </p>
              <hr className="m-1" />
            </div>
          ))}

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
      </Container>

      <ErrorModal msg={showModal} resetMsg={closeModal} />
    </>
  );
}

export default BlogPage;

export async function getStaticProps(context) {
  const pid = context.params.pid;
  let blogPost;

  const ref = doc(db, "blog", pid);
  const docSnap = await getDoc(ref);
  if (docSnap.exists()) {
    blogPost = docSnap.data();
  } else {
    error = "Error: data doesnt exist";
  }

  return {
    props: {
      post: JSON.parse(JSON.stringify(blogPost)),
    },
    revalidate: 60,
  };
}

export async function getStaticPaths() {
  const BlogPostIds = [];
  const querySnapshot = await getDocs(collection(db, "blog"));
  querySnapshot.forEach((doc) => {
    const blogID = {
      pid: doc.data().id,
    };
    BlogPostIds.push(blogID);
  });

  return {
    paths: BlogPostIds.map((blogID) => {
      return {
        params: {
          pid: blogID.pid,
        },
      };
    }),
    fallback: false,
  };
}
