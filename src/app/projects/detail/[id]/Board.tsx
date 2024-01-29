import React, { use, useEffect, useState } from 'react';
import { DragDropContext, Draggable, Droppable, DropResult } from 'react-beautiful-dnd';
import List from './List';
import { Backend_URL } from '@/lib/Constants';
import { usePathname } from 'next/navigation';
import { Button, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
interface BoardProps {
    lists: any[];
    issues: any;
    onUpdateIssue: () => void;
}

const Board: React.FC<BoardProps> = ({ lists: initialLists, issues: initialIssues,onUpdateIssue }) => {
    const reorderListsEndpoint = `${Backend_URL}/list/reorder`;
    const reorderIssuesEndpoint = `${Backend_URL}/issues/reorder`;
    const pathname = usePathname();
    const projectId = Number(pathname.split('/')[3]);

    const [lists, setLists] = useState(initialLists);
    const [issues, setIssues] = useState(initialIssues);
    
    useEffect(() => {
        setLists(initialLists);
        setIssues(initialIssues);
    }, [initialLists, initialIssues]);

    const onDragEnd = async (result: DropResult) => {
        if (!result.destination) return;

        const isListType = result.type === 'LIST';

        // Extract numeric ID from the draggable ID
        const id = parseInt(result.draggableId.split('-')[1], 10);
        const body = isListType
            ? {
                    id, // The id of the list being reordered
                    order: result.source.index, // The current order of the list +1
                    newOrder: result.destination.index, // The new order of the list after reordering
                    projectId: projectId,
                }
            : {
                    id, // The id of the issue being reordered
                    s: {
                        sId: parseInt(result.source.droppableId.split('-')[1], 10), // The source list ID
                        order: result.source.index, // The current order of the issue in the source list
                    },
                    d: {
                        dId: parseInt(result.destination.droppableId.split('-')[1], 10), // The destination list ID
                        newOrder: result.destination.index, // The new order of the issue in the destination list
                    },
                };

        try {
            // Call the backend endpoint based on the type
            const endpoint = isListType ? reorderListsEndpoint : reorderIssuesEndpoint;

            await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
            });

            // Update the updatedAt field for the issue after reordering (if it's an issue)
            if (!isListType) {
                await fetch(`${Backend_URL}/issues/update/${body.id}`, {
                    method: 'PUT', 
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
            }
            if (isListType) {
                const newLists = [...lists];
                const [removed] = newLists.splice(result.source.index, 1);
                newLists.splice(result.destination.index, 0, removed);
                setLists(newLists);
            } else {
       
                const newIssues = { ...issues };
                const sourceIssues = newIssues[body.s?.sId ?? 0];
                const [removed] = sourceIssues.splice(body.s?.order ?? 0, 1);
                const destinationIssues = newIssues[body.d?.dId ?? 0];
                destinationIssues.splice(body.d?.newOrder ?? 0, 0, removed);
                setIssues(newIssues);
            }
        
        } catch (error) {
            console.error('Error reordering:', error);        }
    };

    const handleCreateList = async () => {
        try {
            const response = await fetch(`${Backend_URL}/list`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ projectId }),
            });

            if (response.ok) {
                const newList = await response.json();
                setLists([...lists, newList]);
                message.success('List created successfully!');
            } else {
                throw new Error('Failed to create list');
            }
        } catch (error) {
            console.error('Error creating list:', error);
        }
    };
    const handleDeleteList = (listId: number) => {
    const updatedLists = lists.filter((list) => list.id !== listId);
    setLists(updatedLists);
  };

  const handleUpdateListName = (updatedList: any) => {
  const listIndex = lists.findIndex((l) => l.id === updatedList.id);

  if (listIndex !== -1) {
    const updatedLists = [...lists];
    updatedLists[listIndex].name = updatedList.name;
    setLists(updatedLists);
  }
};

  const handleCreateIssue = (createdIssue: any) => {
    const updatedIssues = { ...issues };
    updatedIssues[createdIssue.listId] = [...updatedIssues[createdIssue.listId], createdIssue];
    setIssues(updatedIssues);
  };



    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="board" direction="horizontal" type="LIST">
                {(provided) => (
                    <div ref={provided.innerRef} {...provided.droppableProps}  className="flex space-x-4 p-8 overflow-x-auto">
                        {lists.map((list, index) => (
                            console.log(index),
                            <Draggable key={`list-${list.id}`} draggableId={`list-${list.id}`} index={index}>             
                                {(provided) => (                                    
                                    <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}
                                    className="w-80 flex-none">
                                        <List key={list.id} list={list} lists = {lists}issues={issues} index={index+1} onDeleteList={handleDeleteList} onCreateIssue={handleCreateIssue} onUpdateListName={handleUpdateListName} onUpdateIssues={onUpdateIssue}/>
                                        
                                    </div>
                                  
                                )}
                            </Draggable>
                        ))}
                        {provided.placeholder}
                        <Button type="default" size="large" className="mx-auto bg-gray-100 border-none" onClick={handleCreateList}>
                            <PlusOutlined />
                        </Button> 
                    </div>
                )}
            </Droppable>
                                 
        </DragDropContext>
    );
};

export default Board;
