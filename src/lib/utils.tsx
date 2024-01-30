import { CheckSquareFilled, BugFilled, ThunderboltFilled } from '@ant-design/icons';
import { UpOutlined, MinusOutlined, DownOutlined } from '@ant-design/icons';

export const getColoredIconByIssueType = (issueType: number) => {
 
  switch (issueType) {
    case 1:
      return <CheckSquareFilled style={{ color: '#1890ff'}} />;
    case 2:
      return <BugFilled style={{ color: 'red' }} />;
    case 3:
      return <ThunderboltFilled style={{ color: 'orange'}} />;
    default:
      return null;
  }
};

export const getColoredIconByPriority = (priority: number) => {


  switch (priority) {
    case 1:
      return <UpOutlined style={{ color: 'red'}} />;
    case 2:
      return <MinusOutlined style={{ color: 'orange' }} />;
    case 3:
      return <DownOutlined style={{ color: '1890ff'}} />;
    default:
      return null;
  }
};