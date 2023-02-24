import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useAuth } from "../../../context/AuthProvider";
import { Badge, Button, Card, Spinner } from "react-bootstrap";
import { useRouter } from "next/router";
import { IoIosArrowForward } from "react-icons/io";
import { deleteDocInCollection, updateDocFields } from "../../../firebase/Firestore";
import { useDeviceStore } from "../../../stores/deviceStore";
import ConfirmActionModal from "../../Modals/ConfirmActionModal";
import { deleteFileInStorage, deleteFilesInDirStorage, getFileUrlStorage } from "../../../firebase/Storage";
import axios from "axios";

function Product(props) {
  const router = useRouter();
  const product = props.product;
  const isMobile = useDeviceStore((state) => state.isMobile);
  const theme = useDeviceStore((state) => state.themeState);
  const lang = useDeviceStore((state) => state.lang);
  const { setErrorMsg } = useAuth();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [loadingEdit, setLoadingEdit] = useState(false);
  const [loadingDel, setLoadingDel] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const timeStampToDate = (time) => {
    return new Date(time.seconds * 1000 + time.nanoseconds / 100000);
  };

  useEffect(() => {
    getFileUrlStorage(`images/products/${product.id}`, product.image)
      .then((url) => {
        const img = document.getElementById(`${product.title[lang]}-AdminPic`);
        img.setAttribute("src", url);
      })
      .catch((error) => console.log(error));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.reload]);

  async function deleteProduct() {
    setLoadingDel(true);
    try {
      const revalidateData = {
        secret: process.env.NEXT_PUBLIC_API_KEY,
        paths: ["/admin/products", "/"],
      };

      await deleteDocInCollection("products", product.id);
      await deleteStripeProduct("en");
      await deleteStripeProduct("pl");
      await deleteFilesInDirStorage(`images/products/${product.id}`);
      await axios.post("/api/revalidate", revalidateData);
      props.refresh(); //refresh the product list
      setShowConfirmModal({ msg: "", itemID: "" });
    } catch (error) {
      setShowConfirmModal({ msg: "", itemID: "" });
      setErrorMsg("Something went wrong, please try again later.");
      console.log(error);
    }
    setLoadingDel(false);
  }

  const changeStatus = async () => {
    setLoadingStatus(true);
    try {
      const revalidateData = {
        secret: process.env.NEXT_PUBLIC_API_KEY,
        paths: ["/admin/products", "/"],
      };
      await updateDocFields("products", product.id, { active: !product.active });
      await axios.post("/api/revalidate", revalidateData);
      props.refresh(); //refresh the product list
    } catch (error) {
      console.log(error);
      setErrorMsg("Something went wrong, please try again later.");
    }
    setLoadingStatus(false);
  };

  const showDetailsFunc = () => {
    setShowDetails(!showDetails);
  };

  const deleteStripeProduct = async (lang) => {
    const payload = {
      secret: process.env.NEXT_PUBLIC_API_KEY,
      mode: "delete",
      data: {
        prod_id: product.price[lang].prod_id,
        s_id: product.price[lang].s_id,
      },
    };
    try {
      return await axios.post("/api/stripe/products", payload);
    } catch (error) {
      console.log(error);
      throw error;
    }
  };
  return (
    <div className="color-primary">
      {props.idx === 0 && (
        <>
          {!isMobile && (
            <>
              <div className="d-flex text-start w-100">
                <div className="col-4">
                  <strong>Product Name</strong>
                </div>
                <div className="col-2">
                  <strong>Status</strong>
                </div>
                <div className="col-2 col-lg-3">
                  <strong>Price</strong>
                </div>
                <div className="col-4 col-lg-3">
                  <strong>Actions</strong>
                </div>
              </div>
            </>
          )}
          <hr />
        </>
      )}

      <div className="d-flex align-items-center text-start w-100 flex-wrap rounded p-1">
        <div className="col-10 col-md-4 d-flex pointer" onClick={showDetailsFunc}>
          <div className="d-flex align-items-center me-2">
            <Card.Img
              src="/img/placeholders/cartImage.webp"
              id={`${product.title[lang]}-AdminPic`}
              height="58"
              alt={product.title[lang]}
            />
          </div>
          <div>
            {isMobile ? (
              <>
                <p className={`mb-0 ${!product.active && "text-muted"}`}>{product.title[lang]}</p>
                <i>
                  <small className={!product.active ? "text-muted" : ""}>
                    {timeStampToDate(product.createDate).toLocaleDateString()}
                    {!product.active && " - disabled"}
                  </small>
                </i>
              </>
            ) : (
              <>
                <p className={`mb-0 ${!product.active && "text-muted"}`}>{product.title[lang]}</p>
                <small className="text-muted">{timeStampToDate(product.createDate).toLocaleDateString()}</small>
              </>
            )}
          </div>
        </div>

        {!isMobile && (
          <>
            <div className="col-2 text-uppercase pointer" onClick={showDetailsFunc}>
              <Badge
                bg={!product.active ? "accent4" : "success"}
                className={!product.active ? (theme == "dark" ? "text-dark" : "text-light") : ""}
              >
                {product.active ? "Active" : "Disabled"}
              </Badge>
            </div>
            <div className={`col-2 col-lg-3 pointer ${!product.active && "text-muted"}`} onClick={showDetailsFunc}>
              <span className="me-1">{product.price[lang].amount}</span>
              <span className="text-uppercase">{product.price[lang].currency}</span>
              <span className="ms-1 me-1">/ {product.price[lang === "en" ? "pl" : "en"].amount}</span>
              <span className="text-uppercase">{product.price[lang === "en" ? "pl" : "en"].currency}</span>
            </div>
            <div className="col-4 col-lg-3">
              <div className="d-flex flex-wrap mt-2 gap-3">
                {/* Edit Button */}
                <Button
                  variant="outline-primary"
                  size="sm"
                  onClick={() => {
                    router.push({
                      pathname: "/admin/products/[pid]",
                      query: { pid: product.id },
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
                {/* Activate / Disable product Button */}
                <Button
                  variant={product.active ? "outline-accent4" : "outline-success"}
                  size="sm"
                  onClick={changeStatus}
                  disabled={loadingStatus}
                >
                  {loadingStatus ? (
                    <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                  ) : (
                    <>{product.active ? "Disable" : "Activate"}</>
                  )}
                </Button>
                {/* Delete product Button */}
                <Button
                  variant="primary"
                  className="text-light"
                  size="sm"
                  onClick={() => {
                    setShowConfirmModal({
                      msg: "You are trying to delete your Product. This action is irreversible. Please confirm.",
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
        {/* Details on Mobile */}
        {showDetails && isMobile && (
          <div className="w-100">
            <div className="d-flex gap-3 mt-3 justify-content-between">
              <Button
                variant="outline-primary"
                className="col-3"
                size="sm"
                onClick={() => {
                  router.push({
                    pathname: "/admin/blogs/[pid]",
                    query: { pid: product.id },
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
              {/* Activate / Disable product Button */}
              <Button
                variant={product.active ? "outline-accent4" : "outline-success"}
                className="col-3"
                size="sm"
                onClick={changeStatus}
                disabled={loadingStatus}
              >
                {loadingStatus ? (
                  <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                ) : (
                  <>{product.active ? "Disable" : "Activate"}</>
                )}
              </Button>
              <Button
                variant="primary"
                className="text-light col-3"
                size="sm"
                onClick={() => {
                  setShowConfirmModal({
                    msg: "You are trying to delete your Product. This action is irreversible. Please confirm.",
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

            <div className="mt-3">
              <p className="mb-0">
                <strong>Price:</strong>
                <span className="ms-1 me-1">{product.price[lang].amount}</span>
                <span className="text-uppercase">{product.price[lang].currency}</span>
                <span className="ms-1 me-1">/ {product.price[lang === "en" ? "pl" : "en"].amount}</span>
                <span className="text-uppercase">{product.price[lang === "en" ? "pl" : "en"].currency}</span>
              </p>
              <div className="d-flex gap-2">
                <p className="mb-0">
                  <small>
                    <strong>Status: </strong> {product.active ? "Active" : "Disabled"}
                  </small>
                </p>
                <p>
                  <small>
                    <strong>Cards: </strong> {product.cardSet}
                  </small>
                </p>
                <p>
                  <small>
                    <strong>Category: </strong> {product.category}
                  </small>
                </p>
              </div>
              <p className="mb-0">
                <strong>Description:</strong>
              </p>
              <p>
                <small>{product.desc[lang]}</small>
              </p>
            </div>
          </div>
        )}
        {/* Details on Desktops */}
        {showDetails && !isMobile && (
          <div className="mt-2">
            <div className="d-flex gap-3">
              <p>
                <strong>Cards: </strong> {product.cardSet}
              </p>
              <p>
                <strong>Category: </strong> {product.category}
              </p>
            </div>
            <p className="mb-0">
              <strong>Description:</strong>
            </p>
            <p>
              <small>{product.desc[lang]}</small>
            </p>
          </div>
        )}
      </div>
      <hr />

      {/* Modal which appears when user wants to cancel the order */}
      <ConfirmActionModal
        msg={showConfirmModal.msg}
        closeModal={() => setShowConfirmModal({ msg: "", itemID: "" })}
        action={deleteProduct}
      />
    </div>
  );
}

export default Product;
