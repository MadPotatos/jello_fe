"use client";
import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Button, Table, Input, Breadcrumb } from 'antd';
import { SearchOutlined, PlusOutlined } from '@ant-design/icons';
import { Backend_URL } from '@/lib/Constants';
import Link from 'next/link';
import { Project } from '@/lib/types';
import { ColumnsType } from 'antd/es/table';

const { Column } = Table;
const { Search } = Input;

const ProjectList = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProjects = async (userId: number) => {
    setLoading(true);
    try {
      const response = await fetch(`${Backend_URL}/project/all/${userId}`);
      const rawData: { projects: Project[] } = await response.json();
      setProjects(rawData.projects);
      setLoading(false);
    } catch (err) {
      console.error(err);
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
  },
  {
    title: 'Leader',
    dataIndex: 'leaderAvatar',
    key: 'leaderAvatar',
    render: (avatar: string, record: Project) => (
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <img
          src={avatar || '/images/default_avatar.jpg'}  
          alt="Leader Avatar"
          style={{ width: '40px', borderRadius: '50%', marginRight: '8px' }}
        />
        <span>{record?.leaderName}</span>
      </div>
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
          onSearch={(value) => console.log('Search:', value)}
        />
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          style={{ backgroundColor: '#1890ff', borderColor: '#1890ff', fontSize: '16px' }}>
          Create Project
        </Button>
      </div>

      <Table dataSource={projects} columns={columns} loading={loading} rowKey="id" style={{ fontSize: '16px' }} />
    </div>
  );
};

export default ProjectList;