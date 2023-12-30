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
import { Backend_URL } from '@/lib/Constants';
import { usePathname } from 'next/navigation';
import { Project } from '@/lib/types';

const { Sider } = Layout;
type MenuItem = Required<MenuProps>['items'][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
  } as MenuItem;
}


const Sidebar = ({ project }: { project: Project }) => {

   const [collapsed, setCollapsed] = useState(false);
   
const items: MenuItem[] = [
  getItem('Board', '1', <ProjectOutlined />),
  getItem('Timeline', '2', <GroupOutlined />),
  getItem('Code', '3', <CodeOutlined  />),
  getItem('Project setting', '4', <ToolOutlined  />),
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
