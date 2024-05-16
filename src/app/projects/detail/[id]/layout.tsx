"use client";
import React from "react";
import { Breadcrumb, Layout } from "antd";
import Sidebar from "@/components/SideBar";
import { usePathname, useRouter } from "next/navigation";
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

  const projectId: number = parseInt(pathname.split("/")[3]);
  const { data: project } = useSWR<ProjectDetail>(`project-${projectId}`, () =>
    fetchProjectById(projectId)
  );

  const breadcrumbItems = [
    { title: "Home", onClick: () => router.push("/") },
    {
      title: "Projects",
      onClick: () => router.push(`/projects/${session?.user.id}`),
    },
    { title: project ? project.name : "Project" },
  ];
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sidebar project={project} />
      <Layout className="bg-white">
        <Breadcrumb
          items={breadcrumbItems}
          className="px-4 py-2 text-base hover:text-blue-500 text-2xl"
        />
        <Content className="p-6 m-5 min-h-280">{children}</Content>
      </Layout>
    </Layout>
  );
};

export default ProjectLayout;
