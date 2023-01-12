import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import styles from "../../../../styles/layout/main/Navbar.module.scss";
import { Navbar, Nav, Container, Dropdown, Alert, Badge, Offcanvas } from "react-bootstrap";
import ChangeThemeButton from "../../../ChangeThemeButton";
import { useAuth } from "../../../../context/AuthProvider";
import { FaRegUserCircle } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";
import { RiAlertFill } from "react-icons/ri";
import { BsCart4 } from "react-icons/bs";
import { GiFox, GiUnicorn, GiTurd, GiSparkSpirit, GiSharpCrown, GiWallet, GiTwoCoins } from "react-icons/gi";
//admin icons: GiPimiento GiPiggyBank GiPointyHat GiPopcorn GiSharpCrown GiSparkSpirit GiStrawberry
// GiSwordsEmblem GiTiara GiTurd GiTwoCoins GiUnicorn GiWallet GiAnarchy GiArcingBolt GiBleedingHeart
// GiBulb GiBurningEmbers GiCardQueenHearts GiCowled GiCrownedHeart GiFireBottle GiFox GiSittingDog
import Cart from "../../../Cart/Cart";

function DesktopMenu(props) {
  const router = useRouter();
  const { authUserFirestore, logoutUser, isAdmin } = useAuth();
  const [error, setError] = useState("");
  const [back, setBack] = useState(false);
  const [onTop, setOnTop] = useState(true);
  const [showCart, setShowCart] = useState(undefined);
  const revTheme = props.theme === "light" ? "dark" : "light";
  const offCanvBackColor = props.theme === "light" ? "#fcfcfb" : "#11061a";

  async function handleLogout() {
    setError("");
    try {
      await logoutUser();
      router.push("/");
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
          className={`display-1 ${isAdmin && "fs-6"} 
          ${back ? (onTop ? "fs-5 shadow-sm background" : "fs-6 shadow-sm background") : "fs-5"}
          d-flex flex-nowrap align-items-center p-1`}
          fixed="top"
        >
          <Container style={{minWidth: "95vw"}}>
            <Link href="/" passHref legacyBehavior>
              <Navbar.Brand style={back ? (onTop ? { height: "40px" } : { height: "45px" }) : { height: "40px" }}>
                <span className={`${styles.brand} ${back ? (onTop ? "fs-2" : "fs-4") : "fs-2"}`}>BrightLight</span>
                <span
                  className={`${styles.brandGypsy} ${
                    back ? (onTop ? "display-7" : "fs-6") : "display-7"
                  } d-block color-secondary`}
                  style={
                    back
                      ? onTop
                        ? { position: "relative", top: "-9px", left: "65px" }
                        : { position: "relative", top: "-8px", left: "50px" }
                      : { position: "relative", top: "-9px", left: "65px" }
                  }
                >
                  GYPSY
                </span>
              </Navbar.Brand>
            </Link>
            <Navbar.Toggle aria-controls="top-navbar" />
            <Navbar.Collapse id="top-navbar">
              <Nav className="ms-auto d-flex align-items-center">
                {props.navItems.map((item) => (
                  <Link key={item.id} href={item.to} passHref legacyBehavior>
                    <Nav.Link>{item.text}</Nav.Link>
                  </Link>
                ))}

                {authUserFirestore ? (
                  <Container className="d-flex align-items-center me-1">
                    <div className="vr m-2 color-primary"></div>
                    <Dropdown title="My account">
                      <Dropdown.Toggle
                        variant={props.theme}
                        style={{ background: "none", border: "none" }}
                        className={`color-primary fs-6 ${styles.hover} d-flex align-items-center`}
                        id="dropdown-user"
                      >
                        <a>Hi {authUserFirestore?.name}!</a>
                        <FaRegUserCircle className={`${styles.icons} color-primary ms-1 mt-1`} />
                      </Dropdown.Toggle>

                      <Dropdown.Menu variant={props.theme} className="background mt-2">
                        <Link href="/user/profile#main" passHref legacyBehavior>
                          <Dropdown.Item>Profile</Dropdown.Item>
                        </Link>
                        <Link href="/user/orders#main" passHref legacyBehavior>
                          <Dropdown.Item>My orders</Dropdown.Item>
                        </Link>
                        <Link href="/user/horoscope#main" passHref legacyBehavior>
                          <Dropdown.Item>
                            Daily Horoscope
                            <small className="ms-1">
                              <Badge bg="danger">NEW!</Badge>
                            </small>
                          </Dropdown.Item>
                        </Link>
                        <Dropdown.Divider />
                        <Dropdown.Item onClick={handleLogout}>
                          <FiLogOut className={`${styles.icons} color-primary me-1`} title="Log Out" />
                          Log Out
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>

                    {/* Admin options */}
                    {isAdmin && (
                      <Dropdown title="My account">
                        <Dropdown.Toggle
                          variant={props.theme}
                          style={{ background: "none", border: "none" }}
                          className={`color-primary fs-6 ${styles.hover}`}
                          id="dropdown-user"
                        >
                          <span>Admin </span>
                          <GiSparkSpirit className={`${styles.icons} color-primary `} />
                        </Dropdown.Toggle>
                        <Dropdown.Menu variant={props.theme} className="background mt-2">
                          <Link href="/admin/products#main" passHref legacyBehavior>
                            <Dropdown.Item>Products</Dropdown.Item>
                          </Link>
                          <Link href="/admin/orders#main" passHref legacyBehavior>
                            <Dropdown.Item>Blog posts</Dropdown.Item>
                          </Link>
                          <Link href="/admin/horoscope#main" passHref legacyBehavior>
                            <Dropdown.Item>Menage Users</Dropdown.Item>
                          </Link>
                          <Dropdown.Divider />
                          <Link href="/admin/horoscope#main" passHref legacyBehavior>
                            <Dropdown.Item>Menage Orders</Dropdown.Item>
                          </Link>
                          <Dropdown.Divider />
                          <Dropdown.Item onClick={handleLogout}>
                            <GiWallet className={`${styles.iconsAdmin} color-primary me-1`} title="Finances" />
                            Finances
                          </Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    )}
                    {/* Shopping Cart */}
                    <Nav.Link onClick={() => setShowCart(true)}>
                      <div className="d-flex align-items-center" >
                        <BsCart4 className={`${styles.cartIconDesktop} color-primary  ${styles.hover}`} />
                        {authUserFirestore.cart.length > 0 && (
                          <div style={{ position: "relative", top: "10px", left: "-2px", width: "1px" }}>
                            <small>
                              <Badge bg="danger">{authUserFirestore.cart.length}</Badge>
                            </small>
                          </div>
                        )}
                      </div>
                    </Nav.Link>
                  </Container>
                ) : (
                  <Link href="/sign-in" passHref legacyBehavior>
                    <Nav.Link>Sign In</Nav.Link>
                  </Link>
                )}
                <Nav.Link href="#">
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
        onHide={() => setShowCart(undefined)}
        style={{ background: offCanvBackColor }}
      >
        <Offcanvas.Header closeButton closeVariant={props.theme === "light" ? undefined : "white"}>
          <Offcanvas.Title className={`text-${revTheme}`}>
            <BsCart4 className={`${styles.mobileIcons} color-primary mb-2`} />
            <a className={`text-${revTheme}`}> Shopping cart</a>
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body className={`text-${revTheme}`}>
          <Cart theme={props.theme} setShowCart={setShowCart} />
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
