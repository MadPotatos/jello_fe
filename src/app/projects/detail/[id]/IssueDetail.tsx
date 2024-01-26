'use client';
import React, { useEffect, useState } from 'react';
import { Button, Col, Form, Input, Modal, Row, Select, Space, List } from 'antd';
import { Avatar, Typography } from 'antd';
import { Comment } from '@ant-design/compatible';
import { Backend_URL } from '@/lib/Constants';
import { usePathname } from 'next/navigation';
import { Member } from '@/lib/types';
import { getColoredIconByIssueType, getColoredIconByPriority } from '@/lib/utils';

interface IssueDetailModalProps {
  issue: any;
  lists: any[];
  visible: boolean;
  onClose: () => void;
}

const IssueDetailModal: React.FC<IssueDetailModalProps> = ({ issue, lists,visible, onClose }) => {
  const [members, setMembers] = useState<Member[]>([]);
  const pathname = usePathname();
  const projectId = Number(pathname.split('/')[3]);

   const fetchMembers = async (id: number) => {
        try {
        const response = await fetch(`${Backend_URL}/member/${id}`);
        const data = await response.json();
        return data.members;
        } catch (error) {
        console.error('Error fetching members:', error);
        throw error;
        }
    };


  const [form] = Form.useForm();

const typeOptions = [
  { label: <span>{getColoredIconByIssueType(1)} Task</span>, value: 1 },
  { label: <span>{getColoredIconByIssueType(2)} Bug</span>, value: 2 },
  { label: <span>{getColoredIconByIssueType(3)} Review</span>, value: 3 }
];

const priorityOptions = [
  { label: <span>{getColoredIconByPriority(1)} High</span>, value: 1 },
  { label: <span>{getColoredIconByPriority(2)} Medium</span>, value: 2 },
  { label: <span>{getColoredIconByPriority(3)} Low</span>, value: 3 }
];


  const comments = issue.comments || [];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const membersData = await fetchMembers(projectId);
        setMembers(membersData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }
  , [projectId]);

  return (
    <Modal
      title={issue.summary}
      visible={visible}
      onOk={onClose}
      onCancel={onClose}
      width={800}
      footer={[
        <Button key="back" onClick={onClose} >
          Back
        </Button>,
        <Button key="submit" type="primary" onClick={onClose} style={{ backgroundColor: '#1890ff' }}>
          Save
        </Button>,
      ]}
    >
      <Row>
        <Col span={16}>
          <div className="p-4">
            <Typography.Title level={4}>{issue.name}</Typography.Title>
            <Typography.Paragraph>{issue.descr}</Typography.Paragraph>
            <List
              className="comment-list"
              header={`${comments.length} comments`}
              itemLayout="horizontal"
              dataSource={comments}
              renderItem={(comment: any) => (
                <li>
                  <Comment
                    author={comment.author}
                    avatar={<Avatar src={comment.avatar} alt={comment.author} />}
                    content={comment.content}
                    datetime={new Date(comment.datetime).toLocaleString()}
                  />
                </li>
              )}
            />
            <Form form={form} layout="vertical">
              <Row gutter={16}>
                <Col span={24}>
                  <Form.Item
                    label="Add Comment"
                    name="comment"
                    rules={[{ required: true }]}
                  >
                    <Input.TextArea />
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={24} className="text-right">
                  <Button type="primary" htmlType="submit" style={{ backgroundColor: '#1890ff'}}>
                    Add Comment
                  </Button>
                </Col>
              </Row>
            </Form>
          </div>
        </Col>
        <Col span={8}>
          <div className="p-4">
            <Space direction="vertical" size={16}>
              <Form.Item
                   label="Type"
                   name="type"
                   rules={[{ required: true }]}
                   labelCol={{ span: 24 }} 
                   wrapperCol={{ span: 24 }}
                    >
              <Select
                style={{ width: '100%' }}
                options={typeOptions}
                defaultValue={issue.type}
                
              />
              </Form.Item>
              <Form.Item
                label="Priority"
                name="priority"
                rules={[{ required: true }]}
                labelCol={{ span: 24 }} 
                wrapperCol={{ span: 24 }}
              >
              <Select
                style={{ width: '100%' }}
                placeholder="Select Priority"
                options={priorityOptions}
                defaultValue={issue.priority}
              />
              </Form.Item>
              <Form.Item
                label="Status"
                labelCol={{ span: 24 }}
                wrapperCol={{ span: 24 }}
              >
                 <Select 
                 style={{ width: '100%' }}
                 placeholder="Select List"
                 defaultValue={issue.listId}>
                  {lists.map((list:any) => (
                      <Select.Option key={list.id} value={list.id}>
                          {list.name}
                      </Select.Option>
                  ))}
              </Select>
              </Form.Item>



              <Typography.Text type="secondary">Reporter: {issue.reporter}</Typography.Text>
              <Typography.Text type="secondary">Assignees: {issue.assignee}</Typography.Text>
              <Typography.Text type="secondary">Updated At: {new Date(issue.updatedAt).toLocaleString()}</Typography.Text>
              <Typography.Text type="secondary">Created At: {new Date(issue.createdAt).toLocaleString()}</Typography.Text>
            </Space>
          </div>
        </Col>
      </Row>
    </Modal>
  );
};

export default IssueDetailModal;
