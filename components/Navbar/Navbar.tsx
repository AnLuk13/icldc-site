"use client";

import { useTranslations, useLocale } from "next-intl";
import { Link, usePathname, useRouter } from "@/app/lib/routing";
import { useState } from "react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import BurgerMenu from "./BurgerMenu";
import LanguageDropdown from "./LanguageDropdown";
import styles from "./Navbar.module.scss";

const Navbar = () => {
  const t = useTranslations("navigation");
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigation = [
    { name: t("home"), href: "/" },
    { name: t("about"), href: "/about" },
    { name: t("projects"), href: "/projects" },
    { name: t("partners"), href: "/partners" },
    { name: t("events"), href: "/events" },
    { name: t("contact"), href: "/contact" },
  ];

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <Link href="/" className={styles.brand}>
          <div className={styles.logo}>
            <img
              src="https://picsum.photos/200/300"
              alt="ICLDC Logo"
              className={styles.logo}
            />
          </div>
          <span>ICLDC</span>
        </Link>

        <div className={styles.nav}>
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`${styles.navLink} ${
                isActive(item.href) ? styles.active : ""
              }`}
            >
              {item.name}
            </Link>
          ))}
        </div>

        <div className={styles.actions}>
          <LanguageDropdown />

          <ThemeToggle />

          <BurgerMenu
            isOpen={isMobileMenuOpen}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          />
        </div>

        {isMobileMenuOpen && (
          <div className={styles.mobileMenu}>
            <div className={styles.mobileNav}>
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={styles.mobileNavLink}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
