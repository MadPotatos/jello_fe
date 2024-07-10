import React from "react";
import {
  Modal,
  Form,
  Input,
  DatePicker,
  Select,
  message,
  notification,
} from "antd";
import { Sprint } from "@/lib/types";
import { updateSprint } from "@/app/api/sprintApi";
import dayjs from "dayjs";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import {
  addUserStoryToSprint,
  getNotDoneUserStories,
} from "@/app/api/userStoryApi";
import useSWR from "swr";

const { Item } = Form;
const { RangePicker } = DatePicker;
const { Option } = Select;

interface EditSprintModelProps {
  visible: boolean;
  onUpdate: () => void;
  onCancel: () => void;
  sprint: Sprint;
  projectId: number;
}

const EditSprintModel: React.FC<EditSprintModelProps> = ({
  visible,
  onUpdate,
  onCancel,
  sprint,
  projectId,
}) => {
  const [form] = Form.useForm();
  const { data: session } = useSession();
  const { data: notDone } = useSWR<any>(
    `not-done-user-stories-${projectId}`,
    () => getNotDoneUserStories(projectId)
  );

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

      if (values.userStories) {
        for (const userStoryId of values.userStories) {
          await addUserStoryToSprint(sprint.id, userStoryId);
        }
      }

      onUpdate();
      notification.success({
        message: "Cập nhật sprint thành công",
      });
    } catch (error) {
      console.error("Error updating sprint:", error);
      notification.error({
        message: "Cập nhật sprint thất bại",
      });
    }
  };

  return (
    <Modal
      open={visible}
      title="Chỉnh sửa Sprint"
      okText="Cập nhật"
      cancelText="Hủy"
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
          label="Tên Sprint"
          rules={[{ required: true, message: "Vui lòng nhập tên sprint" }]}
        >
          <Input />
        </Item>

        <Item
          label="Ngày bắt đầu và kết thúc"
          name="date"
          rules={[
            {
              required: true,
              message: "Vui lòng chọn ngày bắt đầu và kết thúc",
            },
          ]}
        >
          <RangePicker
            disabledDate={(current) =>
              current && current < dayjs().startOf("day")
            }
            format="DD-MM-YYYY"
          />
        </Item>

        <Item name="goal" label="Mục tiêu">
          <Input.TextArea />
        </Item>

        <Item name="userStories" label="User Stories">
          <Select
            mode="multiple"
            placeholder="Chọn user stories"
            options={notDone?.map((userStory: any) => ({
              value: userStory.id,
              label: ` ${userStory.title}`,
            }))}
          ></Select>
        </Item>
      </Form>
    </Modal>
  );
};

export default EditSprintModel;
