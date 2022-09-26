import React, { useEffect, useState } from "react";
import MobileMenu from "./MobileMenu";
import DesktopMenu from "./DesktopMenu";
import { useDeviceStore } from "../../../../stores/deviceStore"


function Navigation(props) {
  const isMobile = useDeviceStore((state) => state.isMobile)
  const navItems = [
    { id: 1, to: "/#main", text: "Home" },
    { id: 2, to: "/about#main", text: "About" },
    { id: 3, to: "/blog#main", text: "Blog" },
    { id: 4, to: "#footer", text: "Contact" }
    // { id: 5, to: "/pricing", text: "Pricing" }
    // { id: 6, to: "/sign-in", text: "Sign In" }
  ];

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