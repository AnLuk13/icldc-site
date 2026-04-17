import { getTranslations, getLocale } from "next-intl/server";
import { format } from "date-fns";
import { getEvents } from "@/lib/firebase/events";
import { resolveText } from "@/lib/i18n";
import type { Event, Language } from "@/lib/types";
import styles from "./page.module.scss";

export const revalidate = 3600;

export default async function EventsPage() {
  const [t, locale, events] = await Promise.all([
    getTranslations("events"),
    getLocale(),
    getEvents(),
  ]);

  const now = new Date();
  const upcoming = events.filter((e) => e.startDate && e.startDate >= now);
  const past = events.filter((e) => !e.startDate || e.startDate < now);

  const renderEventCard = (event: Event) => (
    <div key={event.id} className={styles.eventCard}>
      <div className={styles.eventBody}>
        <div className={styles.eventDate}>
          {event.startDate && (
            <>
              <span className={styles.day}>
                {format(event.startDate, "dd")}
              </span>
              <span className={styles.month}>
                {format(event.startDate, "MMM").toUpperCase()}
              </span>
              {event.endDate && (
                <span className={styles.endDate}>
                  {t("to")} {format(event.endDate, "dd MMM")}
                </span>
              )}
            </>
          )}
        </div>
        <div className={styles.eventContent}>
          <h3>{resolveText(event.name, locale as Language)}</h3>
          {event.description && (
            <p>{resolveText(event.description, locale as Language)}</p>
          )}
          <div className={styles.eventMeta}>
            {event.location && (
              <span className={styles.metaItem}>📍 {event.location}</span>
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
          <img
            src={event.bannerImage}
            alt={resolveText(event.name, locale as Language)}
          />
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
        </div>
      </section>
    </div>
  );
}
