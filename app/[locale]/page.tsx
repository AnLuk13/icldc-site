"use client"

import { useTranslations } from "next-intl"
import styles from "./page.module.scss"

export default function HomePage() {
  const t = useTranslations("home")

  return (
    <div className={styles.home}>
      <section className={styles.hero}>
        <div className="container">
          <div className={styles.heroContent}>
            <h1 className={styles.title}>{t("title")}</h1>
            <p className={styles.subtitle}>{t("subtitle")}</p>
            <p className={styles.description}>{t("description")}</p>
            <button className={styles.ctaButton}>{t("learnMore")}</button>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className={styles.features}>
            <div className={styles.feature}>
              <h3>Cercetare</h3>
              <p>Proiecte de cercetare inovatoare în domeniul cultural</p>
            </div>
            <div className={styles.feature}>
              <h3>Dezvoltare</h3>
              <p>Dezvoltarea capacităților și competențelor culturale</p>
            </div>
            <div className={styles.feature}>
              <h3>Colaborare</h3>
              <p>Parteneriate strategice pentru impact maxim</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
