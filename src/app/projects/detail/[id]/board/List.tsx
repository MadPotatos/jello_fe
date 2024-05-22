import React, { useEffect, useState } from "react";
import { Droppable } from "@hello-pangea/dnd";
import { Button, Input, Modal, Select, message, Form } from "antd";
import {
  EditOutlined,
  CheckOutlined,
  CloseOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import Issue from "./Issue";
import { useSession } from "next-auth/react";
import {
  getColoredIconByIssueType,
  getColoredIconByPriority,
  priorityOptions,
  typeOptions,
} from "@/lib/utils";

import { mutate } from "swr";
import { usePathname } from "next/navigation";
import { deleteList, updateList } from "@/app/api/listApi";
import { createIssue } from "@/app/api/issuesApi";
import { List as ListType } from "@/lib/types";
import dynamic from "next/dynamic";

const IssueDetailModal = dynamic(() => import("@/components/IssueDetail"), {
  ssr: false,
});

const { confirm } = Modal;

interface ListProps {
  list: any;
  lists: ListType[];
  issues: any;
  sprintId: number | undefined;
}

const List: React.FC<ListProps> = ({ list, issues, lists, sprintId }) => {
  const [isCreatingIssue, setIsCreatingIssue] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newListName, setNewListName] = useState(list.name);
  const { data: session } = useSession();
  const [selectedIssue, setSelectedIssue] = useState<any>(null);
  const [visible, setVisible] = useState(false);
  const pathname = usePathname();
  const projectId = Number(pathname.split("/")[3]);

  const handleCreateIssueClick = () => {
    setIsCreatingIssue(true);
  };

  const handleCloseIssueForm = () => {
    setIsCreatingIssue(false);
  };

  useEffect(() => {
    setNewListName(list.name);
  }, [list.name]);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleNameChange = (e: any) => {
    setNewListName(e.target.value);
  };

  const handleIssueClick = (issue: any) => {
    setSelectedIssue(issue);
    setVisible(true);
  };

  const handleSaveClick = async () => {
    try {
      await updateList(list.id, newListName);
      setIsEditing(false);
      mutate(`lists-${projectId}`);
      message.success("List name updated successfully!");
    } catch (error) {
      message.error("Failed to update list name");
    }
  };

  const handleDelete = async () => {
    try {
      confirm({
        title: "Are you sure you want to delete this list?",
        icon: <ExclamationCircleOutlined />,
        content: "This action cannot be undone",
        okText: "Yes",
        okButtonProps: { style: { backgroundColor: "#1890ff" } },
        cancelText: "No",
        onOk: async () => {
          await deleteList(list.id);
          message.success("List deleted successfully");
          mutate(`lists-${projectId}`);
        },
      });
    } catch (error) {
      console.error("Error deleting list:", error);
    }
  };

  const handleSubmitIssue = async (values: any) => {
    try {
      values.listId = list.id;
      values.sprintId = sprintId;
      values.projectId = projectId;
      values.reporterId = session?.user.id;
      await createIssue(values, session?.backendTokens.accessToken);
      mutate(`issues-${projectId}`);
      setIsCreatingIssue(false);
      message.success("Issue created successfully!");
    } catch (error) {
      console.error("Error creating issue:", error);
      message.error("Failed to create issue");
    }
  };

  return (
    <div className="flex flex-col bg-gray-100 shadow-md mb-4 p-4 group">
      <div className="flex items-center justify-between border-gray-200 pb-4">
        {isEditing ? (
          <div className="flex items-center">
            <Input
              value={newListName}
              onChange={handleNameChange}
              placeholder={list.name}
              className="bg-transparent text-lg font-medium text-gray-900"
            />
          </div>
        ) : (
          <div className="text-lg font-medium text-gray-900">{newListName}</div>
        )}

        {isEditing ? (
          <div className="flex">
            <Button type="text" onClick={handleSaveClick}>
              <CheckOutlined style={{ color: "#39e75f" }} />
            </Button>
            <Button type="text" onClick={() => setIsEditing(false)}>
              <CloseOutlined style={{ color: "#f44336" }} />
            </Button>
          </div>
        ) : (
          <div className="flex">
            <Button type="text" onClick={handleEditClick}>
              <EditOutlined />
            </Button>
            <Button type="text" danger onClick={handleDelete}>
              <DeleteOutlined />
            </Button>
          </div>
        )}
      </div>
      <Droppable droppableId={`list-${list.id}`} type="ISSUE">
        {(provided) => (
          <div ref={provided.innerRef} {...provided.droppableProps}>
            {issues && Array.isArray(issues)
              ? issues.map((issue: any, innerIndex: number) => (
                  <Issue
                    key={issue.id}
                    issue={issue}
                    index={innerIndex}
                    onClick={() => handleIssueClick(issue)}
                  />
                ))
              : null}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
      {sprintId !== undefined && (
        <>
          {isCreatingIssue ? (
            <Form
              onFinish={handleSubmitIssue}
              className="flex flex-col mt-4 bg-white shadow-md"
              layout="vertical"
              initialValues={{
                summary: "",
                type: 1,
                priority: 1,
              }}
            >
              <div className="p-3">
                <Form.Item
                  name="summary"
                  rules={[
                    { required: true, message: "Please enter issue summary" },
                  ]}
                >
                  <Input
                    placeholder="What needs to be done?"
                    variant="borderless"
                  />
                </Form.Item>

                <div className="flex items-center">
                  <Form.Item name="type">
                    <Select
                      placeholder="Select issue type"
                      options={typeOptions}
                    ></Select>
                  </Form.Item>

                  <Form.Item name="priority" style={{ marginLeft: "10px" }}>
                    <Select
                      placeholder="Select priority"
                      options={priorityOptions}
                    ></Select>
                  </Form.Item>
                </div>

                <div className="flex justify-between">
                  <Button type="default" onClick={handleCloseIssueForm}>
                    Cancel
                  </Button>
                  <Button
                    type="primary"
                    htmlType="submit"
                    style={{ backgroundColor: "#1890ff" }}
                  >
                    Create Issue
                  </Button>
                </div>
              </div>
            </Form>
          ) : (
            <Button type="text" size="large" onClick={handleCreateIssueClick}>
              + Add Issue
            </Button>
          )}
        </>
      )}
      {selectedIssue && (
        <IssueDetailModal
          issue={selectedIssue}
          lists={lists}
          visible={visible}
          onClose={() => setVisible(false)}
        />
      )}
    </div>
  );
};

export default List;
