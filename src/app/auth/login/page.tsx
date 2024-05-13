"use client";
import { Input, Button, Form, message, notification } from "antd";
import { signIn } from "next-auth/react";
import { LockOutlined, MailOutlined } from "@ant-design/icons";
import React, { useRef } from "react";
import { useRouter } from "next/navigation";

const LoginPage = () => {
  const router = useRouter();
  const [form] = Form.useForm();
  const email = useRef("");
  const pass = useRef("");

  const onFinish = async () => {
    try {
      const result = await signIn("credentials", {
        username: email.current,
        password: pass.current,
        redirect: false,
      });
      if (result?.error) {
        notification.error({
          message: "Login failed",
          description: "Invalid email or password",
        });
        return;
      }
      notification.success({
        message: "Login successful",
        description: "You have been logged in",
      });
      router.push("/home");
    } catch (error) {
      message.error("Login failed. Please try again.");
    }
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen bg-gradient-to-br from-cyan-300 to-sky-600">
      <div className="px-20 py-10 shadow bg-white rounded-md flex flex-col gap-4 items-center">
        <img
          src="/images/logo.png"
          alt="logo"
          style={{ width: "100px", height: "auto", marginBottom: "20px" }}
        />
        <h2 className="text-2xl font-bold mb-4">Welcome back</h2>
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
              onChange={(e) => (email.current = e.target.value)}
              style={{ height: "60px", fontSize: "16px" }}
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
              onChange={(e) => (pass.current = e.target.value)}
              style={{ height: "60px", fontSize: "16px" }}
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              style={{
                minHeight: "60px",
                fontSize: "16px",
                fontWeight: "bold",
              }}
            >
              Login
            </Button>
          </Form.Item>
        </Form>
        <p className="mt-4 text-base text-gray-700">
          Don't have an account?{" "}
          <a href="/auth/signup" className="text-blue-500">
            Sign up here
          </a>
          .
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
