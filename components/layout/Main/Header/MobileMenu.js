import React, { useEffect, useState } from "react";
import Link from "next/link";
import styles from "../../../../styles/layout/main/Navbar.module.scss";
import { Navbar, Nav, Container, Alert, Offcanvas, Badge } from "react-bootstrap";
import ChangeThemeButton from "../../../ChangeThemeButton";
import { useAuth } from "../../../../context/AuthProvider";
import { FaRegUserCircle } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";
import { RiAlertFill } from "react-icons/ri";
import { BsCart4 } from "react-icons/bs";
import Cart from "../../../Cart";

function MobileMenu(props) {
  const { authUserFirestore, logoutUser } = useAuth();
  const [error, setError] = useState("");
  const [back, setBack] = useState(false);
  const [onTop, setOnTop] = useState(true);
  const [expandedMenu, setExpand] = useState(false);
  const revTheme = props.theme === "light" ? "dark" : "light";
  const offCanvBackColor = props.theme === "light" ? "#fcfcfb" : "#11061a";

  async function handleLogout() {
    setError("");
    try {
      await logoutUser();
    } catch (error) {
      setError("Failed to log out");
    }
  }

  //show/hide background of the menu on mobile devices
  const menuClicked = () => {
    if (back && onTop && expandedMenu) {
      setBack(false);
    } else if (!back && onTop && !expandedMenu) {
      setBack(true);
    }
    setExpand(!expandedMenu);
  };

  //show/hide background of the menu on scroll
  window.onscroll = () => {
    if (window.pageYOffset > 50) {
      setBack(true);
      setOnTop(false);
    } else {
      if (!expandedMenu) {
        setBack(false);
      }
      setOnTop(true);
    }
  };

  return (
    <>
      <nav>
        <Navbar
          collapseOnSelect
          expand="md"
          variant={props.theme}
          className={`display-1 pt-1 pb-1 ${back ? "fs-5 shadow-sm background" : "fs-5"}`}
          fixed="top"
        >
          <Container className="d-flex">
            <Link href="/" passHref>
              <Navbar.Brand style=
                {
                  back
                    ? onTop
                      ? { height: "40px" }
                      : { height: "45px" }
                    : { height: "40px" }
                }
                >
                <span className={`${styles.brand} ${back ? (onTop ? "fs-2" : "fs-4") : "fs-2"}`}>BrightLight</span>
                <span
                  className={`${styles.brandGypsyFont} ${
                    back ? (onTop ? "display-7" : "fs-6") : "display-7"
                  } d-block color-secondary`}
                  style={
                    back
                      ? onTop
                        ? { position: "relative", top: "-9px", left: "59px" }
                        : { position: "relative", top: "-8px", left: "50px" }
                      : { position: "relative", top: "-9px", left: "59px" }
                  }
                >
                  GYPSY
                </span>
              </Navbar.Brand>
            </Link>

            {authUserFirestore && (
              <>
                <Navbar collapseOnSelect expand="md" variant={props.theme} className="fs-5 display-1 ms-auto me-3 ">
                  <Navbar.Toggle aria-controls="profile-nav">
                    <FaRegUserCircle className={`${styles.mobileIcons} color-primary`} />
                  </Navbar.Toggle>
                  <Navbar.Offcanvas
                    id="profile-nav"
                    aria-labelledby="profile-nav"
                    placement="top"
                    style={{ background: offCanvBackColor }}
                  >
                    <Offcanvas.Header closeButton closeVariant={props.theme === "light" ? undefined : "white"}>
                      <Offcanvas.Title id="profile-nav-offcanvas">
                        <a className={`text-${revTheme}`}>Hi {authUserFirestore.name}!</a>
                      </Offcanvas.Title>
                    </Offcanvas.Header>
                    <Offcanvas.Body>
                      <Nav className="ms-auto">
                        <Link href="/user-profile#main" passHref>
                          <Nav.Link className={`text-${revTheme}`}>Profile</Nav.Link>
                        </Link>
                        {/* <Link href="/#" passHref>
                          <Nav.Link className={`text-${revTheme}`}>Messages</Nav.Link>
                        </Link> */}
                        <Link href="/#" passHref>
                          <Nav.Link className={`text-${revTheme}`}>My orders</Nav.Link>
                        </Link>

                        <Nav.Link
                          onClick={handleLogout}
                          className={`text-${props.theme === "light" ? "dark" : "light"}`}
                        >
                          <FiLogOut className={`${styles.icons} color-primary me-1`} title="Log Out" />
                          Log Out
                        </Nav.Link>
                      </Nav>
                    </Offcanvas.Body>
                  </Navbar.Offcanvas>
                </Navbar>

                <Navbar collapseOnSelect expand="md" variant={props.theme} className="fs-5 display-1 me-3">
                  <Navbar.Toggle aria-controls="cart-nav">
                    <BsCart4 className={`${styles.mobileIcons} color-primary`} />
                    {authUserFirestore.cart.length > 0 && (
                      <div style={{ position: "absolute", top: "25px", left: "36px" }}>
                        <small>
                          <Badge bg="danger">{authUserFirestore.cart.length}</Badge>
                        </small>
                      </div>
                    )}
                  </Navbar.Toggle>
                  <Navbar.Offcanvas
                    id="cart-nav"
                    aria-labelledby="cart-nav"
                    placement="top"
                    style={{ background: offCanvBackColor }}
                  >
                    <Offcanvas.Header closeButton closeVariant={props.theme === "light" ? undefined : "white"}>
                      <Offcanvas.Title id="cart-nav-offcanvas">
                        <BsCart4 className={`${styles.mobileIcons} text-${revTheme} mb-2`} />
                        <a className={`text-${revTheme}`}> Shopping cart</a>
                      </Offcanvas.Title>
                    </Offcanvas.Header>
                    <Offcanvas.Body>
                      <Cart theme={props.theme} />
                    </Offcanvas.Body>
                  </Navbar.Offcanvas>
                </Navbar>
              </>
            )}

            <Navbar.Toggle aria-controls="top-navbar" onClick={menuClicked} />
            <Navbar.Collapse id="top-navbar">
              <Nav className="ms-auto">
                {props.navItems.map((item) => (
                  <Link key={item.id} href={item.to} passHref>
                    <Nav.Link onClick={menuClicked}>{item.text}</Nav.Link>
                  </Link>
                ))}
                {authUserFirestore ? (
                  ""
                ) : (
                  <Link href="/sign-in" passHref>
                    <Nav.Link onClick={menuClicked} className={back && "mt-1"}>
                      Sign In
                    </Nav.Link>
                  </Link>
                )}
                <Nav.Link href="#" onClick={menuClicked}>
                  <ChangeThemeButton text={false} />
                </Nav.Link>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      </nav>

      {error && (
        <div className={styles.darkBack}>
          <Container className={styles.centerElement}>
            <Alert variant="danger" onClose={() => setError("")} className="shadow" dismissible>
              <RiAlertFill className="me-2 mb-1 iconSizeAlert" data-size="2" />
              <strong>Ups! </strong>
              {error}
            </Alert>
          </Container>
        </div>
      )}
    </>
  );
}

export default MobileMenu;