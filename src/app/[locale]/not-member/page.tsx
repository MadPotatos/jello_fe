"use client";
import { Button } from "antd";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import React from "react";

const NotMemberPage = () => {
  const router = useRouter();
  const t = useTranslations("NotMember");
  return (
    <div className="min-h-screen flex flex-grow items-center justify-center bg-gray-50">
      <div className="rounded-lg bg-white p-8 text-center shadow-xl">
        <h1 className="mb-4 text-4xl font-bold">404</h1>
        <p className="text-gray-600">{t("notMemberDesc")}</p>
        <Button
          type="primary"
          size="large"
          shape="round"
          className="mt-4"
          onClick={() => router.push("/home")}
        >
          {t("goBackHome")}
        </Button>
      </div>
    </div>
  );
};

export default NotMemberPage;
