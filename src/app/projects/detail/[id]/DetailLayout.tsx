"use client";
import React from 'react';
import { Breadcrumb, Layout } from 'antd';
import Sidebar from '@/components/SideBar';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';


const { Content } = Layout;

interface ProjectLayoutProps {
  children: React.ReactNode;
  project?: any;
}

const ProjectLayout: React.FC<ProjectLayoutProps> = ({ children, project }) => {
  const router = useRouter();
  const { data: session } = useSession();
  
  const breadcrumbItems = [
    { title: 'Home', onClick: () => router.push('/') },
    { title: 'Projects', onClick: () => router.push(`/projects/${session?.user.id}`) },
    { title: project ? project.name : 'Project' },
  ];
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sidebar project={project} />
      <Layout className="bg-white">
       <Breadcrumb
        items={breadcrumbItems}
        className="px-4 py-2 text-base hover:text-blue-500"
      />
      <Content className="p-6 m-5 min-h-280">
        {children}
      </Content>
      </Layout>
    </Layout>
  );
};

export default ProjectLayout;