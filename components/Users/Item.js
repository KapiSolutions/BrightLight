import React, { useState } from "react";
import { Button, Spinner } from "react-bootstrap";
import { FaRegUser, FaUserSecret } from "react-icons/fa";
import { IoIosArrowForward } from "react-icons/io";
import { useDeviceStore } from "../../stores/deviceStore";
import ConfirmActionModal from "../Modals/ConfirmActionModal";

function Item(props) {
  const isMobile = useDeviceStore((state) => state.isMobile);
  const [loadingDel, setLoadingDel] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const user = props.user;

  const showDetailsFunc = () => {
    setShowDetails(!showDetails);
  };

  async function deleteUser() {
    try {
      await deleteDocInCollection("users", user.id);
      setShowConfirmModal({ msg: "", itemID: "" });
      //   props.refresh(); //refresh the order list
    } catch (error) {
      console.log(error);
      setShowConfirmModal({ msg: "", itemID: "" });
      setErrorMsg("Something went wrong, please try again later.");
    }
  }
  return (
    <div className="color-primary">
      {props.idx === 0 && (
        <>
          {!isMobile && (
            <>
              <div className="d-flex text-start w-100">
                <div className="col-3">
                  <strong>User Name</strong>
                </div>
                <div className="col-5">
                  <strong>User Email</strong>
                </div>
                <div className="col-2">
                  <strong>Provider</strong>
                </div>
                <div className="col-2">
                  <strong>Actions</strong>
                </div>
              </div>
            </>
          )}
          <hr />
        </>
      )}

      <div className="d-flex align-items-center text-start w-100 flex-wrap">
        <div className="col-10 col-md-3 d-flex pointer">
          <div className="d-flex align-items-center me-2">
            {user.role == "user" ? (
              <FaRegUser style={{ width: "25px", height: "25px" }} />
            ) : (
              <FaUserSecret style={{ width: "25px", height: "25px" }} />
            )}
          </div>
          <div className="d-flex flex-column">
            {isMobile ? (
              <>
                <p className="mb-0">{user.name}</p>
                <i>
                  <small>Role: {user.role == "user" ? "User" : "Admin"}</small>
                </i>
              </>
            ) : (
              <>
                <p className="mb-0">{user.name}</p>
                <small className="text-muted">Role: {user.role == "user" ? "User" : "Admin"}</small>
              </>
            )}
          </div>
        </div>

        {!isMobile && (
          <>
            <div className="col-5 text-uppercase">
              <small>{user.email}</small>
            </div>
            <div className="col-2">{user.signProvider}</div>
            <div className="col-2">
              <div className="d-flex gap-2 align-items-center justify-content-end">
                <Button variant="outline-primary" size="sm" onClick={showDetailsFunc}>
                  Show {showDetails ? "less" : "more"}
                </Button>
                <Button
                  variant="primary"
                  className="text-light"
                  size="sm"
                  onClick={() => {
                    setShowConfirmModal({
                      msg: "You are trying to delete this user. This action is irreversible. Please confirm.",
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
          <div className="mt-3 w-100">
            <div>
              <p>
                <small className="text-uppercase">
                  <strong>Email:</strong> {user.email}
                </small>
                <br />
                <small className="text-uppercase">
                  <strong>Provider:</strong> {user.signProvider}
                </small>
              </p>
            </div>
            <div className="w-100 text-end">
              <Button
                variant="primary"
                className="text-light"
                size="sm"
                onClick={() => {
                  setShowConfirmModal({
                    msg: "You are trying to delete the user. This action is irreversible. Please confirm.",
                    itemID: "",
                  });
                }}
                disabled={loadingDel}
              >
                {loadingDel ? (
                  <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                ) : (
                  "Delete User"
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
        action={deleteUser}
      />
    </div>
  );
}

export default Item;
