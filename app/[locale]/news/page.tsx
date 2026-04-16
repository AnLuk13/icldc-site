"use client";

import { useEffect, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { format } from "date-fns";
import {
  FileText,
  FileIcon,
  Download,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import type { News, Language } from "@/lib/types";
import { resolveText } from "@/lib/i18n";
import Modal from "@/components/Modal/Modal";
import styles from "./page.module.scss";

// ─── helpers ─────────────────────────────────────────────────────────────────

function getMimeType(doc: string): string {
  const match = doc.match(/^data:([^;]+);/);
  return match ? match[1] : "application/octet-stream";
}

function getDocKind(mime: string): "image" | "pdf" | "other" {
  if (mime.startsWith("image/")) return "image";
  if (mime === "application/pdf") return "pdf";
  return "other";
}

function mimeToExt(mime: string): string {
  const map: Record<string, string> = {
    "application/pdf": "pdf",
    "application/msword": "doc",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
      "docx",
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/gif": "gif",
    "image/webp": "webp",
  };
  return map[mime] ?? "bin";
}

function buildBlobUrl(dataUrl: string): string {
  const [header, b64] = dataUrl.split(",");
  const mime = header.match(/^data:([^;]+)/)?.[1] ?? "application/octet-stream";
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return URL.createObjectURL(new Blob([bytes], { type: mime }));
}

function triggerDownload(doc: string, name: string) {
  const isData = doc.startsWith("data:");
  const url = isData ? buildBlobUrl(doc) : doc;
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  if (isData) setTimeout(() => URL.revokeObjectURL(url), 60_000);
}

// ─── DocViewer ────────────────────────────────────────────────────────────────

interface DocViewerProps {
  docs: string[];
  initialIndex: number;
  onClose: () => void;
}

function DocViewer({ docs, initialIndex, onClose }: DocViewerProps) {
  const [index, setIndex] = useState(initialIndex);
  const [blobUrl, setBlobUrl] = useState<string | null>(null);

  const doc = docs[index];
  const isDataUrl = doc.startsWith("data:");
  const isHttpUrl = /^https?:\/\/|^\//.test(doc);
  const mime = getMimeType(doc);
  const kind = getDocKind(mime);
  const fileName = `document-${index + 1}.${mimeToExt(mime)}`;

  useEffect(() => {
    if (kind === "pdf" && isDataUrl) {
      const url = buildBlobUrl(doc);
      setBlobUrl(url);
      return () => {
        URL.revokeObjectURL(url);
        setBlobUrl(null);
      };
    }
    setBlobUrl(null);
  }, [doc, kind, isDataUrl]);

  const pdfSrc = isDataUrl ? blobUrl : isHttpUrl ? doc : null;

  const viewerFooter = (
    <div className={styles.viewerFooter}>
      {docs.length > 1 && (
        <div className={styles.viewerNav}>
          <button
            className={styles.navBtn}
            onClick={() => setIndex((i) => Math.max(0, i - 1))}
            disabled={index === 0}
          >
            <ChevronLeft size={18} />
          </button>
          <span>
            {index + 1} / {docs.length}
          </span>
          <button
            className={styles.navBtn}
            onClick={() => setIndex((i) => Math.min(docs.length - 1, i + 1))}
            disabled={index === docs.length - 1}
          >
            <ChevronRight size={18} />
          </button>
        </div>
      )}
      <button
        className={styles.downloadBtn}
        onClick={() => triggerDownload(doc, fileName)}
      >
        <Download size={15} />
        Download
      </button>
    </div>
  );

  return (
    <Modal
      open
      onClose={onClose}
      title={fileName}
      size="xl"
      bodyFill
      footer={viewerFooter}
    >
      <div className={styles.viewerBody}>
        {kind === "image" && (isDataUrl || isHttpUrl) && (
          <img src={doc} alt={fileName} className={styles.viewerImage} />
        )}
        {kind === "pdf" && pdfSrc && (
          <iframe src={pdfSrc} title={fileName} className={styles.viewerPdf} />
        )}
        {kind === "pdf" && !pdfSrc && (
          <div className={styles.viewerFallback}>
            <FileText size={56} />
            <p>{fileName}</p>
            <p className={styles.viewerNote}>Loading PDF…</p>
          </div>
        )}
        {(kind === "other" || (!isDataUrl && !isHttpUrl)) && (
          <div className={styles.viewerFallback}>
            <FileIcon size={56} />
            <p>{fileName}</p>
            <p className={styles.viewerNote}>
              Preview not available for this file type.
            </p>
          </div>
        )}
      </div>
    </Modal>
  );
}

// ─── NewsDetailDialog ─────────────────────────────────────────────────────────

interface NewsDetailProps {
  item: News;
  locale: Language;
  onClose: () => void;
  onViewDoc: (docs: string[], index: number) => void;
}

function NewsDetailDialog({
  item,
  locale,
  onClose,
  onViewDoc,
}: NewsDetailProps) {
  const t = useTranslations("news");

  return (
    <Modal
      open
      onClose={onClose}
      title={resolveText(item.name, locale)}
      size="lg"
    >
      <div className={styles.detailScrollArea}>
        {item.bannerImage && (
          <div className={styles.detailBanner}>
            <img src={item.bannerImage} alt={resolveText(item.name, locale)} />
          </div>
        )}

        <div className={styles.detailMeta}>
          {item.author && (
            <span>
              {t("author")}: <strong>{item.author}</strong>
            </span>
          )}
          {item.category && (
            <span>
              {t("category")}: <strong>{item.category}</strong>
            </span>
          )}
          {item.publishedAt && (
            <span>
              {t("publishedAt")}:{" "}
              <strong>
                {format(new Date(item.publishedAt), "dd MMM yyyy")}
              </strong>
            </span>
          )}
        </div>

        {item.tags && item.tags.length > 0 && (
          <div className={styles.detailTags}>
            {item.tags.map((tag) => (
              <span key={tag} className={styles.tag}>
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className={styles.detailText}>
          {resolveText(item.content, locale)
            .split("\n")
            .map((para, i) =>
              para.trim() ? <p key={i}>{para}</p> : <br key={i} />,
            )}
        </div>

        {item.documents && item.documents.length > 0 && (
          <div className={styles.documentsSection}>
            <h4 className={styles.documentsSectionTitle}>
              {t("documents")} ({item.documents.length})
            </h4>
            <div className={styles.documentList}>
              {item.documents.map((doc, i) => {
                const mime = getMimeType(doc);
                const kind = getDocKind(mime);
                const name = `document-${i + 1}.${mimeToExt(mime)}`;
                return (
                  <div key={i} className={styles.documentItem}>
                    <button
                      className={styles.docPreview}
                      onClick={() => onViewDoc(item.documents!, i)}
                      aria-label={`View ${name}`}
                    >
                      {kind === "image" ? (
                        <img src={doc} alt={name} className={styles.docThumb} />
                      ) : kind === "pdf" ? (
                        <FileText size={32} />
                      ) : (
                        <FileIcon size={32} />
                      )}
                    </button>
                    <span className={styles.docName}>{name}</span>
                    <div className={styles.docActions}>
                      <button
                        className={styles.viewBtn}
                        onClick={() => onViewDoc(item.documents!, i)}
                      >
                        {t("view")}
                      </button>
                      <button
                        className={styles.downloadDocBtn}
                        onClick={() => triggerDownload(doc, name)}
                        aria-label={`Download ${name}`}
                      >
                        <Download size={14} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function NewsPage() {
  const t = useTranslations("news");
  const locale = useLocale() as Language;
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedNews, setSelectedNews] = useState<News | null>(null);
  const [docViewer, setDocViewer] = useState<{
    docs: string[];
    index: number;
  } | null>(null);

  useEffect(() => {
    fetch("/api/news")
      .then((r) => r.json())
      .then(setNews)
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <div className={styles.news}>
        <section className="section">
          <div className="container">
            <div className={styles.header}>
              <h1 className={styles.title}>{t("title")}</h1>
              <p className={styles.description}>{t("description")}</p>
            </div>

            {loading ? (
              <p className={styles.loading}>{t("loading")}</p>
            ) : news.length === 0 ? (
              <p className={styles.noNews}>{t("noNews")}</p>
            ) : (
              <div className={styles.newsGrid}>
                {news.map((item) => (
                  <article
                    key={item._id}
                    className={styles.newsCard}
                    onClick={() => setSelectedNews(item)}
                  >
                    {item.bannerImage && (
                      <div className={styles.newsBanner}>
                        <img
                          src={item.bannerImage}
                          alt={resolveText(item.name, locale)}
                        />
                      </div>
                    )}
                    <div className={styles.newsBody}>
                      {item.category && (
                        <span className={styles.categoryBadge}>
                          {item.category}
                        </span>
                      )}
                      <h3>{resolveText(item.name, locale)}</h3>
                      {item.summary ? (
                        <p className={styles.newsSummary}>
                          {resolveText(item.summary, locale)}
                        </p>
                      ) : item.content ? (
                        <p className={styles.newsSummary}>
                          {resolveText(item.content, locale).slice(0, 160)}…
                        </p>
                      ) : null}
                      <div className={styles.newsMeta}>
                        {item.author && <span>{item.author}</span>}
                        {item.publishedAt && (
                          <span>
                            {format(new Date(item.publishedAt), "dd MMM yyyy")}
                          </span>
                        )}
                      </div>
                      {item.tags && item.tags.length > 0 && (
                        <div className={styles.newsTags}>
                          {item.tags.map((tag) => (
                            <span key={tag} className={styles.tag}>
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                      <div className={styles.cardFooter}>
                        {item.documents && item.documents.length > 0 && (
                          <span className={styles.docsBadge}>
                            <FileText size={13} />
                            {item.documents.length} {t("documentsCount")}
                          </span>
                        )}
                        <button className={styles.readMoreBtn}>
                          {t("readMore")}
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>

      {selectedNews && (
        <NewsDetailDialog
          item={selectedNews}
          locale={locale}
          onClose={() => setSelectedNews(null)}
          onViewDoc={(docs, index) => setDocViewer({ docs, index })}
        />
      )}

      {docViewer && (
        <DocViewer
          docs={docViewer.docs}
          initialIndex={docViewer.index}
          onClose={() => setDocViewer(null)}
        />
      )}
    </>
  );
}
