
"use client";
import React from 'react';
import SignInButton from './SignInButton';
import { Layout, Menu } from 'antd';
import { HomeOutlined, DashboardOutlined,TeamOutlined,PhoneOutlined } from '@ant-design/icons';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

const { Header } = Layout;

const AppBar = () => {
  const { data: session } = useSession();
  const router = useRouter();

  const items = [
    { label: <span className="text-lg">Home Page</span>, icon: <HomeOutlined />, key: 'home', onClick: () => router.push('/home') },
    { label: <span className="text-lg">Project</span>, icon: <DashboardOutlined />, key: 'dashboard', onClick: () => router.push(`/projects/${session?.user?.id}`) }, 
    { label: <span className="text-lg">Features</span>, icon: <TeamOutlined />,key: 'about', onClick: () => router.push('/features')},
    { label: <span className="text-lg">Contact Us</span>, icon: <PhoneOutlined />,key: 'contact', onClick: () => router.push('/contact')},
  ];

  return (
    <Header className="bg-white border-b shadow">
      <div className="flex items-center gap-4">
        <div className="flex items-center">
          <Image src="/images/logo.png" alt="Jello Logo" width={40} height={40} />
          <span className="ml-2 text-xl font-bold">Jello</span>
        </div>
        <Menu mode="horizontal" theme="light" className="flex gap-4" items={items} />
        <div className="ml-auto">
          <SignInButton />
        </div>
      </div>
    </Header>
  );
};

export default AppBar;
