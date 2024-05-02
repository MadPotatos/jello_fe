"use client";
import { usePathname } from 'next/navigation'; 
import React, {  useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Input, Button, Form, message, Modal, Avatar, Popover } from 'antd';
import { Member, ProjectDetail } from '@/lib/types';
import UploadImage from '@/components/UploadImage';
import useSWR, { mutate } from 'swr';
import { fetchProjectById ,updateProject,updateProjectImage} from '@/app/api/projectApi';
import { fetchMembers } from '@/app/api/memberApi';
import { validateRepository } from '@/lib/utils';

const ProjectSettingPage = () => {
  const {data: session} = useSession();
  const pathname = usePathname();
  const [isModalVisible, setIsModalVisible] = useState(false);

  const projectId: number = parseInt(pathname.split('/')[3]);
  const {data: project} = useSWR<ProjectDetail>(`project-${projectId}`, () => fetchProjectById(projectId));
  const {data: members} = useSWR<Member[]>(`members-${projectId}`, () => fetchMembers(projectId));

  const [image, setImage] = useState<string>(project?.image || "");

 const isAdmin = members?.some((member) => member.userId === session?.user?.id && member.isAdmin);
 const [form] = Form.useForm();

  const handleUpdateProject = async (values: any) => {
    try {
      await updateProject(projectId, values, session?.backendTokens.accessToken);
      message.success('Project updated successfully');
      mutate(`project-${projectId}`);
    } catch (error) {
      message.error('Error updating project');
    }
  };
  
  const handleUpdateImage = async (id: number, image: string) => {
        try {
        await updateProjectImage(id, image, session?.backendTokens.accessToken);
        message.success('Image updated successfully');
        setIsModalVisible(false);
        mutate(`project-${projectId}`);     
        } catch (error) {
        console.error('Error updating image:', error);
        throw error;
        }
    };



  const handleCancel = () => {
    setIsModalVisible(false);
  };

  useEffect(() => {
    form.setFieldsValue({
      name: project?.name,
      repo: project?.repo,
      descr: project?.description,
    });
  });

 return (
  <div className="site-layout-content">
  <h1 className='mb-4 text-xl font-semibold text-c-text'>Project Settings</h1>
     <div className='flex mt-10 px-5 justify-center'>

        <Form layout="vertical" className='min-w-[25rem] flex-col gap-4' 
            onFinish={handleUpdateProject}
            form={form}
            >
          <div className="flex flex-col items-center justify-center gap-4">
           
            <Avatar src={project?.image} alt={project?.name} size={150} shape='square'/>

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
            <Form.Item label="Repository" name="repo" rules={[
            { required: true, message: 'Please enter the repository URL' },
            { validator: validateRepository },
          ]}>
              <Input
                disabled={!isAdmin}
              />
            </Form.Item>
            <Form.Item label="Description" name="descr" rules={[{ required: true, message: 'Please enter the project description' }]}>
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

                    {members && members.length > 0 ?(
                    members.map((member: any) => (
                      <Popover
                                        key={member.userId} 
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
                    ))
                  ):(<p>No members</p>)}
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