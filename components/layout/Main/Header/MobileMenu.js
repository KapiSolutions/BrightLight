import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import styles from "../../../../styles/layout/main/Navbar.module.scss";
import { Navbar, Nav, Container, Alert, Offcanvas, Badge, Button } from "react-bootstrap";
import ChangeThemeButton from "../../../ChangeThemeButton";
import { useAuth } from "../../../../context/AuthProvider";
import { FaRegUserCircle } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";
import { RiAlertFill } from "react-icons/ri";
import { BsCart4 } from "react-icons/bs";
import { GiSparkSpirit, GiWallet } from "react-icons/gi";
import Cart from "../../../Cart/Cart";
import ChangeLocale from "../../../ChangeLocale";

function MobileMenu(props) {
  const router = useRouter();
  const locale = props.locale;
  const { authUserFirestore, logoutUser, isAdmin } = useAuth();
  const [error, setError] = useState("");
  const [back, setBack] = useState(false);
  const [onTop, setOnTop] = useState(true);
  const [expandedMenu, setExpand] = useState(false);
  const [showCart, setShowCart] = useState(undefined);
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

  const t = {
    en: {
      profile: "Profile",
      myOrders: "My Orders",
      dailyHoroscope: "Daily Horoscope",
      logOut: "Log Out",
      products: "Products",
      blogPosts: "Blog",
      users: "Menage Users",
      menageOrders: "Menage Orders",
      regulations: "Legal Terms",
      finances: "Finances",
      signIn: "Sign In",
      cart: "Shopping Cart",
      admin: "Admin Panel",
    },
    pl: {
      profile: "Profil",
      myOrders: "Zamówienia",
      dailyHoroscope: "Codzienny Horoskop",
      logOut: "Wyloguj",
      products: "Produkty",
      blogPosts: "Blog",
      users: "Użytkownicy",
      menageOrders: "Zamówienia",
      regulations: "Regulaminy",
      finances: "Finanse",
      signIn: "Zaloguj",
      cart: "Koszyk",
      admin: "Panel Administratora",
    },
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
            <Link href="/" passHref legacyBehavior>
              <Navbar.Brand style={{ height: "45px" }}>
                <span className={`${styles.brand} fs-4`}>BrightLight</span>
                <span className={`${styles.brandGypsy} fs-6 color-secondary`}>GYPSY</span>
              </Navbar.Brand>
            </Link>

            {authUserFirestore && (
              <>
                <Navbar collapseOnSelect expand="md" variant={props.theme} className="fs-5 display-1 ms-auto me-3 ">
                  <Navbar.Toggle aria-controls="profile-nav">
                    {isAdmin ? (
                      <GiSparkSpirit className={`${styles.mobileIcons} color-primary`} />
                    ) : (
                      <FaRegUserCircle className={`${styles.mobileIcons} color-primary`} />
                    )}
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
                        {isAdmin && (
                          <>
                            <section className={`ms-0 mb-3 ${styles.adminBack}`}>
                              <p className={`text-${revTheme} text-uppercase mb-2`}>
                                <strong>{t[locale].admin}</strong>
                              </p>
                              <Link href="/admin/blogs#main" passHref legacyBehavior>
                                <Nav.Link className={`text-${revTheme}`}>{t[locale].blogPosts}</Nav.Link>
                              </Link>
                              <Link href="/admin/products#main" passHref legacyBehavior>
                                <Nav.Link className={`text-${revTheme}`}>{t[locale].products}</Nav.Link>
                              </Link>
                              <Link href="/admin/regulations#main" passHref legacyBehavior>
                                <Nav.Link className={`text-${revTheme}`}>{t[locale].regulations}</Nav.Link>
                              </Link>
                              <Link href="/admin/users#main" passHref legacyBehavior>
                                <Nav.Link className={`text-${revTheme}`}>{t[locale].users}</Nav.Link>
                              </Link>

                              <Link href="/admin/orders#main" passHref legacyBehavior>
                                <Nav.Link className={`text-${revTheme}`}>{t[locale].menageOrders}</Nav.Link>
                              </Link>
                              <div className="d-flex align-items-center">
                                <GiWallet
                                  className={`${styles.iconsAdmin} text-${revTheme} color-primary me-1`}
                                  title="Finances"
                                />
                                <Link href="/admin/finances#main" passHref legacyBehavior>
                                  <Nav.Link className={`text-${revTheme}`}>{t[locale].finances}</Nav.Link>
                                </Link>
                              </div>
                            </section>
                            <hr className={`text-${revTheme}`} />
                          </>
                        )}

                        <Link href="/user/profile" scroll={false} passHref legacyBehavior>
                          <Nav.Link className={`text-${revTheme}`}>{t[locale].profile}</Nav.Link>
                        </Link>
                        <Link href="/user/orders" scroll={false} passHref legacyBehavior>
                          <Nav.Link className={`text-${revTheme}`}>{t[locale].myOrders}</Nav.Link>
                        </Link>
                        <Link href="/user/horoscope" scroll={false} passHref legacyBehavior>
                          <Nav.Link className={`text-${revTheme}`}>
                            {t[locale].dailyHoroscope}
                            <small className="ms-1">
                              <Badge bg="danger">NEW!</Badge>
                            </small>
                          </Nav.Link>
                        </Link>
                        <hr className={`text-${revTheme}`} />
                        <Nav.Link
                          onClick={handleLogout}
                          className={`text-${props.theme === "light" ? "dark" : "light"}`}
                        >
                          <FiLogOut className={`${styles.icons} color-primary me-1`} title={t[locale].logOut} />
                          {t[locale].logOut}
                        </Nav.Link>
                      </Nav>
                    </Offcanvas.Body>
                  </Navbar.Offcanvas>
                </Navbar>

                <Navbar collapseOnSelect expand="md" variant={props.theme} className="fs-5 display-1 me-3">
                  <Navbar.Toggle aria-controls="cart-nav" onClick={() => setShowCart(true)}>
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
                    show={showCart}
                    onHide={() => setShowCart(undefined)}
                    aria-labelledby="cart-nav"
                    placement="top"
                    style={{ background: offCanvBackColor }}
                  >
                    <Offcanvas.Header closeButton closeVariant={props.theme === "light" ? undefined : "white"}>
                      <Offcanvas.Title id="cart-nav-offcanvas">
                        <BsCart4 className={`${styles.mobileIcons} text-${revTheme} mb-2`} />
                        <a className={`text-${revTheme}`}> {t[locale].cart}</a>
                      </Offcanvas.Title>
                    </Offcanvas.Header>
                    <Offcanvas.Body>
                      <Cart theme={props.theme} setShowCart={setShowCart} />
                    </Offcanvas.Body>
                  </Navbar.Offcanvas>
                </Navbar>
              </>
            )}

            <Navbar.Toggle aria-controls="top-navbar" onClick={menuClicked} />
            <Navbar.Collapse id="top-navbar">
              <Nav className="ms-auto mt-3 mb-2">
                {props.navItems.map((item) => (
                  <Link key={item.id} href={item.to} passHref legacyBehavior>
                    <Nav.Link onClick={menuClicked}>{item.text}</Nav.Link>
                  </Link>
                ))}
                {authUserFirestore ? (
                  ""
                ) : (
                  <Link href="/sign-in" passHref legacyBehavior>
                    <Nav.Link onClick={menuClicked} className={back && "mt-1"}>
                    <Button size="md" className="ps-2 pt-1 pe-2 pb-1">
                      {t[locale].signIn}
                    </Button>
                    </Nav.Link>
                  </Link>
                )}
                <div className="d-flex align-items-center mt-2 gap-5 justify-content-center">
                  <Nav.Link href="#" onClick={menuClicked}>
                    <ChangeThemeButton text={false} />
                  </Nav.Link>
                  <Nav.Link href="#" onClick={menuClicked} className={styles.hover}>
                    <ChangeLocale />
                  </Nav.Link>
                </div>
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
