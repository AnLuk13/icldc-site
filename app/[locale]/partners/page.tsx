import { getTranslations, getLocale } from "next-intl/server";
import { getPartners } from "@/lib/firebase/partners";
import { resolveText } from "@/lib/i18n";
import type { Language, Partner } from "@/lib/types";
import styles from "./page.module.scss";

export const revalidate = 3600;

export default async function PartnersPage() {
  const [t, locale, partners] = await Promise.all([
    getTranslations("partners"),
    getLocale(),
    getPartners(),
  ]);

  return (
    <div className={styles.partners}>
      <section className="section">
        <div className="container">
          <div className={styles.header}>
            <h1 className={styles.title}>{t("title")}</h1>
            <p className={styles.description}>{t("description")}</p>
          </div>

          {partners.length === 0 ? (
            <p className={styles.noPartners}>{t("noPartners")}</p>
          ) : (
            <div className={styles.partnerGrid}>
              {partners.map((partner) => (
                <div key={partner.id} className={styles.partnerCard}>
                  <div className={styles.partnerCardHeader}>
                    {partner.logo ? (
                      <div className={styles.partnerLogo}>
                        <img
                          className={styles.partnerLogo}
                          src={partner.logo}
                          alt={resolveText(partner.name, locale as Language)}
                        />
                      </div>
                    ) : (
                      <div className={styles.partnerLogoPlaceholder}>🤝</div>
                    )}
                    <div className={styles.partnerCardMeta}>
                      <h3>{resolveText(partner.name, locale as Language)}</h3>
                      {partner.website && (
                        <a
                          href={partner.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={styles.partnerLink}
                        >
                          ↗ {partner.website.replace(/^https?:\/\//, "")}
                        </a>
                      )}
                    </div>
                  </div>
                  <div className={styles.partnerCardBody}>
                    {partner.description && (
                      <p>
                        {resolveText(partner.description, locale as Language)}
                      </p>
                    )}
                    {partner.projects && partner.projects.length > 0 && (
                      <div className={styles.projectsList}>
                        <span className={styles.projectsLabel}>
                          {t("projectsLabel")}
                        </span>
                        <div className={styles.projectChips}>
                          {partner.projects.map((project) => (
                            <span
                              key={project.id}
                              className={
                                project.status === "completed"
                                  ? styles.projectChipCompleted
                                  : project.status === "planned"
                                    ? styles.projectChipPlanned
                                    : styles.projectChip
                              }
                            >
                              {resolveText(project.name, locale as Language)}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
