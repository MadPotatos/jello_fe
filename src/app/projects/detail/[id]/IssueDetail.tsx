import React from 'react';
import { Button, Modal, Space } from 'antd';
import { Avatar, Typography } from 'antd';

interface IssueDetailModalProps {
  issue: any;
  visible: boolean;
  onClose: () => void;
}

const IssueDetailModal: React.FC<IssueDetailModalProps> = ({ issue, visible, onClose }) => {
  return (
    <Modal
      title={issue.summary}
      open={visible}
      onOk={onClose}
      onCancel={onClose}
      width={800}
      footer={[
        <Button key="back" onClick={onClose}>
          Back
        </Button>,
      ]}
    >
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <Avatar src={issue.assignees[0]?.User?.avatar} size={64} />
            <Space style={{ verticalAlign: 'middle' }}>
              <Typography.Text type="secondary">{issue.assignees[0]?.User?.name}</Typography.Text>
              <Typography.Text type="secondary">{issue.updatedAt}</Typography.Text>
            </Space>
          </div>
          {/* Add buttons for actions like editing or commenting, if needed */}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="col-span-2">
            <Typography.Text type="secondary">Type:</Typography.Text>
            <Typography.Text type="secondary">{issue.type}</Typography.Text>
          </div>
          <div className="col-span-2">
            <Typography.Text type="secondary">Priority:</Typography.Text>
            <Typography.Text type="secondary">{issue.priority}</Typography.Text>
          </div>
          <div className="col-span-2">
            <Typography.Text type="secondary">Status:</Typography.Text>
            <Typography.Text type="secondary">Open</Typography.Text> {/* Or any other status */}
          </div>
          <div className="col-span-3">
            <Typography.Text type="secondary">Reporter:</Typography.Text>
            <Typography.Text type="secondary">{issue.reporterId}</Typography.Text>
          </div>
          <div className="col-span-3">
            <Typography.Text type="secondary">Created:</Typography.Text>
            <Typography.Text type="secondary">{issue.createdAt}</Typography.Text>
          </div>
          <div className="col-span-3">
            <Typography.Text type="secondary">Updated:</Typography.Text>
            <Typography.Text type="secondary">{issue.updatedAt}</Typography.Text>
          </div>
          <div className="col-span-6">
            <Typography.Text type="secondary">Description:</Typography.Text>
            <Typography.Text>{issue.descr}</Typography.Text>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default IssueDetailModal;