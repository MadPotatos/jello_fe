import React from 'react';

import { Sprint } from '@/lib/types';
import SprintIssues from './SprintIssue';
import { Button, Dropdown, MenuProps } from 'antd';

interface SprintProps {
  sprint: Sprint;
  issues: any;
  filteredIssues: any;
}

const SprintCard: React.FC<SprintProps> = ({ sprint, issues, filteredIssues}) => {

  const items: MenuProps['items'] = [
    
    { key: 'edit-sprint', label: 'Edit Sprint' },
    { key: 'delete-sprint',danger:true, label: 'Delete Sprint' },
  ];
  return (
    <div key={sprint.id} className="bg-gray-100 p-2">
      <div className="flex justify-between">
        <div className="flex mb-2 p-2 gap-4">
        <h2 className="text-xl">{sprint.name}</h2>
        {sprint.startDate && sprint.endDate && (
          <p className="text-xl text-gray-400">
            {new Date(sprint.startDate).toLocaleDateString()} - {new Date(sprint.endDate).toLocaleDateString()}
          </p>
        )}
        <div>
          <span className="text-lg text-gray-400">({issues[sprint.id]?.length ?? 0} issues)</span>
        </div>
      </div>
      <Dropdown  className="text-xl " menu={{items}} trigger={['click']} placement="bottomRight">
          <Button type="text">...</Button>
        </Dropdown> 
    </div>
      <SprintIssues
        issues={issues}
        sprintId={sprint.id}
        filteredIssues={filteredIssues}
      />
    </div>
  );
};

export default SprintCard;
