import React from "react";
import { Draggable } from "@hello-pangea/dnd";
import { Avatar, Badge } from "antd";
import { ApartmentOutlined } from "@ant-design/icons";
import {
  getColoredIconByIssueType,
  getColoredIconByPriority,
} from "@/lib/utils";

interface IssueProps {
  issue: any;
  index: number;
  onClick: (issue: any) => void;
}

const Issue: React.FC<IssueProps> = ({ issue, index, onClick }) => {
  return (
    <Draggable key={issue.id} draggableId={`issue-${issue.id}`} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className="bg-white hover:bg-gray-200 shadow-md mb-2 group"
          onClick={() => onClick(issue)}
        >
          <div className="p-3">
            <div className="flex flex-col ">
              <div className="flex items-center justify-between">
                <span className="font-medium text-base text-gray-900">
                  {issue.summary}
                </span>
                {issue.children > 0 ? <ApartmentOutlined /> : <div> </div>}
              </div>
              <div className="mt-3 flex items-center justify-between">
                <div className="mb-1 flex items-center text-lg gap-2">
                  {getColoredIconByIssueType(issue.type)}
                  {getColoredIconByPriority(issue.priority)}
                  {issue.comments > 0 && (
                    <Badge count={issue.comments} color="#0064f2" />
                  )}
                </div>

                <div>
                  <Avatar.Group
                    maxCount={2}
                    maxStyle={{ color: "#f56a00", backgroundColor: "#fde3cf" }}
                  >
                    {issue.assignees?.map((assignee: any) => (
                      <Avatar
                        key={assignee.userId}
                        src={
                          assignee.User.avatar || "/images/default_avatar.jpg"
                        }
                      />
                    ))}
                  </Avatar.Group>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default Issue;
