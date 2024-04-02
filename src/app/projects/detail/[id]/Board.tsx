import React from 'react';
import { DragDropContext, Draggable, Droppable, DropResult } from '@hello-pangea/dnd';
import List from './List';
import { Backend_URL } from '@/lib/Constants';
import { usePathname } from 'next/navigation';
import { Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { mutate } from 'swr';
import { createList, reorderLists } from '@/app/api/listApi';
import { reorderIssues, updateIssueDate } from '@/app/api/issuesApi';
interface BoardProps {
    lists: any[];
    issues: any;
}

const Board: React.FC<BoardProps> = ({ lists, issues}) => {
    const reorderListsEndpoint = `${Backend_URL}/list/reorder`;
    const reorderIssuesEndpoint = `${Backend_URL}/issues/reorder`;
    const pathname = usePathname();
    const projectId = Number(pathname.split('/')[3]);


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
           if (isListType) {
                await reorderLists(body);
                mutate(`lists-${projectId}`);
            } else {
                await reorderIssues(body);
                await updateIssueDate(body.id);
                mutate(`issues-${projectId}`);
            }
        } catch (error) {
            console.error('Error reordering:', error);        }
    };

    const handleCreateList = async () => {
        try {
            await createList(projectId);
            mutate(`lists-${projectId}`);
        } catch (error) {
            console.error('Error creating list:', error);
        }
    };

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="board" direction="horizontal" type="LIST">
                {(provided) => (
                    <div ref={provided.innerRef} {...provided.droppableProps}  className="flex space-x-4 p-8 overflow-x-auto">
                        {lists.map((list, index) => (
                            <Draggable key={`list-${list.id}`} draggableId={`list-${list.id}`} index={index}>             
                                {(provided) => (                                    
                                    <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}
                                    className="w-80 flex-none">
                                        <List list={list} lists = {lists}issues={issues} index={index+1}   />
                                        
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
