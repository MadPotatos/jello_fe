"use client";
import { Button } from "antd";
import { useRouter } from "next/navigation";
import React from "react";

const NotMemberPage = () => {
  const router = useRouter();
  return (
    <div className="min-h-screen flex flex-grow items-center justify-center bg-gray-50">
      <div className="rounded-lg bg-white p-8 text-center shadow-xl">
        <h1 className="mb-4 text-4xl font-bold">404</h1>
        <p className="text-gray-600">
          Oops! You are not a member of this project.
        </p>
        <Button
          type="primary"
          size="large"
          shape="round"
          className="mt-4"
          onClick={() => router.push("/home")}
        >
          Go Back Home
        </Button>
      </div>
    </div>
  );
};

export default NotMemberPage;
