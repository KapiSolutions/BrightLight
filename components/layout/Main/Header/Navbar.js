import React, { useEffect, useState } from "react";
import Link from 'next/link'
import styles from '../../../../styles/layout/main/Navbar.module.scss'

import { Navbar as Navbarr, Nav, Container } from 'react-bootstrap'
import ChangeThemeButton from '../../../ChangeThemeButton'
import { GiBackForth } from "react-icons/gi";

function Navbar(props) {
  const navItems = [
    { id: 1, to: "/#main", text: "Home" },
    { id: 2, to: "/about#main", text: "About" },
    { id: 3, to: "/blog#main", text: "Blog" },
    { id: 4, to: "/contact", text: "Contact" },
    { id: 5, to: "/pricing", text: "Pricing" },
    { id: 6, to: "/sign-in", text: "Sign In" }
  ];

  const [back, setBack] = useState(false);
  const [onTop, setOnTop] = useState(true);
  const [expandedMenu, setExpand] = useState(false);

  const menuClicked = () => {
    if (window.innerWidth < 768) {
      if (back && onTop && expandedMenu) {
        setBack(false);
      } else if (!back && onTop && !expandedMenu) {
        setBack(true);
      }
    }
    setExpand(!expandedMenu);
  };

  useEffect(() => {
    window.onscroll = () => {
      if (window.pageYOffset > 50) {
        setBack(true);
        setOnTop(false);
      } else {
        setBack(false);
        setOnTop(true);
      }
    };
  }, []);

  return (

    <Navbarr
      collapseOnSelect
      expand="md"
      variant={props.theme}
      className={`display-1 ${back ? 'fs-6 shadow background' : 'fs-5'}`}
      fixed="top"
    >
      <Container>
        <Link href="/" passHref>
          <Navbarr.Brand className={`${styles.brand} ${back ? 'fs-4' : 'fs-1'}`}>
            BrightLight
          </Navbarr.Brand>
        </Link>
        <Navbarr.Toggle aria-controls="responsive-navbar-nav" onClick={menuClicked} />
        <Navbarr.Collapse id="responsive-navbar-nav"  >
          <Nav className="ms-auto">

            {navItems.map((item) => (
              <Link key={item.id} href={item.to} passHref>
                <Nav.Link onClick={menuClicked}>{item.text}</Nav.Link>
              </Link>
            ))}
            {/* <Nav.Link>|</Nav.Link> */}
            <Nav.Link href="#" onClick={menuClicked}>
              <ChangeThemeButton text={true} />
            </Nav.Link>

          </Nav>
        </Navbarr.Collapse>
      </Container>
    </Navbarr>
  )
}

export default Navbar