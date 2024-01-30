"use client";
import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Button, Table, Input, Breadcrumb, Popover, Avatar, message, Modal } from 'antd';
import { SearchOutlined, PlusOutlined } from '@ant-design/icons';
import { Backend_URL } from '@/lib/Constants';
import { Leader, Project } from '@/lib/types';
import { useSession } from 'next-auth/react';
import { ExclamationCircleOutlined } from '@ant-design/icons';

const { Search } = Input;
const { confirm } = Modal;

const DeletedProjectList = () => {
  const pathname = usePathname();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchValue, setSearchValue] = useState<string>('');
  const { data: session } = useSession();

   

  const fetchProjects = async (userId: number) => {
    setLoading(true);
    try {
      const response = await fetch(`${Backend_URL}/project/deleted/${userId}`);
      const { projects } = await response.json();
      setProjects(projects);
      setLoading(false);
    } catch (err) {
      console.error(err);
    }
  };

     const handleSearch = (value: string) => {
    setSearchValue(value);
    if (value.trim() === '') {
      fetchProjects(parseInt(pathname.split('/')[2]));
    } else {
      const filteredProjects = projects.filter(project =>
        project.name.toLowerCase().includes(value.toLowerCase())
      );
      setProjects(filteredProjects);
    }
  };

  useEffect(() => {
    const userId: number = parseInt(pathname.split('/')[2]);
    fetchProjects(userId);
  }, [pathname]);

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
          trigger="click"
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
          const response = await fetch(`${Backend_URL}/project/restore/${projectId}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              authorization: `Bearer ${session?.backendTokens.accessToken}`,
            },
          });
          message.success('Project is removed to recycle bin !');
          const userId: number = parseInt(pathname.split('/')[2]);
          fetchProjects(userId);
        } catch (err) {
          console.error(err);
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

      <Table dataSource={projects} 
        columns={columns} 
        loading={loading} 
        rowKey="id" 
        />
    </div>
  );
};

export default DeletedProjectList;
