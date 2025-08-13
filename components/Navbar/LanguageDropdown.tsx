"use client";

import React, { useState, useRef, useEffect } from "react";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/app/lib/routing";
import { ChevronDown } from "lucide-react";
import styles from "./LanguageDropdown.module.scss";

const LanguageDropdown = () => {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const languages = [
    { code: "ro", name: "RO", fullName: "Română" },
    { code: "ru", name: "RU", fullName: "Русский" },
    { code: "en", name: "EN", fullName: "English" },
  ];

  const currentLanguage =
    languages.find((lang) => lang.code === locale) || languages[0];

  const handleLanguageChange = (newLocale: string) => {
    const currentPath = pathname;
    router.replace(currentPath, { locale: newLocale });
    setIsOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Close dropdown on escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  return (
    <div className={styles.languageDropdown} ref={dropdownRef}>
      <button
        className={`${styles.dropdownTrigger} ${isOpen ? styles.open : ""}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label="Select language"
      >
        <span className={styles.currentLang}>{currentLanguage.name}</span>
        <ChevronDown
          className={`${styles.chevron} ${isOpen ? styles.rotated : ""}`}
          size={16}
        />
      </button>

      {isOpen && (
        <div className={styles.dropdownMenu} role="listbox">
          {languages.map((lang) => (
            <button
              key={lang.code}
              className={`${styles.dropdownItem} ${
                locale === lang.code ? styles.active : ""
              }`}
              onClick={() => handleLanguageChange(lang.code)}
              role="option"
              aria-selected={locale === lang.code}
            >
              <span className={styles.langCode}>{lang.name}</span>
              <span className={styles.langName}>{lang.fullName}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageDropdown;
