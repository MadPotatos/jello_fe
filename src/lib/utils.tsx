import {
  CheckSquareFilled,
  BugFilled,
  ThunderboltFilled,
  SubnodeOutlined,
} from "@ant-design/icons";
import { UpOutlined, MinusOutlined, DownOutlined } from "@ant-design/icons";

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
      return <DownOutlined style={{ color: "1890ff" }} />;
    default:
      return null;
  }
};
export const typeOptions = [
  { label: <span>{getColoredIconByIssueType(1)} Task</span>, value: 1 },
  { label: <span>{getColoredIconByIssueType(2)} Bug</span>, value: 2 },
  { label: <span>{getColoredIconByIssueType(3)} Review</span>, value: 3 },
];

export const priorityOptions = [
  { label: <span>{getColoredIconByPriority(1)} High</span>, value: 1 },
  { label: <span>{getColoredIconByPriority(2)} Medium</span>, value: 2 },
  { label: <span>{getColoredIconByPriority(3)} Low</span>, value: 3 },
];

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
