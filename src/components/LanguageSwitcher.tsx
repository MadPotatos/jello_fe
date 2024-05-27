"use client";
import React from "react";
import { Button, Dropdown, MenuProps } from "antd";
import { GlobalOutlined } from "@ant-design/icons";
import {
  localeNames,
  locales,
  usePathname,
  useRouter,
  type Locale,
} from "@/i18n.config";

export default function LocaleSwitcher({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  const router = useRouter();

  const changeLocale = (newLocale: Locale) => {
    router.replace(pathname, { locale: newLocale });
    window.location.href = `/${newLocale}/${pathname}`;
  };

  const items: MenuProps["items"] = locales.map((loc) => ({
    key: loc,
    label: localeNames[loc],
    onClick: () => changeLocale(loc),
  }));

  return (
    <Dropdown menu={{ items }} trigger={["click"]}>
      <Button
        type="default"
        size="large"
        icon={<GlobalOutlined />}
        shape="circle"
      />
    </Dropdown>
  );
}
