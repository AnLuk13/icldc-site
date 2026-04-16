"use client";

import { useEffect, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import type { Partner, Language } from "@/lib/types";
import { resolveText } from "@/lib/i18n";
import styles from "./page.module.scss";

export default function PartnersPage() {
  const t = useTranslations("partners");
  const locale = useLocale() as Language;
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/partners")
      .then((r) => r.json())
      .then(setPartners)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className={styles.partners}>
      <section className="section">
        <div className="container">
          <div className={styles.header}>
            <h1 className={styles.title}>{t("title")}</h1>
            <p className={styles.description}>{t("description")}</p>
          </div>

          {loading ? (
            <p className={styles.loading}>{t("loading")}</p>
          ) : partners.length === 0 ? (
            <p className={styles.noPartners}>{t("noPartners")}</p>
          ) : (
            <div className={styles.partnerGrid}>
              {partners.map((partner) => (
                <div key={partner._id} className={styles.partnerCard}>
                  <div className={styles.partnerLogo}>
                    {partner.logo ? (
                      <img
                        src={partner.logo}
                        alt={resolveText(partner.name, locale)}
                      />
                    ) : (
                      <img
                        src="/placeholder.svg?height=80&width=80"
                        alt={resolveText(partner.name, locale)}
                      />
                    )}
                  </div>
                  <h3>{resolveText(partner.name, locale)}</h3>
                  {partner.description && (
                    <p>{resolveText(partner.description, locale)}</p>
                  )}
                  {partner.projects && partner.projects.length > 0 && (
                    <span className={styles.projectsBadge}>
                      {partner.projects.length} {t("projectsCount")}
                    </span>
                  )}
                  {partner.website && (
                    <a
                      href={partner.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.partnerLink}
                    >
                      {partner.website.replace(/^https?:\/\//, "")}
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
