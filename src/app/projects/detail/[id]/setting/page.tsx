"use client";
import { Backend_URL } from '@/lib/Constants';
import { usePathname } from 'next/navigation'; 
import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Input, Button, Image, Form, message, Modal, Avatar, Popover } from 'antd';
import { Member } from '@/lib/types';
import UploadImage from '@/components/UploadImage';

const ProjectSettingPage = () => {
  const [project, setProject] = useState<any>({});
  const [members, setMembers] = useState<Member[]>([]);
  const {data: session} = useSession();
  const pathname = usePathname();
  const projectId = Number(pathname.split('/')[3]);
  const [form] = Form.useForm();
   const [image, setImage] = useState<string>(project.image || "");
  const [isModalVisible, setIsModalVisible] = useState(false);


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

    const fetchMembers = async (id: number) => {
        try {
        const response = await fetch(`${Backend_URL}/member/${id}`);
        const data = await response.json();
        return data.members;
        } catch (error) {
        console.error('Error fetching members:', error);
        throw error;
        }
    };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const projectData = await fetchProject(projectId);
        const membersData = await fetchMembers(projectId);
        setMembers(membersData);
        setProject(projectData);
        form.setFieldsValue({name: projectData.name, repo: projectData.repo, descr: projectData.descr});
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [projectId]);

  const isAdmin = members.some((member) => member.userId === session?.user?.id && member.isAdmin);

  const handleUpdateProject = async (values: any) => {
    try {
      const response = await fetch(`${Backend_URL}/project/${projectId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${session?.backendTokens.accessToken}`,
        },
        body: JSON.stringify(values),
      });
      const data = await response.json();
      message.success('Project updated successfully');
      window.location.reload();
    } catch (error) {
      console.error('Error updating project:', error);
      message.error('Error updating project');
    }
  };
  
  const handleUpdateImage = async (id: number, image: string) => {
        try {
        const response = await fetch(`${Backend_URL}/project/${id}/image`, {
            method: 'PUT',
            headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${session?.backendTokens.accessToken}`,
            },
            body: JSON.stringify({ image }),
        });
        const data = await response.json();
        message.success('Image updated successfully');
        setIsModalVisible(false);
        window.location.reload();       
        } catch (error) {
        console.error('Error updating image:', error);
        throw error;
        }
    };



  const handleCancel = () => {
    setIsModalVisible(false);
  };
 return (
  console.log(project.descr),
  <div className="site-layout-content">
  <h1 className='mb-4 text-xl font-semibold text-c-text'>Project Settings</h1>
     <div className='flex mt-10 px-5 justify-center'>

        <Form layout="vertical" className='min-w-[25rem] flex-col gap-4' 
            onFinish={handleUpdateProject}
            form={form}
            >
          <div className="flex flex-col items-center justify-center gap-4">
           
            <Avatar src={project.image} alt={project.name} size={150} shape='square'/>

            {isAdmin && (
              <Button type="text" className="" onClick={() => setIsModalVisible(true)} style={{ backgroundColor: '#ccc',  fontSize: '16px' }}>
                Change Image
              </Button>
            )}
        
          </div>
          
          <div className="mt-6 text-center">
            <Form.Item label="Name" name="name"  rules={[{ required: true, message: 'Please enter project name' }]}>
              <Input
                disabled={!isAdmin}    
              />
            </Form.Item>
            <Form.Item label="Repo" name="repo">
              <Input
                disabled={!isAdmin}
              />
            </Form.Item>
            <Form.Item label="Description" name="descr">
              <Input.TextArea
                disabled={!isAdmin}
                rows={4}
              />
            </Form.Item>
            {isAdmin && (
              <Button type="primary" htmlType="submit" style={{ backgroundColor: '#1890ff',  fontSize: '16px' }}>
                Save
              </Button>
            )}
          </div>
          <h2 className="mt-8 font-bold">Members</h2>
          <div className="py-4">
          <Avatar.Group maxCount={6} maxStyle={{ color: '#f56a00', backgroundColor: '#fde3cf' }}>
                    {members.map((member: any) => (
                      <Popover
                                        content={
                                          <div className="max-w-xs py-3 rounded-lg">
                                            <div className="flex photo-wrapper p-2 justify-center">
                                              <Avatar src={member.avatar || '/images/default_avatar.jpg'} size={64} />
                                            </div>
                                            <div className="p-2">
                                              <h3 className="text-center text-xl text-gray-900 font-medium leading-8">{member.name}</h3>
                                              <div className="text-center text-gray-400 text-xs font-semibold">
                                                <p>{member.email}</p>
                                              </div>
                                              <div className="text-center my-3">
                                                <a
                                                  className="text-xs text-indigo-500 italic hover:underline hover:text-indigo-600 font-medium"
                                                  href={`/user/${member.userId}`}
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
                      <Avatar key={member.userId} src={member.avatar} size={40} />
                      </Popover>
                    ))}
                  </Avatar.Group>
          </div>
        </Form>
      </div>
      <Modal
        title="Update Project Image"
        open={isModalVisible}
        onOk={() => handleUpdateImage(projectId, image)}
        onCancel={handleCancel}
        okButtonProps={{style: {backgroundColor: '#1890ff'}}}
      >
        <UploadImage image={image} setImage={setImage} />
      </Modal>
  </div>
  );
};

export default ProjectSettingPage;