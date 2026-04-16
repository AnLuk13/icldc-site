import type { MultilingualText, Language } from "@/lib/types";

/**
 * Resolves a multilingual field to a plain string for the given locale.
 * Falls back through ro → en if the requested locale is missing.
 */
export function resolveText(
  value: MultilingualText | string | undefined,
  locale: Language,
  fallback = "",
): string {
  if (!value) return fallback;
  if (typeof value === "string") return value;
  return value[locale] || value.ro || value.en || fallback;
}
