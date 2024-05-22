"use client";
import React from "react";
import { Breadcrumb, Layout } from "antd";
import Sidebar from "@/components/SideBar";
import { usePathname } from "next/navigation";
import { useRouter } from "next-nprogress-bar";
import { useSession } from "next-auth/react";
import useSWR from "swr";
import { ProjectDetail } from "@/lib/types";
import { fetchProjectById } from "@/app/api/projectApi";

const { Content } = Layout;

interface ProjectLayoutProps {
  children: React.ReactNode;
}

const ProjectLayout: React.FC<ProjectLayoutProps> = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session } = useSession();

  const projectId: number = parseInt(pathname.split("/")[4]);
  const { data: project } = useSWR<ProjectDetail>(`project-${projectId}`, () =>
    fetchProjectById(projectId)
  );

  const breadcrumbItems = [
    {
      title: "Home",
      onClick: () => router.push("/"),
      className: "cursor-pointer hover:text-blue-500",
    },
    {
      title: "Projects",
      onClick: () => router.push(`/projects/${session?.user.id}`),
      className: "cursor-pointer hover:text-blue-500",
    },
    { title: project ? project.name : "Project" },
  ];
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sidebar project={project} />
      <Layout className="bg-white">
        <Breadcrumb items={breadcrumbItems} className="p-2 text-base" />
        <Content className="p-6 m-5 min-h-280">{children}</Content>
      </Layout>
    </Layout>
  );
};

export default ProjectLayout;
