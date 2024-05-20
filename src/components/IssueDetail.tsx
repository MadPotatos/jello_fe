"use client";
import React, { useEffect, useState } from "react";
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
  DatePicker,
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
import {
  DeleteOutlined,
  ExclamationCircleOutlined,
  PlusOutlined,
  CheckOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import useSWR, { mutate } from "swr";
import { fetchMembers } from "@/app/api/memberApi";
import {
  createComment,
  deleteComment,
  fetchComments,
} from "@/app/api/commentApi";
import {
  createIssue,
  deleteIssue,
  fetchSubIssues,
  updateIssue,
} from "@/app/api/issuesApi";
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
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [descriptionValue, setDescriptionValue] = useState("");
  const [showAddSubIssueInput, setShowAddSubIssueInput] = useState(false);
  const [selectedSubIssue, setSelectedSubIssue] = useState<any | null>(null);
  const [isSubIssueModalVisible, setIsSubIssueModalVisible] = useState(false);

  const handleDescriptionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setDescriptionValue(e.target.value);
  };

  const handleEditDescription = () => {
    setIsEditingDescription(true);
  };

  const formattedUpdatedAt = dayjs(issue.updatedAt).format("DD-MM-YYYY HH:mm");
  const formattedCreatedAt = dayjs(issue.createdAt).format("DD-MM-YYYY HH:mm");

  const { data: members } = useSWR<Member[]>(`members-${projectId}`, () =>
    fetchMembers(projectId)
  );
  const { data: comments } = useSWR<IssueComment[]>(
    `comments-${issue.id}`,
    () => fetchComments(issue.id)
  );
  const { data: subIssues } = useSWR(`sub-issues-${issue.id}`, () =>
    fetchSubIssues(issue.id)
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
            progress: issue.progress,
            dueDate: issue.dueDate ? dayjs(issue.dueDate) : "",
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
  }, [issue, members, form]);

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
      mutate(`issues-${projectId}`);
      mutate(`sprint-issues-${projectId}`);
      mutate(`all-issues-${projectId}`);
    } catch (error) {
      console.error("Error updating issue:", error);
    }
  };

  const handleDescriptionSubmit = async () => {
    const newDescr = form.getFieldValue("descr");
    if (newDescr !== issue.descr) {
      await handleUpdateIssue("descr", newDescr);
    }
    setIsEditingDescription(false);
  };

  const handleSubmitSubIssue = async (values: any) => {
    try {
      values.listId = issue.listId;
      values.sprintId = issue.sprintId;
      values.projectId = projectId;
      values.reporterId = session?.user.id;
      values.type = 4;
      values.parentId = issue.id;
      await createIssue(values, session?.backendTokens.accessToken);
      mutate(`sub-issues-${issue.id}`);
      mutate(`sprint-issues-${projectId}`);
      mutate(`all-issues-${projectId}`);
      mutate(`issues-${projectId}`);
      setShowAddSubIssueInput(false);
      message.success("Issue created successfully!");
    } catch (error) {
      console.error("Error adding sub issue:", error);
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

  const handleCloseModal = () => {
    setShowAddSubIssueInput(false);
    setIsEditingDescription(false);
    onClose();
  };

  const handleSubIssueClick = (subIssue: any) => {
    setSelectedSubIssue(subIssue);
    setIsSubIssueModalVisible(true);
  };

  return (
    <Modal
      open={visible}
      onCancel={handleCloseModal}
      width={1000}
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
                    height: "200px",
                  }}
                  value={descriptionValue}
                  onChange={handleDescriptionChange}
                  onFocus={handleEditDescription}
                  onBlur={() => setIsEditingDescription(false)}
                />
              </Form.Item>
              {isEditingDescription ? (
                <Form.Item>
                  <Button type="primary" onClick={handleDescriptionSubmit}>
                    Submit
                  </Button>
                </Form.Item>
              ) : (
                <div></div>
              )}
            </Form>
            {issue.type !== 4 && (
              <Form.Item>
                <div className="flex items-center justify-between">
                  <div className="font-base font-bold mb-3">
                    Sub Issues: {subIssues?.length}
                  </div>
                  <Button
                    type="text"
                    icon={<PlusOutlined />}
                    onClick={() => setShowAddSubIssueInput(true)}
                  ></Button>
                </div>

                <List
                  className="max-h-[170px] overflow-y-auto"
                  locale={{
                    emptyText: <div></div>,
                  }}
                  dataSource={subIssues}
                  renderItem={(issue: any, issueIndex: number) => (
                    <div
                      className="border border-gray-200 py-3 px-6 bg-white hover:bg-gray-200 flex justify-between items-center"
                      onClick={() => handleSubIssueClick(issue)}
                    >
                      <div className="flex items-center justify-between gap-6 text-lg">
                        <div>{getColoredIconByIssueType(issue.type)}</div>
                        <p>{issue.summary}</p>
                      </div>

                      <div className="flex items-center gap-8 text-lg">
                        <div>{getColoredIconByPriority(issue.priority)}</div>
                        <Avatar.Group
                          maxCount={2}
                          maxStyle={{
                            color: "#f56a00",
                            backgroundColor: "#fde3cf",
                          }}
                          style={{ minWidth: "80px" }}
                        >
                          {issue.assignees && issue.assignees.length > 0 ? (
                            issue.assignees.map((assignee: any) => (
                              <Avatar
                                key={assignee.userId}
                                src={
                                  assignee.User.avatar ||
                                  "/images/default_avatar.jpg"
                                }
                              />
                            ))
                          ) : (
                            <span></span>
                          )}
                        </Avatar.Group>
                      </div>
                    </div>
                  )}
                ></List>
                {showAddSubIssueInput && (
                  <Form
                    onFinish={handleSubmitSubIssue}
                    layout="horizontal"
                    initialValues={{
                      summary: "",
                      priority: 1,
                    }}
                    className="border border-gray-200 p-3 flex justify-between bg-white"
                  >
                    <Form.Item
                      name="summary"
                      rules={[
                        {
                          required: true,
                          message: "Please enter issue summary",
                        },
                        {
                          max: 100,
                          message: "Summary must be at most 100 characters",
                        },
                      ]}
                    >
                      <Input
                        placeholder="What needs to be done?"
                        variant="borderless"
                        autoFocus
                      />
                    </Form.Item>

                    <div className="flex gap-2">
                      <Form.Item name="priority">
                        <Select
                          placeholder="Select priority"
                          style={{ minWidth: "100px" }}
                        >
                          <Select.Option value={1}>
                            {getColoredIconByPriority(1)} High
                          </Select.Option>
                          <Select.Option value={2}>
                            {getColoredIconByPriority(2)} Medium
                          </Select.Option>
                          <Select.Option value={3}>
                            {getColoredIconByPriority(3)} Low
                          </Select.Option>
                        </Select>
                      </Form.Item>

                      <Button type="primary" htmlType="submit">
                        <CheckOutlined />
                      </Button>
                      <Button
                        type="default"
                        danger
                        onClick={() => setShowAddSubIssueInput(false)}
                      >
                        <CloseOutlined />
                      </Button>
                    </div>
                  </Form>
                )}
              </Form.Item>
            )}
            <Form.Item
              label={`Comments: ${comments?.length}`}
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
            >
              <List
                className="comment-list max-h-[250px] overflow-y-auto"
                itemLayout="horizontal"
                dataSource={comments}
                renderItem={(comment: any) => (
                  <li key={comment.id}>
                    <div className="flex justify-between items-center">
                      <div>
                        <Comment
                          author={
                            <Typography.Text className="text-base">
                              {comment.name}
                            </Typography.Text>
                          }
                          avatar={
                            <Avatar src={comment.avatar} alt={comment.name} />
                          }
                          content={comment.descr}
                          datetime={dayjs(comment.createdAt).format(
                            "DD-MM-YYYY HH:mm"
                          )}
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
                          <Button
                            type="text"
                            danger
                            icon={<DeleteOutlined />}
                          />
                        </Popconfirm>
                      )}
                    </div>
                  </li>
                )}
              />
            </Form.Item>
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
                  <Button type="primary" htmlType="submit">
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
                {issue.type !== 4 && (
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
                )}
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
                  label="Progress"
                  name="progress"
                  labelCol={{ span: 24 }}
                  wrapperCol={{ span: 24 }}
                >
                  <Select
                    style={{ width: "100%" }}
                    placeholder="Select progress"
                    onChange={(value) => handleUpdateIssue("progress", value)}
                  >
                    <Select.Option value={0}>0%</Select.Option>
                    <Select.Option value={25}>25%</Select.Option>
                    <Select.Option value={50}>50%</Select.Option>
                    <Select.Option value={75}>75%</Select.Option>
                    <Select.Option value={100}>100%</Select.Option>
                  </Select>
                </Form.Item>

                <Form.Item
                  label="Due Date"
                  name="dueDate"
                  labelCol={{ span: 24 }}
                  wrapperCol={{ span: 24 }}
                >
                  <DatePicker
                    disabledDate={(current) =>
                      current && current < dayjs().startOf("day")
                    }
                    format="DD-MM-YYYY"
                    style={{ width: "100%" }}
                    onChange={(date) => handleUpdateIssue("dueDate", date)}
                  />
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
                          <Avatar src={member.avatar} className="mr-2" />
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
      {selectedSubIssue && (
        <IssueDetailModal
          issue={selectedSubIssue}
          lists={lists}
          visible={isSubIssueModalVisible}
          onClose={() => setIsSubIssueModalVisible(false)}
        />
      )}
    </Modal>
  );
};

export default IssueDetailModal;
