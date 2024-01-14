"use client";
import { Backend_URL } from '@/lib/Constants';
import { usePathname } from 'next/navigation'; 
import React, { useEffect, useState } from 'react';
import ProjectLayout from '../layout';

const ProjectSettingPage = () => {
  const [project, setProject] = useState<any>({});
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const projectData = await fetchProject(projectId);
        setProject(projectData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [projectId]);

  return (
  
      <div className="site-layout-content">
         <h1 className='mb-4 text-xl font-semibold text-c-text'>Project Setting</h1>
      
      
      </div>
 
  );
};

export default ProjectSettingPage;
