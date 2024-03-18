import React, { useEffect, useState } from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import { Button, Form, Input, Modal, Radio, Select, message } from 'antd';
import { EditOutlined, CheckOutlined,CloseOutlined ,DeleteOutlined} from '@ant-design/icons';
import { Backend_URL } from '@/lib/Constants';
import Issue from './Issue';
import { useSession } from 'next-auth/react';
import { getColoredIconByIssueType, getColoredIconByPriority } from '@/lib/utils';
import IssueDetailModal from './IssueDetail';


interface ListProps {
  list: any;
  lists: any[];
  issues: any;
  index: number;
  onDeleteList: (listId: number) => void;
  onCreateIssue: (createdIssue: any) => void;
  onUpdateListName: (updatedList: any) => void;
  onUpdateIssues: () => void; 
}

const List: React.FC<ListProps> = ({ list, issues,lists, index,onDeleteList,onCreateIssue,onUpdateListName,onUpdateIssues }) => {
  const [isCreatingIssue, setIsCreatingIssue] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newListName, setNewListName] = useState(list.name);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { data: session } = useSession();
  const [selectedIssue, setSelectedIssue] = useState<any>(null); 
  const [visible, setVisible] = useState(false)

  const handleCreateIssueClick = () => {
    setIsCreatingIssue(true);
  };

  const handleCloseIssueForm = () => {
    setIsCreatingIssue(false);
  };

  useEffect(() => {

      setNewListName(list.name);
    
  }, [list.name]);

  const handleShowModal = () => {
    setIsModalVisible(true);
  };

  const handleHideModal = () => {
    setIsModalVisible(false);
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleNameChange = (e: any) => {
    setNewListName(e.target.value);
  };

  const handleIssueClick = (issue: any) => {
  setSelectedIssue(issue);
  setVisible(true);
};


  const handleSaveClick = async () => {
    try {
      const response = await fetch(`${Backend_URL}/list/${list.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: newListName }),
      });

      if (response.ok) {
        const updatedList = await response.json();
        setIsEditing(false);
        
        onUpdateListName(updatedList);
        message.success('List name updated successfully!');
      } else {
        throw new Error('Failed to update list name');
      }
    } catch (error) {
      message.error('Failed to update list name');
    }
  };

    const handleDeleteClick = () => {
    handleShowModal();
  };

  const handleConfirmDelete = async () => {
    try {
      const response = await fetch(`${Backend_URL}/list/${list.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        message.success('List deleted successfully!');
        onDeleteList(list.id);
      } else {
        throw new Error('Failed to delete list');
      }
    } catch (error) {
      console.error('Failed to delete list:', error);
      message.error('Failed to delete list');
    } finally {
      handleHideModal();
    }
  };

  const handleSubmitIssue = async (values: any) => {
    try {
    
      values.listId = list.id;
      values.reporterId = session?.user.id;


      const response = await fetch(`${Backend_URL}/issues`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${session?.backendTokens.accessToken}`,
        },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        const createdIssue = await response.json();
        onCreateIssue(createdIssue);
        setIsCreatingIssue(false);
        message.success('Issue created successfully!');
      } else {
        throw new Error('Failed to create issue');
      }
    } catch (error) {
      console.error('Error creating issue:', error);
      message.error('Failed to create issue');
    }
  };

  return (
    <Draggable draggableId={`list-${list.id}`} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className="flex flex-col bg-gray-100 shadow-md mb-4 p-4 group"
        >
          <div className="flex items-center justify-between border-gray-200 pb-4">
            {isEditing ? (
              <div className="flex items-center">
                <Input
                  value={newListName}
                  onChange={handleNameChange}
                  placeholder={list.name}
                  className='bg-transparent text-lg font-medium text-gray-900'
                />
              </div>
            ) : (
              <div className="text-lg font-medium text-gray-900">
                {newListName}
              </div>
            )}

            {isEditing ? (
                <div className='flex'>
              <Button type="text" onClick={handleSaveClick}>
                <CheckOutlined style={{ color: '#39e75f' }} />
              </Button>
                <Button type="text" onClick={() => setIsEditing(false)}>
                    <CloseOutlined style={{ color: '#f44336' }} />
                </Button>
                </div>
            ) : (
                <div className='flex'>
              <Button type="text" onClick={handleEditClick}>
                <EditOutlined />
              </Button>
              <Button type="text" danger onClick={handleDeleteClick}>
                <DeleteOutlined />
                </Button>
                </div>
            )}
          </div>
          <Droppable droppableId={`list-${list.id}`} type="ISSUE">
            {(provided) => (
              <div ref={provided.innerRef} {...provided.droppableProps}>
                {issues[list.id] && Array.isArray(issues[list.id])
                ? issues[list.id].map((issue: any, innerIndex: number) => (
                 <Issue key={issue.id} issue={issue} index={innerIndex} onClick={() => handleIssueClick(issue)}/>              
             ))
                : null}
                {provided.placeholder}
            </div>
            )}
          </Droppable>
            {isCreatingIssue ? (
            <Form
                onFinish={handleSubmitIssue}
                className="flex flex-col mt-4 bg-white shadow-md"
                layout="vertical"
                initialValues={{
                    summary: '',
                    type: 1,
                    priority: 1,
                }}
                >
                    <div className="p-3">
                <Form.Item
                    name="summary"
                    rules={[{ required: true, message: 'Please enter issue summary' }]}
                >
                    <Input 
                        placeholder="What needs to be done?"
                        bordered={false}
                         />
                </Form.Item>

                <div className="flex items-center">
                    <Form.Item name="type">
                    <Select
                        placeholder="Select issue type"
                    >
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

                    <Form.Item name="priority" style={{ marginLeft: '10px' }}>
                    <Select
                        placeholder="Select priority"
                        
                    >
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
                </div>

                <div className="flex justify-between">
                    <Button type="default" onClick={handleCloseIssueForm}>
                    Cancel
                    </Button>
                    <Button 
                        type="primary" 
                        htmlType="submit" 
                        style={{ backgroundColor: '#1890ff'}}>
                    Create Issue
                    </Button>
                </div>
                </div>
                    </Form>
            ) : (
                <Button
                type="text"
                size="large"
                onClick={handleCreateIssueClick}
                >
                + Add Issue
                </Button>
            )}
          <Modal
            title="Confirm Deletion"
            open={isModalVisible}
            onOk={handleConfirmDelete}
            onCancel={handleHideModal}
            okButtonProps={{style: {backgroundColor: '#1890ff'}}}
          >
            <p>Are you sure you want to delete this list?</p>
          </Modal>
       {selectedIssue && (
        <IssueDetailModal issue={selectedIssue} lists={lists} visible={visible} onClose={()=>setVisible(false)} onUpdateIssue={onUpdateIssues}/>
                )}

        </div>
      )}
    </Draggable>
    
  );
};



export default List;
