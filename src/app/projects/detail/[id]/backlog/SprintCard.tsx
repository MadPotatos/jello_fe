import React, { useState } from 'react';
import { Sprint,List } from '@/lib/types';
import SprintIssues from './SprintIssue';
import { Button, Dropdown, Form, Input, MenuProps, Modal, Select, message, notification } from 'antd';
import { createSprint, deleteSprint, updateSprint } from '@/app/api/sprintApi';
import { ExclamationCircleOutlined} from '@ant-design/icons';
import useSWR, { mutate } from 'swr';
import { SprintStatus } from '@/lib/enum';
import { Droppable } from '@hello-pangea/dnd';
import { createIssue } from '@/app/api/issuesApi';
import { useSession } from 'next-auth/react';
import { CheckOutlined,CloseOutlined } from '@ant-design/icons';
import { getColoredIconByIssueType, getColoredIconByPriority } from '@/lib/utils';
import dayjs from 'dayjs';
import EditSprintModel from './EditSprintModel';
import { fetchLists } from '@/app/api/listApi';
import { useRouter } from 'next/navigation';
import CompleteSprintModel from './CompleteSprintModel';



const { confirm } = Modal;

interface SprintProps {
  sprint: Sprint;
  issues: any;
  filteredIssues: any;
  projectId: number;
}

const SprintCard: React.FC<SprintProps> = ({ sprint, issues, filteredIssues,projectId}) => {
  const { data: session } = useSession();
  const router = useRouter();
  const [isCreatingIssue, setIsCreatingIssue] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isCompleteModalVisible, setIsCompleteModalVisible] = useState(false);

  const { data: lists } = useSWR<List[]>(`lists-${projectId}`, () => fetchLists(projectId));

  

  const formattedStartDate = dayjs(sprint.startDate).format('D MMM');
  const formattedEndDate = dayjs(sprint.endDate).format('D MMM');

  

  const handleUpdate = () => {
    setIsModalVisible(false);
    mutate(`sprints-${projectId}`);
  };

  const handleComplete = () => {
    setIsCompleteModalVisible(false);
    mutate(`sprints-${projectId}`);
    mutate(`sprint-issues-${projectId}`);
  }

   const handleSubmitIssue = async (values: any) => {
    try {
    
      values.sprintId = sprint.id;
      values.reporterId = session?.user.id;
        await createIssue(values, session?.backendTokens.accessToken);     
        mutate(`sprint-issues-${projectId}`);
        setIsCreatingIssue(false);
     
    } catch (error) {
      console.error('Error creating issue:', error);
      message.error('Failed to create issue');
    }
  };

  const items: MenuProps['items'] = [  
    { key: 'edit-sprint', label: 'Edit Sprint', onClick: () => {setIsModalVisible(true)}},
    { key: 'delete-sprint',danger:true, label: 'Delete Sprint',onClick: () => {handleDelete()} },
  ];

  const handleCreateSprint = async () => {
        try {
            await createSprint(projectId, session?.backendTokens.accessToken);
            mutate(`sprints-${projectId}`);
        } catch (error) {
            console.error('Error creating sprint:', error);
        }
    };

  const handleStartSprint = async () => {
    try {
      
      if (!sprint.startDate || !sprint.endDate) {
        setIsModalVisible(true);
        notification.warning({
          message: 'Please set sprint dates',
          description: 'You need to set sprint dates before starting the sprint',
        });
        return;
      }

      if(issues[sprint.id]?.length === 0){
        notification.warning({
          message: 'Cannot start sprint',
          description: 'There are no issues in the sprint',
        });
        return;
      }

    const res = await updateSprint(sprint.id, { status: SprintStatus.IN_PROGRESS }, session?.backendTokens.accessToken);  
    if (res.statusCode === 409) {
      notification.warning({
        message: 'Cannot start sprint',
        description: 'Another sprint is already in progress',
      });
      return;
    }
      mutate(`sprints-${projectId}`);
      router.push(`/projects/detail/${projectId}/board`);
      notification.success({
      message: 'Sprint started',
      description: 'We have filled the board with your sprint issues. Good luck!',
    });


    } catch (error:any) {        
       notification.error({
          message: 'Failed to start sprint',
          description: 'An error occurred while starting the sprint',
        });      
    }
  }

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
            await deleteSprint(sprint.id, session?.backendTokens.accessToken);
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
        <div className="flex mb-2 px-2 py-2 gap-4">
        <h2 className="text-xl">{sprint.name}</h2>
        
        {sprint.startDate && sprint.endDate && (
          <p className="text-xl text-gray-400">
            {formattedStartDate} - {formattedEndDate}
          </p>
        )}
        <div>
          <span className="text-lg text-gray-400">({issues[sprint.id]?.length ?? 0} issues)</span>
        </div>
      </div>
        
      <div className="flex gap-2 items-center">
   {(sprint.order !== 0 && sprint.status === SprintStatus.CREATED) && (
          <Button 
            type="primary" 
            size='large'
            style={{ backgroundColor: '#0064f2' }}
            onClick={() => handleStartSprint()} 
          >
            Start Sprint
          </Button>
        )}
        {(sprint.order !== 0 && sprint.status === SprintStatus.IN_PROGRESS) && (
          <>
            <Button 
              type="text"
              className="bg-gray-300"
              size='large'
              onClick={() => setIsCompleteModalVisible(true)}
            >
              Complete Sprint
            </Button>
          </>
        )}
        {sprint.order !== 0 ? (
          <Dropdown menu={{ items }} trigger={['click']} placement="bottomRight">
            <Button 
              type="text"
              className="bg-gray-300"
              size='large'>
                ...
            </Button>
          
          </Dropdown>
        ) : (
          <Button
            type="text"
            className="bg-gray-300"
            size='large'
            onClick={() => handleCreateSprint()}
          >
            Create Sprint
          </Button>
        )}
        </div>
    </div>
     {sprint.goal &&  <p className="text-base px-2 pb-4 text-gray-500">{sprint.goal}</p>}
    <Droppable droppableId={`sprint-${sprint.id}`}>
      {(provided) => (
      <div ref={provided.innerRef} {...provided.droppableProps}>
      <SprintIssues
        issues={issues}
        sprintId={sprint.id}
        sprintOrder={sprint.order}
        filteredIssues={filteredIssues}
      />
      {provided.placeholder}

      </div>
            )}
    </Droppable>
    
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
              <Input placeholder="What needs to be done?" variant='borderless' autoFocus style={{minWidth:'500px'}} />
            </Form.Item>
            </div>
            <div className="flex gap-2">
             <Form.Item name="listId" initialValue={lists && lists.length > 0 ? lists[0].id : undefined}>
              <Select style={{ minWidth: '120px' }}>
                {(lists ?? []).map((list: any) => (
                  <Select.Option key={list.id} value={list.id}>
                    {list.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>


            <Form.Item name="priority">
              <Select placeholder="Select priority" style={{ minWidth: '100px' }}>
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
          size='large'   
          block
          className="text-left"
          onClick={() => setIsCreatingIssue(true)}
        >
          + Add Issue
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
        sprintLength={issues[sprint.id]?.length}
      />
    </div>
  );
};

export default SprintCard;
