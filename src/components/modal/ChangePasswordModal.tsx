import { useState } from "react";
import { Modal, Form, Input, Button, message, notification } from "antd";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { updatePassword } from "@/app/api/userApi";

interface ChangePasswordModalProps {
  visible: boolean;
  onCancel: () => void;
  userId: number;
  token: string | undefined;
}

const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({
  visible,
  onCancel,
  userId,
  token,
}) => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const t = useTranslations("Profile");

  const handleChangePassword = async (values: any) => {
    setLoading(true);
    try {
      const res = await updatePassword(
        userId,
        values.currentPassword,
        values.newPassword,
        token
      );
      if (res.statusCode == 400) {
        notification.error({
          message: t("passwordChangeFailed"),
          description: t("incorrectCurrentPassword"),
        });
        return;
      }
      notification.success({
        message: t("passwordChanged"),
      });
      form.resetFields();
      onCancel();
    } catch (error) {
      notification.error({
        message: t("passwordChangeFailed"),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={t("changePassword")}
      open={visible}
      onCancel={onCancel}
      footer={null}
    >
      <Form onFinish={handleChangePassword} form={form}>
        <Form.Item
          name="currentPassword"
          label={t("currentPassword")}
          rules={[{ required: true, message: t("enterCurrentPassword") }]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item
          name="newPassword"
          label={t("newPassword")}
          rules={[{ required: true, message: t("enterNewPassword") }]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item
          name="confirmNewPassword"
          label={t("confirmNewPassword")}
          dependencies={["newPassword"]}
          hasFeedback
          rules={[
            {
              required: true,
              message: t("confirmNewPassword"),
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("newPassword") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error(t("passwordMismatch")));
              },
            }),
          ]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            {t("save")}
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ChangePasswordModal;
