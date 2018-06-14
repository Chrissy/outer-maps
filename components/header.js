import React from "react";
import cx from "classnames";
import styles from "../styles/header.css";
import center from "../styles/center.css";
import Wordmark from "../svg/wordmark.svg";

const Header = () => {
  return (
    <div className={cx(styles.body, center.flex)}>
      <img className={styles.mark} src="/mark.png" />
      <Wordmark className={styles.wordmark} />
    </div>
  );
};

export default Header;
