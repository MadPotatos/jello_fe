"use client";
import { Button, Form, Input, message } from "antd";
import { LockOutlined, MailOutlined, UserOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import React from "react";
import { Backend_URL } from "@/lib/Constants";
import Link from "next/link";

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

      message.success("User Registered!");
      // Redirect to the login page after successful registration
      router.push("/auth/login");
    } catch (error) {
      message.error("Registration failed. Please try again.");
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
        <h2 className="text-2xl font-bold mb-4">Sign up</h2>
        <Form
          onFinish={onFinish}
          autoComplete="off"
          layout="vertical"
          initialValues={{ remember: true }}
        >
          {/* Ant Design Input for name */}
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: "Please enter your name!" }]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="Name"
              style={{ height: "50px", fontSize: "16px" }}
            />
          </Form.Item>
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
              style={{ height: "50px", fontSize: "16px" }}
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
              style={{ height: "50px", fontSize: "16px" }}
            />
          </Form.Item>
          {/* Ant Design Button with overridden styles */}
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              style={{ height: "50px", backgroundColor: "#1890ff", borderColor: "#1890ff", fontSize: "16px" }}
            >
              Submit
            </Button>
          </Form.Item>
        </Form>

        <p style={{ marginTop: "10px", fontSize: "16px", color: "#333" }}>
          Already have an account? <a href="/auth/login" style={{ color: "#1890ff" }}>Sign in here</a>.
        </p>
      </div>
    </div>
  );
};

export default SignupPage;
