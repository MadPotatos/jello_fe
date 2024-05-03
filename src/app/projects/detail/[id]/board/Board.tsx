import React from "react";
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from "@hello-pangea/dnd";
import List from "./List";
import { usePathname } from "next/navigation";
import { Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { mutate } from "swr";
import { createList } from "@/app/api/listApi";
import { reorderIssues, updateIssueDate } from "@/app/api/issuesApi";
interface BoardProps {
  lists: any[];
  issues: any;
}

const Board: React.FC<BoardProps> = ({ lists, issues }) => {
  const pathname = usePathname();
  const projectId = Number(pathname.split("/")[3]);

  const onDragEnd = async (result: DropResult) => {
    if (!result.destination) return;

    // Extract numeric ID from the draggable ID
    const id = parseInt(result.draggableId.split("-")[1], 10);
    const body = {
      id, // The id of the issue being reordered
      s: {
        sId: parseInt(result.source.droppableId.split("-")[1], 10), // The source list ID
        order: result.source.index, // The current order of the issue in the source list
      },
      d: {
        dId: parseInt(result.destination.droppableId.split("-")[1], 10), // The destination list ID
        newOrder: result.destination.index, // The new order of the issue in the destination list
      },
      type: "list",
    };

    try {
      await reorderIssues(body);
      await updateIssueDate(body.id);
      mutate(`issues-${projectId}`);
    } catch (error) {
      console.error("Error reordering:", error);
    }
  };

  const handleCreateList = async () => {
    try {
      await createList(projectId);
      mutate(`lists-${projectId}`);
    } catch (error) {
      console.error("Error creating list:", error);
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex space-x-4 py-4 overflow-x-auto">
        {lists.map((list, index) => (
          <div className="flex-none" style={{ minWidth: "320px" }}>
            <List
              list={list}
              lists={lists}
              issues={issues[list.id]}
              index={index + 1}
            />
          </div>
        ))}
        <Button
          type="default"
          size="large"
          className="mx-auto bg-gray-100 border-none"
          onClick={handleCreateList}
        >
          <PlusOutlined />
        </Button>
      </div>
    </DragDropContext>
  );
};

export default Board;
