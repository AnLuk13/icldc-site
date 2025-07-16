"use client"

import { useTranslations } from "next-intl"
import styles from "./page.module.scss"

export default function AboutPage() {
  const t = useTranslations("about")

  return (
    <div className={styles.about}>
      <section className="section">
        <div className="container">
          <div className={styles.header}>
            <h1 className={styles.title}>{t("title")}</h1>
            <p className={styles.description}>{t("description")}</p>
          </div>

          <div className={styles.content}>
            <div className={styles.card}>
              <h2 className="accent-text">{t("mission")}</h2>
              <p>{t("missionText")}</p>
            </div>

            <div className={styles.card}>
              <h2 className="accent-text">{t("vision")}</h2>
              <p>{t("visionText")}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
