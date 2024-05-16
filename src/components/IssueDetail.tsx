"use client";
import React, { useEffect } from "react";
import {
  Button,
  Col,
  Form,
  Input,
  Modal,
  Row,
  Select,
  Space,
  List,
  message,
} from "antd";
import { Avatar, Typography } from "antd";
import { Comment } from "@ant-design/compatible";
import { usePathname } from "next/navigation";
import { IssueComment, List as ListType, Member } from "@/lib/types";
import {
  getColoredIconByIssueType,
  getColoredIconByPriority,
} from "@/lib/utils";
import { useSession } from "next-auth/react";
import { Popconfirm } from "antd";
import { DeleteOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import useSWR, { mutate } from "swr";
import { fetchMembers } from "@/app/api/memberApi";
import {
  createComment,
  deleteComment,
  fetchComments,
} from "@/app/api/commentApi";
import { deleteIssue, updateIssue } from "@/app/api/issuesApi";
import dayjs from "dayjs";

const { confirm } = Modal;

interface IssueDetailModalProps {
  issue: any;
  lists: ListType[] | undefined;
  visible: boolean;
  onClose: () => void;
}

const IssueDetailModal: React.FC<IssueDetailModalProps> = ({
  issue,
  lists,
  visible,
  onClose,
}) => {
  const pathname = usePathname();
  const { data: session } = useSession();
  const projectId = Number(pathname.split("/")[3]);
  const [form] = Form.useForm();

  const formattedUpdatedAt = dayjs(issue.updatedAt).format("DD-MM-YYYY HH:mm");
  const formattedCreatedAt = dayjs(issue.createdAt).format("DD-MM-YYYY HH:mm");

  const { data: members } = useSWR<Member[]>(`members-${projectId}`, () =>
    fetchMembers(projectId)
  );
  const { data: comments } = useSWR<IssueComment[]>(
    `comments-${issue.id}`,
    () => fetchComments(issue.id)
  );

  const typeOptions = [
    { label: <span>{getColoredIconByIssueType(1)} Task</span>, value: 1 },
    { label: <span>{getColoredIconByIssueType(2)} Bug</span>, value: 2 },
    { label: <span>{getColoredIconByIssueType(3)} Review</span>, value: 3 },
  ];

  const priorityOptions = [
    { label: <span>{getColoredIconByPriority(1)} High</span>, value: 1 },
    { label: <span>{getColoredIconByPriority(2)} Medium</span>, value: 2 },
    { label: <span>{getColoredIconByPriority(3)} Low</span>, value: 3 },
  ];

  const reporter = members?.find(
    (member) => member.userId === issue.reporterId
  );
  const defaultAssigneeIds = issue.assignees.map(
    (assignee: { userId: string }) => Number(assignee.userId)
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (issue && members) {
          form.setFieldsValue({
            type: issue.type,
            priority: issue.priority,
            listId: issue.listId,
            assignees: defaultAssigneeIds,
            descr: issue.descr,
            summary: issue.summary,
          });
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [projectId, issue, members, form, defaultAssigneeIds]);

  const handleAddComment = async (commentText: string) => {
    try {
      await createComment(
        session?.user.id,
        issue.id,
        commentText,
        session?.backendTokens.accessToken
      );
      message.success("Comment added successfully");
      mutate(`comments-${issue.id}`);
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    try {
      await deleteComment(commentId, session?.backendTokens.accessToken);
      message.success("Comment deleted successfully");
      mutate(`comments-${issue.id}`);
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  const handleUpdateIssue = async (type: string, value: any) => {
    try {
      await updateIssue(
        issue.id,
        type,
        value,
        projectId,
        session?.backendTokens.accessToken
      );
      message.success("Issue updated successfully");
      mutate(`issues-${projectId}`);
      mutate(`sprint-issues-${projectId}`);
      mutate(`all-issues-${projectId}`);
    } catch (error) {
      console.error("Error updating issue:", error);
    }
  };

  const handleDeteleIssue = async () => {
    try {
      confirm({
        title: "Are you sure you want to delete this issue?",
        icon: <ExclamationCircleOutlined />,
        content: "This action cannot be undone",
        okText: "Yes",
        okButtonProps: { style: { backgroundColor: "#1890ff" } },
        cancelText: "No",
        onOk: async () => {
          await deleteIssue(issue.id, session?.backendTokens.accessToken);
          message.success("Issue deleted successfully");
          onClose();
          mutate(`issues-${projectId}`);
        },
      });
    } catch (error) {
      console.error("Error deleting issue:", error);
    }
  };

  return (
    <Modal
      open={visible}
      onCancel={onClose}
      width={800}
      footer={[
        <Button type="text" danger onClick={handleDeteleIssue} key="1">
          Delete Issue
        </Button>,
      ]}
    >
      <Row>
        <Col span={16}>
          <div className="p-4">
            <Form form={form}>
              <Form.Item
                name="summary"
                labelCol={{ span: 24 }}
                wrapperCol={{ span: 24 }}
              >
                <Input
                  className="mb-4 font-bold text-2xl"
                  style={{
                    border: "none",
                    outline: "none",
                    borderBottom: "1px solid #ccc",
                  }}
                  onPressEnter={(e) => {
                    handleUpdateIssue(
                      "summary",
                      (e.target as HTMLInputElement).value
                    );
                  }}
                />
              </Form.Item>
              <Form.Item
                label="Description"
                name="descr"
                labelCol={{ span: 24 }}
                wrapperCol={{ span: 24 }}
              >
                <Input.TextArea
                  className="mb-4"
                  style={{
                    border: "none",
                    outline: "none",
                    borderBottom: "1px solid #ccc",
                  }}
                  onPressEnter={(e) => {
                    handleUpdateIssue(
                      "descr",
                      (e.target as HTMLInputElement).value
                    );
                  }}
                ></Input.TextArea>
              </Form.Item>
            </Form>
            <List
              className="comment-list max-h-[450px] overflow-y-auto"
              header={`${comments?.length} comments`}
              itemLayout="horizontal"
              dataSource={comments}
              renderItem={(comment: any) => (
                <li>
                  <div className="flex justify-between items-center">
                    <div>
                      <Comment
                        author={
                          <Typography.Text style={{ fontSize: "16px" }}>
                            {comment.name}
                          </Typography.Text>
                        }
                        avatar={
                          <Avatar src={comment.avatar} alt={comment.name} />
                        }
                        content={comment.descr}
                        datetime={new Date(comment.createdAt).toLocaleString()}
                      />
                    </div>
                    {session?.user.id === comment.userId && (
                      <Popconfirm
                        title="Are you sure you want to delete this comment?"
                        onConfirm={() => handleDeleteComment(comment.id)}
                        okText="Yes"
                        okButtonProps={{
                          style: { backgroundColor: "#1890ff" },
                        }}
                        cancelText="No"
                      >
                        <Button type="text" danger icon={<DeleteOutlined />} />
                      </Popconfirm>
                    )}
                  </div>
                </li>
              )}
            />
            <Form
              layout="vertical"
              onFinish={(values) => handleAddComment(values.comment)}
            >
              <Row gutter={16}>
                <Col span={24}>
                  <Form.Item
                    label="Add Comment"
                    name="comment"
                    rules={[
                      { required: true, message: "Please input comment" },
                    ]}
                  >
                    <Input.TextArea />
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={24} className="text-right">
                  <Button
                    type="primary"
                    htmlType="submit"
                    style={{ backgroundColor: "#1890ff" }}
                  >
                    Add Comment
                  </Button>
                </Col>
              </Row>
            </Form>
          </div>
        </Col>
        <Col span={8}>
          <Form form={form} layout="vertical">
            <div className="p-4">
              <Space direction="vertical" size={8}>
                <Form.Item
                  label="Type"
                  name="type"
                  labelCol={{ span: 24 }}
                  wrapperCol={{ span: 24 }}
                >
                  <Select
                    style={{ width: "100%" }}
                    options={typeOptions}
                    placeholder="Select Type"
                    onChange={(value) => handleUpdateIssue("type", value)}
                  />
                </Form.Item>
                <Form.Item
                  label="Priority"
                  name="priority"
                  labelCol={{ span: 24 }}
                  wrapperCol={{ span: 24 }}
                >
                  <Select
                    style={{ width: "100%" }}
                    placeholder="Select Priority"
                    options={priorityOptions}
                    onChange={(value) => handleUpdateIssue("priority", value)}
                  />
                </Form.Item>
                <Form.Item
                  label="Status"
                  name="listId"
                  labelCol={{ span: 24 }}
                  wrapperCol={{ span: 24 }}
                >
                  <Select
                    style={{ width: "100%" }}
                    placeholder="Select List"
                    onChange={(value) => handleUpdateIssue("listId", value)}
                  >
                    {lists?.map((list: any) => (
                      <Select.Option key={list.id} value={list.id}>
                        {list.name}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>

                <Form.Item
                  label="Reporter"
                  labelCol={{ span: 24 }}
                  wrapperCol={{ span: 24 }}
                >
                  <div className="border border-gray-300 rounded-md p-2 cursor-not-allowed">
                    <Typography.Text>
                      {reporter ? <Avatar src={reporter.avatar} /> : null}{" "}
                      {reporter ? reporter.name : null}
                    </Typography.Text>
                  </div>
                </Form.Item>

                <Form.Item
                  label="Assignees"
                  name="assignees"
                  labelCol={{ span: 24 }}
                  wrapperCol={{ span: 24 }}
                >
                  <Select
                    mode="multiple"
                    style={{ width: "100%" }}
                    placeholder="Select Assignees"
                    onChange={(value) =>
                      handleUpdateIssue("addAssignee", value)
                    }
                  >
                    {members &&
                      members.map((member: Member) => (
                        <Select.Option
                          key={member.userId}
                          value={member.userId}
                        >
                          {member.name}
                        </Select.Option>
                      ))}
                  </Select>
                </Form.Item>

                <Typography.Text type="secondary">
                  Updated At: {formattedCreatedAt}
                </Typography.Text>
                <Typography.Text type="secondary">
                  Created At: {formattedUpdatedAt}
                </Typography.Text>
              </Space>
            </div>
          </Form>
        </Col>
      </Row>
    </Modal>
  );
};

export default IssueDetailModal;
