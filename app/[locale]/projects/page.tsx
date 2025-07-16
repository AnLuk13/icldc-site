"use client"

import { useTranslations } from "next-intl"
import styles from "./page.module.scss"

export default function ProjectsPage() {
  const t = useTranslations("projects")

  return (
    <div className={styles.projects}>
      <section className="section">
        <div className="container">
          <div className={styles.header}>
            <h1 className={styles.title}>{t("title")}</h1>
            <p className={styles.description}>{t("description")}</p>
          </div>

          <div className={styles.projectSections}>
            <div className={styles.section}>
              <h2 className="accent-text">{t("currentProjects")}</h2>
              <div className={styles.projectGrid}>
                <div className={styles.projectCard}>
                  <h3>Proiect Cultural Digital</h3>
                  <p>Digitizarea patrimoniului cultural moldovenesc pentru generațiile viitoare.</p>
                  <span className={styles.status}>În desfășurare</span>
                </div>
                <div className={styles.projectCard}>
                  <h3>Cercetare Etnografică</h3>
                  <p>Studiul tradițiilor și obiceiurilor populare din regiunea noastră.</p>
                  <span className={styles.status}>În desfășurare</span>
                </div>
              </div>
            </div>

            <div className={styles.section}>
              <h2 className="accent-text">{t("completedProjects")}</h2>
              <div className={styles.projectGrid}>
                <div className={styles.projectCard}>
                  <h3>Atlas Cultural Regional</h3>
                  <p>Cartografierea siturilor culturale de importanță regională.</p>
                  <span className={styles.statusCompleted}>Finalizat</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
