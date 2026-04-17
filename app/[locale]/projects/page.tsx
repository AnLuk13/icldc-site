import { getTranslations, getLocale } from "next-intl/server";
import { format } from "date-fns";
import { getProjects } from "@/lib/firebase/projects";
import { resolveText } from "@/lib/i18n";
import type { Project, Language } from "@/lib/types";
import styles from "./page.module.scss";

export const revalidate = 3600;

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; partner?: string }>;
}) {
  const { status, partner } = await searchParams;

  const [t, locale, projects] = await Promise.all([
    getTranslations("projects"),
    getLocale(),
    getProjects({
      status: status as Project["status"] | undefined,
      partnerId: partner,
    }),
  ]);

  const current = status
    ? projects
    : projects.filter((p) => p.status === "ongoing" || p.status === "planned");
  const completed = status
    ? []
    : projects.filter((p) => p.status === "completed");

  const renderProjectCard = (project: Project) => (
    <div key={project.id} className={styles.projectCard}>
      <div className={styles.cardTop}>
        <h3>{resolveText(project.name, locale as Language)}</h3>
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

      <p>{resolveText(project.description, locale as Language)}</p>

      {(project.startDate || project.endDate) && (
        <div className={styles.projectDates}>
          {project.startDate && (
            <span>
              {t("startDate")}: {format(project.startDate, "MMM yyyy")}
            </span>
          )}
          {project.endDate && (
            <span>
              {t("endDate")}: {format(project.endDate, "MMM yyyy")}
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
        <div className={styles.partnersList}>
          {project.partners.map((partner) => (
            <div className={styles.partnerChips} key={partner.id}>
              {partner.logo ? (
                <img
                  src={partner.logo}
                  alt={resolveText(partner.name, locale as Language)}
                  className={styles.partnerChipLogo}
                />
              ) : null}
              <div key={partner.id} className={styles.partnerChip}>
                <span>{resolveText(partner.name, locale as Language)}</span>
                {partner.website && (
                  <a
                    href={partner.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.partnerChipLink}
                    title={partner.website}
                  >
                    ↗
                  </a>
                )}
              </div>
            </div>
          ))}
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

          {status ? (
            <div className={styles.projectGrid}>
              {projects.length === 0 ? (
                <p className={styles.noProjects}>{t("noCurrentProjects")}</p>
              ) : (
                projects.map(renderProjectCard)
              )}
            </div>
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
