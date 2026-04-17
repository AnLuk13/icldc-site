import { getTranslations } from "next-intl/server";
import { getNews } from "@/lib/firebase/news";
import NewsList from "./NewsList";
import styles from "./page.module.scss";

export const revalidate = 3600;

export default async function NewsPage() {
  const [t, news] = await Promise.all([getTranslations("news"), getNews()]);

  return (
    <div className={styles.news}>
      <section className="section">
        <div className="container">
          <div className={styles.header}>
            <h1 className={styles.title}>{t("title")}</h1>
            <p className={styles.description}>{t("description")}</p>
          </div>

          <NewsList news={news} />
        </div>
      </section>
    </div>
  );
}
