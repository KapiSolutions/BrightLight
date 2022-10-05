import React, { useState } from "react";
import Link from "next/link";
import styles from "../../../../styles/layout/main/Navbar.module.scss";
import { Navbar, Nav, Container, Dropdown, Alert, Badge, Offcanvas } from "react-bootstrap";
import ChangeThemeButton from "../../../ChangeThemeButton";
import { useAuth } from "../../../../context/AuthProvider";
import { FaRegUserCircle } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";
import { RiAlertFill } from "react-icons/ri";
import { BsCart4 } from "react-icons/bs";
import Cart from "../../../Cart";

function DesktopMenu(props) {
  const { authUserFirestore, logoutUser } = useAuth();
  const [error, setError] = useState("");
  const [back, setBack] = useState(false);
  const [onTop, setOnTop] = useState(true);
  const [showCart, setShowCart] = useState(false);
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

  //show/hide background of the menu on scroll
  window.onscroll = () => {
    if (window.pageYOffset > 50) {
      setBack(true);
      setOnTop(false);
    } else {
      setBack(false);
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
          className={`display-1 ${back ? (onTop ? "fs-5 shadow-sm background" : "fs-6 shadow-sm background") : "fs-5"}`}
          fixed="top"
        >
          <Container>
            <Link href="/" passHref>
              <Navbar.Brand className={`${styles.brand} ${back ? (onTop ? "fs-1" : "fs-4") : "fs-1"}`}>
                BrightLight
              </Navbar.Brand>
            </Link>
            <Navbar.Toggle aria-controls="top-navbar" />
            <Navbar.Collapse id="top-navbar">
              <Nav className="ms-auto">
                {props.navItems.map((item) => (
                  <Link key={item.id} href={item.to} passHref>
                    <Nav.Link className={back && "mt-1"}>{item.text}</Nav.Link>
                  </Link>
                ))}

                {authUserFirestore ? (
                  <Container className="d-flex ">
                    <div className="vr m-2 color-primary"></div>
                    <Dropdown title="My account">
                      <Dropdown.Toggle
                        variant={props.theme}
                        style={{ background: "none", border: "none" }}
                        className={`color-primary mt-1 fs-6 ${styles.hover}`}
                        id="dropdown-user"
                      >
                        <a>Hi {authUserFirestore?.name}! </a>
                        <FaRegUserCircle className={`${styles.icons} color-primary `} />
                      </Dropdown.Toggle>

                      <Dropdown.Menu variant={props.theme} className="background mt-2">
                        <Link href="/user-profile#main" passHref>
                          <Dropdown.Item>Profile</Dropdown.Item>
                        </Link>
                        <Link href="/#" passHref>
                          <Dropdown.Item>My orders</Dropdown.Item>
                        </Link>
                        <Dropdown.Divider />
                        <Dropdown.Item onClick={handleLogout}>
                          <FiLogOut className={`${styles.icons} color-primary me-1`} title="Log Out" />
                          Log Out
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>

                    <Nav.Link className={back && "mt-1"} onClick={() => setShowCart(true)}>
                      <div className="d-block" style={{ maxHeight: "25px" }}>
                        <BsCart4 className={`${styles.cartIconDesktop} color-primary ${styles.hover}`} />
                        {authUserFirestore.cart.length > 0 && (
                          <div style={{ position: "relative", top: "-14px", left: "19px" }}>
                            <small>
                              <Badge bg="danger">{authUserFirestore.cart.length}</Badge>
                            </small>
                          </div>
                        )}
                      </div>
                    </Nav.Link>
                  </Container>
                ) : (
                  <Link href="/sign-in" passHref>
                    <Nav.Link className={back && "mt-1"}>Sign In</Nav.Link>
                  </Link>
                )}
                <Nav.Link href="#" className={back && "mt-1"}>
                  <ChangeThemeButton text={false} />
                </Nav.Link>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      </nav>

      <Offcanvas
        show={showCart}
        placement="end"
        onHide={() => setShowCart(false)}
        style={{ background: offCanvBackColor }}
      >
        <Offcanvas.Header closeButton closeVariant={props.theme === "light" ? undefined : "white"}>
          <Offcanvas.Title className={`text-${revTheme}`}>
            <BsCart4 className={`${styles.mobileIcons} color-primary mb-2`} />
            <a className={`text-${revTheme}`}> Shopping cart</a>
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body className={`text-${revTheme}`}>
        <Cart theme={props.theme}/>
        </Offcanvas.Body>
      </Offcanvas>

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

export default DesktopMenu;
