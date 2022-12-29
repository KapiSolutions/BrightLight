import React, { useEffect, useState, useReducer } from "react";
import Head from "next/head";
import { Container, Form, InputGroup } from "react-bootstrap";
import { useRouter } from "next/router";
import { useDeviceStore } from "../../../stores/deviceStore";
import { useAuth } from "../../../context/AuthProvider";
import UserOrderItem from "../../../components/UserOrderItem";
import { FiSearch } from "react-icons/fi";
import { BsFilterRight } from "react-icons/bs";
import styles from "../../../styles/pages/Orders.module.scss";

function UserOrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState(false);
  const [message, setMessage] = useState("");
  const isMobile = useDeviceStore((state) => state.isMobile);
  const { isAuthenticated, authUserFirestore, userOrders, updateUserData } = useAuth();
  const initShowOptions = { show: false, sortBar: "1", showBar: "1" };
  const [showOptions, updateShowOptions] = useReducer((state, updates) => ({ ...state, ...updates }), initShowOptions);

  const sleep = (milliseconds) => {
    return new Promise((resolve) => setTimeout(resolve, milliseconds));
  };
  async function scroll() {
    await sleep(300);
    document.getElementById("uo-ctx").scrollIntoView();
  }

  useEffect(() => {
    if (isAuthenticated()) {
      isMobile && scroll();

      authUserFirestore && updateUserData(authUserFirestore?.id, null, true); //update only orders
      setOrders([...userOrders].sort((a, b) => b.timeCreate.toDate() - a.timeCreate.toDate())); //sort and copy to new variable to prevent affecting on source data during operations
    } else {
      router.replace("/sign-in");
      return;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //Searching for specific order
  const findOrder = (e) => {
    e.preventDefault();
    setMessage("");
    let orderFounded = false;
    const value = document.getElementById(`findOrder${isMobile ? "Mobile" : ""}`).value;

    if (value !== "") {
      userOrders.forEach((item) => {
        if (item.id == value) {
          setOrders([item]);
          orderFounded = true;
          return;
        }
      });
      if (!orderFounded) {
        setOrders([]);
        setMessage("Order does not exist.");
      }
    } else {
      setOrders([...userOrders]);
    }
    if (!isMobile) {
      document.getElementById("filterByDate").value = "1";
      document.getElementById("filterByType").value = "All orders";
    }
  };

  //Sort orders
  const sortBy = (e, sortMethod, filteredArray) => {
    if (isMobile && e) {
      updateShowOptions({ sortBar: sortMethod });
      const children = document.getElementById("sortForm").childNodes;
      children.forEach((child) => {
        child.style = "border: 1px solid rgba(133, 133, 133, 0.389)";
      });
      e.target.style = "border: 1px solid rgba(133, 133, 133)";
    }
    const value = e?.target.value ? e.target.value : sortMethod;
    const array = filteredArray ? filteredArray : [...orders];
    switch (value) {
      case "1":
        setOrders(array.sort((a, b) => b.timeCreate.toDate() - a.timeCreate.toDate()));
        break;
      case "2":
        setOrders(array.sort((a, b) => a.timeCreate.toDate() - b.timeCreate.toDate()));
        break;
      case "3":
        setOrders(array.sort((a, b) => b.totalPrice - a.totalPrice));
        break;
      case "4":
        setOrders(array.sort((a, b) => a.totalPrice - b.totalPrice));
        break;
      default:
        break;
    }
  };

  //Filter orders by type
  const filterByType = (e, filterBy, filteredArray) => {
    let value;
    let array;
    if (isMobile) {
      switch (filterBy) {
        case "All orders":
          updateShowOptions({ showBar: "1" });
          break;
        case "Waiting for payment":
          updateShowOptions({ showBar: "2" });
          break;
        case "In realization":
          updateShowOptions({ showBar: "3" });
          break;
        case "Done":
          updateShowOptions({ showBar: "4" });
          break;

        default:
          break;
      }
      const children = document.getElementById("showForm").childNodes;
      children.forEach((child) => {
        child.style = "border: 1px solid rgba(133, 133, 133, 0.389)";
      });
      e.target.style = "border: 1px solid rgba(133, 133, 133)";
      value = filterBy;
      array = [...userOrders];
    } else {
      value = e?.target.value ? e.target.value : filterBy;
      array = filteredArray
        ? filteredArray
        : filterByDate(null, document.getElementById("filterByDate").value, [...userOrders]);
    }

    let filteredOrders = [];

    if (value == "All orders") {
      filteredOrders = array;
      setOrders(array);
    } else {
      array.forEach((item) => {
        if (item.status == value) {
          filteredOrders.push(item);
        }
      });
      setOrders(filteredOrders);
    }
    //sort filtered array according to actual settings
    if (!isMobile && !filteredArray) {
      sortBy(null, document.getElementById("sortBy").value, filteredOrders);
    }
    if(isMobile && !filteredArray){
      sortBy(null, showOptions.sortBar, filteredOrders);
    }
    return filteredOrders;
  };

  //Filter orders by Date
  const filterByDate = (e, filterBy, filteredArray) => {
    const value = e?.target.value ? e.target.value : filterBy;
    const array = filteredArray
      ? filteredArray
      : filterByType(null, document.getElementById("filterByType").value, [...userOrders]);
    let filteredOrders = [];
    var oneMonthAgo = new Date(new Date().getFullYear(), new Date().getMonth() - 1, new Date().getDate());
    var twoMonthsAgo = new Date(new Date().getFullYear(), new Date().getMonth() - 2, new Date().getDate());
    var fourMonthsAgo = new Date(new Date().getFullYear(), new Date().getMonth() - 4, new Date().getDate());
    var oneYearAgo = new Date(new Date().getFullYear() - 1, new Date().getMonth(), new Date().getDate());

    switch (value) {
      case "1":
        filteredOrders = array;
        setOrders(array);
        break;
      case "2":
        array.forEach((item) => {
          if (item.timeCreate.toDate() > oneMonthAgo) {
            filteredOrders.push(item);
          }
        });
        setOrders(filteredOrders);
        break;
      case "3":
        array.forEach((item) => {
          if (item.timeCreate.toDate() > twoMonthsAgo) {
            filteredOrders.push(item);
          }
        });
        setOrders(filteredOrders);
        break;
      case "4":
        array.forEach((item) => {
          if (item.timeCreate.toDate() > fourMonthsAgo) {
            filteredOrders.push(item);
          }
        });
        setOrders(filteredOrders);
        break;
      case "5":
        array.forEach((item) => {
          if (item.timeCreate.toDate() > oneYearAgo) {
            filteredOrders.push(item);
          }
        });
        setOrders(filteredOrders);
        break;
      default:
        break;
    }
    //sort filtered array according to actual settings
    !filteredArray && sortBy(null, document.getElementById("sortBy").value, filteredOrders);
    return filteredOrders;
  };

  useEffect(() => {
    if (showOptions.show) {
      const childrenSort = [...document.getElementById("sortForm").childNodes];
      const childrenShow = [...document.getElementById("showForm").childNodes];

      childrenSort.map((child, idx) => {
        if (idx + 1 == showOptions.sortBar) {
          child.style = "border: 1px solid rgba(133, 133, 133)";
        } else {
          child.style = "border: 1px solid rgba(133, 133, 133, 0.389)";
        }
      });
      childrenShow.map((child, idx) => {
        if (idx + 1 == showOptions.showBar) {
          child.style = "border: 1px solid rgba(133, 133, 133)";
        } else {
          child.style = "border: 1px solid rgba(133, 133, 133, 0.389)";
        }
      });

      // childrenSort.forEach((child) => {
      //     child.style = "border: 1px solid rgba(133, 133, 133, 0.389)";
      //   });
      //   e.target.style = "border: 1px solid rgba(133, 133, 133)";
    }
  }, [showOptions]);

  return (
    <>
      <Head>
        <title>BrightLight | My orders</title>
      </Head>
      <Container className="justify-content-center text-center mt-5" id="uo-ctx">
        <h1 className="color-primary">My orders</h1>
        {userOrders?.length == 0 ? (
          <p className="color-primary">No orders yet.</p>
        ) : (
          <>
            <section className={`text-center color-primary ${isMobile ? "" : "mt-2"}`}>
              {!isMobile && (
                <div className="text-start mb-4">
                  <FiSearch
                    style={{ position: "relative", top: "59px", left: "11px", width: "20px", height: "20px" }}
                  />

                  <Form className="text-start d-flex gap-4" onSubmit={findOrder}>
                    <Form.Group className="col-3">
                      <Form.Label className="mb-0">
                        <small>
                          <strong>Find order</strong>
                        </small>
                      </Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Find order by id"
                        id="findOrder"
                        style={{ paddingLeft: "40px" }}
                      />
                    </Form.Group>

                    <Form.Group className="col-2" onChange={filterByDate}>
                      <Form.Label className="mb-0">
                        <small>
                          <strong>Filter by date</strong>
                        </small>
                      </Form.Label>
                      <Form.Select type="text" id="filterByDate">
                        <option value="1">All dates</option>
                        <option value="2">Last 30 days</option>
                        <option value="3">Last 60 days</option>
                        <option value="4">Last 120 days</option>
                        <option value="5">Last Year</option>
                      </Form.Select>
                    </Form.Group>
                    <Form.Group controlId="filterByType" className="col-2" onChange={filterByType}>
                      <Form.Label className="mb-0">
                        <small>
                          <strong>Filter by type</strong>
                        </small>
                      </Form.Label>
                      <Form.Select type="text" id="filterByType">
                        <option value="All orders">All orders</option>
                        <option value="Waiting for payment">Waiting for payment</option>
                        <option value="In realization">In realization</option>
                        <option value="Done">Done</option>
                      </Form.Select>
                    </Form.Group>
                    <Form.Group className="col-2" onChange={sortBy}>
                      <Form.Label className="mb-0">
                        <small>
                          <strong>Sort orders</strong>
                        </small>
                      </Form.Label>
                      <Form.Select type="text" id="sortBy">
                        <option value="1">Order date &#8600;</option>
                        <option value="2">Order date &#8599;</option>
                        <option value="3">Total price &#8600;</option>
                        <option value="4">Total price &#8599;</option>
                      </Form.Select>
                    </Form.Group>
                  </Form>
                </div>
              )}

              {isMobile && (
                <div className="text-start">
                  <FiSearch
                    onClick={findOrder}
                    className="pointer"
                    style={{ position: "relative", top: "32px", left: "11px", width: "20px", height: "20px" }}
                  />
                  <Form className="text-start d-flex" onSubmit={findOrder}>
                    <Form.Control
                      type="text"
                      placeholder="Find order by id"
                      id="findOrderMobile"
                      style={{ paddingLeft: "40px" }}
                      className="w-100"
                      title="Filter"
                    />
                    <InputGroup.Text
                      className="pointer border"
                      onClick={() => {
                        updateShowOptions({ show: !showOptions.show });
                      }}
                    >
                      <BsFilterRight style={{ width: "20px", height: "20px" }} />
                    </InputGroup.Text>
                  </Form>
                  {showOptions.show && (
                    <section className="d-block mt-3 color-primary" style={{ maxWidth: "100%" }}>
                      <div className="d-flex align-items-center mb-2 text-nowrap">
                        <div>Sort by:</div>
                        <div
                          id="sortForm"
                          className={`d-flex overflow-auto ms-2 ${styles.optionsBar}`}
                          style={{ maxWidth: "75vw" }}
                        >
                          <div
                            className={`rounded m-1 p-2 pointer`}
                            onClick={(e) => {
                              sortBy(e, "1");
                            }}
                          >
                            Date &#8600;
                          </div>
                          <div
                            className={`rounded m-1 p-2 pointer ${styles.sortItem}`}
                            onClick={(e) => {
                              sortBy(e, "2");
                            }}
                          >
                            Date &#8599;
                          </div>
                          <div
                            className={`rounded m-1 p-2 pointer ${styles.sortItem}`}
                            onClick={(e) => {
                              sortBy(e, "3");
                            }}
                          >
                            Price &#8600;
                          </div>
                          <div
                            className={`rounded m-1 p-2 pointer ${styles.sortItem}`}
                            onClick={(e) => {
                              sortBy(e, "4");
                            }}
                          >
                            Price &#8599;
                          </div>
                        </div>
                      </div>

                      <div className="d-flex align-items-center mb-2 text-nowrap">
                        <div>Show:</div>
                        <div
                          id="showForm"
                          className={`d-flex overflow-auto ms-2 ${styles.optionsBar}`}
                          style={{ maxWidth: "79vw" }}
                        >
                          <div
                            className={`rounded m-1 p-2 pointer ${styles.optionsBar}`}
                            onClick={(e) => {
                              filterByType(e, "All orders");
                            }}
                          >
                            All
                          </div>
                          <div
                            className={`rounded m-1 p-2 pointer ${styles.sortItem}`}
                            onClick={(e) => {
                              filterByType(e, "Waiting for payment");
                            }}
                          >
                            Unpaid
                          </div>
                          <div
                            className={`rounded m-1 p-2 pointer ${styles.sortItem}`}
                            onClick={(e) => {
                              filterByType(e, "In realization");
                            }}
                          >
                            In realization
                          </div>
                          <div
                            className={`rounded m-1 p-2 pointer ${styles.sortItem}`}
                            onClick={(e) => {
                              filterByType(e, "Done");
                            }}
                          >
                            Done
                          </div>
                        </div>
                      </div>
                    </section>
                  )}
                </div>
              )}

              {message && <p className="color-primary mt-5">{message}</p>}

              {Array.from({ length: orders?.length }).map((_, idx) => (
                <UserOrderItem key={idx} idx={idx} orders={orders} />
              ))}
            </section>
          </>
        )}
      </Container>
    </>
  );
}

export default UserOrdersPage;
