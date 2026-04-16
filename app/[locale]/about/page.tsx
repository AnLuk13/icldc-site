"use client";

import { useTranslations } from "next-intl";
import styles from "./page.module.scss";

export default function AboutPage() {
  const t = useTranslations("about");

  const principles = t.raw("principles") as string[];
  const goals = t.raw("goals") as string[];
  const activities = t.raw("activities") as string[];

  return (
    <div className={styles.about}>
      <section className="section">
        <div className="container">
          <div className={styles.header}>
            <img src="/logo.svg" alt="ICLDC" className={styles.headerLogo} />
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

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>{t("principlesTitle")}</h2>
            <ul className={styles.list}>
              {principles.map((item, i) => (
                <li key={i} className={styles.listItem}>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>{t("goalsTitle")}</h2>
            <ul className={styles.list}>
              {goals.map((item, i) => (
                <li key={i} className={styles.listItem}>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>{t("activitiesTitle")}</h2>
            <ul className={styles.list}>
              {activities.map((item, i) => (
                <li key={i} className={styles.listItem}>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
