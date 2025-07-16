"use client"

import { useTranslations } from "next-intl"
import styles from "./page.module.scss"

export default function PartnersPage() {
  const t = useTranslations("partners")

  return (
    <div className={styles.partners}>
      <section className="section">
        <div className="container">
          <div className={styles.header}>
            <h1 className={styles.title}>{t("title")}</h1>
            <p className={styles.description}>{t("description")}</p>
          </div>

          <div className={styles.partnerSections}>
            <div className={styles.section}>
              <h2 className="accent-text">{t("academic")}</h2>
              <div className={styles.partnerGrid}>
                <div className={styles.partnerCard}>
                  <div className={styles.partnerLogo}>
                    <img src="/placeholder.svg?height=80&width=80" alt="Partner Logo" />
                  </div>
                  <h3>Universitatea de Stat din Moldova</h3>
                  <p>Colaborare în domeniul cercetării culturale și educației.</p>
                </div>
                <div className={styles.partnerCard}>
                  <div className={styles.partnerLogo}>
                    <img src="/placeholder.svg?height=80&width=80" alt="Partner Logo" />
                  </div>
                  <h3>Academia de Științe a Moldovei</h3>
                  <p>Parteneriat strategic pentru proiecte de cercetare avansată.</p>
                </div>
              </div>
            </div>

            <div className={styles.section}>
              <h2 className="accent-text">{t("institutional")}</h2>
              <div className={styles.partnerGrid}>
                <div className={styles.partnerCard}>
                  <div className={styles.partnerLogo}>
                    <img src="/placeholder.svg?height=80&width=80" alt="Partner Logo" />
                  </div>
                  <h3>Ministerul Culturii</h3>
                  <p>Suport instituțional pentru inițiativele culturale naționale.</p>
                </div>
                <div className={styles.partnerCard}>
                  <div className={styles.partnerLogo}>
                    <img src="/placeholder.svg?height=80&width=80" alt="Partner Logo" />
                  </div>
                  <h3>UNESCO Moldova</h3>
                  <p>Colaborare pentru protejarea patrimoniului cultural.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
