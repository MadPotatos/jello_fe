import React from 'react';
import { Modal, Form, Input, DatePicker, message } from 'antd';
import { Sprint } from '@/lib/types';
import { updateSprint } from '@/app/api/sprintApi';
import dayjs from 'dayjs'; 


const { Item } = Form;
const { RangePicker } = DatePicker;

interface EditSprintModelProps {
  visible: boolean;
  onUpdate: () => void;
  onCancel: () => void;
  sprint: Sprint;
}

const EditSprintModel: React.FC<EditSprintModelProps> = ({ visible, onUpdate, onCancel, sprint }) => {
  const [form] = Form.useForm();


  const onFinish = async (values: any) => {
    try {
      const formattedValues = {
        name: values.name,
        startDate: values.date[0].format(),
        endDate: values.date[1].format(),
        goal: values.goal,
      };

      await updateSprint(sprint.id, formattedValues);
      onUpdate();
      message.success('Sprint updated successfully');
    } catch (error) {
      console.error('Error updating sprint:', error);
      message.error('Failed to update sprint');
    }
  };

  return (
    <Modal
      open={visible}
      title="Edit Sprint"
      okText="Update"
      cancelText="Cancel"
      onCancel={onCancel}
      onOk={() => form.submit()}
      okButtonProps={{ style: { backgroundColor: '#1890ff' } }}
    >
      <Form 
        form={form} 
        onFinish={onFinish} 
        layout="vertical"
        initialValues={
          {
            name: sprint.name,
            date: [dayjs(sprint.startDate), dayjs(sprint.endDate)],
            goal: sprint.goal,
          }
        
        }>
        <Item
          name="name"
          label="Sprint Name"
          rules={[{ required: true, message: 'Please enter the sprint name' }]}
        >
          <Input />
        </Item>

        <Item label="Start and End Date" name="date">
          <RangePicker 
          disabledDate={(current) => current && current < dayjs().startOf('day')}
          format="DD-MM-YYYY" />
        </Item>



        <Item name="goal" label="Sprint Goal">
          <Input.TextArea />
        </Item>
      </Form>
    </Modal>
  );
};

export default EditSprintModel;