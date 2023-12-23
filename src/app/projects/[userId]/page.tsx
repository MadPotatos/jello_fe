"use client";
import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Button, Table, Input, Breadcrumb, Popover, Avatar } from 'antd';
import { SearchOutlined, PlusOutlined } from '@ant-design/icons';
import { Backend_URL } from '@/lib/Constants';
import { Leader, Project } from '@/lib/types';
import CreateProjectModel from './CreateProjectModel';

const { Search } = Input;

const ProjectList = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchValue, setSearchValue] = useState<string>('');
   const [isModalVisible, setIsModalVisible] = useState(false);


  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const fetchProjects = async (userId: number) => {
    setLoading(true);
    try {
      const response = await fetch(`${Backend_URL}/project/all/${userId}`);
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
          <img
            src={text || '/images/logo.png'} 
            alt="Project"
            style={{ width: '50px', borderRadius: '10%' }}
          />
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
                    href={`/profile/${leader.userId}`}
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
        <Button size="small" danger onClick={() => console.log('Delete project', record.id)}>
          Delete
        </Button>
      ),
    },
  ];

 return (
    <div className="w-full flex flex-col justify-center px-16 py-4">
      <Breadcrumb style={{ margin: '16px 0', fontSize: '18px' }}
      items={[
        { title: 'Home', key: 'home', href: '/' },
        { title: 'Projects', key: 'projects' },   
      ]}
      >
      </Breadcrumb>

      <div className="flex justify-between items-center mb-10">
        <Search
          placeholder="Search projects"
          prefix={<SearchOutlined />}
          style={{ width: '300px', fontSize: '16px' }}
          onSearch={handleSearch}
        />
       <Button
          type="primary"
          icon={<PlusOutlined />}
          style={{ backgroundColor: '#1890ff',  fontSize: '16px' }}
          onClick={showModal} 
        >
          Create Project
        </Button>
      </div>

      <Table dataSource={projects} columns={columns} loading={loading} rowKey="id" />

       <CreateProjectModel
        visible={isModalVisible}
        onCreate={(createdProject: any) => {
          setProjects([...projects, createdProject]);
        }}
        onCancel={handleCancel}
      />
    </div>
  );
};

export default ProjectList;
