"use client";
import React, { useEffect, useState } from 'react';
import { Avatar, Layout, Menu } from 'antd';
import {
  ProjectOutlined,
  ToolOutlined,
  CodeOutlined,
  GroupOutlined 
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { usePathname, useRouter } from 'next/navigation';
import { Backend_URL } from '@/lib/Constants';

const { Sider } = Layout;
type MenuItem = Required<MenuProps>['items'][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
  onClick?: () => void,
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
    onClick,
  } as MenuItem;
}


const Sidebar = () => {
  const [project, setProject] = useState<any>({});
   const [collapsed, setCollapsed] = useState(false);
   const router = useRouter();
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
   
const items: MenuItem[] = [
  getItem('Board', '1', <ProjectOutlined />, undefined, () => router.push('/projects/detail/'+project.id)),
  getItem('Timeline', '2', <GroupOutlined />, undefined, () => router.push('/timeline')),
  getItem('Code', '3', <CodeOutlined />, undefined, () => router.push('/code')),
  getItem('Project setting', '4', <ToolOutlined />, undefined, () => router.push('/projects/detail/'+project.id+'/setting')),
];

  return (
    <Sider theme='light' 
    collapsible collapsed={collapsed} 
    onCollapse={(value) => setCollapsed(value)}
     width={250} >
          
        <div className="flex items-center p-4 mb-4">
            {!collapsed && (
          <><Avatar src={project &&project.image} size={40} shape="square" className="mr-2" /><div>
                      <h3 className="m-0 text-black text-lg">{project &&project.name}</h3>
                      <p className="m-0 text-gray-600 text-sm">Software Project</p>
                  </div></>
          )}
        </div>
      

      <Menu
        mode="inline"
        defaultSelectedKeys={['1']}
        style={{ height: '100%' }}
        items={items}
        className="h-full text-base"
      />
    </Sider>
  );
};

export default Sidebar;
