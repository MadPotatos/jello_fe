"use client";
import AppBar from "@/components/Header";
import "./globals.css";
import Providers from "@/components/Providers";
import { usePathname } from "next/navigation";
import Footer from "@/components/Footer";
import { Layout } from "antd";
import { Content } from "antd/es/layout/layout";
import { AppProgressBar as ProgressBar } from "next-nprogress-bar";

interface Props {
  children: React.ReactNode;
}

export default function RootLayout(props: Props) {
  const routesWithoutAppBar = ["/auth/login", "/auth/signup"];
  const pathName = usePathname();

  return (
    <html lang="en">
      <body>
        <Layout style={{ minHeight: "100vh" }}>
          <Providers>
            {!routesWithoutAppBar.includes(pathName) ? (
              <>
                <ProgressBar
                  height="4px"
                  color="#0064f2"
                  options={{ showSpinner: false }}
                  shallowRouting
                />
                <AppBar />
                <Content>{props.children}</Content>
                <Footer />
              </>
            ) : (
              props.children
            )}
          </Providers>
        </Layout>
      </body>
    </html>
  );
}
