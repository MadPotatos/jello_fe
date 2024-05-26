import {
  CheckSquareFilled,
  BugFilled,
  ThunderboltFilled,
  SubnodeOutlined,
  UpOutlined,
  MinusOutlined,
  DownOutlined,
} from "@ant-design/icons";
import { useTranslations } from "next-intl";
import { CheckboxOptionType } from "antd/es/checkbox/Group";

export const getColoredIconByIssueType = (issueType: number) => {
  switch (issueType) {
    case 1:
      return <CheckSquareFilled style={{ color: "#1890ff" }} />;
    case 2:
      return <BugFilled style={{ color: "red" }} />;
    case 3:
      return <ThunderboltFilled style={{ color: "orange" }} />;
    case 4:
      return <SubnodeOutlined style={{ color: "#0064f2" }} />;
    default:
      return null;
  }
};

export const getColoredIconByPriority = (priority: number) => {
  switch (priority) {
    case 1:
      return <UpOutlined style={{ color: "red" }} />;
    case 2:
      return <MinusOutlined style={{ color: "orange" }} />;
    case 3:
      return <DownOutlined style={{ color: "#1890ff" }} />;
    default:
      return null;
  }
};

export const typeOptions = (
  t: (key: string) => string
): CheckboxOptionType<number>[] => {
  return [
    {
      label: (
        <span className="flex gap-2">
          {getColoredIconByIssueType(1)}
          {t("TypeOptions.task")}
        </span>
      ),
      value: 1,
    },
    {
      label: (
        <span className="flex gap-2">
          {getColoredIconByIssueType(2)}
          {t("TypeOptions.bug")}
        </span>
      ),
      value: 2,
    },
    {
      label: (
        <span className="flex gap-2">
          {getColoredIconByIssueType(3)}
          {t("TypeOptions.review")}
        </span>
      ),
      value: 3,
    },
  ];
};

export const priorityOptions = (
  t: (key: string) => string
): CheckboxOptionType<number>[] => {
  return [
    {
      label: (
        <span className="flex gap-2">
          {getColoredIconByPriority(1)}
          {t("PriorityOptions.high")}
        </span>
      ),
      value: 1,
    },
    {
      label: (
        <span className="flex gap-2">
          {getColoredIconByPriority(2)}
          {t("PriorityOptions.medium")}
        </span>
      ),
      value: 2,
    },
    {
      label: (
        <span className="flex gap-2">
          {getColoredIconByPriority(3)}
          {t("PriorityOptions.low")}
        </span>
      ),
      value: 3,
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
