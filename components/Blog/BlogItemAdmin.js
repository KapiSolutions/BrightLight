import React, { useState } from "react";
import Image from "next/image";
import { useAuth } from "../../context/AuthProvider";
import { Badge, Button, Modal, Spinner } from "react-bootstrap";
import { useRouter } from "next/router";
import { AiOutlineLike, AiOutlineComment } from "react-icons/ai";
import { IoIosArrowForward } from "react-icons/io";
import { deleteDocInCollection } from "../../firebase/Firestore";
import { useDeviceStore } from "../../stores/deviceStore";
import ConfirmActionModal from "../Modals/ConfirmActionModal";
import { deleteFilesInDirStorage } from "../../firebase/Storage";
import axios from "axios";

function BlogItemAdmin(props) {
  const router = useRouter();
  const locale = router.locale;
  const post = props.post;
  const isMobile = useDeviceStore((state) => state.isMobile);
  const { setErrorMsg } = useAuth();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [loadingEdit, setLoadingEdit] = useState(false);
  const [loadingDel, setLoadingDel] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const cardsIcon = "/img/cards-light.png";

  const timeStampToDate = (time) => {
    return new Date(time.seconds * 1000 + time.nanoseconds / 100000);
  };

  async function deleteBlog() {
    try {
      const revalidateData = {
        secret: process.env.NEXT_PUBLIC_API_KEY,
        paths: ["/admin/blogs", "/blog"]
      }
      
      await deleteDocInCollection("blog", post.id);
      await deleteFilesInDirStorage(`images/blog/${post.id}`);
      await axios.post("/api/revalidate", revalidateData);
      props.refresh(); //refresh the blog list after deleting
      setShowConfirmModal({ msg: "", itemID: "" });
    } catch (error) {
      setShowConfirmModal({ msg: "", itemID: "" });
      setErrorMsg("Something went wrong, please try again later.");
      console.log(error);
    }
  }

  const showDetailsFunc = () => {
    setShowDetails(!showDetails);
  };
  return (
    <div className="color-primary">
      {props.idx === 0 && (
        <>
          {!isMobile && (
            <>
              <div className="d-flex text-start w-100">
                <div className="col-4">
                  <strong>Blog title</strong>
                </div>
                <div className="col-3">
                  <strong>Creation Date</strong>
                </div>
                <div className="col-3">
                  <strong>Reactions</strong>
                </div>
                <div className="col-2">
                  <strong>Action</strong>
                </div>
              </div>
            </>
          )}
          <hr />
        </>
      )}

      <div className="d-flex align-items-center text-start w-100 flex-wrap">
        <div className="col-10 col-md-4 d-flex pointer" onClick={showDetailsFunc}>
          <div className="d-flex align-items-center">
            {/* <SiMicrodotblog style={{width: "25px", height: "25px"}}/> */}
            <Image src={cardsIcon} width="58" height="58" alt="tarot cards" />
          </div>
          <div>
            {isMobile ? (
              <>
                <p className="mb-0">{post.title[locale]}</p>
                <i>
                  <small>
                    By: {post.author} - {timeStampToDate(post.date).toLocaleDateString()}
                  </small>
                </i>
              </>
            ) : (
              <>
                <p className="mb-0">{post.title[locale]}</p>
                <small className="text-muted">By: {post.author}</small>
              </>
            )}
          </div>
        </div>

        {!isMobile && (
          <>
            <div className="col-3 text-uppercase">{timeStampToDate(post.date).toLocaleDateString()}</div>
            <div className="col-3">
              <div className="d-flex gap-1">
                <div>
                  <AiOutlineLike style={{ width: "22px", height: "22px" }} />
                  <span className="ms-1 p-1 me-2">{post.likes.length}</span>
                </div>

                <div>
                  <AiOutlineComment style={{ width: "22px", height: "22px" }} />
                  <span className="ms-1 p-1">{post.comments.length}</span>
                </div>
              </div>
            </div>
            <div className="col-2">
              <div className="d-flex flex-wrap mt-2 gap-3">
                <Button
                  variant="outline-primary"
                  size="sm"
                  onClick={() => {
                    router.push({
                      pathname: "/admin/blogs/[pid]",
                      query: { pid: post.id },
                      hash: "main",
                    });
                    setLoadingEdit(true);
                  }}
                  disabled={loadingEdit}
                >
                  {loadingEdit ? (
                    <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                  ) : (
                    "Edit"
                  )}
                </Button>
                <Button
                  variant="primary"
                  className="text-light"
                  size="sm"
                  onClick={() => {
                    setShowConfirmModal({
                      msg: "You are trying to delete your Blog Post. This action is irreversible. Confirm or return to orders.",
                      itemID: "",
                    });
                  }}
                  disabled={loadingDel}
                >
                  {loadingDel ? (
                    <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                  ) : (
                    "Delete"
                  )}
                </Button>
              </div>
            </div>
          </>
        )}
        {isMobile && (
          <div className="col-2 text-center pointer" onClick={showDetailsFunc}>
            <IoIosArrowForward
              style={{ height: "25px", width: "25px", transform: `rotate(${showDetails ? "90" : "0"}deg)` }}
            />
          </div>
        )}
        {/* Actions bar on Mobile */}
        {showDetails && (
          <div className="d-flex justify-content-between w-100 mt-3">
            <div className="d-flex">
              <div className="d-flex gap-1 ms-2">
                <div>
                  <AiOutlineLike style={{ width: "20px", height: "20px" }} />
                  <small className="ms-1 p-1 me-2">{post.likes.length}</small>
                </div>

                <div>
                  <AiOutlineComment style={{ width: "20px", height: "20px" }} />
                  <small className="ms-1 p-1">{post.comments.length}</small>
                </div>
              </div>
            </div>
            <div className="d-flex gap-3">
              <Button
                variant="outline-primary"
                size="sm"
                onClick={() => {
                  router.push({
                    pathname: "/admin/blogs/[pid]",
                    query: { pid: post.id },
                    hash: "main",
                  });
                  setLoadingEdit(true);
                }}
                disabled={loadingEdit}
              >
                {loadingEdit ? (
                    <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                  ) : (
                    "Edit"
                  )}
              </Button>
              <Button
                variant="primary"
                className="text-light"
                size="sm"
                onClick={() => {
                  setShowConfirmModal({
                    msg: "You are trying to delete your Blog Post. This action is irreversible. Please confirm.",
                    itemID: "",
                  });
                }}
                disabled={loadingDel}
              >
                {loadingDel ? (
                  <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                ) : (
                  "Delete"
                )}
              </Button>
            </div>
          </div>
        )}
      </div>
      <hr />

      {/* Modal which appears when user wants to cancel the order */}
      <ConfirmActionModal
        msg={showConfirmModal.msg}
        closeModal={() => setShowConfirmModal({ msg: "", itemID: "" })}
        action={deleteBlog}
      />
    </div>
  );
}

export default BlogItemAdmin;
