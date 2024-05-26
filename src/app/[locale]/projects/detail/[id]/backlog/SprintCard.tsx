import React, { useState } from "react";
import { Sprint, List as ListType } from "@/lib/types";
import SprintIssues from "./SprintIssue";
import {
  Button,
  Dropdown,
  Form,
  Input,
  List,
  MenuProps,
  Modal,
  Select,
  message,
  notification,
} from "antd";
import { createSprint, deleteSprint, updateSprint } from "@/app/api/sprintApi";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import useSWR, { mutate } from "swr";
import { SprintStatus } from "@/lib/enum";
import { Droppable } from "@hello-pangea/dnd";
import { createIssue } from "@/app/api/issuesApi";
import { useSession } from "next-auth/react";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { priorityOptions, typeOptions } from "@/lib/utils";
import dayjs from "dayjs";
import { fetchLists } from "@/app/api/listApi";
import { useRouter } from "next-nprogress-bar";
import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";

const CompleteSprintModel = dynamic(
  () => import("@/components/CompleteSprintModel"),
  {
    ssr: false,
  }
);

const EditSprintModel = dynamic(() => import("./EditSprintModel"), {
  ssr: false,
});
const Tooltip = dynamic(() => import("antd").then((mod) => mod.Tooltip), {
  ssr: false,
});

const IssueDetailModal = dynamic(() => import("@/components/IssueDetail"), {
  ssr: false,
});

const { confirm } = Modal;

interface SprintProps {
  sprint: Sprint;
  filteredIssues: any;
  projectId: number;
  isAdmin: any;
}

