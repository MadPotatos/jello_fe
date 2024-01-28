import React, { useState } from 'react';
import { Input, Avatar, Button, Modal, Select, message, Typography } from 'antd';
import { UserAddOutlined } from '@ant-design/icons';
import { debounce } from 'lodash';
import { Backend_URL } from '@/lib/Constants';
import { usePathname } from 'next/navigation';
import { Member, User } from '@/lib/types';

interface FilterProps {
  members: Member[];
  onSearch: (query: string) => void;
  onAddMember: () => void;
}

const Filter: React.FC<FilterProps> = ({ members, onSearch,onAddMember }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchedUsers, setSearchedUsers] = useState<User[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const pathname = usePathname();
  const projectId = Number(pathname.split('/')[3]);

  const debouncedSearch = debounce(async (value: string) => {
    try {
      const response = await fetch(`${Backend_URL}/user/searchbyName?name=${value}`);
      const data = await response.json();
      setSearchedUsers(data.users);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  }, 300); 

  const handleUserSearch = (value: string) => {
    debouncedSearch(value); 
  };

  const handleAddMember = async () => {
  if (selectedUserId) {
    try {
      // Check if the user is already a member
      const isAlreadyMember = members.some(member => member.userId === selectedUserId);      
      if (isAlreadyMember) {
        message.error('User is already a member');
        return; 
      }

      await fetch(`${Backend_URL}/member/${projectId}/${selectedUserId}`,{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      message.success('Member added successfully');
      onAddMember();

      setSelectedUserId(null);
      handleCancel();
    } catch (error) {
      console.error('Error adding member:', error);
      message.error('Failed to add member');
    }
  } else {
    message.error('Please select a user');
  }
};


  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <div className="flex justify-between items-center mb-4 px-8">
      <div className="flex items-center">
        <Input.Search
          placeholder="Search issues"
          onSearch={onSearch}
        />
        <div className="ml-4">
          <Avatar.Group maxCount={5}>
            {members.map((member: Member) => (
              <Avatar key={member.userId} src={member.avatar} alt={member.name} size={40} />
            ))}
          </Avatar.Group>
        </div>
        <Button
        type="text"
        shape="circle"
        icon={<UserAddOutlined />}
        size="large"
        style={{ marginLeft: '10px', backgroundColor: '#d8d9dc' }}
        onClick={showModal}
      />
      </div>
      
      <Modal
        title="Add Member"
        open={isModalVisible}
        onCancel={handleCancel}
        footer={[
          <Button key="cancel" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button key="add" type="primary" onClick={handleAddMember} style={{ backgroundColor: '#1890ff' }}>
            Add Member
          </Button>,
        ]}
        className="rounded-lg shadow-md"
      >
        <Select
          value={selectedUserId}
          placeholder="Search user"
          showSearch
          onSearch={handleUserSearch}
          style={{ width: '100%' }}
          filterOption={false}
          onChange={(value: number) => setSelectedUserId(value)}
        >
          {searchedUsers.map((user: User) => (
            <Select.Option key={user.id} value={user.id}>
              <div className="flex items-center">
                <Avatar src={user.avatar} alt={user.name} size={24} />
                <div className="ml-2">
                  <strong>{user.name}</strong> ({user.email})
                </div>
              </div>
            </Select.Option>
          ))}
        </Select>
        <div className="prose mt-4">
      <Typography.Text strong>Member Capabilities:</Typography.Text>
      <ul className="list-disc pl-6">
        <li>Access project resources and features</li>
        <li>Contribute to tasks and discussions</li>
        <li>Invite other members</li>
      </ul>
    </div>
      </Modal>
    </div>
  );
};

export default Filter;
