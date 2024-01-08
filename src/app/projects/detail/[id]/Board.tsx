import React, { use, useEffect, useState } from 'react';
import { DragDropContext, Draggable, Droppable, DropResult } from 'react-beautiful-dnd';
import List from './List';
import { Backend_URL } from '@/lib/Constants';
import { usePathname } from 'next/navigation';

interface BoardProps {
    lists: any[];
    issues: any;
}

const Board: React.FC<BoardProps> = ({ lists: initialLists, issues: initialIssues }) => {
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
                    order: result.source.index, // The current order of the list
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

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="board" direction="horizontal" type="LIST">
                {(provided) => (
                    <div ref={provided.innerRef} {...provided.droppableProps}  className="flex space-x-4 p-8 overflow-x-auto">
                        {lists.map((list, index) => (
                            <Draggable key={`list-${list.id}`} draggableId={`list-${list.id}`} index={index}>
                                {(provided) => (
                                    <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}
                                    className="min-w-80 flex-grow">
                                        <List key={list.id} list={list} issues={issues} index={list.order} />
                                    </div>
                                )}
                            </Draggable>
                        ))}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </DragDropContext>
    );
};

export default Board;
