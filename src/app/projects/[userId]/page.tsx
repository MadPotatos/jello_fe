"use client";
import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { useRouter } from "next-nprogress-bar";
import { Button, Table, Input, Breadcrumb, Avatar, message, Modal } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { Leader, Project } from "@/lib/types";
import { useSession } from "next-auth/react";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import useSWR, { mutate } from "swr";
import { deleteProject, fetchProjects } from "@/app/api/projectApi";
import dynamic from "next/dynamic";

const CreateProjectModel = dynamic(() => import("./CreateProjectModel"), {
  ssr: false,
});
const UserPopover = dynamic(() => import("@/components/UserPopover"), {
  ssr: false,
});

const { Search } = Input;
const { confirm } = Modal;

const ProjectList: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session } = useSession();
  const [searchValue, setSearchValue] = useState<string>("");
  const [isModalVisible, setIsModalVisible] = useState(false);

  const userId: number = parseInt(pathname.split("/")[2]);

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
      title: "Project",
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
      title: "Description",
      dataIndex: "description",
      key: "description",
      width: "40%",
    },
    {
      title: "Leader",
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
      title: "Action",
      key: "action",
      render: (text: any, record: Project) =>
        record.leader?.userId === session?.user.id ? (
          <Button
            size="small"
            danger
            onClick={(e) => handleDelete(record.id, e)}
          >
            Delete
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
      title: "Do you want to delete this project?",
      icon: <ExclamationCircleOutlined />,
      content:
        "The project will be moved to the recycle bin and will be permanently deleted in 30 days.",
      okType: "danger",
      onOk: async () => {
        try {
          await deleteProject(projectId, session?.backendTokens.accessToken);
          message.success("Project is moved to recycle bin !");
          mutate(`project-all-${userId}`);
        } catch (err) {
          console.error(err);
          message.error("Failed to delete project");
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
          { title: "Home", key: "home", href: "/" },
          { title: "Projects", key: "projects" },
        ]}
      ></Breadcrumb>

      <div className="flex justify-between items-center mb-10">
        <Search
          placeholder="Search projects"
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
          Create Project
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
