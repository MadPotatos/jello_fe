"use client";
import { Input, Button, Form, message, notification, Image } from "antd";
import { signIn } from "next-auth/react";
import { LockOutlined, MailOutlined } from "@ant-design/icons";
import React, { useRef } from "react";
import { useRouter } from "next-nprogress-bar";
import { useTranslations } from "next-intl";

const LoginPage = () => {
  const router = useRouter();
  const [form] = Form.useForm();
  const email = useRef("");
  const pass = useRef("");
  const t = useTranslations("Login");

  const onFinish = async () => {
    try {
      const result = await signIn("credentials", {
        username: email.current,
        password: pass.current,
        redirect: false,
      });
      if (result?.error) {
        notification.error({
          message: t("errorMessage"),
          description: t("errorDesc"),
        });
        return;
      }
      notification.success({
        message: t("successMessage"),
        description: t("successDesc"),
      });
      router.push("/home");
    } catch (error) {
      message.error(t("errorMessage"));
    }
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen bg-gradient-to-br from-cyan-300 to-sky-600">
      <div className="px-14 py-8 shadow bg-white rounded-md flex flex-col gap-4 items-center">
        <Image
          src="/images/logo2.jpeg"
          preview={false}
          alt="logo"
          width={150}
          height={150}
        />
        <h2 className="text-2xl font-bold mb-4">{t("welcome")}</h2>
        <Form
          form={form}
          onFinish={onFinish}
          autoComplete="off"
          layout="vertical"
          initialValues={{ remember: true }}
        >
          <Form.Item
            label="Email"
            name="email"
            rules={[
              {
                type: "email",
                message: t("validateEmail"),
              },
              {
                required: true,
                message: t("validateEmail"),
              },
            ]}
          >
            <Input
              prefix={<MailOutlined />}
              placeholder="Email"
              onChange={(e) => (email.current = e.target.value)}
              style={{ minHeight: "40px" }}
            />
          </Form.Item>

          <Form.Item
            label={t("password")}
            name="password"
            rules={[
              {
                required: true,
                message: t("validatePassword"),
              },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder={t("password")}
              onChange={(e) => (pass.current = e.target.value)}
              style={{ minHeight: "40px" }}
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              style={{
                minHeight: "40px",
                fontSize: "16px",
                fontWeight: "bold",
              }}
            >
              {t("login")}
            </Button>
          </Form.Item>
        </Form>
        <p className="text-base text-gray-700">
          {t("dontHaveAccount")}
          <a
            className="ml-2 text-blue-500"
            onClick={() => router.push("/auth/signup")}
          >
            {t("signup")}
          </a>
          .
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
