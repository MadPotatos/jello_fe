import React from "react";
import { Modal, Form, Input, Select, Button } from "antd";
import { IssuePriority } from "@/lib/enum";

interface CreateTaskModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (values: any) => void;
}

const { Option } = Select;

const CreateTaskModal: React.FC<CreateTaskModalProps> = ({
  visible,
  onClose,
  onSubmit,
}) => {
  const handleSubmit = (values: any) => {
    onSubmit(values);
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <Modal
      title="Tạo công việc"
      open={visible}
      onCancel={handleCancel}
      footer={null}
    >
      <Form onFinish={handleSubmit} layout="vertical">
        <Form.Item
          name="summary"
          label="Mô tả"
          rules={[
            {
              required: true,
              message: "Vui lòng nhập mô tả công việc",
            },
            {
              max: 100,
              message: "Mô tả không vượt quá 100 ký tự",
            },
          ]}
        >
          <Input placeholder="Nhập mô tả công việc" />
        </Form.Item>

        <Form.Item
          name="priority"
          label="Độ ưu tiên"
          initialValue={IssuePriority.HIGH}
        >
          <Select placeholder="Chọn độ ưu tiên">
            {Object.keys(IssuePriority).map((key) => (
              <Option
                key={key}
                value={IssuePriority[key as keyof typeof IssuePriority]}
              >
                {IssuePriority[key as keyof typeof IssuePriority]}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <div className="flex justify-end">
          <Button type="default" onClick={handleCancel} className="mr-2">
            Hủy
          </Button>
          <Button type="primary" htmlType="submit">
            Tạo
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default CreateTaskModal;
