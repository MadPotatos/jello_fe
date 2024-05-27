"use client";
import { Button } from "antd";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next-nprogress-bar";
import React from "react";
import { useTranslations } from "next-intl";

const HomePage: React.FC = () => {
  const router = useRouter();
  const { data: session } = useSession();

  const handleLoginClick = () => {
    if (session?.user) {
      router.push(`/projects/${session.user.id}`);
    } else {
      router.push("/auth/signup");
    }
  };

  const t = useTranslations("Home");

  return (
    <section id="hero" className="p-20 bg-gradient-to-b from-white to-blue-200">
      <div className="max-w-7xl mx-auto flex items-center">
        <div className="w-1/2 mr-10">
          <h1 className="text-6xl font-bold mb-4">{t("title")}</h1>
          <p className="text-xl mb-8">{t("description")}</p>
          <Button
            onClick={handleLoginClick}
            shape="round"
            className="text-white text-2xl h-14 w-64 bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-bold rounded-lg px-5 py-2.5 text-center me-2 mb-2"
          >
            {session?.user ? t("button1") : t("button2")}
          </Button>
        </div>
        <div className="w-1/2">
          <Image
            src="/images/hero-image.png"
            alt="hero"
            width={931}
            height={1205}
          />
        </div>
      </div>
    </section>
  );
};

export default HomePage;
