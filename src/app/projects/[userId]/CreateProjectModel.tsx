import React, { useState } from 'react';
import { Modal, Form, Input, message } from 'antd';
import { useSession } from 'next-auth/react';
import UploadImage from '@/components/UploadImage';
import { createProject } from '@/app/api/projectApi';


const { Item } = Form;

const CreateProjectModel = ({ visible, onCreate, onCancel }: any) => {
  const [form] = Form.useForm();
  const [image, setImage] = useState<string>('');
  const { data: session } = useSession();

  const validateRepository = (rule: any, value: string, callback: any) => {
    const regex = /^(https:\/\/github\.com\/[a-zA-Z0-9-]+\/[a-zA-Z0-9-_]+)(\.git)?$/;
    if (regex.test(value)) {
      callback();
    } else {
      callback('Invalid repository format');
    }
  };

  const onFinish = async (values: any) => {
    try {
      values.userId = session?.user?.id;
      values.image = image;

      const success = await createProject(values, session?.backendTokens.accessToken);

      if (success) {
        onCreate();
        message.success('Project created successfully');
        form.resetFields();
        onCancel();
      } else {
        message.error('Failed to create project. Please try again.');
      }
    } catch (error) {
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
      okButtonProps={{ style: { backgroundColor: '#1890ff' } }}
    >
      <Form form={form} onFinish={onFinish} layout="vertical">
        <Item label="Project Image">
          <UploadImage image={image} setImage={setImage} />
        </Item>
        <Item
          name="name"
          label="Project Name"
          rules={[{ required: true, message: 'Please enter the project name' }]}
        >
          <Input />
        </Item>
        <Item
          name="description"
          label="Description"
          rules={[{ required: true, message: 'Please enter the project description' }]}
        >
          <Input.TextArea />
        </Item>
        <Item
          name="repo"
          label="Repository (Example: https://github.com/{user}/{repo})"
          rules={[
            { required: true, message: 'Please enter the repository URL' },
            { validator: validateRepository },
          ]}
        >
          <Input />
        </Item>
      </Form>
    </Modal>
  );
};

export default CreateProjectModel;
