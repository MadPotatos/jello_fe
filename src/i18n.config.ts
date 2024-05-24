import { createSharedPathnamesNavigation } from "next-intl/navigation";

export const locales = ["en", "vi"] as const;
export type Locale = (typeof locales)[number];

export const localeNames: Record<Locale, string> = {
  en: "English",
  vi: "Tiếng Việt",
};

export const { Link, usePathname, useRouter } = createSharedPathnamesNavigation(
  { locales }
);
