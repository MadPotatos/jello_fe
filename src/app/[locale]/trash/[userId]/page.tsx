"use client";
import React, { use, useState } from "react";
import { usePathname } from "next/navigation";
import { Button, Table, Input, Avatar, message, Modal } from "antd";
import { Leader, Project } from "@/lib/types";
import { useSession } from "next-auth/react";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import useSWR, { mutate } from "swr";
import { fetchDeletedProjects, restoreProject } from "@/app/api/projectApi";
import { useTranslations } from "next-intl";

const { Search } = Input;
const { confirm } = Modal;

const DeletedProjectList = () => {
  const pathname = usePathname();
  const [searchValue, setSearchValue] = useState<string>("");
  const { data: session } = useSession();
  const t = useTranslations("Trash");

  const userId: number = parseInt(pathname.split("/")[3]);

  const { data: projects, error: projectsError } = useSWR<Project[]>(
    `project-deleted-${userId}`,
    () => fetchDeletedProjects(userId)
  );

  const handleSearch = (value: string) => {
    setSearchValue(value);
  };

  const filteredProjects = projects?.filter((project) =>
    project.name.toLowerCase().includes(searchValue.toLowerCase())
  );

  const columns = [
    {
      title: t("project"),
      dataIndex: "image",
      key: "project",
      render: (text: string, record: Project) => (
        <div style={{ display: "flex", alignItems: "center" }}>
          <Avatar
            src={record.image || "/images/default_avatar.jpg"}
            size={50}
            shape="square"
          />
          <span
            style={{ marginLeft: "20px", fontWeight: "bold", color: "#1890ff" }}
          >
            {record.name}
          </span>
        </div>
      ),
    },
    {
      title: t("description"),
      dataIndex: "description",
      key: "description",
      width: "40%",
    },
    {
      title: t("leader"),
      dataIndex: "leader",
      key: "leader",
      render: (leader: Leader, record: Project) => (
        <div
          style={{ display: "flex", alignItems: "center", cursor: "pointer" }}
        >
          <Avatar
            src={leader.avatar || "/images/default_avatar.jpg"}
            size={48}
            style={{ marginRight: "10px" }}
          />
          <span>{leader.name}</span>
        </div>
      ),
    },
    {
      title: t("action"),
      key: "action",
      render: (text: any, record: Project) => (
        <Button
          size="small"
          type="default"
          onClick={(e) => handleRestore(record.id, e)}
        >
          {t("restore")}
        </Button>
      ),
    },
  ];

  const handleRestore = async (
    projectId: number,
    event: React.MouseEvent<HTMLElement, MouseEvent>
  ) => {
    event.stopPropagation();
    confirm({
      title: t("restoreProjectConfirmation"),
      icon: <ExclamationCircleOutlined />,
      okText: t("restore"),
      cancelText: t("cancel"),
      onOk: async () => {
        try {
          await restoreProject(projectId, session?.backendTokens.accessToken);
          message.success(t("projectRestored"));
          mutate(`project-deleted-${userId}`);
        } catch (err) {
          console.error(err);
          message.error(t("failedToRestoreProject"));
        }
      },
      onCancel() {},
    });
  };

  return (
    <div className="w-full flex flex-col justify-start px-16 py-4 bg-gradient-to-b from-white to-purple-200 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-10">
        {t("recycleBin")}
      </h1>

      <div className="flex justify-between items-center mb-10">
        <Search
          placeholder={t("searchProjects")}
          size="large"
          style={{ width: "300px" }}
          onSearch={handleSearch}
        />
      </div>

      <Table
        dataSource={filteredProjects || []}
        columns={columns}
        loading={!projects && !projectsError}
        rowKey="id"
      />
    </div>
  );
};

export default DeletedProjectList;
