"use client";
import { Backend_URL } from '@/lib/Constants';
import { usePathname } from 'next/navigation'; 
import React, { useEffect, useState } from 'react';
import { Spin } from 'antd';
import Board from './Board';
import Filter from './Filter';
import { Member } from '@/lib/types';

const ProjectDetailPage = () => {
  const [lists, setLists] = useState<any>([]);
  const [issues, setIssues] = useState<any>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const pathname = usePathname();
  const projectId = Number(pathname.split('/')[3]);
  const [filteredIssues, setFilteredIssues] = useState<any>({});
  const [searchQuery, setSearchQuery] = useState<string>('');

  const fetchLists = async (projectId: number) => {
    try {
      const response = await fetch(`${Backend_URL}/list/${projectId}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching lists:', error);
      throw error;
    }
  };

  const fetchIssues = async (projectId: number) => {
    try {
      const response = await fetch(`${Backend_URL}/issues/${projectId}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching issues:', error);
      throw error;
    }
  };

  const fetchMembers = async (projectId: number) => {
    try {
      const response = await fetch(`${Backend_URL}/member/${projectId}`);
      const data = await response.json();
      return data.members;
    } catch (error) {
      console.error('Error fetching members:', error);
      throw error;
    }
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query); 
    filterIssues(query); 
  };

  // Define filter function
   const filterIssues = (query: string) => {
    const filtered = {} as any; 
    Object.keys(issues).forEach((listId: string) => {
      filtered[listId] = issues[listId].filter((issue: any) =>
        issue.summary.toLowerCase().includes(query.toLowerCase())
      );
    });
    setFilteredIssues(filtered); 
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const listsData = await fetchLists(projectId);
        const issuesData = await fetchIssues(projectId);
        const membersData = await fetchMembers(projectId);
        setLists(listsData);
        setIssues(issuesData);
        setMembers(membersData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [projectId]);

  const handleAddMember = async () => {

    const membersData = await fetchMembers(projectId);
    setMembers(membersData);
  }

  return (
      console.log(filteredIssues),
      <div className="site-layout-content">
         <h1 className='mb-4 text-xl font-semibold text-c-text'>Kanban Board</h1>
     <Filter members={members} onSearch={handleSearch} onAddMember = {handleAddMember}/> 
        {lists ? (
        <Board lists={lists} issues={Object.keys(filteredIssues).length > 0 ? filteredIssues : issues} />
      ) : (
        <div className="grid h-[40vh] w-full place-items-center">
          <Spin size="large" />
        </div>
      )}
      </div>

  );
};

export default ProjectDetailPage;
