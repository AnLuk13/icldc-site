"use client";

import { useState } from "react";
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

function getMimeType(url: string): string {
  const ext = url.split("?")[0].split(".").pop()?.toLowerCase() ?? "";
  const map: Record<string, string> = {
    pdf: "application/pdf",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    gif: "image/gif",
    webp: "image/webp",
    svg: "image/svg+xml",
    doc: "application/msword",
    docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  };
  return map[ext] ?? "application/octet-stream";
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

function getFileName(url: string, index: number): string {
  try {
    // Firebase Storage URL: .../o/{encoded_path}?alt=media&token=...
    const match = url.match(/\/o\/(.+?)(\?|$)/);
    if (match) {
      const path = decodeURIComponent(match[1]);
      return path.split("/").pop() ?? `document-${index + 1}`;
    }
    const pathname = new URL(url).pathname;
    const last = pathname.split("/").pop();
    if (last) return decodeURIComponent(last);
  } catch {}
  return `document-${index + 1}`;
}

function triggerDownload(url: string, name: string) {
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.target = "_blank";
  a.rel = "noopener noreferrer";
  a.click();
}

// ─── DocViewer ────────────────────────────────────────────────────────────────

interface DocViewerProps {
  docs: string[];
  initialIndex: number;
  itemName: string;
  onClose: () => void;
}

function DocViewer({ docs, initialIndex, itemName, onClose }: DocViewerProps) {
  const [index, setIndex] = useState(initialIndex);

  const url = docs[index];
  const mime = getMimeType(url);
  const kind = getDocKind(mime);
  const ext = mimeToExt(mime);
  const fileName =
    docs.length > 1
      ? `${itemName} (${index + 1} of ${docs.length}).${ext}`
      : `${itemName}.${ext}`;

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
        onClick={() => triggerDownload(url, fileName)}
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
        {kind === "image" && (
          <img src={url} alt={fileName} className={styles.viewerImage} />
        )}
        {kind === "pdf" && (
          <iframe src={url} title={fileName} className={styles.viewerPdf} />
        )}
        {kind === "other" && (
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
  onViewDoc: (docs: string[], index: number, itemName: string) => void;
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
          {item.createdAt && (
            <span>
              {t("publishedAt")}:{" "}
              <strong>{format(item.createdAt, "dd MMM yyyy")}</strong>
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
                const name = getFileName(doc, i);
                return (
                  <div key={i} className={styles.documentItem}>
                    <button
                      className={styles.docPreview}
                      onClick={() =>
                        onViewDoc(
                          item.documents!,
                          i,
                          resolveText(item.name, locale),
                        )
                      }
                      aria-label={`View ${resolveText(item.name, locale)}`}
                    >
                      {kind === "image" ? (
                        <img src={doc} alt={name} className={styles.docThumb} />
                      ) : kind === "pdf" ? (
                        <FileText size={32} />
                      ) : (
                        <FileIcon size={32} />
                      )}
                    </button>
                    <span className={styles.docName}>
                      {resolveText(item.name, locale)}
                      {item.documents!.length > 1 ? ` (${i + 1})` : ""}.
                      {mimeToExt(mime)}
                    </span>
                    <div className={styles.docActions}>
                      <button
                        className={styles.viewBtn}
                        onClick={() =>
                          onViewDoc(
                            item.documents!,
                            i,
                            resolveText(item.name, locale),
                          )
                        }
                      >
                        {t("view")}
                      </button>
                      <button
                        className={styles.downloadDocBtn}
                        onClick={() =>
                          triggerDownload(
                            doc,
                            `${resolveText(item.name, locale)}${item.documents!.length > 1 ? ` (${i + 1})` : ""}.${mimeToExt(getMimeType(doc))}`,
                          )
                        }
                        aria-label={`Download ${resolveText(item.name, locale)}`}
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

// ─── NewsList ─────────────────────────────────────────────────────────────────

interface NewsListProps {
  news: News[];
}

export default function NewsList({ news }: NewsListProps) {
  const t = useTranslations("news");
  const locale = useLocale() as Language;
  const [selectedNews, setSelectedNews] = useState<News | null>(null);
  const [docViewer, setDocViewer] = useState<{
    docs: string[];
    index: number;
    itemName: string;
  } | null>(null);

  if (news.length === 0) {
    return <p className={styles.noNews}>{t("noNews")}</p>;
  }

  console.log(news[0].documents);

  return (
    <>
      <div className={styles.newsGrid}>
        {news.map((item) => (
          <article
            key={item.id}
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
                <span className={styles.categoryBadge}>{item.category}</span>
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
                {item.createdAt && (
                  <span>{format(item.createdAt, "dd MMM yyyy")}</span>
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
                <button className={styles.readMoreBtn}>{t("readMore")}</button>
              </div>
            </div>
          </article>
        ))}
      </div>

      {selectedNews && (
        <NewsDetailDialog
          item={selectedNews}
          locale={locale}
          onClose={() => setSelectedNews(null)}
          onViewDoc={(docs, index, itemName) =>
            setDocViewer({ docs, index, itemName })
          }
        />
      )}

      {docViewer && (
        <DocViewer
          docs={docViewer.docs}
          initialIndex={docViewer.index}
          itemName={docViewer.itemName}
          onClose={() => setDocViewer(null)}
        />
      )}
    </>
  );
}
