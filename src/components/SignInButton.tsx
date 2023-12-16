"use client";
import { useSession, signOut } from "next-auth/react";
import { Button, Avatar, Dropdown, Menu } from "antd";
import React from "react";

const SignInButton = () => {
  const { data: session } = useSession();
  console.log({ session });

  const handleSignOut = () => {
    signOut();
  };

  if (session && session.user)
    return (
      <div className="flex gap-4 ml-auto items-center">
        <Dropdown
          overlay={
            <Menu>
              <Menu.Item key="signout" onClick={handleSignOut}>
                Sign Out
              </Menu.Item>
            </Menu>
          }
          trigger={['click']}
        >
          <div className="flex items-center">
            <Avatar size="large" src={session.user.avatar} alt={session.user.name} />
            <span className="ml-2 text-sky-600">{session.user.name}</span>
          </div>
        </Dropdown>
      </div>
    );

  return (
    <div className="flex gap-4 ml-auto items-center">
      <Button type="primary" style={{ backgroundColor: '#1890ff', borderColor: '#1890ff' }} href={"/api/auth/signin"}>
        Sign In
      </Button>
      <Button type="text" style={{ color: '#1890ff' }} href={"/auth/signup"}>
        Sign Up
      </Button>
    </div>
  );
};

export default SignInButton;
