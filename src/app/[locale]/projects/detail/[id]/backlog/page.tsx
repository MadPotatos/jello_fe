"use client";
import React, { useState } from "react";
import { Spin } from "antd";
import { Member, Sprint } from "@/lib/types";
import useSWR, { mutate } from "swr";
import { fetchMembers } from "@/app/api/memberApi";
import {
  fetchIssuesInSprint,
  reorderIssues,
  updateIssueDate,
} from "@/app/api/issuesApi";
import { fetchSprints } from "@/app/api/sprintApi";
import Filter from "../Filter";
import { DragDropContext, DropResult } from "@hello-pangea/dnd";
import { usePathname } from "next/navigation";
import SprintCard from "./SprintCard";
import { useSession } from "next-auth/react";

const ProjectBacklogPage: React.FC = () => {
  const pathname = usePathname();
  const { data: session } = useSession();
  const projectId = Number(pathname.split("/")[4]);
  const [filteredIssues, setFilteredIssues] = useState<any>({});
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filterTypes, setFilterTypes] = useState<number[]>([]);
  const [filterPriorities, setFilterPriorities] = useState<number[]>([]);
  const [filterUseId, setFilterUserId] = useState<number>();
  const [isDragging, setIsDragging] = useState(false);

  const { data: members } = useSWR<Member[]>(`members-${projectId}`, () =>
    fetchMembers(projectId)
  );
  const { data: sprints } = useSWR<Sprint[]>(`sprints-${projectId}`, () =>
    fetchSprints(projectId)
  );
  const { data: issues } = useSWR<any>(`sprint-issues-${projectId}`, () =>
    fetchIssuesInSprint(projectId)
  );

  const isAdmin = members?.some(
    (member) => member.userId === session?.user?.id && member.isAdmin
  );

  const onDragEnd = async (result: DropResult) => {
    if (!result.destination || !sprints || !issues) return;

    // Extract numeric ID from the draggable ID
    const id = parseInt(result.draggableId.split("-")[1], 10);
    const sourceSprintId = parseInt(
      result.source.droppableId.split("-")[1],
      10
    );
    const destinationSprintId = parseInt(
      result.destination.droppableId.split("-")[1],
      10
    );
    const sourceIndex = result.source.index;
    const destinationIndex = result.destination.index;

    const updatedIssues = { ...issues };
    const [movedIssue] = updatedIssues[sourceSprintId].splice(sourceIndex, 1);
    updatedIssues[destinationSprintId].splice(destinationIndex, 0, movedIssue);

    setIsDragging(true);

    const body = {
      id,
      s: {
        sId: sourceSprintId,
        order: sourceIndex,
      },
      d: {
        dId: destinationSprintId,
        newOrder: destinationIndex,
      },
      type: "sprint",
    };

    try {
      await reorderIssues(body);
      await updateIssueDate(body.id);
      mutate(`sprint-issues-${projectId}`);
    } catch (error) {
      console.error("Error reordering:", error);
      mutate(`sprint-issues-${projectId}`);
    } finally {
      setIsDragging(false);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    filterIssues(query, filterUseId, filterTypes, filterPriorities);
  };

  const handleUserClick = (userId: number) => {
    setFilterUserId(userId);
    filterIssues(searchQuery, userId, filterTypes, filterPriorities);
  };

  const handleFilterChange = (filter: {
    types: number[];
    priorities: number[];
  }) => {
    setFilterTypes(filter.types);
    setFilterPriorities(filter.priorities);
    filterIssues(searchQuery, filterUseId, filter.types, filter.priorities);
  };
  const handleClearFilter = () => {
    setFilterTypes([]);
    setFilterPriorities([]);
    setFilterUserId(undefined);
    filterIssues(searchQuery);
  };

  const filterIssues = (
    query: string,
    userId?: number,
    types: number[] = [],
    priorities: number[] = []
  ) => {
    if (!issues) return;

    const filtered = {} as any;
    Object.keys(issues).forEach((listId: string) => {
      filtered[listId] = issues[listId].filter((issue: any) => {
        const matchesSearchQuery = issue.summary
          .toLowerCase()
          .includes(query.toLowerCase());
        const matchesUserId = userId
          ? issue.assignees.some((assignee: any) => assignee.userId === userId)
          : true;
        const matchesType =
          types.length > 0 ? types.includes(issue.type) : true;
        const matchesPriority =
          priorities.length > 0 ? priorities.includes(issue.priority) : true;
        return (
          matchesSearchQuery && matchesUserId && matchesType && matchesPriority
        );
      });
    });
    setFilteredIssues(filtered);
  };

  if (!sprints || !members || !issues) {
    return (
      <div className="site-layout-content">
        <h1 className="mb-4 text-xl font-semibold text-c-text">Backlog</h1>
        <div className="grid h-[40vh] w-full place-items-center">
          <Spin size="large" />
        </div>
      </div>
    );
  }

  return (
    <div className="site-layout-content">
      <h1 className="text-xl font-semibold text-gray-800 mb-4">Backlog</h1>
      <Filter
        members={members}
        onSearch={handleSearch}
        onUserClick={handleUserClick}
        onFilterChange={handleFilterChange}
        onClearFilter={handleClearFilter}
      />
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex flex-col py-4 gap-4">
          {sprints
            .slice(1)
            .concat(sprints.slice(0, 1))
            .map((sprint) => (
              <SprintCard
                key={sprint.id}
                sprint={sprint}
                filteredIssues={
                  Object.keys(filteredIssues).length > 0
                    ? filteredIssues[sprint.id]
                    : issues[sprint.id]
                }
                projectId={projectId}
                isAdmin={isAdmin}
                isDragging={isDragging}
              />
            ))}
        </div>
      </DragDropContext>
    </div>
  );
};

export default ProjectBacklogPage;
