import { useTranslations } from "next-intl";

import React from "react";

const Error = () => {
  const t = useTranslations("NotFound");
  return (
    <div className="min-h-screen flex flex-grow items-center justify-center bg-gray-50">
      <div className="rounded-lg bg-white p-8 text-center shadow-xl">
        <h1 className="mb-4 text-4xl font-bold">404</h1>
        <p className="text-gray-600">{t("notFoundDesc")}</p>
      </div>
    </div>
  );
};

export const dynamic = "force-dynamic";
export default Error;
