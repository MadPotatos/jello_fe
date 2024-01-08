"use client";
import { Backend_URL } from '@/lib/Constants';
import { usePathname } from 'next/navigation'; 
import React, { useEffect, useState } from 'react';
import ProjectLayout from './DetailLayout';
import { Spin } from 'antd';
import Board from './Board';

const ProjectDetailPage = () => {
  const [project, setProject] = useState<any>({});
  const [lists, setLists] = useState<any>([]);
  const [issues, setIssues] = useState<any>([]);
  const pathname = usePathname();
  const projectId = Number(pathname.split('/')[3]);

  const fetchProject = async (id: number) => {
    try {
      const response = await fetch(`${Backend_URL}/project/${id}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching project:', error);
      throw error;
    }
  };

  const fetchLists = async (projectId: number) => {
    try {
      const response = await fetch(`${Backend_URL}/list/${projectId}`);
      const data = await response.json();
      setLists(data);
    } catch (error) {
      console.error('Error fetching lists:', error);
      throw error;
    }
  };

  const fetchIssues = async (projectId: number) => {
    try {
      const response = await fetch(`${Backend_URL}/issues/${projectId}`);
      const data = await response.json();
      setIssues(data);
    } catch (error) {
      console.error('Error fetching issues:', error);
      throw error;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const projectData = await fetchProject(projectId);
        setProject(projectData);
        await fetchLists(projectId);
        await fetchIssues(projectId);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [projectId]);

  return (
    <ProjectLayout project={project}>
      <div className="site-layout-content">
         <h1 className='mb-4 text-xl font-semibold text-c-text'>Kanban Board</h1>
      
      {lists ? (
        <Board lists={lists} issues={issues} />
      ) : (
        <div className='grid h-[40vh] w-full place-items-center'>
          <Spin size="large" />
        
      </div>
      )}
      </div>
    </ProjectLayout>
  );
};

export default ProjectDetailPage;
