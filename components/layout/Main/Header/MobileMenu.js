import React, { useEffect, useState } from "react";
import Link from "next/link";
import styles from "../../../../styles/layout/main/Navbar.module.scss";
import { Navbar, Nav, Container, Alert, Offcanvas } from "react-bootstrap";
import ChangeThemeButton from "../../../ChangeThemeButton";
import { useAuth } from "../../../../context/AuthProvider";
import { FaRegUserCircle } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";
import { RiAlertFill } from "react-icons/ri";

function MobileMenu(props) {
  const { currentUser, logoutUser } = useAuth();
  const [error, setError] = useState("");
  const [back, setBack] = useState(false);
  const [onTop, setOnTop] = useState(true);
  const [expandedMenu, setExpand] = useState(false);
  const revTheme = props.theme === "light" ? "dark" : "light";
  const offCanvBackColor = props.theme === "light" ? "#fcfcfb" : "#11061a";

  async function handleLogout() {
    setError("");
    // menuClicked();
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
          className={`display-1 ${back ? "fs-5 shadow-sm background" : "fs-5"}`}
          fixed="top"
        >
          <Container className="d-flex">
            <Link href="/" passHref>
              <Navbar.Brand className={`${styles.brand} ${back ? (onTop ? "fs-1" : "fs-4") : "fs-1"}`}>
                BrightLight
              </Navbar.Brand>
            </Link>

            {currentUser && (
              <>
                <Navbar collapseOnSelect expand="md" variant={props.theme} className="fs-5 display-1 ms-auto me-2">
                  <Navbar.Toggle aria-controls="top-navbar2">
                    <FaRegUserCircle className={`${styles.mobileIcons} color-primary`} />
                  </Navbar.Toggle>
                  <Navbar.Offcanvas
                    id="top-navbar2"
                    aria-labelledby="top-navbar2"
                    placement="top"
                    style={{ background: offCanvBackColor }}
                  >
                    <Offcanvas.Header
                      closeButton
                      closeVariant={props.theme === "light" ? undefined : "white"}
                    >
                      <Offcanvas.Title id="top-navbar2-title">
                        <a className={`text-${revTheme}`}>Hi {currentUser.displayName}!</a>
                      </Offcanvas.Title>
                    </Offcanvas.Header>
                    <Offcanvas.Body>
                      <Nav className="ms-auto">
                        <Link href="/#" passHref>
                          <Nav.Link className={`text-${revTheme}`}>Profile</Nav.Link>
                        </Link>
                        <Link href="/#" passHref>
                          <Nav.Link className={`text-${revTheme}`}>Shopping cart</Nav.Link>
                        </Link>
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
                {currentUser ? (
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
