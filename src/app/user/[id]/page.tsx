"use client";
import { useState } from 'react';
import { Form, Input, Button, Avatar, Spin, message, notification, Modal, Card } from 'antd';
import {useSession} from 'next-auth/react';
import { usePathname } from 'next/navigation';
import UploadImage from '@/components/UploadImage';
import { EditOutlined ,CheckCircleOutlined} from '@ant-design/icons';
import { Project, User } from '@/lib/types';
import { Typography } from 'antd';
import useSWR, { mutate } from 'swr';
import { fetchProjects } from '@/app/api/projectApi';
import { fetchUser, updateAvatar, updateUser } from '@/app/api/userApi';

const { Title, Text } = Typography;

const { Item } = Form;

const Profile = () => {
  const [editable, setEditable] = useState(false);
  const { data: session,update } = useSession();
  const pathname = usePathname();
  const [isModalVisible, setIsModalVisible] = useState(false);

  const userId: number = parseInt(pathname.split('/')[2]);

  const { data: projects } = useSWR<Project[]>(`project-all-${userId}`, () => fetchProjects(userId));
  const { data: user } = useSWR<User>(`user-profile-${userId}`, () => fetchUser(userId) || {} as User);

  const [image, setImage] = useState<string>(user?.avatar || "");

  const showSuccessNotification = () => {
    notification.success({
      message: 'Profile Updated',
      description: 'Your profile has been updated successfully.',
    });
  };

  const showEmailTakenNotification = () => {
    notification.error({
      message: 'Email Already Taken',
      description: 'The email address is already in use. Please choose a different email.',
    });
  };

  const handleUpdateInfo = async (values: any) => {
    try {
      await updateUser(user?.id, values, session?.backendTokens.accessToken);
      setEditable(false);
      showSuccessNotification();
      await update();
      mutate(`user-profile-${userId}`);
    } catch (error) {
      if ((error as Error).message === 'Email already taken') {
        showEmailTakenNotification();
      } else {
        message.error('Failed to update profile. Please try again.');
      }
    }
  };

  const handleUpdateAvatar = async () => {
    try {
      // Check if the user has uploaded a new image
      if (image !== null) {
        await updateAvatar(user?.id, image, session?.backendTokens.accessToken);
        handleCancel();
        showSuccessNotification();
        await update();
        mutate(`user-profile-${userId}`);
      } else {
        message.warning('Please choose a new avatar to update.');
      }
    } catch (error) {
      message.error('Failed to update avatar. Please try again.');
    }
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleEditCancel = () => {
    setEditable(false);
  };

   return (
    <div className="h-full bg-gradient-to-b from-white to-purple-200 py-8 px-28 flex flex-col items-center space-y-4">

      <Card
        className="w-full"
        cover={
          <img
            alt="Profile Background"
            src="/images/profile-background.jpg"
            className="rounded-tl-lg rounded-tr-lg"
          />
        }
      >
        <div className="flex flex-col items-center -mt-20">
          <Avatar
            src={user?.avatar}
            alt={`${user?.name}'s avatar`}
            size={160}
            onClick={() => session?.user?.id === user?.id && showModal()}
            className="cursor-pointer"
            style={{ border: '4px solid #fff' }}
          />
          <div className="flex items-center space-x-2 mt-2">
            <p className="text-2xl">{user?.name}</p>
            <CheckCircleOutlined style={{ color: '#1890ff' }} />
          </div>
          <p className="text-gray-700">{user?.job}</p>
          <p className="text-sm text-gray-500">{user?.organization}</p>
        </div>
        
      </Card>
      <div className="flex space-x-4 w-full">
        <Card className="flex-1 mt-4">
          {editable ? (
            <Form
              onFinish={handleUpdateInfo}
              initialValues={{
                name: user?.name,
                email: user?.email,
                job: user?.job,
                organization: user?.organization,
              }}
            >
              <Item label="Full name" name="name" rules={[{ required: true }]}>
                <Input />
              </Item>
              <Item label="Email" name="email" rules={[{ required: true, type: 'email' }]}>
                <Input />
              </Item>
              <Item label="Job title" name="job">
                <Input />
              </Item>
              <Item label="Organization" name="organization">
                <Input />
              </Item>
              <Item>
                <Button type="primary" htmlType="submit" style={{ backgroundColor: '#1890ff' }}>
                  Save
                </Button>
                <Button onClick={handleEditCancel} className="ml-2">
                  Cancel
                </Button>
              </Item>
            </Form>
          ) : (
            <div>
              <div className="flex items-center justify-between">
                <h4 className="text-xl text-gray-900 font-bold">Personal Info</h4>
                {session?.user?.id === user?.id && (
                  <EditOutlined
                    style={{ fontSize: '20px', color: '#1890ff', cursor: 'pointer' }}
                    onClick={() => setEditable(true)}
                  />
                )}
              </div>
              <ul className="mt-2 text-gray-700">
                <li className="flex border-y py-2">
                  <span className="font-bold w-24">Full name:</span>
                  <span className="text-gray-700">{user?.name}</span>
                </li>
                <li className="flex border-b py-2">
                  <span className="font-bold w-24">Email:</span>
                  <span className="text-gray-700">{user?.email}</span>
                </li>
                <li className="flex border-b py-2">
                  <span className="font-bold w-24">Job title:</span>
                  <span className="text-gray-700">{user?.job}</span>
                </li>
                <li className="flex border-b py-2">
                  <span className="font-bold w-24">Organization:</span>
                  <span className="text-gray-700">{user?.organization}</span>
                </li>
              </ul>
            </div>
          )}
        </Card>

        {/* Project List */}
         <Card className="flex-1 mt-4" title="PROJECTS">
  <div className="overflow-x-scroll max-w-3xl flex flex-row h-96 space-x-4">
    {projects && projects.length > 0 ? (
      projects.map((project: Project) => (
        <div key={project.id} className="mb-4">
          <Card className="w-80 shadow-lg border border-gray-300 rounded-lg">
            <div className="flex flex-col items-center">
              <Title level={4} className="mb-2">{project.name}</Title>
              <img alt={project.name} src={project.image} className="h-40 w-full object-cover mb-4" />
              <Text className="mb-4">{project.description}</Text>
              <div className="flex items-center">
                <span className="font-semibold">Leader:</span>
                {project.leader && (
                  <Avatar src={project.leader.avatar} size={32} className="ml-2" />
                )}
                <Text className="ml-2">{project.leader?.name}</Text>
              </div>
            </div>
          </Card>
        </div>
      ))
    ) : (
      <p>No projects found.</p>
    )}
  </div>
</Card>


      </div>
   

      <Modal
        title="Update Avatar"
        open={isModalVisible}
        onOk={handleUpdateAvatar}
        onCancel={handleCancel}
        okButtonProps={{style: {backgroundColor: '#1890ff'}}}
      >
        <UploadImage image={image} setImage={setImage} />
      </Modal>
    </div>
  );
};

export default Profile;