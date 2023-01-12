import React from "react";
import useLocalStorageState from "use-local-storage-state";
import { GiEvilMoon, GiUbisoftSun } from "react-icons/gi";
// Dark Theme: GiNightSky GiNightSleep GiEvilMoon
import styles from "../styles/components/ChangeThemeButton.module.scss";

function ChangeThemeButton(props) {
  const [theme, setTheme] = useLocalStorageState("theme", {
    ssr: true,
    defaultValue: "light",
  });
  const switchTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
  };
  return (
    <div style={{ cursor: "pointer" }} title="Change theme" className="color-primary">
      {theme == "light" ? (
        <div onClick={switchTheme}>
          <GiEvilMoon className={`${styles.themeIcon} ${styles.hover}`} />
          {props.text ? <span>Dark theme</span> : <span></span>}
        </div>
      ) : (
        <div onClick={switchTheme}>
          <GiUbisoftSun className={`${styles.themeIcon} ${styles.hover}`} />
          {props.text ? <span>Light theme</span> : <span></span>}
        </div>
      )}
    </div>
  );
}

export default ChangeThemeButton;
