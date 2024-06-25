import React, { useState } from "react";
import { DragDropContext, DropResult } from "@hello-pangea/dnd";
import List from "./List";
import { usePathname } from "next/navigation";
import { Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import useSWR, { mutate } from "swr";
import { createList } from "@/app/api/listApi";
import { reorderIssues, updateIssueDate } from "@/app/api/issuesApi";

interface BoardProps {
  lists: any[];
  issues: any;
  sprintId: number | undefined;
}

const Board: React.FC<BoardProps> = ({ sprintId, lists, issues }) => {
  const pathname = usePathname();
  const projectId = Number(pathname.split("/")[4]);
  const [isDragging, setIsDragging] = useState(false);

  const onDragEnd = async (result: DropResult) => {
    if (!result.destination || !lists || !issues) return;

    // Extract numeric ID from the draggable ID
    const id = parseInt(result.draggableId.split("-")[1], 10);
    const sourceListId = parseInt(result.source.droppableId.split("-")[1], 10);
    const destinationListId = parseInt(
      result.destination.droppableId.split("-")[1],
      10
    );
    const sourceIndex = result.source.index;
    const destinationIndex = result.destination.index;

    // const updatedIssues = { ...issues };
    // const [movedIssue] = updatedIssues[sourceListId].splice(sourceIndex, 1);
    // updatedIssues[destinationListId].splice(destinationIndex, 0, movedIssue);

    setIsDragging(true);

    const body = {
      id,
      s: {
        sId: sourceListId,
        order: sourceIndex,
      },
      d: {
        dId: destinationListId,
        newOrder: destinationIndex,
      },
      type: "list",
    };

    try {
      await reorderIssues(body);
      await updateIssueDate(body.id);
      mutate(`issues-${projectId}`);
    } catch (error) {
      console.error("Error reordering:", error);
      mutate(`issues-${projectId}`);
    } finally {
      setIsDragging(false);
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

  if (!lists || !issues) return <div>Loading...</div>;

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex space-x-4 py-4 overflow-x-auto">
        {lists.map((list) => (
          <div
            className="flex-none"
            style={{ minWidth: "320px" }}
            key={list.id}
          >
            <List
              key={list.id}
              list={list}
              lists={lists}
              issues={issues[list.id]}
              sprintId={sprintId}
              isDragging={isDragging}
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
