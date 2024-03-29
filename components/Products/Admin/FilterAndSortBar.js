import React, { useEffect, useState } from "react";
import { Form, InputGroup } from "react-bootstrap";
import { useDeviceStore } from "../../../stores/deviceStore";
import { FiSearch } from "react-icons/fi";
import { BsFilterRight } from "react-icons/bs";
import { useRouter } from "next/router";

function FilterAndSortBar(props) {
  const router = useRouter();
  const locale = router.locale;
  const isMobile = useDeviceStore((state) => state.isMobile);
  const currency = useDeviceStore((state) => state.currency);
  const [showOptions, setShowOptions] = useState(false);
  const [sortOption, setSortOption] = useState("1");
  const sortItem = {
    border: "1px solid rgba(133, 133, 133, 0.389)",
  };

  const t = {
    en: {
      find: "Find product",
      findBy: "Find product by name",
      filter: "Filter by Date",
      filter1: "All Dates",
      filter2: "Last 30 days",
      filter3: "Last 60 days",
      filter4: "Last 120 days",
      filter5: "Last Year",
      // filterType: "Filter by Status",
      // filterType1: "All",
      // filterType2: "Unpaid",
      // filterType3: "In realiation",
      // filterType4: "Done",
      sort: "Sort orders",
      date: "Date",
      price: "Price",
      show: "Show",
      noProduct: "Product not found.",
    },
    pl: {
      find: "Znajdź produkt",
      findBy: "Wyszukaj po nazwie",
      filter: "Filtruj po dacie",
      filter1: "Wszystko",
      filter2: "Ostatnie 30 dni",
      filter3: "Ostatnie 60 dni",
      filter4: "Ostatnie 120 dni",
      filter5: "Ostatni rok",
      // filterType: "Filtruj po statusie",
      // filterType1: "Wszystko",
      // filterType2: "Nieopłacone",
      // filterType3: "W realizacji",
      // filterType4: "Gotowe",
      sort: "Sortuj",
      date: "Data",
      price: "Cena",
      show: "Pokaż",
      noProduct: "Nie ma takiego produktu.",
    },
  };

  const timeStampToDate = (time) => {
    return new Date(time.seconds * 1000 + time.nanoseconds / 100000);
  };

  useEffect(() => {
    //sort array on initialization
    props.outputArray(props.refArray.sort((a, b) => timeStampToDate(b.createDate) - timeStampToDate(a.createDate)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    //add some styles on initialization
    if (showOptions) {
      const sortByChildrens = [...document.getElementById(`sortBy${props.id}Mobile`).childNodes];

      sortByChildrens.map((child, idx) => {
        if (idx + 1 == sortOption) {
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
    let tmpItems = [];
    const input = document.getElementById(`find${props.id}${isMobile ? "Mobile" : ""}`).value;
    if (input !== "") {
      props.refArray.map((item) => {
        //Search for key words in titles
        if (item.title[locale].includes(input) || item.title[locale].toLowerCase().includes(input)) {
          tmpItems.push(item);
          itemFounded = true;
        }
      });
      if (itemFounded) {
        props.outputArray(tmpItems);
      } else {
        props.outputArray([]);
        props.msg(t[locale].noProduct);
      }
    } else {
      props.outputArray([...props.refArray]);
    }
    if (!isMobile) {
      document.getElementById(`filterByDate${props.id}`).value = "1";
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
        props.outputArray(array.sort((a, b) => timeStampToDate(b.createDate) - timeStampToDate(a.createDate)));
        break;
      case "2":
        props.outputArray(array.sort((a, b) => timeStampToDate(a.createDate) - timeStampToDate(b.createDate)));
        break;
      case "3":
        props.outputArray(array.sort((a, b) => b.price[currency].amount - a.price[currency].amount));
        break;
      case "4":
        props.outputArray(array.sort((a, b) => a.price[currency].amount - b.price[currency].amount));
        break;
      default:
        break;
    }
  };

  //Filter orders by Date
  const filterByDate = (e, filterBy, filteredArray) => {
    const value = e?.target.value ? e.target.value : filterBy;
    const array = filteredArray ? filteredArray : [...props.refArray];
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
          if (timeStampToDate(item.createDate) > oneMonthAgo) {
            filteredOrders.push(item);
          }
        });
        props.outputArray(filteredOrders);
        break;
      case "3":
        array.forEach((item) => {
          if (timeStampToDate(item.createDate) > twoMonthsAgo) {
            filteredOrders.push(item);
          }
        });
        props.outputArray(filteredOrders);
        break;
      case "4":
        array.forEach((item) => {
          if (timeStampToDate(item.createDate) > fourMonthsAgo) {
            filteredOrders.push(item);
          }
        });
        props.outputArray(filteredOrders);
        break;
      case "5":
        array.forEach((item) => {
          if (timeStampToDate(item.createDate) > oneYearAgo) {
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
              <Form.Group className="col-6">
                <Form.Label className="mb-0">
                  <small>
                    <strong>{t[locale].find}</strong>
                  </small>
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder={t[locale].findBy}
                  id={`find${props.id}`}
                  style={{ paddingLeft: "40px" }}
                />
              </Form.Group>

              {/* Filter by Date: */}
              <Form.Group className="col-3" onChange={filterByDate}>
                <Form.Label className="mb-0">
                  <small>
                    <strong>{t[locale].filter}</strong>
                  </small>
                </Form.Label>
                <Form.Select type="text" id={`filterByDate${props.id}`}>
                  <option value="1">{t[locale].filter1}</option>
                  <option value="2">{t[locale].filter2}</option>
                  <option value="3">{t[locale].filter3}</option>
                  <option value="4">{t[locale].filter4}</option>
                  <option value="5">{t[locale].filter5}</option>
                </Form.Select>
              </Form.Group>

              {/* Sorty By: */}
              <Form.Group className="col-2" onChange={sortBy}>
                <Form.Label className="mb-0">
                  <small>
                    <strong>{t[locale].sort}</strong>
                  </small>
                </Form.Label>
                <Form.Select type="text" id={`sortBy${props.id}`}>
                  <option value="1">{t[locale].date} &#8600;</option>
                  <option value="2">{t[locale].date} &#8599;</option>
                  <option value="3">{t[locale].price} &#8600;</option>
                  <option value="4">{t[locale].price} &#8599;</option>
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
                placeholder={t[locale].findBy}
                id={`find${props.id}Mobile`}
                style={{ paddingLeft: "40px" }}
                className="w-100"
                title="Filter"
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
                  <div>{t[locale].sort}</div>
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
                     {t[locale].date} &#8600;
                    </div>
                    <div
                      className={`rounded m-1 p-2 pointer ${sortItem}`}
                      onClick={(e) => {
                        sortBy(e, "2");
                      }}
                    >
                      {t[locale].date} &#8599;
                    </div>
                    <div
                      className={`rounded m-1 p-2 pointer ${sortItem}`}
                      onClick={(e) => {
                        sortBy(e, "3");
                      }}
                    >
                      {t[locale].price} &#8600;
                    </div>
                    <div
                      className={`rounded m-1 p-2 pointer ${sortItem}`}
                      onClick={(e) => {
                        sortBy(e, "4");
                      }}
                    >
                      {t[locale].price} &#8599;
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
