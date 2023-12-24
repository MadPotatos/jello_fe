"use client";
import { useState, useEffect } from 'react';
import { Form, Input, Button, Avatar, Spin, message, notification, Modal } from 'antd';
import { Backend_URL } from '@/lib/Constants';
import { useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import UploadImage from '@/components/UploadImage';

const { Item } = Form;

const Profile = () => {
  const [user, setUser] = useState<any>({});
  const [editable, setEditable] = useState(false);
  const [formData, setFormData] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const { data: session } = useSession();
  const pathname = usePathname();
  const [image, setImage] = useState<string>(user.avatar || "");
  const [isModalVisible, setIsModalVisible] = useState(false);

  const updateUser = async ({ id, name, email}: any) => {
    try {
      const response = await fetch(`${Backend_URL}/user/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${session?.backendTokens.accessToken}`,
        },
        body: JSON.stringify({ name, email }),
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

  const handleUpdateInfo = async () => {
    try {
      await updateUser({ id: user.id, ...formData });
      setEditable(false);
      showSuccessNotification();
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
        // Handle the error as needed
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [pathname]);

  const handleEdit = () => {
    setFormData({
      name: user.name,
      email: user.email,
      avatar: user.avatar,
    });
    setEditable(true);
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <div>
      <h1>{user.name}'s Profile</h1>
      <Avatar 
        src={user.avatar} 
        alt={`${user.name}'s avatar`} 
        size={150} 
        onClick={() => session?.user?.id === user.id && showModal()} 
/>

      <p>Email: {user.email}</p>

      {session?.user?.id === user.id && (
        <div>
          {loading ? (
            <Spin />
          ) : (
            <>
              {editable ? (
                <Form layout="vertical" onFinish={handleUpdateInfo}>
                  <Item label="Name">
                    <Input
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </Item>
                  <Item label="Email">
                    <Input
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </Item>
                  <Item>
                    <Button type="primary" htmlType="submit">
                      Save
                    </Button>
                  </Item>
                </Form>
              ) : (
                <Button type="primary" onClick={handleEdit}>
                  Edit Profile
                </Button>
              )}

              <Modal
                title="Update Avatar"
                open={isModalVisible}
                onOk={handleUpdateAvatar}
                onCancel={handleCancel}
              >
                <UploadImage image={image} setImage={setImage} />
              </Modal>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Profile;
