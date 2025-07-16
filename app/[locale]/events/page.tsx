"use client"

import { useTranslations } from "next-intl"
import styles from "./page.module.scss"

export default function EventsPage() {
  const t = useTranslations("events")

  return (
    <div className={styles.events}>
      <section className="section">
        <div className="container">
          <div className={styles.header}>
            <h1 className={styles.title}>{t("title")}</h1>
            <p className={styles.description}>{t("description")}</p>
          </div>

          <div className={styles.eventSections}>
            <div className={styles.section}>
              <h2 className="accent-text">{t("upcoming")}</h2>
              <div className={styles.eventList}>
                <div className={styles.eventCard}>
                  <div className={styles.eventDate}>
                    <span className={styles.day}>15</span>
                    <span className={styles.month}>MAR</span>
                  </div>
                  <div className={styles.eventContent}>
                    <h3>Conferința Anuală de Cercetare Culturală</h3>
                    <p>O întâlnire a cercetătorilor și specialiștilor în domeniul cultural.</p>
                    <span className={styles.eventLocation}>Chișinău, Moldova</span>
                  </div>
                </div>

                <div className={styles.eventCard}>
                  <div className={styles.eventDate}>
                    <span className={styles.day}>22</span>
                    <span className={styles.month}>APR</span>
                  </div>
                  <div className={styles.eventContent}>
                    <h3>Workshop: Digitizarea Patrimoniului</h3>
                    <p>Sesiune practică despre metodele moderne de digitizare.</p>
                    <span className={styles.eventLocation}>Online</span>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.section}>
              <h2 className="accent-text">{t("past")}</h2>
              <div className={styles.eventList}>
                <div className={styles.eventCard}>
                  <div className={styles.eventDate}>
                    <span className={styles.day}>10</span>
                    <span className={styles.month}>FEB</span>
                  </div>
                  <div className={styles.eventContent}>
                    <h3>Simpozion: Tradițiile Culturale Contemporane</h3>
                    <p>Discuții despre rolul tradițiilor în societatea modernă.</p>
                    <span className={styles.eventLocation}>Chișinău, Moldova</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
