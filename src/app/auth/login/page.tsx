"use client";
import { Input, Button, Form, message } from "antd";
import { signIn } from "next-auth/react";
import { LockOutlined, MailOutlined } from "@ant-design/icons";
import React, { useRef } from "react";

const LoginPage = () => {
  const [form] = Form.useForm();
  const email = useRef("");
  const pass = useRef("");

  const onFinish = async () => {
    try {
      const result = await signIn("credentials", {
        username: email.current,
        password: pass.current,
        redirect: true,
        callbackUrl: "/home",
      });
    } catch (error) {
      console.error("An error occurred during login:", error);
      message.error("Login failed. Please try again.");
    }
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen bg-gradient-to-br from-cyan-300 to-sky-600">
      <div className="px-20 py-10 shadow bg-white rounded-md flex flex-col gap-6 items-center">
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
          {/* Ant Design Input for email */}
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
          {/* Ant Design Input for password */}
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
          {/* Ant Design Button with overridden styles */}
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              style={{ height: "60px", backgroundColor: "#1890ff", borderColor: "#1890ff", fontSize: "16px" }}
            >
              Login
            </Button>
          </Form.Item>
        </Form>
        <p style={{ marginTop: "10px", fontSize: "16px", color: "#333" }}>
          Don't have an account? <a href="/auth/signup" style={{ color: "#1890ff" }}>Sign up here</a>.
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
