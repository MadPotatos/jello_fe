"use client";

import { Select } from "antd";
import {
  localeNames,
  locales,
  usePathname,
  useRouter,
  type Locale,
} from "@/i18n.config";

const { Option } = Select;

export default function LocaleSwitcher({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  const router = useRouter();

  const changeLocale = (value: string) => {
    const newLocale = value as Locale;
    router.replace(pathname, { locale: newLocale });
    window.location.href = `/${newLocale}/${pathname}`;
  };

  return (
    <div>
      <Select
        value={locale}
        onChange={changeLocale}
        style={{ width: 200 }}
        className="..."
      >
        {locales.map((loc) => (
          <Option key={loc} value={loc}>
            {localeNames[loc]}
          </Option>
        ))}
      </Select>
    </div>
  );
}
