import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useAuth } from "../../../context/AuthProvider";
import { Badge, Button, Spinner } from "react-bootstrap";
import { useRouter } from "next/router";
import { IoIosArrowForward } from "react-icons/io";
import { deleteDocInCollection, updateDocFields } from "../../../firebase/Firestore";
import { useDeviceStore } from "../../../stores/deviceStore";
import ConfirmActionModal from "../../Modals/ConfirmActionModal";
import { deleteFilesInDirStorage } from "../../../firebase/Storage";
import axios from "axios";
import placeholder from "../../../utils/placeholder";

function Product(props) {
  const router = useRouter();
  const locale = router.locale;
  const product = props.product;
  const isMobile = useDeviceStore((state) => state.isMobile);
  const theme = useDeviceStore((state) => state.themeState);
  const { setErrorMsg } = useAuth();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [loadingEdit, setLoadingEdit] = useState(false);
  const [loadingDel, setLoadingDel] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const timeStampToDate = (time) => {
    return new Date(time.seconds * 1000 + time.nanoseconds / 100000);
  };

  const t = {
    en: {
      sthWrong: "Something went wrong, please try again later.",
      product: "Product Name",
      status: "Status",
      price: "Price",
      action: "Action",
      active: "Active",
      disabled: "Disabled",
      edit: "Edit",
      disable: "Disable",
      activate: "Activate",
      delete: "Delete",
      tryDelete: "You are trying to delete your Product. This action is irreversible. Please confirm.",
      cards: "Cards",
      category: "Category",
      desc: "Description",
      date: "Date",

      deleteError: "Order deleted but an error occurred during sending an email to the client.",
      emailError: "An error occurred during sending an email to the client.",
      deleteOrder: "Delete the order.",
      safeDelete: "You can safely delete an Order",
      unpaid: "Unpaid",
      inRealization: "In Realization",
      done: "Done",
      extraTime: "Extra Time: ",
      timesUp: "Time's Up:",
      deadline: "Deadline: ",
      hurryUp: "Hurry Up! ",
      finishIn: "Finish in: ",
      sendNotificationButton: "Send notification",
      sendNotification: "Send email notification to the client.",
      sending: "Sending",
      sended: "Sended",
      notificationSended: "Notification sended",
      more: "more..",
      cancel: "Cancel",
      hide: "Hide details",
      show: "Show details",
      loading: "Loading...",
    },
    pl: {
      sthWrong: "Coś poszło nie tak, spróbuj ponownie później.",
      product: "Nazwa produktu",
      status: "Status",
      price: "Cena",
      action: "Opcje",
      active: "Aktywny",
      disabled: "Nieaktywny",
      edit: "Edytuj",
      disable: "Dezaktywuj",
      activate: "Aktywuj",
      delete: "Usuń",
      tryDelete: "Próbujesz usunąć swój Produkt. Ta czynność jest nieodwracalna. Proszę potwierdzić.",
      cards: "Karty",
      category: "Kategoria",
      desc: "Opis",
      date: "Data",

      deleteError: "Zamówienie zostało usunięte, ale wystąpił błąd podczas wysyłania wiadomości e-mail do klienta.",
      emailError: "Wystąpił błąd podczas wysyłania wiadomości e-mail do klienta.",
      deleteOrder: "Usuń zamówienie.",
      safeDelete: "Możesz bezpiecznie usunąć zamówienie",
      unpaid: "Nieopłacone",
      inRealization: "W realizacji",
      done: "Gotowe",
      extraTime: "Dodatkowy czas: ",
      timesUp: "Po czasie:",
      deadline: "Pozostało: ",
      hurryUp: "Szybko! ",
      finishIn: "Zakończ w: ",
      sendNotificationButton: "Wyślij powiadomienie",
      sendNotification: "Wyślij powiadomienie do klienta.",
      sending: "Wysyłanie",
      sended: "Wysłano",
      notificationSended: "Powiadomienie wysłane",
      more: "wiecej..",
      cancel: "Anuluj",
      hide: "Ukryj szczegóły",
      show: "Pokaż szczegóły",
      loading: "Ładuję...",
    },
  };

  async function deleteProduct() {
    setLoadingDel(true);
    try {
      const revalidateData = {
        secret: process.env.NEXT_PUBLIC_API_KEY,
        paths: ["/admin/products", "/"],
      };

      await deleteDocInCollection("products", product.id);
      await deleteStripeProduct("usd");
      await deleteStripeProduct("pln");
      await deleteFilesInDirStorage(`images/products/${product.id}`);
      await axios.post("/api/revalidate", revalidateData);
      props.refresh(); //refresh the product list
      setShowConfirmModal({ msg: "", itemID: "" });
    } catch (error) {
      setShowConfirmModal({ msg: "", itemID: "" });
      setErrorMsg(t[locale].sthWrong);
      console.log(error);
    }
    setLoadingDel(false);
  }

  const changeStatus = async () => {
    setLoadingStatus(true);
    try {
      const revalidateData = {
        secret: process.env.NEXT_PUBLIC_API_KEY,
        paths: ["/"],
        // paths: ["/","/admin/products"],
      };
      await updateDocFields("products", product.id, { active: !product.active });
      await axios.post("/api/revalidate", revalidateData);
      props.refresh(); //refresh the product list
    } catch (error) {
      console.log(error);
      setErrorMsg(t[locale].sthWrong);
    }
    setLoadingStatus(false);
  };

  const showDetailsFunc = () => {
    setShowDetails(!showDetails);
  };

  const deleteStripeProduct = async (ccy) => {
    const payload = {
      secret: process.env.NEXT_PUBLIC_API_KEY,
      mode: "delete",
      data: {
        prod_id: product.price[ccy].prod_id,
        s_id: product.price[ccy].s_id,
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
                  <strong>{t[locale].product}</strong>
                </div>
                <div className="col-2">
                  <strong>{t[locale].status}</strong>
                </div>
                <div className="col-2 col-lg-3">
                  <strong>{t[locale].price}</strong>
                </div>
                <div className="col-4 col-lg-3">
                  <strong>{t[locale].action}</strong>
                </div>
              </div>
            </>
          )}
          <hr />
        </>
      )}

      <div className="d-flex align-items-center text-start w-100 flex-wrap rounded p-1">
        <div className="col-10 col-md-4 d-flex pointer" onClick={showDetailsFunc}>
          <div className="d-flex align-items-center me-2" style={{ position: "relative", width: "46px" }}>
            <Image
              src={product.image.path}
              alt={`${product.title[locale]} - Bright Light Gypsy Tarot`}
              fill
              placeholder="blur"
              blurDataURL={placeholder("dark")}
              className={`rounded ${!product.active && "opacity-50"}`}
              style={{ objectFit: "cover" }}
              sizes="33vw"
            />
          </div>
          <div>
            {isMobile ? (
              <>
                <p className={`mb-0 ${!product.active && "text-muted"}`}>{product.title[locale]}</p>
                <i>
                  <small className={!product.active ? "text-muted" : ""}>
                    <span className="me-1">{product.price.usd.amount}</span>
                    <span className="text-uppercase">{product.price.usd.currency}</span>
                    <span className="ms-1 me-1">/ {product.price.pln.amount}</span>
                    <span className="text-uppercase">{product.price.pln.currency}</span>
                  </small>
                </i>
              </>
            ) : (
              <>
                <p className={`mb-0 ${!product.active && "text-muted"}`}>{product.title[locale]}</p>
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
                {product.active ? t[locale].active : t[locale].disabled}
              </Badge>
            </div>
            <div className={`col-2 col-lg-3 pointer ${!product.active && "text-muted"}`} onClick={showDetailsFunc}>
              <span className="me-1">{product.price.usd.amount}</span>
              <span className="text-uppercase">{product.price.usd.currency}</span>
              <span className="ms-1 me-1">/ {product.price.pln.amount}</span>
              <span className="text-uppercase">{product.price.pln.currency}</span>
            </div>
            <div className="col-4 col-lg-3">
              <div className="d-flex flex-wrap mt-2 gap-2">
                {/* Edit Button */}
                <Button
                  variant="warning"
                  size="sm"
                  className="border-dark"
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
                    t[locale].edit
                  )}
                </Button>
                {/* Activate / Disable product Button */}
                <Button
                  variant={product.active ? "outline-success" : "outline-accent4"}
                  size="sm"
                  onClick={changeStatus}
                  disabled={loadingStatus}
                >
                  {loadingStatus ? (
                    <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                  ) : (
                    <>{product.active ? t[locale].disable : t[locale].activate}</>
                  )}
                </Button>
                {/* Delete product Button */}
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
        {/* Details on Mobile */}
        {showDetails && isMobile && (
          <div className="w-100">
            <div className="d-flex gap-3 mt-3 justify-content-between">
              <Button
                variant="warning"
                className="col-3"
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
                  t[locale].edit
                )}
              </Button>
              {/* Activate / Disable product Button */}
              <Button
                variant={product.active ? "outline-success" : "outline-accent4"}
                className="col-3"
                size="sm"
                onClick={changeStatus}
                disabled={loadingStatus}
              >
                {loadingStatus ? (
                  <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                ) : (
                  <>{product.active ? t[locale].disable : t[locale].activate}</>
                )}
              </Button>
              <Button
                variant="primary"
                className="text-light col-3"
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

            <div className="mt-3">
              <div className="d-flex gap-2">
                <p className="mb-0">
                  <small>
                    <strong>{t[locale].status}: </strong> {product.active ? t[locale].active : t[locale].disabled}
                  </small>
                </p>
                <p>
                  <small>
                    <strong>{t[locale].cards}: </strong> {product.cardSet}
                  </small>
                </p>
                <p>
                  <small>
                    <strong>{t[locale].category}: </strong> {product.category}
                  </small>
                </p>
                <p>
                  <small>
                    <strong>{t[locale].date}: </strong> {timeStampToDate(product.createDate).toLocaleDateString()}
                  </small>
                </p>
              </div>
              <p className="mb-0">
                <strong>{t[locale].desc}:</strong>
              </p>
              <p>
                <small>{product.desc[locale]}</small>
              </p>
            </div>
          </div>
        )}
        {/* Details on Desktops */}
        {showDetails && !isMobile && (
          <div className="mt-2">
            <div className="d-flex gap-3">
              <p>
                <strong>{t[locale].cards}: </strong> {product.cardSet}
              </p>
              <p>
                <strong>{t[locale].category}: </strong> {product.category}
              </p>
            </div>
            <p className="mb-0">
              <strong>{t[locale].desc}:</strong>
            </p>
            <p>
              <small>{product.desc[locale]}</small>
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
