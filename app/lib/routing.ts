import { defineRouting } from "next-intl/routing";
import { createNavigation } from "next-intl/navigation";

export const locales = ["en", "ro", "ru"] as const;
export const defaultLocale = "ro";

export const routing = defineRouting({
  locales,
  defaultLocale,
  localePrefix: "never",
});

export const { Link, redirect, usePathname, useRouter } =
  createNavigation(routing);
