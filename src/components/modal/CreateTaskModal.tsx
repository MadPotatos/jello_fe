import React from "react";
import { Modal, Form, Input, Select, Button } from "antd";
import { IssuePriority } from "@/lib/enum";
import { useTranslations } from "next-intl";
import { getColoredIconByPriority, priorityOptions } from "@/lib/utils";

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
  const t = useTranslations(); // Access translations

  const handleSubmit = (values: any) => {
    onSubmit(values);
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <Modal
      title={t("CreateTaskModal.title")}
      visible={visible}
      onCancel={handleCancel}
      footer={null}
    >
      <Form onFinish={handleSubmit} layout="vertical">
        <Form.Item
          name="summary"
          label={t("CreateTaskModal.summaryLabel")}
          rules={[
            {
              required: true,
              message: t("CreateTaskModal.summaryRequired"),
            },
            {
              max: 100,
              message: t("CreateTaskModal.summaryMaxLength"),
            },
          ]}
        >
          <Input placeholder={t("CreateTaskModal.summaryLabel")} />
        </Form.Item>

        <Form.Item
          name="priority"
          label={t("CreateTaskModal.priorityLabel")}
          initialValue={IssuePriority.HIGH}
        >
          <Select
            placeholder={t("CreateTaskModal.priorityPlaceholder")}
            options={priorityOptions(t)}
          ></Select>
        </Form.Item>

        <div className="flex justify-end">
          <Button type="default" onClick={handleCancel} className="mr-2">
            {t("CreateTaskModal.cancel")}
          </Button>
          <Button type="primary" htmlType="submit">
            {t("CreateTaskModal.create")}
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default CreateTaskModal;
