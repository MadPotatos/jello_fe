import React, { useState } from "react";
import { Avatar, List, Button, Tag } from "antd";
import { Draggable } from "@hello-pangea/dnd";
import {
  getColoredIconByIssueType,
  getColoredIconByPriority,
} from "@/lib/utils";
import IssueDetailModal from "@/components/IssueDetail";

interface SprintIssuesProps {
  issue: any;
  issueIndex: number;
  onClick: (issue: any) => void;
}

const SprintIssues: React.FC<SprintIssuesProps> = ({
  issue,
  issueIndex,
  onClick,
}) => {
  return (
    <Draggable
      key={issue.id}
      draggableId={`issue-${issue.id}`}
      index={issueIndex}
    >
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <div
            className="border border-gray-200 py-3 px-6 bg-white hover:bg-gray-200 flex justify-between items-center"
            onClick={() => onClick(issue)}
          >
            <div className="flex items-center justify-between gap-6 text-lg">
              <div>{getColoredIconByIssueType(issue.type)}</div>
              <p>{issue.summary}</p>
            </div>

            <div className="flex items-center gap-8 text-lg">
              <div className="text-center" style={{ minWidth: "200px" }}>
                {issue.List && (
                  <Tag
                    color="blue"
                    className="text-sm pb-1 pt-0.5 rounded-full"
                  >
                    {issue.List.name}
                  </Tag>
                )}
              </div>
              <div>{getColoredIconByPriority(issue.priority)}</div>
              <Avatar.Group
                maxCount={2}
                maxStyle={{
                  color: "#f56a00",
                  backgroundColor: "#fde3cf",
                }}
                style={{ minWidth: "80px" }}
              >
                {issue.assignees && issue.assignees.length > 0 ? (
                  issue.assignees.map((assignee: any) => (
                    <Avatar key={assignee.userId} src={assignee.User.avatar} />
                  ))
                ) : (
                  <span></span>
                )}
              </Avatar.Group>
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default SprintIssues;
