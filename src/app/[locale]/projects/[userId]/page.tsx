"use client";
import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { useRouter } from "next-nprogress-bar";
import { Button, Table, Input, Breadcrumb, Avatar, message, Modal } from "antd";
import { PlusOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import { Leader, Project } from "@/lib/types";
import { useSession } from "next-auth/react";
import useSWR, { mutate } from "swr";
import { deleteProject, fetchProjects } from "@/app/api/projectApi";
import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";

const CreateProjectModel = dynamic(() => import("./CreateProjectModel"), {
  ssr: false,
});
const UserPopover = dynamic(() => import("@/components/UserPopover"), {
  ssr: false,
});

const { Search } = Input;
const { confirm } = Modal;

const ProjectList: React.FC = () => {
  const t = useTranslations("ProjectList");
  const router = useRouter();
  const pathname = usePathname();
  const { data: session } = useSession();
  const [searchValue, setSearchValue] = useState<string>("");
  const [isModalVisible, setIsModalVisible] = useState(false);

  const userId: number = parseInt(pathname.split("/")[3]);

  const { data: projects, error: projectsError } = useSWR<Project[]>(
    `project-all-${userId}`,
    () => fetchProjects(userId)
  );

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleCreate = () => {
    setIsModalVisible(false);
    mutate(`project-all-${userId}`);
  };

  const handleSearch = (value: string) => {
    setSearchValue(value);
  };

  const filteredProjects = projects?.filter((project) =>
    project.name.toLowerCase().includes(searchValue.toLowerCase())
  );

  const columns: any[] = [
    {
      title: t("project"),
      dataIndex: "image",
      key: "project",
      render: (text: string, record: Project) => (
        <div style={{ display: "flex", alignItems: "center" }}>
          <Avatar
            src={record.image || "/images/logo2.jpeg"}
            size={50}
            shape="square"
          />
          <span className="text-lg font-semibold ml-4 cursor-pointer text-blue-500">
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
      render: (leader: Leader) => (
        <UserPopover user={leader}>
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
        </UserPopover>
      ),
    },
    {
      title: t("action"),
      key: "action",
      render: (text: any, record: Project) =>
        record.leader?.userId === session?.user.id ? (
          <Button
            size="small"
            danger
            onClick={(e) => handleDelete(record.id, e)}
          >
            {t("delete")}
          </Button>
        ) : null,
    },
  ];

  const handleDelete = async (
    projectId: number,
    event: React.MouseEvent<HTMLElement, MouseEvent>
  ) => {
    event.stopPropagation();
    confirm({
      title: t("deleteConfirmTitle"),
      icon: <ExclamationCircleOutlined />,
      content: t("deleteConfirmContent"),
      okType: "danger",
      onOk: async () => {
        try {
          await deleteProject(projectId, session?.backendTokens.accessToken);
          message.success(t("deleteSuccess"));
          mutate(`project-all-${userId}`);
        } catch (err) {
          console.error(err);
          message.error(t("deleteFailed"));
        }
      },
      onCancel() {},
    });
  };

  return (
    <div className="w-full flex flex-col justify-start px-16 py-4 bg-gradient-to-b from-white to-blue-200 min-h-screen">
      <Breadcrumb
        className="mb-8 text-lg"
        items={[
          { title: t("home"), key: "home", href: "/" },
          { title: t("projects"), key: "projects" },
        ]}
      ></Breadcrumb>

      <div className="flex justify-between items-center mb-10">
        <Search
          placeholder={t("searchPlaceholder")}
          size="large"
          className="w-96 rounded-full "
          onSearch={handleSearch}
        />
        <Button
          type="primary"
          icon={<PlusOutlined />}
          size="large"
          shape="round"
          onClick={showModal}
        >
          {t("createProject")}
        </Button>
      </div>

      <Table
        dataSource={filteredProjects || []}
        columns={columns}
        loading={!projects && !projectsError}
        rowKey="id"
        onRow={(record) => {
          return {
            onClick: () => router.push(`/projects/detail/${record.id}/board`),
            className: "hover:bg-gray-100 cursor-pointer",
          };
        }}
      />

      <CreateProjectModel
        visible={isModalVisible}
        onCreate={handleCreate}
        onCancel={handleCancel}
      />
    </div>
  );
};

export default ProjectList;
