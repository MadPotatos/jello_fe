"use client";
import React from "react";
import { useLocale, useTranslations } from "next-intl";
import { Locale } from "@/i18n.config";
import LanguageSwitcher from "@/components/LanguageSwitcher";

const Home = () => {
  const t = useTranslations("Index");
  const locale = useLocale() as Locale;
  return (
    <div>
      <h1>{t("title")}</h1>
      <LanguageSwitcher locale={locale} />
    </div>
  );
};

export default Home;
