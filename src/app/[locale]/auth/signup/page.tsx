"use client";
import { Button, Form, Image, Input, message, notification } from "antd";
import LockOutlined from "@ant-design/icons/LockOutlined";
import MailOutlined from "@ant-design/icons/MailOutlined";
import UserOutlined from "@ant-design/icons/UserOutlined";
import { useRouter } from "next-nprogress-bar";
import React from "react";
import { Backend_URL } from "@/lib/Constants";
import { useTranslations } from "next-intl";

const SignupPage = () => {
  const router = useRouter();
  const t = useTranslations("Signup");

  const onFinish = async (values: any) => {
    try {
      const res = await fetch(Backend_URL + "/auth/register", {
        method: "POST",
        body: JSON.stringify({
          name: values.name,
          email: values.email,
          password: values.password,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        const response = await res.json();
        throw new Error(response.message || t("signUpFailed"));
      }

      notification.success({
        message: t("signUpSuccess"),
        description: t("signUpSuccessDesc"),
      });
      router.push("/auth/login");
    } catch (error) {
      message.error(t("signUpFailedDesc"));
    }
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen bg-gradient-to-br from-cyan-300 to-sky-600">
      <div className="px-20 py-10 shadow bg-white rounded-md flex flex-col gap-4 items-center">
        <Image
          src="/images/logo2.jpeg"
          preview={false}
          alt="logo"
          style={{ width: "200px", height: "auto", marginBottom: "20px" }}
        />
        <h2 className="text-2xl font-bold mb-4">{t("signUp")}</h2>
        <Form
          onFinish={onFinish}
          autoComplete="off"
          layout="vertical"
          initialValues={{ remember: true }}
        >
          <Form.Item
            label={t("fullName")}
            name="name"
            rules={[{ required: true, message: t("validateFullName") }]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder={t("fullName")}
              style={{ minHeight: "50px", fontSize: "16px" }}
            />
          </Form.Item>
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
              style={{ minHeight: "50px", fontSize: "16px" }}
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
              placeholder="Password"
              style={{ minHeight: "50px", fontSize: "16px" }}
            />
          </Form.Item>
          <Form.Item
            label={t("confirmPassword")}
            name="confirmPassword"
            dependencies={["password"]}
            rules={[
              {
                required: true,
                message: t("validateConfirmPassword"),
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error(t("passwordNotMatch")));
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder={t("confirmPassword")}
              style={{ minHeight: "50px", fontSize: "16px" }}
            />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              style={{
                minHeight: "50px",
                fontSize: "16px",
                fontWeight: "bold",
              }}
            >
              {t("signUp")}
            </Button>
          </Form.Item>
        </Form>

        <p className="mt-4 text-base text-gray-700">
          {t("alreadyHaveAccount")}
          <a
            className="ml-2 text-blue-500"
            onClick={() => router.push("/auth/login")}
          >
            {t("login")}
          </a>
          .
        </p>
      </div>
    </div>
  );
};

export default SignupPage;
