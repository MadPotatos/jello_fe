import React, { useState } from 'react';
import { Avatar, Button, Form, Input, List, Select, message } from 'antd';
import { Draggable } from '@hello-pangea/dnd';
import { getColoredIconByIssueType, getColoredIconByPriority } from '@/lib/utils';
import { createIssue } from '@/app/api/issuesApi';
import { mutate } from 'swr';
import { useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { CheckOutlined,CloseOutlined } from '@ant-design/icons';



interface SprintIssuesProps {
  issues: any;
  sprintId: number;
  filteredIssues: any;
}

const SprintIssues: React.FC<SprintIssuesProps> = ({ issues, sprintId, filteredIssues }) => {
   const [isCreatingIssue, setIsCreatingIssue] = useState(false);
   const pathname = usePathname();
   const { data: session } = useSession();
   const projectId = Number(pathname.split('/')[3]);


    const handleSubmitIssue = async (values: any) => {
    try {
    
      values.sprintId = sprintId;
      values.reporterId = session?.user.id;
        await createIssue(values, session?.backendTokens.accessToken);     
        mutate(`sprint-issues-${projectId}`);
        setIsCreatingIssue(false);
     
    } catch (error) {
      console.error('Error creating issue:', error);
      message.error('Failed to create issue');
    }
  };

  return (
    <List
      dataSource={filteredIssues[sprintId] || issues[sprintId]}
      renderItem={(issue:any, issueIndex) => (
        <Draggable
          key={issue.id}
          draggableId={issue.id.toString()}
          index={issueIndex}
        >
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              
            >
              <div className="border border-gray-200 py-3 px-6 bg-white hover:bg-gray-200 flex justify-between items-center">
                <div className="flex items-center gap-6 text-lg">
                <div>{getColoredIconByIssueType(issue.type)}</div>
                <p>{issue.summary}</p>
                </div>
                <div className="flex items-center gap-6 text-lg">
                  <div>{getColoredIconByPriority(issue.priority)}</div>
                  <Avatar.Group
                    maxCount={2}
                    maxStyle={{ color: '#f56a00', backgroundColor: '#fde3cf' }}
                    style={{ minWidth: '80px' }}
                  >
                    {issue.assignees && issue.assignees.length > 0 ? (
                      issue.assignees.map((assignee:any) => (
                        <Avatar key={assignee.userId} src={assignee.User.avatar} />
                      ))
                    ) : (
                      <span></span>
                    )}
                  </Avatar.Group>
                </div>
              </div>
            </div>
          )}
        </Draggable>
      )}
    >
     {isCreatingIssue ? (

          <Form
            onFinish={handleSubmitIssue}
            layout="horizontal"
            initialValues={{
              summary: '',
              type: 1,
              priority: 1,
            }}
            className="border border-gray-200 p-3 flex justify-between text-lg bg-white"           
          >
            <div className="flex  gap-6 text-lg">
             <Form.Item name="type">
              <Select placeholder="Select issue type">
                <Select.Option value={1}>
                  {getColoredIconByIssueType(1)} Task
                </Select.Option>
                <Select.Option value={2}>
                  {getColoredIconByIssueType(2)} Bug
                </Select.Option>
                <Select.Option value={3}>
                  {getColoredIconByIssueType(3)} Review
                </Select.Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="summary"
              rules={[{ required: true, message: 'Please enter issue summary' },
                { max: 100, message: 'Summary must be at most 100 characters' },
              ]}
              
              
            >
              <Input placeholder="What needs to be done?" bordered={false} autoFocus style={{minWidth:'500px'}} />
            </Form.Item>
            </div>
            <div className="flex  gap-2">
            <Form.Item name="priority">
              <Select placeholder="Select priority">
                <Select.Option value={1}>
                  {getColoredIconByPriority(1)} High
                </Select.Option>
                <Select.Option value={2}>
                  {getColoredIconByPriority(2)} Medium
                </Select.Option>
                <Select.Option value={3}>
                  {getColoredIconByPriority(3)} Low
                </Select.Option>
              </Select>
            </Form.Item>

            <Button
              type="primary"
              htmlType="submit"
              style={{ backgroundColor: '#1890ff' }}
            >
              <CheckOutlined />
            </Button>
              <Button
              type="primary"
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
          className="py-3 px-6 w-full h-full text-left text-lg"
          onClick={() => setIsCreatingIssue(true)}
        >
          + Add Issue
        </Button>
      )}
    </List>
  );
};

export default SprintIssues;
