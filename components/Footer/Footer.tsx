"use client";

import React from "react";
import { Linkedin } from "lucide-react";
import styles from "./Footer.module.scss";

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.footerContent}>
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

          <div className={styles.footerDivider} />

          <div className={styles.copyright}>
            <span>
              &copy; {new Date().getFullYear()} ICLDC. All rights reserved.
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
