import React from "react";
import { Sprint } from "@/lib/types";
import { useSession } from "next-auth/react";
import { Form, Image, Modal, Select, notification } from "antd";
import { completeSprint, fetchNotInProgressSprints } from "@/app/api/sprintApi";
import useSWR from "swr";

interface CompleteSprintModelProps {
  visible: boolean;
  onComplete: () => void;
  onCancel: () => void;
  sprint: Sprint | undefined;
  projectId: number;
  sprintLength: number;
}

const CompleteSprintModel: React.FC<CompleteSprintModelProps> = ({
  visible,
  onComplete,
  onCancel,
  sprint,
  projectId,
  sprintLength,
}) => {
  const { data: session } = useSession();
  const [form] = Form.useForm();
  const { data: sprints } = useSWR<any>(`waiting-sprint-${projectId}`, () =>
    fetchNotInProgressSprints(projectId)
  );

  const onFinish = async (values: any) => {
    try {
      await completeSprint(
        sprint?.id,
        values.sprint,
        session?.backendTokens.accessToken
      );
      notification.success({ message: "Sprint completed" });
      onComplete();
    } catch (error) {
      console.error("Error completing sprint:", error);
    }
  };

  return (
    <Modal
      open={visible}
      title={`Complete Sprint ${sprint?.name}`}
      okText="Complete"
      cancelText="Cancel"
      onCancel={onCancel}
      onOk={() => form.submit()}
      okButtonProps={{ style: { backgroundColor: "#0064f2" } }}
    >
      <div className="flex justify-center items-center my-4">
        <Image
          src="/images/trophy.png"
          width={200}
          preview={false}
          alt="trophy icon"
        />
      </div>

      <p className="text-lg text-center pb-6">
        This sprint contains:{" "}
        <span className="font-semibold">{sprintLength}</span> open issues
      </p>

      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item
          name="sprint"
          label="Move open issues to sprint"
          rules={[{ required: true, message: "Please select a sprint" }]}
        >
          <Select>
            {sprints?.map((sprint: any) => (
              <Select.Option key={sprint.id} value={sprint.id}>
                {sprint.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CompleteSprintModel;
