"use client";
import { useState, useEffect } from 'react';
import { Form, Input, Button, Avatar, Spin, message, notification, Modal, Card } from 'antd';
import { Backend_URL } from '@/lib/Constants';
import {useSession} from 'next-auth/react';
import { usePathname } from 'next/navigation';
import UploadImage from '@/components/UploadImage';
import { EditOutlined ,CheckCircleOutlined} from '@ant-design/icons';

const { Item } = Form;

const Profile = () => {
  const [user, setUser] = useState<any>({});
  const [editable, setEditable] = useState(false);
  const [loading, setLoading] = useState(false);
  const { data: session,update } = useSession();
  const pathname = usePathname();
  const [image, setImage] = useState<string>(user.avatar || "");
  const [isModalVisible, setIsModalVisible] = useState(false);

  const updateUser = async ({ id, name, email,job,organization}: any) => {
    try {
      const response = await fetch(`${Backend_URL}/user/profile/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${session?.backendTokens.accessToken}`,
        },
        body: JSON.stringify({ name, email ,job,organization}),
      });
      const data = await response.json();
      if (response.status === 409) {
        throw new Error('Email already taken');
      }
      return data;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  };

    const updateAvatar = async (id: number, avatar: string) => {
        try {
        const response = await fetch(`${Backend_URL}/user/${id}/avatar`, {
            method: 'PUT',
            headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${session?.backendTokens.accessToken}`,
            },
            body: JSON.stringify({ avatar }),
        });
        const data = await response.json();
        return data;
        } catch (error) {
        console.error('Error updating avatar:', error);
        throw error;
        }
    };

  const fetchUser = async (id: number) => {
    try {
      const response = await fetch(`${Backend_URL}/user/${id}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
  };

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
      await updateUser({ id: user.id, ...values });
      setEditable(false);
      showSuccessNotification();
       await update();
     window.location.reload();
     
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
        await updateAvatar(user.id, image);
        showSuccessNotification();
        window.location.reload();
      } else {
        message.warning('Please choose a new avatar to update.');
      }
    } catch (error) {
      message.error('Failed to update avatar. Please try again.');
    }
  };




  useEffect(() => {
    const id: number = parseInt(pathname.split('/')[2], 10);

    const fetchData = async () => {
      setLoading(true);
      try {
        const userData = await fetchUser(id);
        setUser(userData);
      } catch (error) {
        console.error('Error fetching user:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [pathname]);

 

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
    <div className="h-full bg-gray-200 py-8 px-28 flex flex-col items-center space-y-4">

      <Card
        className="w-full"
        cover={
          <img
            alt="Profile Background"
            src="https://vojislavd.com/ta-template-demo/assets/img/profile-background.jpg"
            className="rounded-tl-lg rounded-tr-lg"
          />
        }
      >
        <div className="flex flex-col items-center -mt-20">
          <Avatar
            src={user.avatar}
            alt={`${user.name}'s avatar`}
            size={160}
            onClick={() => session?.user?.id === user.id && showModal()}
            className="cursor-pointer"
            style={{ border: '4px solid #fff' }}
          />
          <div className="flex items-center space-x-2 mt-2">
            <p className="text-2xl">{user.name}</p>
            <CheckCircleOutlined style={{ color: '#1890ff' }} />
          </div>
          <p className="text-gray-700">{user.job}</p>
          <p className="text-sm text-gray-500">{user.organization}</p>
        </div>
        
      </Card>
      <div className="flex space-x-4 w-full">
        <Card className="flex-1 mt-4">
          {editable ? (
            <Form
              onFinish={handleUpdateInfo}
              initialValues={{
                name: user.name,
                email: user.email,
                job: user.job,
                organization: user.organization,
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
                {session?.user?.id === user.id && (
                  <EditOutlined
                    style={{ fontSize: '20px', color: '#1890ff', cursor: 'pointer' }}
                    onClick={() => setEditable(true)}
                  />
                )}
              </div>
              <ul className="mt-2 text-gray-700">
                <li className="flex border-y py-2">
                  <span className="font-bold w-24">Full name:</span>
                  <span className="text-gray-700">{user.name}</span>
                </li>
                <li className="flex border-b py-2">
                  <span className="font-bold w-24">Email:</span>
                  <span className="text-gray-700">{user.email}</span>
                </li>
                <li className="flex border-b py-2">
                  <span className="font-bold w-24">Job title:</span>
                  <span className="text-gray-700">{user.job}</span>
                </li>
                <li className="flex border-b py-2">
                  <span className="font-bold w-24">Organization:</span>
                  <span className="text-gray-700">{user.organization}</span>
                </li>
              </ul>
            </div>
          )}
        </Card>

        {/* Project List */}
        <Card className="flex-1 mt-4" title="PROJECT">
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Nesciunt
            voluptates obcaecati numquam error et ut fugiat asperiores. Sunt
            nulla ad incidunt laboriosam, laudantium est unde natus cum numquam,
            neque facere. Lorem ipsum dolor sit amet consectetur adipisicing
            elit. Ut, magni odio magnam commodi sunt ipsum eum! Voluptas
            eveniet aperiam at maxime, iste id dicta autem odio laudantium
            eligendi com
          </p>
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