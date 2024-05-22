"use client";

import { ReactNode } from "react";
import { SessionProvider } from "next-auth/react";
import { usePathname } from "next/navigation";
import Footer from "@/components/Footer";
import { Content } from "antd/es/layout/layout";
import { AppProgressBar as ProgressBar } from "next-nprogress-bar";
import AppBar from "./Header";
interface Props {
  children: ReactNode;
}

const Providers = ({ children }: Props) => {
  const routesWithoutAppBar = ["/auth/login", "/auth/signup"];
  const pathName = usePathname();
  return (
    <SessionProvider>
      {" "}
      {!pathName.includes(routesWithoutAppBar[0]) &&
      !pathName.includes(routesWithoutAppBar[1]) ? (
        <>
          <ProgressBar
            height="4px"
            color="#0064f2"
            options={{ showSpinner: false }}
            shallowRouting
          />
          <AppBar />
          <Content>{children}</Content>
          <Footer />
        </>
      ) : (
        children
      )}
    </SessionProvider>
  );
};

export default Providers;
