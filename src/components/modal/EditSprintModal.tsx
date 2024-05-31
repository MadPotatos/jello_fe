import React from "react";
import { Modal, Form, Input, DatePicker, message, notification } from "antd";
import { Sprint } from "@/lib/types";
import { updateSprint } from "@/app/api/sprintApi";
import dayjs from "dayjs";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";

const { Item } = Form;
const { RangePicker } = DatePicker;

interface EditSprintModelProps {
  visible: boolean;
  onUpdate: () => void;
  onCancel: () => void;
  sprint: Sprint;
}

const EditSprintModel: React.FC<EditSprintModelProps> = ({
  visible,
  onUpdate,
  onCancel,
  sprint,
}) => {
  const [form] = Form.useForm();
  const { data: session } = useSession();
  const t = useTranslations("SprintModal");

  const onFinish = async (values: any) => {
    try {
      const formattedValues = {
        name: values.name,
        startDate: values.date[0].format(),
        endDate: values.date[1].format(),
        goal: values.goal,
      };

      await updateSprint(
        sprint.id,
        formattedValues,
        session?.backendTokens.accessToken
      );
      onUpdate();
      notification.success({
        message: t("updateSuccess"),
      });
    } catch (error) {
      console.error("Error updating sprint:", error);
      notification.error({
        message: t("updateFailed"),
      });
    }
  };

  return (
    <Modal
      open={visible}
      title={t("title")}
      okText={t("update")}
      cancelText={t("cancel")}
      onCancel={onCancel}
      onOk={() => form.submit()}
    >
      <Form
        form={form}
        onFinish={onFinish}
        layout="vertical"
        initialValues={{
          name: sprint.name,
          date:
            sprint.startDate && sprint.endDate
              ? [dayjs(sprint.startDate), dayjs(sprint.endDate)]
              : "",
          goal: sprint.goal,
        }}
      >
        <Item
          name="name"
          label={t("sprintName")}
          rules={[{ required: true, message: t("nameRequired") }]}
        >
          <Input />
        </Item>

        <Item
          label={t("startendDate")}
          name="date"
          rules={[{ required: true, message: t("dateRequired") }]}
        >
          <RangePicker
            disabledDate={(current) =>
              current && current < dayjs().startOf("day")
            }
            format="DD-MM-YYYY"
          />
        </Item>

        <Item name="goal" label={t("goal")}>
          <Input.TextArea />
        </Item>
      </Form>
    </Modal>
  );
};

export default EditSprintModel;
