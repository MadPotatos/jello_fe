"use client";
import { Button, Form, Image, Input, message, notification } from "antd";
import LockOutlined from "@ant-design/icons/LockOutlined";
import MailOutlined from "@ant-design/icons/MailOutlined";
import UserOutlined from "@ant-design/icons/UserOutlined";
import { useRouter } from "next-nprogress-bar";
import React from "react";
import { Backend_URL } from "@/lib/Constants";

const SignupPage = () => {
  const router = useRouter();

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
        throw new Error(response.message || "Registration failed");
      }

      notification.success({
        message: "Registration successful",
        description:
          "You have successfully registered. Please login to continue.",
      });
      router.push("/auth/login");
    } catch (error) {
      message.error("Registration failed. Please try again.");
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
        <h2 className="text-2xl font-bold mb-4">Sign up</h2>
        <Form
          onFinish={onFinish}
          autoComplete="off"
          layout="vertical"
          initialValues={{ remember: true }}
        >
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: "Please enter your name!" }]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="Name"
              style={{ minHeight: "50px", fontSize: "16px" }}
            />
          </Form.Item>
          <Form.Item
            label="Email"
            name="email"
            rules={[
              {
                type: "email",
                message: "Please enter a valid email address!",
              },
              {
                required: true,
                message: "Please enter your email!",
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
            label="Password"
            name="password"
            rules={[
              {
                required: true,
                message: "Please enter your password!",
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
            label="Confirm Password"
            name="confirmPassword"
            dependencies={["password"]}
            rules={[
              {
                required: true,
                message: "Please confirm your password!",
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("The two passwords do not match!")
                  );
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Confirm Password"
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
              Submit
            </Button>
          </Form.Item>
        </Form>

        <p className="mt-4 text-base text-gray-700">
          Already have an account?{" "}
          <a href="/auth/login" className="text-blue-500">
            Sign in here
          </a>
          .
        </p>
      </div>
    </div>
  );
};

export default SignupPage;
