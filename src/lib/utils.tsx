import {
  CheckSquareFilled,
  BugFilled,
  ThunderboltFilled,
  SubnodeOutlined,
  UpOutlined,
  MinusOutlined,
  DownOutlined,
} from "@ant-design/icons";
import { CheckboxOptionType } from "antd/es/checkbox/Group";
import { IssuePriority, IssueType } from "./enum";

export const getColoredIconByIssueType = (issueType: IssueType) => {
  switch (issueType) {
    case IssueType.TASK:
      return <CheckSquareFilled style={{ color: "#1890ff" }} />;
    case IssueType.BUG:
      return <BugFilled style={{ color: "red" }} />;
    case IssueType.REVIEW:
      return <ThunderboltFilled style={{ color: "orange" }} />;
    case IssueType.SUBISSUE:
      return <SubnodeOutlined style={{ color: "#0064f2" }} />;
    default:
      return null;
  }
};

export const getColoredIconByPriority = (priority: IssuePriority) => {
  switch (priority) {
    case IssuePriority.HIGH:
      return <UpOutlined style={{ color: "red" }} />;
    case IssuePriority.MEDIUM:
      return <MinusOutlined style={{ color: "orange" }} />;
    case IssuePriority.LOW:
      return <DownOutlined style={{ color: "#1890ff" }} />;
    default:
      return null;
  }
};

export const typeOptions = (
  t: (key: string) => string
): CheckboxOptionType<IssueType>[] => {
  return [
    {
      label: (
        <span className="flex gap-2">
          {getColoredIconByIssueType(IssueType.TASK)}
          {t("TypeOptions.task")}
        </span>
      ),
      value: IssueType.TASK,
    },
    {
      label: (
        <span className="flex gap-2">
          {getColoredIconByIssueType(IssueType.BUG)}
          {t("TypeOptions.bug")}
        </span>
      ),
      value: IssueType.BUG,
    },
    {
      label: (
        <span className="flex gap-2">
          {getColoredIconByIssueType(IssueType.REVIEW)}
          {t("TypeOptions.review")}
        </span>
      ),
      value: IssueType.REVIEW,
    },
  ];
};

export const priorityOptions = (
  t: (key: string) => string
): CheckboxOptionType<IssuePriority>[] => {
  return [
    {
      label: (
        <span className="flex gap-2">
          {getColoredIconByPriority(IssuePriority.HIGH)}
          {t("PriorityOptions.high")}
        </span>
      ),
      value: IssuePriority.HIGH,
    },
    {
      label: (
        <span className="flex gap-2">
          {getColoredIconByPriority(IssuePriority.MEDIUM)}
          {t("PriorityOptions.medium")}
        </span>
      ),
      value: IssuePriority.MEDIUM,
    },
    {
      label: (
        <span className="flex gap-2">
          {getColoredIconByPriority(IssuePriority.LOW)}
          {t("PriorityOptions.low")}
        </span>
      ),
      value: IssuePriority.LOW,
    },
  ];
};

export const fetcher = (url: string) => fetch(url).then((r) => r.json());

export const validateRepository = (rule: any, value: string, callback: any) => {
  if (!value || value.trim() === "") {
    callback();
    return;
  }
  const regex =
    /^(https:\/\/github\.com\/[a-zA-Z0-9-]+\/[a-zA-Z0-9-_]+)(\.git)?$/;
  if (regex.test(value)) {
    callback();
  } else {
    callback("Invalid repository format");
  }
};
