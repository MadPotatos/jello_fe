import React from "react";
import { Sprint } from "@/lib/types";
import { useSession } from "next-auth/react";
import { Form, Image, Modal, Select, notification } from "antd";
import { completeSprint, fetchNotInProgressSprints } from "@/app/api/sprintApi";
import useSWR from "swr";
import { useTranslations } from "next-intl";

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
  const t = useTranslations("completeSprint");

  const onFinish = async (values: any) => {
    try {
      await completeSprint(
        sprint?.id,
        values.sprint,
        session?.backendTokens.accessToken
      );
      notification.success({ message: t("sprintCompletedSuccess") });
      onComplete();
    } catch (error) {
      console.error("Error completing sprint:", error);
    }
  };

  return (
    <Modal
      open={visible}
      title={`${t("title")} ${sprint?.name}`}
      okText={t("complete")}
      cancelText={t("cancel")}
      onCancel={onCancel}
      onOk={() => form.submit()}
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
        {t("containsOpenIssues")}{" "}
        <span className="font-semibold">{sprintLength}</span> {t("openIssues")}
      </p>

      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item
          name="sprint"
          label={t("moveOpenIssuesToSprint")}
          rules={[{ required: true, message: t("pleaseSelectSprint") }]}
        >
          <Select
            options={sprints?.map((sprint: Sprint) => ({
              label: sprint.name,
              value: sprint.id,
            }))}
          ></Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CompleteSprintModel;
