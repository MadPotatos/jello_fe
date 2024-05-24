"use client";
import React from "react";
import SignInButton from "./SignInButton";
import { Layout, Menu } from "antd";
import {
  HomeOutlined,
  DashboardOutlined,
  TeamOutlined,
  PhoneOutlined,
} from "@ant-design/icons";
import Image from "next/image";
import { useRouter } from "next-nprogress-bar";
import { useSession } from "next-auth/react";
import { MenuProps } from "antd/lib";
import LanguageSwitcher from "./LanguageSwitcher";
import { useLocale, useTranslations } from "next-intl";
import { Locale } from "@/i18n.config";

const { Header } = Layout;

const AppBar = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const t = useTranslations("Header");

  const items: MenuProps["items"] = [
    {
      label: <span className="text-lg">{t("home")}</span>,
      icon: <HomeOutlined />,
      key: "home",
      onClick: () => router.push("/home"),
    },
    {
      label: <span className="text-lg">{t("projects")}</span>,
      icon: <DashboardOutlined />,
      key: "dashboard",
      onClick: () => router.push(`/projects/${session?.user?.id}`),
    },
    {
      label: <span className="text-lg">{t("features")}</span>,
      icon: <TeamOutlined />,
      key: "about",
      onClick: () => router.push("/features"),
    },
    {
      label: <span className="text-lg">{t("contact")}</span>,
      icon: <PhoneOutlined />,
      key: "contact",
      onClick: () => router.push("/contact"),
    },
  ];

  const locale = useLocale() as Locale;

  return (
    <Header className="bg-white border-b shadow">
      <div className="flex items-center">
        <Image src="/images/logo.png" alt="logo" width={100} height={60} />

        <Menu
          mode="horizontal"
          theme="light"
          className="flex gap-4"
          items={items}
        />
        <div className="flex gap-2 ml-auto">
          <LanguageSwitcher locale={locale} />
          <SignInButton />
        </div>
      </div>
    </Header>
  );
};

export default AppBar;
