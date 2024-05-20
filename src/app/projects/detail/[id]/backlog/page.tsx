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
  const projectId = Number(pathname.split("/")[3]);
  const [filteredIssues, setFilteredIssues] = useState<any>({});
  const [searchQuery, setSearchQuery] = useState<string>("");

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
      type: "sprint",
    };
    try {
      await reorderIssues(body);
      await updateIssueDate(body.id);
      mutate(`sprint-issues-${projectId}`);
    } catch (error) {
      console.error("Error reordering:", error);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    filterIssues(query);
  };

  const handleUserClick = (userId: number) => {
    filterIssues(searchQuery, userId);
  };

  const filterIssues = (query: string, userId?: number) => {
    if (!issues) return;

    const filtered = {} as any;
    Object.keys(issues).forEach((sprintId: string) => {
      filtered[sprintId] = issues[sprintId].filter((issue: any) => {
        const matchesSearchQuery = issue.summary
          .toLowerCase()
          .includes(query.toLowerCase());
        const matchesUserId = userId
          ? issue.assignees.some((assignee: any) => assignee.userId === userId)
          : true;
        return matchesSearchQuery && matchesUserId;
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
              />
            ))}
        </div>
      </DragDropContext>
    </div>
  );
};

export default ProjectBacklogPage;
