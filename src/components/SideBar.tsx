"use client";
import React, {  useState } from 'react';
import { Avatar, Layout, Menu } from 'antd';
import {
  ProjectOutlined,
  ToolOutlined,
  PullRequestOutlined,
  GroupOutlined,
  BugOutlined,
  IssuesCloseOutlined,
  TableOutlined
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { usePathname, useRouter } from 'next/navigation';
import useSWR from 'swr';
import { ProjectDetail } from '@/lib/types';
import { fetchProjectById } from '@/app/api/projectApi';


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
   const [collapsed, setCollapsed] = useState(false);
   const router = useRouter();
   const pathname = usePathname();
   const projectId: number = parseInt(pathname.split('/')[3]);

    const { data: project } = useSWR<ProjectDetail>(`project-${projectId}`, () => fetchProjectById(projectId));


   
   
const items: MenuItem[] = [
  getItem('Planning','grp-1',null,[
  getItem('Board', '1', <ProjectOutlined />, undefined, () => router.push('/projects/detail/'+project?.id)),
  getItem('Timeline', '2', <GroupOutlined />, undefined, () => router.push('/timeline')),
  getItem('Backlog', '3', <TableOutlined />, undefined, () => router.push('/projects/detail/'+project?.id+'/backlog')),
  ]),
  getItem('Development','grp-2',null,[
  getItem('Pull requests', '4', <PullRequestOutlined />, undefined, () => router.push('/projects/detail/'+project?.id+'/pull-requests')),
  getItem('Issues', '5', <IssuesCloseOutlined />, undefined, () => router.push('/projects/detail/'+project?.id+'/issues')),
  getItem('Bug tracking', '6', <BugOutlined />, undefined, () => router.push('/projects/detail/'+project?.id+'/bug-tracking')),
  ]),
  {type: 'divider'},
  getItem('Project setting', '7', <ToolOutlined />, undefined, () => router.push('/projects/detail/'+project?.id+'/setting')),
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
        defaultOpenKeys={['grp-1', 'grp-2']}
        style={{ height: '100%' }}
        items={items}
        className="h-full text-base"
      />
    </Sider>
  );
};

export default Sidebar;
