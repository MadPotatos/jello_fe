import React, { useEffect, useState } from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import { CheckSquareFilled, BugFilled, ThunderboltFilled, DownOutlined, UpOutlined, MinusOutlined } from '@ant-design/icons';
import { Button, Input, message } from 'antd';
import { EditOutlined, CheckOutlined } from '@ant-design/icons';
import { Backend_URL } from '@/lib/Constants';

interface ListProps {
  list: any;
  issues: any;
  index: number;
}

const List: React.FC<ListProps> = ({ list, issues, index }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newListName, setNewListName] = useState(list.name);

  useEffect(() => {

      setNewListName(list.name);
    
  }, [list.name]);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleNameChange = (e: any) => {
    setNewListName(e.target.value);
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
        setNewListName(updatedList.name);
        message.success('List name updated successfully!');
      } else {
        throw new Error('Failed to update list name');
      }
    } catch (error) {
      message.error('Failed to update list name');
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
                />
              </div>
            ) : (
              <div className="text-lg font-medium text-gray-900">
                {newListName}
              </div>
            )}

            {isEditing ? (
              <Button type="text" onClick={handleSaveClick}>
                <CheckOutlined style={{ color: '#39e75f' }} />
              </Button>
            ) : (
              <Button type="text" onClick={handleEditClick}>
                <EditOutlined />
              </Button>
            )}
          </div>
          <Droppable droppableId={`list-${list.id}`} type="ISSUE">
            {(provided) => (
              <div ref={provided.innerRef} {...provided.droppableProps}>
                {issues[index] && Array.isArray(issues[index])
                  ? issues[index].map((issue: any, innerIndex: number) => (
                    <Draggable key={issue.id} draggableId={`issue-${issue.id}`} index={innerIndex}>
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
                                  {issue.type === 1
                                    ? <CheckSquareFilled style={{ color: issueTypeColorMapping[issue.type] }} />
                                    : issue.type === 2
                                      ? <BugFilled style={{ color: issueTypeColorMapping[issue.type] }} />
                                      : <ThunderboltFilled style={{ color: issueTypeColorMapping[issue.type] }} />}

                                  {issue.priority === 1
                                    ? <UpOutlined style={{ color: priorityColorMapping[issue.priority] }} />
                                    : issue.priority === 2
                                      ? <MinusOutlined style={{ color: priorityColorMapping[issue.priority] }} />

                                      : <DownOutlined style={{ color: priorityColorMapping[issue.priority] }} />}
                                </div>
                                <div></div>
                              </div>
                            </div>

                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))
                  : null}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </div>
      )}
    </Draggable>
  );
};

const issueTypeColorMapping: { [key: number]: string } = {
  1: '#1890ff',
  2: 'red',
  3: 'orange',
};

const priorityColorMapping: { [key: number]: string } = {
  1: 'red',
  2: 'orange',
  3: '#1890ff',
};

export default List;
