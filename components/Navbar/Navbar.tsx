"use client"

import { useTranslations, useLocale } from "next-intl"
import { usePathname, useRouter } from "next/navigation"
import { useState } from "react"
import Link from "next/link"
import styles from "./Navbar.module.scss"

const Navbar = () => {
  const t = useTranslations("navigation")
  const locale = useLocale()
  const pathname = usePathname()
  const router = useRouter()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const navigation = [
    { name: t("home"), href: `/${locale}` },
    { name: t("about"), href: `/${locale}/about` },
    { name: t("projects"), href: `/${locale}/projects` },
    { name: t("partners"), href: `/${locale}/partners` },
    { name: t("events"), href: `/${locale}/events` },
    { name: t("contact"), href: `/${locale}/contact` },
  ]

  const languages = [
    { code: "ro", name: "RO" },
    { code: "ru", name: "RU" },
    { code: "en", name: "EN" },
  ]

  const handleLanguageChange = (newLocale: string) => {
    const path = pathname.split("/").slice(2).join("/")
    router.push(`/${newLocale}/${path}`)
  }

  const isActive = (href: string) => {
    if (href === `/${locale}`) {
      return pathname === `/${locale}` || pathname === "/"
    }
    return pathname.startsWith(href)
  }

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <Link href={`/${locale}`} className={styles.brand}>
          <div className={styles.logo}>
            <img src="/placeholder.svg?height=40&width=40" alt="ICLDC Logo" />
          </div>
          <span>ICLDC</span>
        </Link>

        <div className={styles.nav}>
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`${styles.navLink} ${isActive(item.href) ? styles.active : ""}`}
            >
              {item.name}
            </Link>
          ))}
        </div>

        <div className={styles.actions}>
          <div className={styles.languageSwitcher}>
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLanguageChange(lang.code)}
                className={`${styles.langButton} ${locale === lang.code ? styles.active : ""}`}
              >
                {lang.name}
              </button>
            ))}
          </div>

          <button className={styles.mobileMenuButton} onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            ☰
          </button>
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
  )
}

export default Navbar
