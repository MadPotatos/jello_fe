import React from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import { CheckSquareFilled, BugFilled, ThunderboltFilled, DownOutlined,UpOutlined,MinusOutlined} from '@ant-design/icons';

interface ListProps {
  list: any;
  issues: any;
  index: number;
}

const List: React.FC<ListProps> = ({ list, issues, index }) => {
  return (
    <Draggable draggableId={`list-${list.id}`} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className="flex flex-col bg-gray-100 shadow-md mb-4 p-4 group"
        >
          <div className="flex items-center justify-between border-gray-200 pt-2 pb-4">
        
            <span className="text-lg font-medium text-gray-900">{list.name}</span>
          
          </div>
           <Droppable droppableId={`list-${list.id}`} type="ISSUE">
      {(provided) => (
        <div ref={provided.innerRef} {...provided.droppableProps}>
          {issues[index] && Array.isArray(issues[index])
            ? issues[index].map((issue: any, innerIndex: number) => (
                <Draggable key={issue.id} draggableId={`issue-${issue.id}`} index={innerIndex}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="bg-white shadow-md mb-2 group"
                    >
                      <div className="p-3">
                        <div className="flex flex-col ">
                         <span className="font-medium text-base text-gray-900">{issue.summary}</span>
                         <div className="mt-3 flex items-center justify-between">
                            <div className='mb-1 flex items-center text-lg gap-2'>
                        {issue.type === 1
                            ? <CheckSquareFilled style={{ color: issueTypeColorMapping[issue.type]}} />
                            : issue.type === 2
                              ? <BugFilled style={{ color: issueTypeColorMapping[issue.type] }} />
                              : <ThunderboltFilled style={{ color: issueTypeColorMapping[issue.type] }} />}
                         
                          {issue.priority === 1
                            ? <UpOutlined  style={{ color: priorityColorMapping[issue.priority] }} />
                            : issue.priority === 2
                              ? <MinusOutlined  style={{  color: priorityColorMapping[issue.priority] }} />
                              
                                  : <DownOutlined  style={{ color: priorityColorMapping[issue.priority] }} />}
                                  </div>
                                  <div></div>
                           </div>
                        </div>
                       
                      </div>
                    </div>
                  )}
                </Draggable>
              ))
            : null}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
        </div>
      )}
    </Draggable>
  );
};



const issueTypeColorMapping:{ [key: number]: string } = {
  1: '#1890ff',
  2: 'red',
  3: 'orange',
};


const priorityColorMapping:{ [key: number]: string } = {
  1: 'red', 
  2: 'orange', 
  3: '#1890ff', 
};

export default List;
