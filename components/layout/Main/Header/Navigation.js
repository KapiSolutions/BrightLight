import React, { useEffect, useState } from "react";
import Link from 'next/link'
import { useRouter } from 'next/router'
import styles from '../../../../styles/layout/main/Navbar.module.scss'
import { Navbar, Nav, Container } from 'react-bootstrap'
import ChangeThemeButton from '../../../ChangeThemeButton'
import { useAuth } from '../../../../context/AuthProvider'

function Navigation(props) {
  const { currentUser, logoutUser } = useAuth();
  const [error, setError] = useState('');

  async function handleLogout() {
    setError('');
    menuClicked();
    try {
      await logoutUser();
    } catch (error) {
      setError('Failed to log out');
    }
  }

  const navItems = [
    { id: 1, to: "/#main", text: "Home" },
    { id: 2, to: "/about#main", text: "About" },
    { id: 3, to: "/blog#main", text: "Blog" },
    { id: 4, to: "#footer", text: "Contact" }
    // { id: 5, to: "/pricing", text: "Pricing" }
    // { id: 6, to: "/sign-in", text: "Sign In" }
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
    <nav>
      <Navbar
        collapseOnSelect
        expand="md"
        variant={props.theme}
        className={`display-1 ${back ? (onTop ? 'fs-5 shadow-sm background' : 'fs-6 shadow-sm background') : 'fs-5'}`}
        fixed="top"
      >
        <Container>
          <Link href="/" passHref>
            <Navbar.Brand className={`${styles.brand} ${back ? (onTop ? 'fs-1' : 'fs-4') : 'fs-1'}`}>
              BrightLight
            </Navbar.Brand>
          </Link>
          <Navbar.Toggle aria-controls="top-navbar" onClick={menuClicked} />
          <Navbar.Collapse id="top-navbar"  >
            <Nav className="ms-auto">

              {navItems.map((item) => (
                <Link key={item.id} href={item.to} passHref>
                  <Nav.Link onClick={menuClicked}>{item.text}</Nav.Link>
                </Link>
              ))}
              {currentUser ?
                <Link href='/' passHref>
                  <Nav.Link onClick={handleLogout}>Log Out</Nav.Link>
                </Link>
                :
                <Link href='/sign-in' passHref>
                  <Nav.Link onClick={menuClicked}>Sign In</Nav.Link>
                </Link>
              }
              <Nav.Link href="#" onClick={menuClicked}>
                <ChangeThemeButton text={false} />
              </Nav.Link>

            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </nav>
  )
}

export default Navigation