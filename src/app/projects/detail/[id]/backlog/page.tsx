"use client";
import React, { useState } from 'react';
import { Spin } from 'antd';
import { Member, Sprint } from '@/lib/types';
import useSWR from 'swr';
import { fetchMembers } from '@/app/api/memberApi';
import { fetchIssuesInSprint } from '@/app/api/issuesApi';
import { fetchSprints } from '@/app/api/sprintApi';
import Filter from '../Filter';
import { DragDropContext, DropResult, Droppable } from '@hello-pangea/dnd';
import { usePathname } from 'next/navigation';
import SprintCard from './SprintCard';



const ProjectBacklogPage: React.FC = () => {
  const pathname = usePathname();
  const projectId = Number(pathname.split('/')[3]);
  const [filteredIssues, setFilteredIssues] = useState<any>({});
  const [searchQuery, setSearchQuery] = useState<string>('');

  const { data: members } = useSWR<Member[]>(`members-${projectId}`, () => fetchMembers(projectId));
  const { data: sprints } = useSWR<Sprint[]>(`sprints-${projectId}`, () => fetchSprints(projectId));
  const { data: issues } = useSWR<any>(`sprint-issues-${projectId}`, () => fetchIssuesInSprint(projectId));

  const onDragEnd = async (result: DropResult) => {};

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    filterIssues(query);
  };

  const filterIssues = (query: string) => {
    if (!issues) return; 

    const filtered = {} as any; 
    Object.keys(issues).forEach((listId: string) => {
      filtered[listId] = issues[listId].filter((issue: any) =>
        issue.summary.toLowerCase().includes(query.toLowerCase())
      );
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
      <Filter members={members} onSearch={handleSearch} />
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="backlog" type="COLUMN" direction="vertical">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef} className="flex flex-col gap-4">
              {sprints
                  .slice(1)
                  .concat(sprints.slice(0, 1)) 
                  .map((sprint) => (
                    <SprintCard
                      key={sprint.id}
                      sprint={sprint}
                      issues={issues}
                      filteredIssues={filteredIssues}
                    />
                  ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default ProjectBacklogPage;