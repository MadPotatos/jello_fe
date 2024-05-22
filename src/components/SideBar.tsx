"use client";
import React, { useEffect, useState } from "react";
import { Avatar, Layout, Menu } from "antd";
import {
  ProjectOutlined,
  ToolOutlined,
  PullRequestOutlined,
  GroupOutlined,
  BugOutlined,
  UnorderedListOutlined,
  TableOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import { usePathname } from "next/navigation";
import { useRouter } from "next-nprogress-bar";
import { ProjectDetail } from "@/lib/types";

const { Sider } = Layout;
type MenuItem = Required<MenuProps>["items"][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
  onClick?: () => void
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
    onClick,
  } as MenuItem;
}
interface SidebarProps {
  project?: ProjectDetail;
}

const Sidebar: React.FC<SidebarProps> = ({ project }) => {
  const [collapsed, setCollapsed] = useState(false);
  const router = useRouter();

  const [selectedKeys, setSelectedKeys] = useState<string[]>(["1"]);
  const pathname = usePathname();

  useEffect(() => {
    if (pathname.includes("timeline")) {
      setSelectedKeys(["2"]);
    } else if (pathname.includes("backlog")) {
      setSelectedKeys(["3"]);
    } else if (pathname.includes("all-issues")) {
      setSelectedKeys(["4"]);
    } else if (pathname.includes("pull-requests")) {
      setSelectedKeys(["5"]);
    } else if (pathname.includes("setting")) {
      setSelectedKeys(["6"]);
    } else {
      setSelectedKeys(["1"]); // Default key
    }
  }, [pathname]);

  const items: MenuItem[] = [
    getItem("Planning", "grp-1", null, [
      getItem("Board", "1", <ProjectOutlined />, undefined, () =>
        router.push("/projects/detail/" + project?.id + "/board")
      ),
      getItem("Timeline", "2", <GroupOutlined />, undefined, () =>
        router.push("/projects/detail/" + project?.id + "/timeline")
      ),
      getItem("Backlog", "3", <TableOutlined />, undefined, () =>
        router.push("/projects/detail/" + project?.id + "/backlog")
      ),
      getItem("Issues", "4", <UnorderedListOutlined />, undefined, () =>
        router.push("/projects/detail/" + project?.id + "/all-issues")
      ),
    ]),
    getItem("Development", "grp-2", null, [
      getItem("Pull requests", "5", <PullRequestOutlined />, undefined, () =>
        router.push("/projects/detail/" + project?.id + "/pull-requests")
      ),
    ]),
    { type: "divider" },
    getItem("Project setting", "6", <ToolOutlined />, undefined, () =>
      router.push("/projects/detail/" + project?.id + "/setting")
    ),
  ];

  return (
    <Sider
      theme="light"
      collapsible
      collapsed={collapsed}
      onCollapse={(value) => setCollapsed(value)}
      width={250}
    >
      <div className="flex items-center p-4 mb-4">
        {!collapsed && (
          <>
            <Avatar
              src={project && project.image}
              size={40}
              shape="square"
              className="mr-2"
            />
            <div>
              <h3 className="m-0 text-black text-lg">
                {project && project.name}
              </h3>
              <p className="m-0 text-gray-600 text-sm">Software Project</p>
            </div>
          </>
        )}
      </div>

      <Menu
        mode="inline"
        selectedKeys={selectedKeys}
        defaultOpenKeys={["grp-1", "grp-2"]}
        style={{ height: "100%" }}
        items={items}
        className="h-full text-base"
      />
    </Sider>
  );
};

export default Sidebar;
