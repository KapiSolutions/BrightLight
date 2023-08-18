import React, { useState, useEffect } from "react";
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
  const { setErrorMsg, authUserCredential } = useAuth();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [loadingEdit, setLoadingEdit] = useState(false);
  const [loadingDel, setLoadingDel] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [idToken, setIdToken] = useState(undefined);
  const cardsIcon = "/img/cards-light.png";

  const t = {
    en: {
      sthWrong: "Something went wrong, please try again later.",
      title: "Blog title",
      createDate: "Creation date",
      reactions: "Reactions",
      action: "Action",
      by: "By:",
      edit: "Edit",
      delete: "Delete",
      tryDelete: "You are trying to delete your Blog Post. This action is irreversible. Please confirm.",
    },
    pl: {
      sthWrong: "Coś poszło nie tak, spróbuj ponownie później.",
      title: "Tytuł Bloga",
      createDate: "Data dodania",
      reactions: "Reakcje",
      action: "Opcje",
      by: "Autor:",
      edit: "Edytuj",
      delete: "Usuń",
      tryDelete: "Próbujesz usunąć swój wpis. Ta czynność jest nieodwracalna. Proszę potwierdzić.",
    },
  };

  const getToken = async () => {
    const token = await authUserCredential.getIdToken(true);
    setIdToken(token.toString());
  };

  useEffect(() => {
    getToken();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const timeStampToDate = (time) => {
    return new Date(time.seconds * 1000 + time.nanoseconds / 100000);
  };

  async function deleteBlog() {
    try {
      const revalidateData = {
        secret: process.env.NEXT_PUBLIC_API_KEY,
        idToken: idToken,
        paths: ["/blog", "/"],
      };

      await deleteDocInCollection("blog", post.id);
      await deleteFilesInDirStorage(`images/blog/${post.id}`);
      await axios.post("/api/revalidate/", revalidateData);
      props.refresh(); //refresh the blog list after deleting
      setShowConfirmModal({ msg: "", itemID: "" });
    } catch (error) {
      setShowConfirmModal({ msg: "", itemID: "" });
      setErrorMsg(t[locale].sthWrong);
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
                  <strong>{t[locale].title}</strong>
                </div>
                <div className="col-3">
                  <strong>{t[locale].createDate}</strong>
                </div>
                <div className="col-3">
                  <strong>{t[locale].reactions}</strong>
                </div>
                <div className="col-2">
                  <strong>{t[locale].action}</strong>
                </div>
              </div>
            </>
          )}
          <hr />
        </>
      )}

      <div className="d-flex align-items-center text-start w-100 flex-wrap">
        <div className="col-10 col-md-4 d-flex pointer" onClick={() => isMobile && showDetailsFunc()}>
          <div className="d-flex align-items-center">
            {/* <SiMicrodotblog style={{width: "25px", height: "25px"}}/> */}
            <Image src={cardsIcon} width="58" height="58" alt="tarot cards" />
          </div>
          <div>
            {isMobile ? (
              <>
                <p className="mb-0">{post.title}</p>
                <i>
                  <small>
                    {t[locale].by} {post.author} - {timeStampToDate(post.date).toLocaleDateString()}
                  </small>
                </i>
              </>
            ) : (
              <>
                <p className="mb-0">{post.title}</p>
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
                    t[locale].edit
                  )}
                </Button>
                <Button
                  variant="primary"
                  className="text-light"
                  size="sm"
                  onClick={() => {
                    setShowConfirmModal({
                      msg: t[locale].tryDelete,
                      itemID: "",
                    });
                  }}
                  disabled={loadingDel}
                >
                  {loadingDel ? (
                    <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                  ) : (
                    t[locale].delete
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
                  t[locale].edit
                )}
              </Button>
              <Button
                variant="primary"
                className="text-light"
                size="sm"
                onClick={() => {
                  setShowConfirmModal({
                    msg: t[locale].tryDelete,
                    itemID: "",
                  });
                }}
                disabled={loadingDel}
              >
                {loadingDel ? (
                  <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                ) : (
                  t[locale].delete
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
