"use client";

import { useTranslations } from "next-intl";
import ProjectsChart from "@/components/ProjectsChart/ProjectsChart";
import VideoBackground from "@/components/VideoBackground/VideoBackground";
import styles from "./page.module.scss";

export default function HomePage() {
  const t = useTranslations("home");

  const features = [
    { title: t("feature1Title"), desc: t("feature1Desc") },
    { title: t("feature2Title"), desc: t("feature2Desc") },
    { title: t("feature3Title"), desc: t("feature3Desc") },
  ];

  return (
    <div className={styles.home}>
      <section className={styles.hero}>
        <VideoBackground src="/videoplayback.mp4" className={styles.videoHero}>
          <div className="container">
            <div className={styles.heroContent}>
              <img src="/logo.svg" alt="ICLDC" className={styles.heroLogo} />
              <h1 className={styles.title}>{t("title")}</h1>
              <p className={styles.subtitle}>{t("subtitle")}</p>
              <p className={styles.description}>{t("description")}</p>
            </div>
          </div>
        </VideoBackground>
      </section>

      <section className="section">
        <div className="container">
          <div className={styles.features}>
            {features.map((feature, index) => (
              <div key={index} className={styles.feature}>
                <h3>{feature.title}</h3>
                <p>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* <ProjectsChart /> */}
    </div>
  );
}
