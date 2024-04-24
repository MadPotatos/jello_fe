import React from 'react';
import { Sprint } from '@/lib/types';
import SprintIssues from './SprintIssue';
import { Button, Dropdown, MenuProps, Modal, message } from 'antd';
import { usePathname } from 'next/navigation';
import { createSprint, deleteSprint } from '@/app/api/sprintApi';
import { ExclamationCircleOutlined} from '@ant-design/icons';
import { mutate } from 'swr';

const { confirm } = Modal;

interface SprintProps {
  sprint: Sprint;
  issues: any;
  filteredIssues: any;
}

const SprintCard: React.FC<SprintProps> = ({ sprint, issues, filteredIssues}) => {
   const pathname = usePathname();
   const projectId = Number(pathname.split('/')[3]);

  const items: MenuProps['items'] = [  
    { key: 'edit-sprint', label: 'Edit Sprint'},
    { key: 'delete-sprint',danger:true, label: 'Delete Sprint',onClick: () => {handleDelete()} },
  ];

  const handleCreateSprint = async () => {
        try {
            await createSprint(projectId);
            mutate(`sprints-${projectId}`);
        } catch (error) {
            console.error('Error creating sprint:', error);
        }
    };

  const handleDelete = async () => {
    try {
      confirm(
        {
          title: 'Are you sure you want to delete this list?',
          icon: <ExclamationCircleOutlined />,
          content: 'This action cannot be undone',
          okText: 'Yes',
          okButtonProps: { style: { backgroundColor: '#1890ff' } },
          cancelText: 'No',
          onOk: async () => {
            await deleteSprint(sprint.id);
              message.success('List deleted successfully');
              mutate(`sprints-${projectId}`);
          },
        }
      )
    } catch (error) {
      console.error('Error deleting list:', error);
    }
    
  };
  
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
 {sprint.order === 0 ?(
      <Button 
      type="text" 
      className="h-full text-lg bg-gray-300"
      onClick={() => {handleCreateSprint()}}
      >
        Create Sprint
        </Button>
    ):
    (     
      <Dropdown 
         menu={{items}} 
         trigger={['click']} 
         placement="bottomRight" >
          <Button type="text" style={{ fontSize: '20px' }}>...</Button>
        </Dropdown> 
  )}
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
