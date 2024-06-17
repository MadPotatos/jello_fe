import "./globals.css";
import Providers from "@/components/Providers";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Layout } from "antd";
import { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { unstable_setRequestLocale } from "next-intl/server";

interface Props {
  children: React.ReactNode;
  params: { locale: string };
}

export const metadata: Metadata = {
  title: "Jello",
  description: "Jello: Project management tool for teams.",
  icons: {
    icon: "/images/small-icon.png",
  },
};

export default async function RootLayout({
  children,
  params: { locale },
}: Props) {
  const messages = await getMessages();
  unstable_setRequestLocale(locale);

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider messages={messages}>
          <Layout style={{ minHeight: "100vh" }}>
            <Providers messages={messages}>
              <Analytics />
              <SpeedInsights />
              {children}
            </Providers>
          </Layout>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
