import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, Spinner } from "react-bootstrap";
import { FaRegUser, FaUserSecret } from "react-icons/fa";
import { IoIosArrowForward } from "react-icons/io";
import { useAuth } from "../../context/AuthProvider";
import { deleteDocInCollection, queryByFirestore } from "../../firebase/Firestore";
import { useDeviceStore } from "../../stores/deviceStore";
import ConfirmActionModal from "../Modals/ConfirmActionModal";
import OrderItem from "./OrderItem";
import { useRouter } from "next/router";

function User(props) {
  const router = useRouter();
  const locale = router.locale;
  const user = props.user;
  const { setErrorMsg } = useAuth();
  const isMobile = useDeviceStore((state) => state.isMobile);
  const [loadingDel, setLoadingDel] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [userOrders, setUserOrders] = useState([]);

  const t = {
    en: {
      sthWrong: "Something went wrong, please try again later.",
      loading: "Loading...",
      name: "User Name",
      email: "User Email",
      provider: "Provider",
      actions: "Actions",
      showLess: "Show Less",
      showMore: "Show More",
      delete: "Delete",
      tryDelete: "You are trying to delete this user. This action is irreversible. Please confirm.",
      role: "Role:",
      user: "User",
      admin: "Admin",
      orders: "User orders:",
      noOrders: "No orders yet.",
      emailAndPassword: "Email and password",
    },
    pl: {
      sthWrong: "Coś poszło nie tak, spróbuj ponownie później.",
      loading: "Ładuję..",
      name: "Nazwa użytkownika",
      email: "Adres E-mail",
      provider: "Poprzez",
      actions: "Opcje",
      showLess: "Zwiń",
      showMore: "Rozwiń",
      delete: "Usuń",
      tryDelete: "Próbujesz usunąć tego użytkownika. Ta czynność jest nieodwracalna. Proszę potwierdzić.",
      role: "Typ:",
      user: "Użytkownik",
      admin: "Administrator",
      orders: "Zamówienia:",
      noOrders: "Brak zamówień.",
      emailAndPassword: "E-mail i hasło",
    },
  };

  const showDetailsFunc = () => {
    setShowDetails(!showDetails);
  };

  useEffect(() => {
    getUserOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const getUserOrders = async () => {
    try {
      const orders = await queryByFirestore("orders", "userID", "==", user.id);
      setUserOrders(orders ? orders : []);
    } catch (error) {
      console.log(error);
      setErrorMsg(t[locale].sthWrong);
    }
  };

  async function deleteUser() {
    const payload = {
      secret: process.env.NEXT_PUBLIC_API_KEY,
      data: { uid: user.id },
      mode: "delete-user",
    };
    try {
      const res = await axios.post("/api/admin/firebase", payload);
      if (res.status === 200) {
        await deleteDocInCollection("users", user.id);
        setShowConfirmModal({ msg: "", itemID: "" });
      } else {
        setShowConfirmModal({ msg: "", itemID: "" });
        setErrorMsg(t[locale].sthWrong);
      }
      props.refresh(); //refresh the user list
    } catch (error) {
      console.log(error);
      setShowConfirmModal({ msg: "", itemID: "" });
      setErrorMsg(t[locale].sthWrong);
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
                  <strong>{t[locale].name}</strong>
                </div>
                <div className="col-5">
                  <strong>{t[locale].email}</strong>
                </div>
                <div className="col-2">
                  <strong>{t[locale].provider}</strong>
                </div>
                <div className="col-2">
                  <strong>{t[locale].actions}</strong>
                </div>
              </div>
            </>
          )}
          <hr />
        </>
      )}

      <div className="d-flex align-items-center text-start w-100 flex-wrap">
        <div className="col-10 col-md-3 d-flex">
          <div className="d-flex align-items-center me-2">
            {user.role == "user" ? (
              <FaRegUser style={{ width: "25px", height: "25px" }} />
            ) : (
              <FaUserSecret style={{ width: "25px", height: "25px" }} />
            )}
          </div>
          <div className="d-flex flex-column pointer" onClick={() => setShowDetails(!showDetails)}>
            {isMobile ? (
              <>
                <p className="mb-0">{user.name}</p>
                <i>
                  <small>{user.email}</small>
                </i>
              </>
            ) : (
              <>
                <p className="mb-0">{user.name}</p>
                {/* <small className="text-muted">Role: {user.role == "user" ? "User" : "Admin"}</small> */}
              </>
            )}
          </div>
        </div>

        {!isMobile && (
          <>
            <div className="col-5 text-uppercase pointer" onClick={() => setShowDetails(!showDetails)}>
              <small>{user.email}</small>
            </div>
            <div className="col-2 pointer" onClick={() => setShowDetails(!showDetails)} >
              {user.signProvider === "emailAndPassword" ? t[locale].emailAndPassword : user.signProvider}
            </div>
            <div className="col-2">
              <div className="d-flex gap-2 align-items-center justify-content-start">
                <Button variant="outline-primary" size="sm" onClick={showDetailsFunc}>
                  {showDetails ? t[locale].showLess : t[locale].showMore}
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

            {/* Actions bar on Desktops */}
            {showDetails && (
              <div className="mt-3 w-100">
                <div>
                  <p>
                    <small className="text-uppercase">
                      <strong>{t[locale].role}</strong> {user.role == "user" ? t[locale].user : t[locale].admin}
                    </small>
                    <br />

                    <small className="text-uppercase">
                      <strong>ID:</strong> {user.id}
                    </small>
                  </p>
                </div>
                <div className="w-100 opacity-50">
                  <hr />
                </div>
                <div>
                  <p className="text-uppercase">
                    <small>
                      <strong>{t[locale].orders}</strong>
                    </small>
                  </p>
                  <div className="d-flex flex-row flex-wrap">
                    {userOrders.map((order, idx) => (
                      <div key={idx} className="d-block col-lg-4 col-md-6 p-1">
                        <OrderItem order={order} />
                      </div>
                    ))}
                  </div>
                  {userOrders.length == 0 && <p>{t[locale].noOrders}</p>}
                </div>
              </div>
            )}
          </>
        )}
        {isMobile && (
          <>
            <div className="col-2 text-center pointer" onClick={showDetailsFunc}>
              <IoIosArrowForward
                style={{ height: "25px", width: "25px", transform: `rotate(${showDetails ? "90" : "0"}deg)` }}
              />
            </div>

            {/* Actions bar on Mobile */}
            {showDetails && (
              <div className="mt-3 w-100">
                <div>
                  <p>
                    <small className="text-uppercase">
                      <strong>{t[locale].role}</strong> {user.role == "user" ? "User" : "Admin"}
                    </small>
                    <br />
                    <small className="text-uppercase">
                      <strong>{t[locale].provider}</strong> {user.signProvider}
                    </small>
                    <br />
                    <small className="text-uppercase">
                      <strong>ID:</strong> {user.id}
                    </small>
                  </p>
                </div>
                <div className="w-100 opacity-50">
                  <hr />
                </div>
                <div>
                  <p className="text-uppercase">
                    <small>
                      <strong>{t[locale].orders}</strong>
                    </small>
                  </p>
                  {userOrders.map((order, idx) => (
                    <OrderItem key={idx} order={order} />
                  ))}

                  {userOrders.length == 0 && <p>{t[locale].noOrders}</p>}
                </div>
                <div className="w-100 text-end">
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
          </>
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

export default User;
