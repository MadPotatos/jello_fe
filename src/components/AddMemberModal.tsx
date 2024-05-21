import React, { useState } from "react";
import { Button, Modal, Select, Avatar, Typography, message } from "antd";
import { useSession } from "next-auth/react";
import { addMember } from "@/app/api/memberApi";
import { searchUsers } from "@/app/api/userApi";
import { Member, User } from "@/lib/types";
import { mutate } from "swr";
import { debounce } from "lodash";

interface AddMemberModalProps {
  isVisible: boolean;
  onCancel: () => void;
  projectId: number;
  members: Member[] | undefined;
}

const AddMemberModal: React.FC<AddMemberModalProps> = ({
  isVisible,
  onCancel,
  projectId,
  members,
}) => {
  const [searchedUsers, setSearchedUsers] = useState<User[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const { data: session } = useSession();

  const debouncedSearch = debounce(async (value: string) => {
    try {
      const data = await searchUsers(value);
      setSearchedUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  }, 300);

  const handleUserSearch = (value: string) => {
    debouncedSearch(value);
  };

  const handleAddMember = async () => {
    if (selectedUserId) {
      try {
        const isAlreadyMember = members?.some(
          (member) => member.userId === selectedUserId
        );
        if (isAlreadyMember) {
          message.error("User is already a member");
          return;
        }
        await addMember(
          projectId,
          selectedUserId,
          session?.backendTokens.accessToken
        );
        message.success("Member added successfully");
        mutate(`members-${projectId}`);
        setSelectedUserId(null);
        onCancel();
      } catch (error) {
        message.error("Failed to add member");
      }
    } else {
      message.error("Please select a user");
    }
  };
  return (
    <Modal
      title="Add Member"
      open={isVisible}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Cancel
        </Button>,
        <Button key="add" type="primary" onClick={handleAddMember}>
          Add Member
        </Button>,
      ]}
    >
      <Select
        value={selectedUserId}
        placeholder="Search user"
        showSearch
        onSearch={handleUserSearch}
        style={{ width: "100%" }}
        filterOption={false}
        onChange={(value: number) => setSelectedUserId(value)}
        options={searchedUsers.map((user) => ({
          value: user.id,
          label: (
            <div className="flex items-center">
              <Avatar src={user.avatar} alt={user.name} size={24} />
              <div className="ml-2">
                {user.name} ({user.email})
              </div>
            </div>
          ),
        }))}
      />
      <div className="prose mt-4">
        <Typography.Text strong>Member Capabilities:</Typography.Text>
        <ul className="list-disc pl-6">
          <li>Access project resources and features</li>
          <li>Contribute to tasks and discussions</li>
          <li>Invite other members</li>
        </ul>
      </div>
    </Modal>
  );
};

export default AddMemberModal;
