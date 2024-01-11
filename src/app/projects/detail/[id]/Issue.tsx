import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { Avatar } from 'antd';
import { getColoredIconByIssueType, getColoredIconByPriority } from '@/lib/utils';

interface IssueProps {
  issue: any;
  index: number;
}

const Issue: React.FC<IssueProps> = ({ issue, index }) => {
  return (
    <Draggable key={issue.id} draggableId={`issue-${issue.id}`} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className="bg-white shadow-md mb-2 group"
        >
          <div className="p-3">
            <div className="flex flex-col ">
              <span className="font-medium text-base text-gray-900">{issue.summary}</span>
              <div className="mt-3 flex items-center justify-between">
                <div className='mb-1 flex items-center text-lg gap-2'>
                    {getColoredIconByIssueType(issue.type)}
                    {getColoredIconByPriority(issue.priority)}
                </div>
                <div>
                  <Avatar.Group maxCount={2} maxStyle={{ color: '#f56a00', backgroundColor: '#fde3cf' }}>
                    {issue.assignees?.map((assignee: any) => (
                      <Avatar key={assignee.userId} src={assignee.User.avatar} />
                    ))}
                  </Avatar.Group>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
};



export default Issue;
