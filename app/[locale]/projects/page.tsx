"use client";

import { useEffect, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { format } from "date-fns";
import type { Project, Language } from "@/lib/types";
import { resolveText } from "@/lib/i18n";
import styles from "./page.module.scss";

export default function ProjectsPage() {
  const t = useTranslations("projects");
  const locale = useLocale() as Language;
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/projects")
      .then((r) => r.json())
      .then(setProjects)
      .finally(() => setLoading(false));
  }, []);

  const current = projects.filter(
    (p) => p.status === "ongoing" || p.status === "planned",
  );
  const completed = projects.filter((p) => p.status === "completed");

  const renderProjectCard = (project: Project) => (
    <div key={project._id} className={styles.projectCard}>
      <div className={styles.cardTop}>
        <h3>{resolveText(project.name, locale)}</h3>
        <span
          className={
            project.status === "completed"
              ? styles.statusCompleted
              : project.status === "planned"
                ? styles.statusPlanned
                : styles.status
          }
        >
          {project.status === "completed"
            ? t("statusCompleted")
            : project.status === "planned"
              ? t("statusPlanned")
              : t("statusActive")}
        </span>
      </div>

      <p>{resolveText(project.description, locale)}</p>

      {(project.startDate || project.endDate) && (
        <div className={styles.projectDates}>
          {project.startDate && (
            <span>
              {t("startDate")}:{" "}
              {format(new Date(project.startDate), "MMM yyyy")}
            </span>
          )}
          {project.endDate && (
            <span>
              {t("endDate")}: {format(new Date(project.endDate), "MMM yyyy")}
            </span>
          )}
        </div>
      )}

      {project.tags && project.tags.length > 0 && (
        <div className={styles.projectTags}>
          {project.tags.map((tag) => (
            <span key={tag} className={styles.tag}>
              {tag}
            </span>
          ))}
        </div>
      )}

      {project.partners && project.partners.length > 0 && (
        <div className={styles.projectMeta}>
          🤝 {project.partners.length}{" "}
          {t("partners", { count: project.partners.length })}
        </div>
      )}

      {project.documents && project.documents.length > 0 && (
        <div className={styles.projectMeta}>
          📄 {project.documents.length} document
          {project.documents.length !== 1 ? "s" : ""}
        </div>
      )}
    </div>
  );

  return (
    <div className={styles.projects}>
      <section className="section">
        <div className="container">
          <div className={styles.header}>
            <h1 className={styles.title}>{t("title")}</h1>
            <p className={styles.description}>{t("description")}</p>
          </div>

          {loading ? (
            <p className={styles.loading}>{t("loading")}</p>
          ) : (
            <div className={styles.projectSections}>
              <div className={styles.section}>
                <h2 className="accent-text">{t("currentProjects")}</h2>
                {current.length === 0 ? (
                  <p className={styles.noProjects}>{t("noCurrentProjects")}</p>
                ) : (
                  <div className={styles.projectGrid}>
                    {current.map(renderProjectCard)}
                  </div>
                )}
              </div>

              <div className={styles.section}>
                <h2 className="accent-text">{t("completedProjects")}</h2>
                {completed.length === 0 ? (
                  <p className={styles.noProjects}>
                    {t("noCompletedProjects")}
                  </p>
                ) : (
                  <div className={styles.projectGrid}>
                    {completed.map(renderProjectCard)}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
