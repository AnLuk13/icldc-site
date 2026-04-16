"use client";

import React from "react";
import { Linkedin } from "lucide-react";
import styles from "./Footer.module.scss";

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.footerContent}>
          <div className={styles.brand}>
            <img
              src="/logo.svg"
              alt="ICLDC Logo"
              className={styles.brandLogo}
            />
            <div className={styles.brandText}>
              <span className={styles.brandName}>ICLDC</span>
              <span className={styles.brandSub}>
                Institutul de Creație Legislativă și Drept Comparat
              </span>
            </div>
          </div>

          <div className={styles.footerRight}>
            <div className={styles.footerText}>
              <span>Developed by</span>
              <a
                href="https://www.linkedin.com/in/antonio-lupu/"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.developerLink}
              >
                <span className={styles.developerName}>Antonio Lupu</span>
                <Linkedin className={styles.linkedinIcon} size={18} />
              </a>
            </div>
            <div className={styles.copyright}>
              <span>
                &copy; {new Date().getFullYear()} ICLDC. All rights reserved.
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
