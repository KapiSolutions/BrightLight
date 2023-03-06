import React from "react";
import MobileMenu from "./MobileMenu";
import DesktopMenu from "./DesktopMenu";
import { useDeviceStore } from "../../../../stores/deviceStore"

function Navigation(props) {
  const locale = props.locale;
  const isMobile = useDeviceStore((state) => state.isMobile)
  const navItems = [
    { id: 1, to: "/#main", text: locale === "en" ? "Home": "Strona główna"},
    { id: 2, to: "/about#main", text: locale === "en" ? "About": "O mnie" },
    { id: 3, to: "/blog#main", text: "Blog" },
    { id: 4, to: "#footer", text: locale === "en" ? "Contact": "Kontakt" }
  ];

  return (
    <>
      {isMobile ? 
      <MobileMenu locale={locale} navItems={navItems} theme={props.theme} /> 
      : 
      <DesktopMenu locale={locale} navItems={navItems} theme={props.theme}/>
      }
    </>
  )
}

export default Navigation