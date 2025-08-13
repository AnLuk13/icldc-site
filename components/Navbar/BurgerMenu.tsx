"use client";

import React from "react";
import styles from "./BurgerMenu.module.scss";

interface BurgerMenuProps {
  isOpen: boolean;
  onClick: () => void;
}

function BurgerMenu({ isOpen, onClick }: BurgerMenuProps) {
  return (
    <button
      className={`${styles.mobileMenuIcon} ${isOpen ? styles.active : ""}`}
      onClick={onClick}
      aria-label={isOpen ? "Close menu" : "Open menu"}
      aria-expanded={isOpen}
    >
      <div className={styles.firstBar} />
      <div className={styles.secondBar} />
      <div className={styles.thirdBar} />
    </button>
  );
}

export default BurgerMenu;
