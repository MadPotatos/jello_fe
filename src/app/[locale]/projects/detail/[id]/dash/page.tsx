"use client";
import {
  Avatar,
  Button,
  Card,
  Col,
  Divider,
  List,
  Row,
  Space,
  Typography,
} from "antd";
import React, { useEffect, useState } from "react";
import useSWR from "swr";
import { fetchProjectById } from "@/app/api/projectApi";
import { fetchCurrentSprint } from "@/app/api/sprintApi";
import { fetchMembers } from "@/app/api/memberApi";
import { Member, ProjectDetail, Sprint } from "@/lib/types";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import dayjs from "dayjs";
import dynamic from "next/dynamic";
import {
  fetchAllIssuesAndUserStory,
  fetchAssignedIssues,
} from "@/app/api/issuesApi";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const { Title, Text } = Typography;

const DashBoardPage: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session } = useSession();

  const projectId: number = parseInt(pathname.split("/")[4]);

  const { data: project } = useSWR<ProjectDetail>(`project-${projectId}`, () =>
    fetchProjectById(projectId)
  );

  const { data: sprint } = useSWR<Sprint>(`current-sprint-${projectId}`, () =>
    fetchCurrentSprint(projectId)
  );

  const { data: members } = useSWR<Member[]>(`members-${projectId}`, () =>
    fetchMembers(projectId)
  );

  const { data: totalWork } = useSWR<any>(`total-work-${projectId}`, () =>
    fetchAllIssuesAndUserStory(projectId)
  );

  const [assignedIssues, setAssignedIssues] = useState<Record<number, any>>({});

  useEffect(() => {
    const fetchAssignedIssuesForMembers = async () => {
      if (members) {
        const issuesPromises = members.map((member) =>
          fetchAssignedIssues(projectId, member.userId)
        );
        const results = await Promise.all(issuesPromises);
        const issuesMap = members.reduce((acc: any, member, idx) => {
          acc[member.userId] = results[idx];
          return acc;
        }, {});
        setAssignedIssues(issuesMap);
      }
    };
    fetchAssignedIssuesForMembers();
  }, [members, projectId]);

  const pieChartData = [
    {
      name: "User Stories",
      data: totalWork?.totalUserStories,
    },
    {
      name: "Tasks",
      data: totalWork?.totalTasks,
    },
    {
      name: "Bugs",
      data: totalWork?.totalBugs,
    },
    {
      name: "Reviews",
      data: totalWork?.totalReviews,
    },
    {
      name: "Sub Tasks",
      data: totalWork?.totalSubtasks,
    },
  ];

  const pieChartOptions: any = {
    chart: {
      type: "pie",
    },
    labels: ["User Stories", "Tasks", "Bugs", "Reviews", "Sub Tasks"],
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 200,
          },
          legend: {
            position: "bottom",
          },
        },
      },
    ],
  };
  const barChartOptions: any = {
    chart: {
      type: "bar",
      stacked: true,
    },
    plotOptions: {
      bar: {
        horizontal: true,
        dataLabels: {
          position: "top",
        },
      },
    },
    dataLabels: {
      enabled: true,
      offsetX: -6,
      style: {
        fontSize: "12px",
        colors: ["#fff"],
      },
    },
    stroke: {
      show: true,
      width: 1,
      colors: ["#fff"],
    },
    tooltip: {
      shared: true,
      intersect: false,
    },
    xaxis: {
      categories: members?.map((member) => member.name) || [],
    },
  };

  const barChartData = [
    {
      name: "Todo",
      data:
        members?.map((member) => assignedIssues[member.userId]?.todo || 0) ||
        [],
    },
    {
      name: "In Progress",
      data:
        members?.map(
          (member) => assignedIssues[member.userId]?.inProgress || 0
        ) || [],
    },
    {
      name: "Done",
      data:
        members?.map((member) => assignedIssues[member.userId]?.done || 0) ||
        [],
    },
  ];
  return (
    <div className="site-layout-content">
      <Title level={2} className="text-xl font-semibold text-gray-800 mb-4">
        Dashboard
      </Title>
      <Row gutter={[16, 16]}>
        <Col span={12}>
          <Card className="border border-gray-200 shadow-md">
            <div className="p-4">
              <Title level={3}>{project?.name}</Title>
              <Title level={5}>Mục tiêu sản phẩm: {project?.productGoal}</Title>
              <Text>{project?.description}</Text>
            </div>
            <div className="ml-4">
              <Title level={5}>Thành viên</Title>
              <Avatar.Group
                maxCount={5}
                size="large"
                maxStyle={{ color: "#f56a00", backgroundColor: "#fde3cf" }}
              >
                {members?.map((member: Member) => (
                  <Avatar
                    key={member.userId}
                    src={member.avatar || "/images/default_avatar.jpg"}
                    alt={member.name}
                    size="large"
                  />
                ))}
              </Avatar.Group>
            </div>
          </Card>
        </Col>
        <Col span={12}>
          <Card className="border border-gray-200 shadow-md">
            {sprint ? (
              <div className="p-4">
                <Title level={3}>{sprint?.name}</Title>
                <Text strong>Mục tiêu: </Text>
                <Text>{sprint?.goal}</Text>
                <Divider />
                <Text strong>Thời gian: </Text>
                <Text>
                  {sprint?.startDate
                    ? `${dayjs(sprint?.startDate).format(
                        "YYYY-MM-DD"
                      )} - ${dayjs(sprint?.endDate).format("YYYY-MM-DD")}`
                    : ""}
                </Text>
              </div>
            ) : (
              <div className="p-4">
                <Title level={3}>Không có Sprint đang trong tiến độ</Title>
              </div>
            )}
          </Card>
        </Col>
        <Col span={12}>
          <Card className="border border-gray-200 shadow-md">
            <div className="p-4">
              <Title level={3}>Tổng công việc: {totalWork?.total}</Title>
              <Chart
                options={pieChartOptions}
                series={pieChartData.map((data) => data.data)}
                type="pie"
                height={400}
                width="100%"
              />
            </div>
          </Card>
        </Col>
        <Col span={12}>
          <Card
            className="border border-gray-200 shadow-md"
            style={{ maxHeight: "480px", overflowY: "scroll" }}
          >
            <div className="p-4">
              <Title level={3}>Tiến độ của thành viên</Title>
              <Chart
                options={barChartOptions}
                series={barChartData}
                type="bar"
                height={500}
                width="100%"
              />
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default DashBoardPage;
