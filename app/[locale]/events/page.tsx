"use client";

import { useEffect, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { format } from "date-fns";
import type { Event, Language } from "@/lib/types";
import { resolveText } from "@/lib/i18n";
import styles from "./page.module.scss";

export default function EventsPage() {
  const t = useTranslations("events");
  const locale = useLocale() as Language;
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/events")
      .then((r) => r.json())
      .then(setEvents)
      .finally(() => setLoading(false));
  }, []);

  const now = new Date();
  const upcoming = events.filter(
    (e) => e.startDate && new Date(e.startDate) >= now,
  );
  const past = events.filter(
    (e) => !e.startDate || new Date(e.startDate) < now,
  );

  const renderEventCard = (event: Event) => (
    <div key={event._id} className={styles.eventCard}>
      <div className={styles.eventBody}>
        <div className={styles.eventDate}>
          {event.startDate && (
            <>
              <span className={styles.day}>
                {format(new Date(event.startDate), "dd")}
              </span>
              <span className={styles.month}>
                {format(new Date(event.startDate), "MMM").toUpperCase()}
              </span>
              {event.endDate && (
                <span className={styles.endDate}>
                  {t("to")} {format(new Date(event.endDate), "dd MMM")}
                </span>
              )}
            </>
          )}
        </div>
        <div className={styles.eventContent}>
          <h3>{resolveText(event.name, locale)}</h3>
          {event.description && (
            <p>{resolveText(event.description, locale)}</p>
          )}
          <div className={styles.eventMeta}>
            {event.location && (
              <span className={styles.metaItem}>
                📍 {event.location}
              </span>
            )}
            {event.organizer && (
              <span className={styles.metaItem}>
                🏛 {t("organizer")}: {event.organizer}
              </span>
            )}
          </div>
          {event.tags && event.tags.length > 0 && (
            <div className={styles.eventTags}>
              {event.tags.map((tag) => (
                <span key={tag} className={styles.tag}>
                  {tag}
                </span>
              ))}
            </div>
          )}
          {event.registrationLink && (
            <a
              href={event.registrationLink}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.registerLink}
            >
              {t("register")}
            </a>
          )}
        </div>
      </div>
      {event.bannerImage && (
        <div className={styles.eventBanner}>
          <img src={event.bannerImage} alt={resolveText(event.name, locale)} />
        </div>
      )}
    </div>
  );

  return (
    <div className={styles.events}>
      <section className="section">
        <div className="container">
          <div className={styles.header}>
            <h1 className={styles.title}>{t("title")}</h1>
            <p className={styles.description}>{t("description")}</p>
          </div>

          {loading ? (
            <p className={styles.loading}>{t("loading")}</p>
          ) : (
            <div className={styles.eventSections}>
              <div className={styles.section}>
                <h2 className="accent-text">{t("upcoming")}</h2>
                {upcoming.length === 0 ? (
                  <p className={styles.noEvents}>{t("noUpcoming")}</p>
                ) : (
                  <div className={styles.eventList}>
                    {upcoming.map(renderEventCard)}
                  </div>
                )}
              </div>

              <div className={styles.section}>
                <h2 className="accent-text">{t("past")}</h2>
                {past.length === 0 ? (
                  <p className={styles.noEvents}>{t("noPast")}</p>
                ) : (
                  <div className={styles.eventList}>
                    {past.map(renderEventCard)}
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
