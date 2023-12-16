"use client";
import AppBar from "@/components/AppBar";
import "./globals.css";
import Providers from "@/components/Providers";
import { usePathname } from "next/navigation";



interface Props {
  children: React.ReactNode;
}

export default function RootLayout(props: Props) {
  const routesWithoutAppBar = ["/auth/login", "/auth/signup"];
  const pathName = usePathname();
  return (
    <html lang="en">
      <body>
        <Providers>
          {!routesWithoutAppBar.includes(pathName) ? (
            <>
              <AppBar />
              {props.children}
            </>
          ) : (
            props.children
          )}
          
       
        </Providers>
      </body>
    </html>
  );
}
