import React, { useState } from "react";
import { Modal, Select, message, notification } from "antd";
import { addIssueToSprint, fetchIssuesNotInSprint } from "@/app/api/issuesApi";

interface AddTaskFromUserStoryProps {
  visible: boolean;
  userStories: any[];
  onCancel: () => void;
  onUpdate: () => void;
  sprintId: number;
}

const AddTaskFromUserStory: React.FC<AddTaskFromUserStoryProps> = ({
  visible,
  userStories,
  onCancel,
  onUpdate,
  sprintId,
}) => {
  const [selectedUserStoryId, setSelectedUserStoryId] = useState<number | null>(
    null
  );
  const [selectedIssueId, setSelectedIssueId] = useState<number | null>(null);
  const [issuesNotInSprint, setIssuesNotInSprint] = useState<any[]>([]);

  const handleUserStoryChange = async (value: number) => {
    setSelectedUserStoryId(value);
    try {
      const issues = await fetchIssuesNotInSprint(value);
      setIssuesNotInSprint(issues);
    } catch (error) {
      console.error("Error fetching issues:", error);
      message.error("Failed to fetch issues");
    }
  };

  const handleIssueChange = (value: number) => {
    setSelectedIssueId(value);
  };

  const handleCancel = () => {
    setSelectedUserStoryId(null);
    setSelectedIssueId(null);
    setIssuesNotInSprint([]);
    onCancel();
  };

  const handleAddTask = async () => {
    if (!selectedUserStoryId || !selectedIssueId) {
      message.error("Please select a user story and an issue");
      return;
    }
    await addIssueToSprint(selectedIssueId, sprintId);
    notification.success({
      message: "Thêm task thành công",
    });
    onUpdate();
  };

  return (
    <Modal
      title="Thêm công việc từ User Story vào Sprint"
      open={visible}
      onCancel={handleCancel}
      onOk={handleAddTask}
      okText="Tạo task"
      cancelText="Huy"
    >
      <div className="flex gap-4 items-center mb-4">
        <span>Chọn User Story:</span>
        <Select
          style={{ width: 200 }}
          onChange={handleUserStoryChange}
          placeholder="Chọn User Story"
        >
          {userStories.map((userStory) => (
            <Select.Option key={userStory.id} value={userStory.id}>
              {userStory.title}
            </Select.Option>
          ))}
        </Select>
      </div>
      <div className="flex gap-4 items-center">
        <span>Chọn công việc:</span>
        <Select
          style={{ width: 200 }}
          onChange={handleIssueChange}
          placeholder="Chọn công việc"
          disabled={!selectedUserStoryId}
        >
          {issuesNotInSprint.map((issue) => (
            <Select.Option key={issue.id} value={issue.id}>
              {issue.summary}
            </Select.Option>
          ))}
        </Select>
      </div>
    </Modal>
  );
};

export default AddTaskFromUserStory;
