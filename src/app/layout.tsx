import "./globals.css";
import Providers from "@/components/Providers";
import { Layout } from "antd";
import { Metadata } from "next";

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

export default function RootLayout(props: Props) {
  return (
    <html lang={props.params.locale}>
      <body>
        <Layout style={{ minHeight: "100vh" }}>
          <Providers>{props.children}</Providers>
        </Layout>
      </body>
    </html>
  );
}
