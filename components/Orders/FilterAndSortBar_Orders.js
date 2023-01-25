import React, { useEffect, useState } from "react";
import { Form, InputGroup } from "react-bootstrap";
import { useDeviceStore } from "../../stores/deviceStore";
import { FiSearch } from "react-icons/fi";
import { BsFilterRight } from "react-icons/bs";

function FilterAndSortBar(props) {
  const isMobile = useDeviceStore((state) => state.isMobile);
  const [showOptions, setShowOptions] = useState(false);
  const [sortOption, setSortOption] = useState("1");
  const [filterOption, setFilterOption] = useState("1");

  const sortItem = {
    border: "1px solid rgba(133, 133, 133, 0.389)",
  };

  const timeStampToDate = (time) => {
    return new Date(time.seconds * 1000 + time.nanoseconds / 100000);
  };

  useEffect(() => {
    //Reset options to default
    if (!isMobile) {
      document.getElementById(`filterByDate${props.id}`).value = "1";
      document.getElementById(`filterByType${props.id}`).value = "All orders";
      document.getElementById(`sortBy${props.id}`).value = "1";
    }
    setSortOption("1");
    setFilterOption("1");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.resetSettings]);

  useEffect(() => {
    //sort array on initialization
    props.outputArray(props.refArray.sort((a, b) => timeStampToDate(b.timeCreate) - timeStampToDate(a.timeCreate)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    //add some styles on initialization
    if (showOptions) {
      const sortByChildrens = [...document.getElementById(`sortBy${props.id}Mobile`).childNodes];
      const filterByTypeChildrens = [...document.getElementById(`filterByType${props.id}Mobile`).childNodes];

      sortByChildrens.map((child, idx) => {
        if (idx + 1 == sortOption) {
          child.style = "border: 1px solid rgba(133, 133, 133)";
        } else {
          child.style = "border: 1px solid rgba(133, 133, 133, 0.389)";
        }
      });
      filterByTypeChildrens.map((child, idx) => {
        if (idx + 1 == filterOption) {
          child.style = "border: 1px solid rgba(133, 133, 133)";
        } else {
          child.style = "border: 1px solid rgba(133, 133, 133, 0.389)";
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showOptions]);

  //Find blog by tags or words in titles
  const findBy = async (e) => {
    e.preventDefault();
    props.msg("");
    let itemFounded = false;
    const input = document.getElementById(`find${props.id}${isMobile ? "Mobile" : ""}`).value;
    if (input !== "") {
      props.refArray.map((item) => {
        if (item.id == input) {
          itemFounded = true;
          props.outputArray([item]);
          return;
        }
      });
      if (!itemFounded) {
        props.outputArray([]);
        props.msg("Order does not exist.");
      }
    } else {
      props.outputArray([...props.refArray]);
    }
    if (!isMobile) {
      document.getElementById(`filterByDate${props.id}`).value = "1";
      document.getElementById(`filterByType${props.id}`).value = "All orders";
    }
  };

  //Sort items
  const sortBy = (e, sortMth, filteredArray) => {
    if (isMobile && e) {
      const children = document.getElementById(`sortBy${props.id}Mobile`).childNodes;
      children.forEach((child) => {
        child.style = "border: 1px solid rgba(133, 133, 133, 0.389)";
      });
      e.target.style = "border: 1px solid rgba(133, 133, 133)";
    }
    const value = e?.target.value ? e.target.value : sortMth;
    setSortOption(value);
    const array = filteredArray ? filteredArray : [...props.inputArray];
    switch (value) {
      case "1":
        props.outputArray(array.sort((a, b) => timeStampToDate(b.timeCreate) - timeStampToDate(a.timeCreate)));
        break;
      case "2":
        props.outputArray(array.sort((a, b) => timeStampToDate(a.timeCreate) - timeStampToDate(b.timeCreate)));
        break;
      case "3":
        props.outputArray(array.sort((a, b) => b.totalPrice - a.totalPrice));
        break;
      case "4":
        props.outputArray(array.sort((a, b) => a.totalPrice - b.totalPrice));
        break;
      default:
        break;
    }
  };

  //Filter orders by Date
  const filterByDate = (e, filterBy, filteredArray) => {
    const value = e?.target.value ? e.target.value : filterBy;
    const array = filteredArray
      ? filteredArray
      : filterByType(null, document.getElementById(`filterByType${props.id}`).value, [...props.refArray]);
    let filteredOrders = [];
    var oneMonthAgo = new Date(new Date().getFullYear(), new Date().getMonth() - 1, new Date().getDate());
    var twoMonthsAgo = new Date(new Date().getFullYear(), new Date().getMonth() - 2, new Date().getDate());
    var fourMonthsAgo = new Date(new Date().getFullYear(), new Date().getMonth() - 4, new Date().getDate());
    var oneYearAgo = new Date(new Date().getFullYear() - 1, new Date().getMonth(), new Date().getDate());

    switch (value) {
      case "1":
        filteredOrders = array;
        props.outputArray(array);
        break;
      case "2":
        array.forEach((item) => {
          if (timeStampToDate(item.timeCreate) > oneMonthAgo) {
            filteredOrders.push(item);
          }
        });
        props.outputArray(filteredOrders);
        break;
      case "3":
        array.forEach((item) => {
          if (timeStampToDate(item.timeCreate) > twoMonthsAgo) {
            filteredOrders.push(item);
          }
        });
        props.outputArray(filteredOrders);
        break;
      case "4":
        array.forEach((item) => {
          if (timeStampToDate(item.timeCreate) > fourMonthsAgo) {
            filteredOrders.push(item);
          }
        });
        props.outputArray(filteredOrders);
        break;
      case "5":
        array.forEach((item) => {
          if (timeStampToDate(item.timeCreate) > oneYearAgo) {
            filteredOrders.push(item);
          }
        });
        props.outputArray(filteredOrders);
        break;
      default:
        break;
    }
    //sort filtered array according to actual settings
    !filteredArray && sortBy(null, document.getElementById(`sortBy${props.id}`).value, filteredOrders);
    return filteredOrders;
  };

  //Filter orders by type
  const filterByType = (e, filterBy, filteredArray) => {
    let value;
    let array;
    if (isMobile) {
      switch (filterBy) {
        case "All orders":
          setFilterOption("1");
          break;
        case "Waiting for payment":
          setFilterOption("2");
          break;
        case "In realization":
          setFilterOption("3");
          break;
        case "Done":
          setFilterOption("4");
          break;
        default:
          break;
      }
      const children = document.getElementById(`filterByType${props.id}Mobile`).childNodes;
      children.forEach((child) => {
        child.style = "border: 1px solid rgba(133, 133, 133, 0.389)";
      });
      e.target.style = "border: 1px solid rgba(133, 133, 133)";
      value = filterBy;
      array = [...props.refArray];
    } else {
      value = e?.target.value ? e.target.value : filterBy;
      array = filteredArray
        ? filteredArray
        : filterByDate(null, document.getElementById(`filterByDate${props.id}`).value, [...props.refArray]);
    }

    let filteredOrders = [];

    if (value == "All orders") {
      filteredOrders = array;
      props.outputArray(array);
    } else {
      array.forEach((item) => {
        if (item.status == value) {
          filteredOrders.push(item);
        }
      });
      props.outputArray(filteredOrders);
    }
    //sort filtered array according to actual settings
    if (!isMobile && !filteredArray) {
      sortBy(null, document.getElementById(`sortBy${props.id}`).value, filteredOrders);
    }
    if (isMobile && !filteredArray) {
      sortBy(null, sortOption, filteredOrders);
    }
    return filteredOrders;
  };

  return (
    <>
      <section className={`text-center ${isMobile ? "" : "mt-2"}`}>
        {/* DESKTOP SECTION */}
        {!isMobile && (
          <div className="text-start mb-4">
            {/* Find by: */}
            <FiSearch
              style={{ position: "relative", top: "59px", left: "11px", width: "20px", height: "20px" }}
              className="pointer text-dark"
              onClick={findBy}
            />
            <Form className="text-start d-flex gap-4 color-primary" onSubmit={findBy}>
              <Form.Group className="col-5">
                <Form.Label className="mb-0">
                  <small>
                    <strong>Find order</strong>
                  </small>
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Find order by id"
                  id={`find${props.id}`}
                  style={{ paddingLeft: "40px" }}
                />
              </Form.Group>

              {/* Filter by Date: */}
              <Form.Group className="col-2" onChange={filterByDate}>
                <Form.Label className="mb-0">
                  <small>
                    <strong>Filter by date</strong>
                  </small>
                </Form.Label>
                <Form.Select type="text" id={`filterByDate${props.id}`}>
                  <option value="1">All dates</option>
                  <option value="2">Last 30 days</option>
                  <option value="3">Last 60 days</option>
                  <option value="4">Last 120 days</option>
                  <option value="5">Last Year</option>
                </Form.Select>
              </Form.Group>

              {/* Filter by type: */}
              <Form.Group className="col-2" onChange={filterByType}>
                <Form.Label className="mb-0">
                  <small>
                    <strong>Filter by type</strong>
                  </small>
                </Form.Label>
                <Form.Select type="text" id={`filterByType${props.id}`}>
                  <option value="All orders">All orders</option>
                  <option value="Waiting for payment">Waiting for payment</option>
                  <option value="In realization">In realization</option>
                  <option value="Done">Done</option>
                </Form.Select>
              </Form.Group>

              {/* Sorty By: */}
              <Form.Group className="col-2" onChange={sortBy}>
                <Form.Label className="mb-0">
                  <small>
                    <strong>Sort orders</strong>
                  </small>
                </Form.Label>
                <Form.Select type="text" id={`sortBy${props.id}`}>
                  <option value="1">Date &#8600;</option>
                  <option value="2">Date &#8599;</option>
                  <option value="3">Total price &#8600;</option>
                  <option value="4">Total price &#8599;</option>
                </Form.Select>
              </Form.Group>
            </Form>
          </div>
        )}

        {/* MOBILE SECTION */}
        {isMobile && (
          <div className="text-start">
            <FiSearch
              onClick={findBy}
              className="pointer text-dark"
              style={{ position: "relative", top: "32px", left: "11px", width: "20px", height: "20px" }}
            />
            <Form className="text-start d-flex" onSubmit={findBy}>
              <Form.Control
                type="text"
                placeholder="Find order by id"
                id={`find${props.id}Mobile`}
                style={{ paddingLeft: "40px" }}
                className="w-100"
                title="Find order"
              />
              <InputGroup.Text
                className="pointer border"
                onClick={() => {
                  setShowOptions(!showOptions);
                }}
              >
                <BsFilterRight style={{ width: "20px", height: "20px" }} />
              </InputGroup.Text>
            </Form>
            {showOptions && (
              <section className="d-block mt-3 color-primary" style={{ maxWidth: "100%" }}>
                <div className="d-flex align-items-center mb-2 text-nowrap">
                  <div>Sort by:</div>
                  <div
                    id={`sortBy${props.id}Mobile`}
                    className="d-flex overflow-auto ms-2 noScrollBar"
                    style={{ maxWidth: "75vw" }}
                  >
                    <div
                      className="rounded m-1 p-2 pointer"
                      onClick={(e) => {
                        sortBy(e, "1");
                      }}
                    >
                      Date &#8600;
                    </div>
                    <div
                      className={`rounded m-1 p-2 pointer ${sortItem}`}
                      onClick={(e) => {
                        sortBy(e, "2");
                      }}
                    >
                      Date &#8599;
                    </div>
                    <div
                      className={`rounded m-1 p-2 pointer ${sortItem}`}
                      onClick={(e) => {
                        sortBy(e, "3");
                      }}
                    >
                      Price &#8600;
                    </div>
                    <div
                      className={`rounded m-1 p-2 pointer ${sortItem}`}
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
                    id={`filterByType${props.id}Mobile`}
                    className="d-flex overflow-auto ms-2 noScrollBar"
                    style={{ maxWidth: "79vw" }}
                  >
                    <div
                      className={`rounded m-1 p-2 pointer`}
                      onClick={(e) => {
                        filterByType(e, "All orders");
                      }}
                    >
                      All
                    </div>
                    <div
                      className={`rounded m-1 p-2 pointer ${sortItem}`}
                      onClick={(e) => {
                        filterByType(e, "Waiting for payment");
                      }}
                    >
                      Unpaid
                    </div>
                    <div
                      className={`rounded m-1 p-2 pointer ${sortItem}`}
                      onClick={(e) => {
                        filterByType(e, "In realization");
                      }}
                    >
                      In realization
                    </div>
                    <div
                      className={`rounded m-1 p-2 pointer ${sortItem}`}
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
      </section>
    </>
  );
}

export default FilterAndSortBar;
