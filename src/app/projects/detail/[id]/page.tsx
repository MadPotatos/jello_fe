"use client";
import { usePathname } from 'next/navigation'; 
import React, { useState } from 'react';
import { Spin } from 'antd';
import Board from './Board';
import Filter from './Filter';
import { List, Member } from '@/lib/types';
import useSWR from 'swr';
import { fetchMembers } from '@/app/api/memberApi';
import { fetchLists } from '@/app/api/listApi';
import { fetchIssues } from '@/app/api/issuesApi';

const ProjectDetailPage = () => {
  const pathname = usePathname();
  const projectId = Number(pathname.split('/')[3]);
  const [filteredIssues, setFilteredIssues] = useState<any>({});
  const [searchQuery, setSearchQuery] = useState<string>('');

  const { data: members } = useSWR<Member[]>(`members-${projectId}`, () => fetchMembers(projectId));
  const { data: lists } = useSWR<List[]>(`lists-${projectId}`, () => fetchLists(projectId));
  const { data: issues } = useSWR(`issues-${projectId}`, () => fetchIssues(projectId));

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

  if (!lists || !members || !issues) {
    return (
      <div className="site-layout-content">
        <h1 className='mb-4 text-xl font-semibold text-c-text'>Kanban Board</h1>
        <div className="grid h-[40vh] w-full place-items-center">
          <Spin size="large" />
        </div>
      </div>
    );
  }

  return (
    <div className="site-layout-content">
      <h1 className='mb-4 text-xl font-semibold text-c-text'>Kanban Board</h1>
      <Filter members={members} onSearch={handleSearch} />
      <Board lists={lists} issues={Object.keys(filteredIssues).length > 0 ? filteredIssues : issues}/>
    </div>
  );
};

export default ProjectDetailPage;
