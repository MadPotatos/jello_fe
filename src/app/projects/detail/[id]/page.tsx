"use client";
import { Backend_URL } from '@/lib/Constants';
import { usePathname } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import ProjectLayout from './DetailLayout';



const ProjectDetailPage = () => {
    const [project, setProject] = useState<any>({});
    const pathname = usePathname();

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
    const id: number = parseInt(pathname.split('/')[3], 10);

    const fetchData = async () => {
      try {
        const projectData = await fetchProject(id);
        setProject(projectData);
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };

    fetchData();
  }, [pathname]);
  return (
      
     <ProjectLayout project={project}>
      <div className="site-layout-content">Content</div>
    </ProjectLayout>

      
  );
};

export default ProjectDetailPage;
