import React, { useEffect, useState } from "react";
import MobileMenu from "./MobileMenu";
import DesktopMenu from "./DesktopMenu";


function Navigation(props) {
  const [width, setWidth] = useState(window.innerWidth);

  const navItems = [
    { id: 1, to: "/#main", text: "Home" },
    { id: 2, to: "/about#main", text: "About" },
    { id: 3, to: "/blog#main", text: "Blog" },
    { id: 4, to: "#footer", text: "Contact" }
    // { id: 5, to: "/pricing", text: "Pricing" }
    // { id: 6, to: "/sign-in", text: "Sign In" }
  ];

  function handleWindowSizeChange() {
    setWidth(window.innerWidth);
  }
  useEffect(() => {
    window.addEventListener('resize', handleWindowSizeChange)
    return () => {
      window.removeEventListener('resize', handleWindowSizeChange)
    }
  }, []);

  const isMobile = width <= 768;

  return (
    <>
      {isMobile ? 
      <MobileMenu navItems={navItems} theme={props.theme} /> 
      : 
      <DesktopMenu navItems={navItems} theme={props.theme}/>
      }
    </>
  )
}

export default Navigation