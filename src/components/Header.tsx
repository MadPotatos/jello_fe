import React from "react";
import SignInButton from "./SignInButton";
import { Layout, Menu } from "antd";
import { HomeOutlined, DashboardOutlined } from "@ant-design/icons";
import Image from "next/image";
import { useRouter } from "next/navigation";

const { Header } = Layout;
const { Item } = Menu;

const AppBar = () => {
  const router = useRouter();

  return (
    <Header className="bg-white border-b shadow">
      <div className="flex items-center gap-4">

        <div className="flex items-center">
          <Image
            src="/images/logo.png" 
            alt="Jello Logo"
            width={40}
            height={40}
          />
          <span className="ml-2 text-xl font-bold">Jello</span>
        </div>
        
        <Menu mode="horizontal" theme="light" className="flex gap-4">
          <Item key="home" icon={<HomeOutlined />} onClick={() => router.push("/")}>
            <span className="text-lg">Home Page</span>
          </Item>
          <Item key="dashboard" icon={<DashboardOutlined />} onClick={() => router.push("/dashboard")}>
            <span className="text-lg">Project</span>
          </Item>
        </Menu>

        <div className="ml-auto">
          <SignInButton />
        </div>
      </div>
    </Header>
  );
};

export default AppBar;