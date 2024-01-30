"use client";
import React, { useState } from 'react';
import { Modal, Form, Input, Button, message } from 'antd';
import { useSession } from 'next-auth/react';
import UploadImage from '@/components/UploadImage';
import { Backend_URL } from '@/lib/Constants';
import { useRouter } from 'next/navigation';

const CreateProjectModel = ({ visible, onCreate, onCancel }: any) => {
  const [form] = Form.useForm();
  const router = useRouter();
  const [image, setImage] = useState<string>("");
  const { data: session } = useSession(); 

  const onFinish = async (values: any) => {
    try {
      values.userId = session?.user?.id;
        values.image = image ;
      const response = await fetch(Backend_URL + '/project', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${session?.backendTokens.accessToken}`,
        },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        const projectData = await response.json();
        onCreate();
        message.success('Project created successfully');
        form.resetFields();
        onCancel();


      } else {
        // Handle API error
        message.error('Failed to create project. Please try again.');
      }
    } catch (error) {
      // Handle fetch or other errors
      console.error('Error creating project:', error);
      message.error('An error occurred. Please try again.');
    }
  };

  return (
    <Modal
      open={visible}
      title="Create New Project"
      okText="Create"
      cancelText="Cancel"
      onCancel={onCancel}
      onOk={() => form.submit()}
      okButtonProps={{style: {backgroundColor: '#1890ff'}}}
    >
      <Form form={form} onFinish={onFinish} layout="vertical">
         <Form.Item label="Project Image">
          <UploadImage image={image} setImage={setImage} />
        </Form.Item>
        <Form.Item
          name="name"
          label="Project Name"
          rules={[{ required: true, message: 'Please enter the project name' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="description"
          label="Description"
          rules={[{ required: true, message: 'Please enter the project description' }]}
        >
          <Input.TextArea />
        </Form.Item>
        <Form.Item
          name="repo"
          label="Repository"
          rules={[{ required: true, message: 'Please enter the repository URL' }]}
        >
          <Input />
        </Form.Item>
        
      </Form>
    </Modal>
  );
};

export default CreateProjectModel;