const SprintCard: React.FC<SprintProps> = ({
  sprint,
  filteredIssues,
  projectId,
  isAdmin,
}) => {
  const { data: session } = useSession();
  const router = useRouter();
  const [isCreatingIssue, setIsCreatingIssue] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isCompleteModalVisible, setIsCompleteModalVisible] = useState(false);
  const [isDetailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState<any>(null);
  const t = useTranslations();

  const { data: lists } = useSWR<ListType[]>(`lists-${projectId}`, () =>
    fetchLists(projectId)
  );

  const formattedStartDate = dayjs(sprint.startDate).format("DD/MM/YYYY");
  const formattedEndDate = dayjs(sprint.endDate).format("DD/MM/YYYY");

  const handleUpdate = () => {
    setIsModalVisible(false);
    mutate(`sprints-${projectId}`);
  };

  const handleComplete = () => {
    setIsCompleteModalVisible(false);
    mutate(`sprints-${projectId}`);
    mutate(`sprint-issues-${projectId}`);
    mutate(`current-sprint-${projectId}`, undefined, false);
  };

  const handleSubmitIssue = async (values: any) => {
    try {
      values.sprintId = sprint.id;
      values.reporterId = session?.user.id;
      values.projectId = projectId;
      await createIssue(values, session?.backendTokens.accessToken);
      mutate(`sprint-issues-${projectId}`);
      setIsCreatingIssue(false);
    } catch (error) {
      console.error("Error creating issue:", error);
      message.error("Failed to create issue");
    }
  };

  const items: MenuProps["items"] = [
    {
      key: "edit-sprint",
      label: t("Backlog.editSprint"),
      onClick: () => {
        setIsModalVisible(true);
      },
    },
    {
      key: "delete-sprint",
      danger: true,
      label: t("Backlog.deleteSprint"),
      onClick: () => {
        handleDelete();
      },
    },
  ];

  const handleCreateSprint = async () => {
    try {
      await createSprint(projectId, session?.backendTokens.accessToken);
      mutate(`sprints-${projectId}`);
    } catch (error) {
      console.error("Error creating sprint:", error);
    }
  };

  const handleStartSprint = async () => {
    try {
      if (!sprint.startDate || !sprint.endDate) {
        setIsModalVisible(true);
        notification.warning({
          message: t("Backlog.setSprintDateTitle"),
          description: t("Backlog.setSprintDateContent"),
        });
        return;
      }

      if (filteredIssues?.length === 0) {
        notification.warning({
          message: t("Backlog.cantStartSprint"),
          description: t("Backlog.cantStartSprintContent1"),
        });
        return;
      }

      const res = await updateSprint(
        sprint.id,
        { status: SprintStatus.IN_PROGRESS, projectId: projectId },
        session?.backendTokens.accessToken
      );
      if (res.statusCode === 409) {
        notification.warning({
          message: t("Backlog.cantStartSprint"),
          description: t("Backlog.cantStartSprintContent2"),
        });
        return;
      }
      mutate(`sprints-${projectId}`);
      router.push(`/projects/detail/${projectId}/board`);
      notification.success({
        message: t("Backlog.sprintStarted"),
        description: t("Backlog.sprintStartedContent"),
      });
    } catch (error: any) {
      notification.error({
        message: t("Backlog.sprintStartedError"),
        description: t("Backlog.sprintStartedErrorContent"),
      });
    }
  };

  const handleDelete = async () => {
    try {
      confirm({
        title: t("Backlog.deleteSprintConfirmTitle"),
        icon: <ExclamationCircleOutlined />,
        content: t("Backlog.deleteSprintConfirmContent"),
        okText: t("Backlog.delete"),
        cancelText: t("Backlog.cancel"),
        onOk: async () => {
          await deleteSprint(sprint.id, session?.backendTokens.accessToken);
          message.success(t("Backlog.deleteSprintSuccess"));
          mutate(`sprints-${projectId}`);
        },
      });
    } catch (error) {
      console.error("Error deleting sprint:", error);
    }
  };

  const handleIssueClick = (issue: any) => {
    setSelectedIssue(issue);
    setDetailModalVisible(true);
  };

  return (
    <div key={sprint.id} className="bg-gray-100 p-2">
      <div className="flex justify-between">
        <div className="flex mb-2 px-2 py-2 gap-4">
          <h2 className="text-xl">{sprint.name}</h2>

          {sprint.startDate && sprint.endDate && (
            <p className="text-xl text-gray-400">
              {formattedStartDate} - {formattedEndDate}
            </p>
          )}
          <div>
            <span className="text-lg text-gray-400">
              ({filteredIssues?.length ?? 0} issues)
            </span>
          </div>
        </div>

        <div className="flex gap-2 items-center">
          {sprint.order !== 0 && sprint.status === SprintStatus.CREATED && (
            <Tooltip title={t("Backlog.startSprintTooltip")}>
              <Button
                type="primary"
                size="large"
                style={{ backgroundColor: "#0064f2" }}
                onClick={() => handleStartSprint()}
                disabled={!isAdmin}
              >
                {t("Backlog.startSprint")}
              </Button>
            </Tooltip>
          )}
          {sprint.order !== 0 && sprint.status === SprintStatus.IN_PROGRESS && (
            <Tooltip title={t("Backlog.completeSprintTooltip")}>
              <Button
                type="text"
                className="bg-gray-300"
                size="large"
                onClick={() => setIsCompleteModalVisible(true)}
                disabled={!isAdmin}
              >
                {t("Backlog.completeSprint")}
              </Button>
            </Tooltip>
          )}
          {sprint.order !== 0 ? (
            <Dropdown
              menu={{ items }}
              trigger={["click"]}
              placement="bottomRight"
              disabled={!isAdmin}
            >
              <Tooltip title={t("Backlog.editSprintTooltip")}>
                <Button
                  type="text"
                  className="bg-gray-300"
                  size="large"
                  disabled={!isAdmin}
                >
                  ...
                </Button>
              </Tooltip>
            </Dropdown>
          ) : (
            <Tooltip title={t("Backlog.createSprintTooltip")}>
              <Button
                type="text"
                className="bg-gray-300"
                size="large"
                onClick={() => handleCreateSprint()}
                disabled={!isAdmin}
              >
                {t("Backlog.createSprint")}
              </Button>
            </Tooltip>
          )}
        </div>
      </div>
      {sprint.goal && (
        <p className="text-base px-2 pb-4 text-gray-500">{sprint.goal}</p>
      )}
      <Droppable droppableId={`sprint-${sprint.id}`}>
        {(provided) => (
          <div ref={provided.innerRef} {...provided.droppableProps}>
            <List
              locale={{
                emptyText: (
                  <div className="border border-gray-400 border-dashed py-3 px-6 text-center text-lg">
                    {sprint.order === 0
                      ? t("Backlog.backlogPlaceholder")
                      : t("Backlog.sprintPlaceholder")}
                  </div>
                ),
              }}
              dataSource={filteredIssues}
              renderItem={(issue: any, issueIndex: number) => (
                <SprintIssues
                  key={issue.id}
                  issue={issue}
                  issueIndex={issueIndex}
                  onClick={() => handleIssueClick(issue)}
                />
              )}
            ></List>
            {provided.placeholder}
          </div>
        )}
      </Droppable>

      {isCreatingIssue ? (
        <Form
          onFinish={handleSubmitIssue}
          layout="horizontal"
          initialValues={{
            summary: "",
            type: 1,
            priority: 1,
          }}
          className="border border-gray-200 p-3 flex justify-between text-lg bg-white"
        >
          <div className="flex  gap-6 text-lg">
            <Form.Item name="type">
              <Select options={typeOptions(t)}></Select>
            </Form.Item>

            <Form.Item
              name="summary"
              rules={[
                { required: true, message: t("Backlog.validateIssueSummary") },
                {
                  max: 100,
                  message: t("Backlog.validateIssueSummaryLength"),
                },
              ]}
            >
              <Input
                placeholder={t("Backlog.issueSummaryPlaceholder")}
                variant="borderless"
                autoFocus
                style={{ minWidth: "500px" }}
              />
            </Form.Item>
          </div>
          <div className="flex gap-2">
            <Form.Item
              name="listId"
              initialValue={lists && lists.length > 0 ? lists[0].id : undefined}
            >
              <Select
                style={{ minWidth: "120px" }}
                options={lists?.map((list: any) => ({
                  label: list.name,
                  value: list.id,
                }))}
              ></Select>
            </Form.Item>

            <Form.Item name="priority">
              <Select
                placeholder={t("Backlog.issuePriorityPlaceholder")}
                style={{ minWidth: "100px" }}
                options={priorityOptions(t)}
              ></Select>
            </Form.Item>

            <Button
              type="primary"
              htmlType="submit"
              style={{ backgroundColor: "#1890ff" }}
            >
              <CheckOutlined />
            </Button>
            <Button
              type="default"
              danger
              onClick={() => setIsCreatingIssue(false)}
            >
              <CloseOutlined />
            </Button>
          </div>
        </Form>
      ) : (
        <Button
          type="text"
          size="large"
          block
          className="text-left"
          onClick={() => setIsCreatingIssue(true)}
          disabled={!isAdmin}
        >
          {t("Backlog.addIssue")}
        </Button>
      )}
      <EditSprintModel
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        sprint={sprint}
        onUpdate={handleUpdate}
      />

      <CompleteSprintModel
        visible={isCompleteModalVisible}
        onCancel={() => setIsCompleteModalVisible(false)}
        onComplete={handleComplete}
        sprint={sprint}
        projectId={projectId}
        sprintLength={(filteredIssues && filteredIssues?.length) ?? 0}
      />

      {selectedIssue && (
        <IssueDetailModal
          issue={selectedIssue}
          lists={lists}
          visible={true}
          onClose={() => setSelectedIssue(null)}
        />
      )}
    </div>
  );
};

export default SprintCard;
