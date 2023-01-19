import React, { useState } from "react";
import Image from "next/image";
import { useAuth } from "../../context/AuthProvider";
import { Badge, Button, Modal, Spinner } from "react-bootstrap";
import { useRouter } from "next/router";
import { TbTrashX } from "react-icons/tb";
import { IoIosArrowForward } from "react-icons/io";
import { deleteDocInCollection } from "../../firebase/Firestore";
import { useDeviceStore } from "../../stores/deviceStore";
import ConfirmActionModal from "../Modals/ConfirmActionModal";

function BlogItemAdmin(props) {
  const router = useRouter();
  const post = props.post;
  const isMobile = useDeviceStore((state) => state.isMobile);
  const { setErrorMsg } = useAuth();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [loading, setLoading] = useState(undefined);
  const [showDetails, setShowDetails] = useState(false);
  const cardsIcon = "/img/cards-light.png";

  const timeStampToDate = (time) => {
    return new Date(time.seconds * 1000 + time.nanoseconds / 100000);
  };

  async function deleteBlog() {
    try {
      await deleteDocInCollection("blog", blog.id);
      //!Delete all the images in the storage
      setShowConfirmModal({ msg: "", itemID: "" });
    } catch (error) {
      setShowConfirmModal({ msg: "", itemID: "" });
      setErrorMsg("Something went wrong, please try again later.");
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
                <div className="col-5">
                  <strong>Blog title</strong>
                </div>
                <div className="col-3">
                  <strong>Author</strong>
                </div>
                <div className="col-2">
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
        <div className="col-10 col-md-5 d-flex pointer" onClick={showDetailsFunc}>
          <div>
            <Image src={cardsIcon} width="58" height="58" alt="tarot cards" />
          </div>
          <div>
            {isMobile ? (
              <>
                <p className="mb-0">{post.title}</p>
                <small>{timeStampToDate(post.date)}</small>
              </>
            ) : (
              <>
                <p className="mb-0">{post.title}</p>
                <small className="text-muted">{timeStampToDate(post.date).toLocaleDateString()}</small>
              </>
            )}
          </div>
        </div>

        {!isMobile && (
          <>
            <div className="col-3 text-uppercase">{post.author}</div>
            <div className="col-2">Likes & Comments</div>
            <div className="col-2">
                <div className="d-flex flex-wrap mt-2 gap-3">
                  <Button variant="outline-primary" size="sm">
                    Edit
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
                    disabled={loading}
                  >
                    {loading ? (
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

        {/* Details of the order */}
        {showDetails && <p>Details - open new page</p>}
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
