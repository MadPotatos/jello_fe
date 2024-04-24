import React from 'react';
import { Avatar, Button, List } from 'antd';
import { Draggable } from '@hello-pangea/dnd';
import { getColoredIconByIssueType, getColoredIconByPriority } from '@/lib/utils';


interface SprintIssuesProps {
  issues: any;
  sprintId: number;
  filteredIssues: any;
}

const SprintIssues: React.FC<SprintIssuesProps> = ({ issues, sprintId, filteredIssues }) => {
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
        <Button 
        type="text" className="py-3 px-6 w-full h-full text-left text-lg">
          + Add Issue
        </Button>
    </List>
  );
};

export default SprintIssues;
