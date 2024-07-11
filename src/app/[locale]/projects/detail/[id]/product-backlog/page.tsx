"use client";
import { useEffect, useState } from "react";
import {
  Button,
  Form,
  Input,
  Modal,
  Select,
  Space,
  Table,
  Spin,
  Popconfirm,
  notification,
  Tag,
} from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import {
  createUserStory,
  fetchUserStory,
  updateUserStory,
  deleteUserStory,
} from "@/app/api/userStoryApi";
import { usePathname } from "next/navigation";
import useSWR, { mutate } from "swr";
import {
  getColoredIconByIssueType,
  getColoredIconByPriority,
  priorityOptions,
} from "@/lib/utils";
import { useTranslations } from "next-intl";
import CreateTaskModal from "@/components/modal/CreateTaskModal";
import { createTask } from "@/app/api/issuesApi";
import { useSession } from "next-auth/react";
import { IssueType, Role } from "@/lib/enum";
import { checkRole } from "@/app/api/memberApi";

const ProductBacklogPage: React.FC = () => {
  const t = useTranslations();
  const pathname = usePathname();
  const { data: session } = useSession();
  const projectId = Number(pathname.split("/")[4]);
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
  const [isTaskModalVisible, setIsTaskModalVisible] = useState(false);
  const [isProductOwner, setIsProductOwner] = useState(false);
  const [selectedUserStory, setSelectedUserStory] = useState<any>(null);
  const [selectedUserStoryId, setSelectedUserStoryId] = useState<number | null>(
    null
  );

  const { data: userStories } = useSWR<any>(`userStories-${projectId}`, () =>
    fetchUserStory(projectId)
  );

  const showModal = () => {
    setIsModalVisible(true);
  };

  const showUpdateModal = (userStory: any) => {
    setSelectedUserStory(userStory);
    setIsUpdateModalVisible(true);
    form.setFieldsValue(userStory);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setIsUpdateModalVisible(false);
    form.resetFields();
  };

  useEffect(() => {
    const fetchRole = async () => {
      try {
        const data = await checkRole(projectId, session?.user.id);
        setIsProductOwner(data.role === Role.PRODUCT_OWNER);
      } catch (error) {
        console.error("Failed to check role", error);
      }
    };

    if (session?.user.id && projectId) {
      fetchRole();
    }
  }, [session?.user.id, projectId]);

  const handleCreateUserStory = async (values: any) => {
    try {
      const { title, description, priority, point } = values;
      const pointInt = parseInt(point, 10);
      await createUserStory({
        projectId,
        title,
        description,
        priority,
        point: pointInt,
      });

      setIsModalVisible(false);
      form.resetFields();
      notification.success({
        message: "Tạo user story thành công",
      });
      mutate(`userStories-${projectId}`);
    } catch (error) {
      console.error("Failed to create user story", error);
      notification.error({
        message: "Lỗi khi tạo user story",
      });
    }
  };

  const handleUpdateUserStory = async (values: any) => {
    try {
      const { title, description, priority, point } = values;
      const pointInt = parseInt(point, 10);
      await updateUserStory(
        {
          title: title,
          description: description,
          priority: priority,
          point: pointInt,
        },
        selectedUserStory.id
      );

      setIsUpdateModalVisible(false);
      form.resetFields();
      notification.success({
        message: "Cập nhật user story thành công",
      });
      mutate(`userStories-${projectId}`);
    } catch (error) {
      console.error("Failed to update user story", error);
      notification.error({
        message: "Lỗi khi cập nhật user story",
      });
    }
  };

  const handleDelete = async (id: any) => {
    try {
      await deleteUserStory(id);
      notification.success({
        message: "Xóa user story thành công",
      });
      mutate(`userStories-${projectId}`);
    } catch (error) {
      console.error("Failed to delete user story", error);
      notification.error({
        message: "Lỗi khi xóa user story",
      });
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    console.error("Failed:", errorInfo);
  };

  const handleCreateTask = (userStoryId: number) => {
    setSelectedUserStoryId(userStoryId);
    setIsTaskModalVisible(true);
  };

  const handleEdit = (userStory: any) => {
    showUpdateModal(userStory);
  };

  const handleTaskModalClose = () => {
    setIsTaskModalVisible(false);
  };

  const handleTaskModalSubmit = async (values: any) => {
    if (selectedUserStoryId === null) return;

    try {
      const { summary, priority } = values;

      await createTask({
        projectId,
        userStoryId: selectedUserStoryId,
        summary,
        priority,
        type: IssueType.TASK,
        reporterId: session?.user.id,
      });
      setIsTaskModalVisible(false);
      notification.success({
        message: "Tạo công việc thành công",
      });
      mutate(`userStories-${projectId}`);
    } catch (error) {
      console.error("Failed to create task", error);
      notification.error({
        message: "Lỗi khi tạo công việc",
      });
    }
  };

  const columns: any[] = [
    {
      title: "Tiêu đề",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      align: "center",
      render: (text: string) => {
        const formattedText = text
          .toLowerCase()
          .replace(/_/g, " ")
          .replace(/^\w/, (c) => c.toUpperCase());
        return <Tag color="blue">{formattedText}</Tag>;
      },
    },
    {
      title: "Độ ưu tiên",
      dataIndex: "priority",
      key: "priority",
      align: "center",
      render: (text: string, record: any) => (
        <div>{getColoredIconByPriority(record.priority)}</div>
      ),
    },
    {
      title: "Điểm",
      dataIndex: "point",
      key: "point",
    },
    {
      title: "Công việc",
      key: "tasks",
      render: (_: any, record: any) => (
        <Table
          dataSource={record.tasks}
          columns={[
            {
              title: "",
              key: "combined",
              render: (task: any) => (
                <div>
                  {getColoredIconByIssueType(task.type)} {task.summary}
                </div>
              ),
            },
          ]}
          pagination={false}
          showHeader={false}
          rowKey="id"
        />
      ),
    },
    {
      title: "Hành động",
      key: "action",
      render: (_: any, record: any) => (
        <Space size="middle">
          <Button
            type="text"
            icon={<PlusOutlined />}
            onClick={() => handleCreateTask(record.id)}
          ></Button>
          <Button
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            disabled={!isProductOwner}
          ></Button>
          <Popconfirm
            title={t("Bạn có chắc muốn xóa user story này không?")}
            onConfirm={() => handleDelete(record.id)}
            okText={t("Đồng ý")}
            cancelText={t("Hủy")}
          >
            <Button
              danger
              icon={<DeleteOutlined />}
              disabled={!isProductOwner}
            ></Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  if (!userStories) {
    return (
      <div className="site-layout-content">
        <div className="grid h-[40vh] w-full place-items-center">
          <Spin size="large" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Product Backlog</h1>
        <Button type="primary" onClick={showModal} disabled={!isProductOwner}>
          Tạo User Story
        </Button>
      </div>

      <Table
        dataSource={userStories || []}
        columns={columns}
        rowKey="id"
        bordered
        pagination={{ pageSize: 5 }}
      />
      <Modal
        title="Tạo User Story"
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form
          form={form}
          name="createUserStoryForm"
          onFinish={handleCreateUserStory}
          onFinishFailed={onFinishFailed}
          layout="vertical"
        >
          <Form.Item
            name="title"
            label="Tiêu đề"
            rules={[{ required: true, message: "Vui lòng nhập tiêu đề" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="description"
            label="Mô tả"
            rules={[{ required: true, message: "Vui lòng nhập mô tả" }]}
          >
            <Input.TextArea />
          </Form.Item>
          <Form.Item
            name="priority"
            label="Độ ưu tiên"
            rules={[{ required: true, message: "Vui lòng chọn độ ưu tiên" }]}
          >
            <Select options={priorityOptions(t)}></Select>
          </Form.Item>
          <Form.Item
            name="point"
            label="Điểm User Story"
            rules={[
              { required: true, message: "Vui lòng nhập điểm User Story" },
            ]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Tạo
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title="Cập nhật User Story"
        open={isUpdateModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form
          form={form}
          name="updateUserStoryForm"
          onFinish={handleUpdateUserStory}
          onFinishFailed={onFinishFailed}
          layout="vertical"
        >
          <Form.Item
            name="title"
            label="Tiêu đề"
            rules={[{ required: true, message: "Vui lòng nhập tiêu đề" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="description"
            label="Mô tả"
            rules={[{ required: true, message: "Vui lòng nhập mô tả" }]}
          >
            <Input.TextArea />
          </Form.Item>
          <Form.Item
            name="priority"
            label="Độ ưu tiên"
            rules={[{ required: true, message: "Vui lòng chọn độ ưu tiên" }]}
          >
            <Select options={priorityOptions(t)}></Select>
          </Form.Item>
          <Form.Item
            name="point"
            label="Điểm User Story"
            rules={[
              { required: true, message: "Vui lòng nhập điểm User Story" },
            ]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Cập nhật
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      <CreateTaskModal
        visible={isTaskModalVisible}
        onClose={handleTaskModalClose}
        onSubmit={handleTaskModalSubmit}
      />
    </div>
  );
};

export default ProductBacklogPage;
