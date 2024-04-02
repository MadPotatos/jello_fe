"use client";
import React, {  useState } from 'react';
import {  usePathname } from 'next/navigation';
import { Button, Table, Input, Breadcrumb, Popover, Avatar, message, Modal } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { Leader, Project } from '@/lib/types';
import { useSession } from 'next-auth/react';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import useSWR, { mutate } from 'swr';
import { fetchDeletedProjects, restoreProject } from '@/app/api/projectApi';

const { Search } = Input;
const { confirm } = Modal;

const DeletedProjectList = () => {
  const pathname = usePathname();
  const [searchValue, setSearchValue] = useState<string>('');
  const { data: session } = useSession();

  const userId: number = parseInt(pathname.split('/')[2]);

  const { data: projects, error: projectsError } = useSWR<Project[]>(`project-deleted-${userId}`, () => fetchDeletedProjects(userId));

   
  const handleSearch = (value: string) => {
    setSearchValue(value);
  };

  const filteredProjects = projects?.filter(project =>
    project.name.toLowerCase().includes(searchValue.toLowerCase())
  );

  const columns = [
    {
      title: 'Project',
      dataIndex: 'image',
      key: 'project',
      render: (text: string, record: Project) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Avatar src={record.image || '/images/default_avatar.jpg'} size={50} shape='square' />
          <span style={{ marginLeft: '20px', fontWeight: 'bold', color: '#1890ff' }}>{record.name}</span>
        </div>
      ),
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      width: '40%',
    },
    {
      title: 'Leader',
      dataIndex: 'leader',
      key: 'leader',
      render: (leader: Leader, record: Project) => (
        <Popover
          content={
            <div className="max-w-xs py-3 rounded-lg">
              <div className="flex photo-wrapper p-2 justify-center">
                <Avatar src={leader.avatar || '/images/default_avatar.jpg'} size={64} />
              </div>
              <div className="p-2">
                <h3 className="text-center text-xl text-gray-900 font-medium leading-8">{leader.name}</h3>
                <div className="text-center text-gray-400 text-xs font-semibold">
                  <p>{leader.email}</p>
                </div>
                <div className="text-center my-3">
                  <a
                    className="text-xs text-indigo-500 italic hover:underline hover:text-indigo-600 font-medium"
                    href={`/user/${leader.userId}`}
                  >
                    View Profile
                  </a>
                </div>
              </div>
            </div>
          }
          title=""
          trigger="hover"
        >
          <div 
            style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
          >
            <Avatar
              src={leader.avatar || '/images/default_avatar.jpg'}  
              size={48}
              style={{  marginRight: '10px' }}
            />
            <span>{leader.name}</span>
          </div>
        </Popover>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (text: any, record: Project) => (
          <Button size="small" type='default' onClick={(e) => handleRestore(record.id,e )}>
            Restore
          </Button>
    
      ),
    },
  ];

  const handleRestore = async (projectId: number,event: React.MouseEvent<HTMLElement, MouseEvent>) => {
    event.stopPropagation();
    confirm({
      title: 'Do you want to restore this project?',
      icon: <ExclamationCircleOutlined />,
      okType: 'default',
      onOk: async () => {
        try {
          await restoreProject(projectId, session?.backendTokens.accessToken);
          message.success('Project is removed from recycle bin !');
          mutate(`project-deleted-${userId}`);
        } catch (err) {
          console.error(err);
          message.error('Failed to restore project');
        }
      },
      onCancel() {},
    });
  };
   

 return (
    <div className="w-full flex flex-col justify-start px-16 py-4 bg-gradient-to-b from-white to-purple-200 min-h-screen">
        <h1 className="text-3xl font-bold text-center mb-10">Recycle Bin</h1>

      <div className="flex justify-between items-center mb-10">
        <Search
          placeholder="Search projects"
          prefix={<SearchOutlined />}
          style={{ width: '300px', fontSize: '16px' }}
          onSearch={handleSearch}
        />
      </div>

      <Table dataSource={filteredProjects || []}
        columns={columns} 
        loading={!projects && !projectsError} 
        rowKey="id" 
        />
    </div>
  );
};

export default DeletedProjectList;