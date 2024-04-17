"use client";
import { usePathname } from 'next/navigation'; 
import React, { useState } from 'react';
import { Spin } from 'antd';
import {  Member, Sprint } from '@/lib/types';
import useSWR from 'swr';
import { fetchMembers } from '@/app/api/memberApi';
import { fetchIssuesInSprint } from '@/app/api/issuesApi';
import { fetchSprints } from '@/app/api/sprintApi';
import Filter from '../Filter';

const ProjectBacklogPage = () => {
  const pathname = usePathname();
  const projectId = Number(pathname.split('/')[3]);
  const [filteredIssues, setFilteredIssues] = useState<any>({});
  const [searchQuery, setSearchQuery] = useState<string>('');

  const { data: members } = useSWR<Member[]>(`members-${projectId}`, () => fetchMembers(projectId));
  const { data: sprints } = useSWR<Sprint[]>(`lists-${projectId}`, () => fetchSprints(projectId));
  const { data: issues } = useSWR(`sprint-issues-${projectId}`, () => fetchIssuesInSprint(projectId));

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
        <h1 className='mb-4 text-xl font-semibold text-c-text'>Backlog</h1>
        <div className="grid h-[40vh] w-full place-items-center">
          <Spin size="large" />
        </div>
      </div>
    );
  }

  return (
    <div className="site-layout-content">
      <h1 className='mb-4 text-xl font-semibold text-c-text'>Backlog</h1>
      <Filter members={members} onSearch={handleSearch} />
      
    </div>
  );
};

export default ProjectBacklogPage;
