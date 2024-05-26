import React, { useState } from "react";
import { Modal, Form, Input, message } from "antd";
import { useSession } from "next-auth/react";
import UploadImage from "@/components/UploadImage";
import { createProject } from "@/app/api/projectApi";
import { validateRepository } from "@/lib/utils";
import { useTranslations } from "next-intl";

const { Item } = Form;

const CreateProjectModel = ({ visible, onCreate, onCancel }: any) => {
  const t = useTranslations("CreateProjectModel");
  const [form] = Form.useForm();
  const [image, setImage] = useState<string>("");
  const { data: session } = useSession();

  const onFinish = async (values: any) => {
    try {
      values.userId = session?.user?.id;
      values.image = image;

      const success = await createProject(
        values,
        session?.backendTokens.accessToken
      );

      if (success) {
        onCreate();
        message.success(t("createSuccess"));
        form.resetFields();
        onCancel();
      } else {
        message.error(t("createFailed"));
      }
    } catch (error) {
      console.error("Error creating project:", error);
      message.error(t("createError"));
    }
  };

  return (
    <Modal
      open={visible}
      title={t("title")}
      okText={t("okText")}
      cancelText={t("cancelText")}
      onCancel={onCancel}
      onOk={() => form.submit()}
      okButtonProps={{ style: { backgroundColor: "#1890ff" } }}
    >
      <Form form={form} onFinish={onFinish} layout="vertical">
        <Item label={t("projectImage")}>
          <UploadImage image={image} setImage={setImage} />
        </Item>
        <Item
          name="name"
          label={t("projectName")}
          rules={[{ required: true, message: t("nameRequired") }]}
        >
          <Input />
        </Item>
        <Item
          name="description"
          label={t("description")}
          rules={[{ required: true, message: t("descriptionRequired") }]}
        >
          <Input.TextArea />
        </Item>
        <Item
          name="repo"
          label="Repository ( https://github.com/{user}/{repo} )"
          rules={[{ validator: validateRepository }]}
        >
          <Input />
        </Item>
      </Form>
    </Modal>
  );
};

export default CreateProjectModel;
