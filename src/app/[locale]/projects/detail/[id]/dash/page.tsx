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
  Tag,
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
import { useTranslations } from "next-intl";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const { Title, Text } = Typography;

const DashBoardPage: React.FC = () => {
  const pathname = usePathname();
  const t = useTranslations("Dash");
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
      name: t("userStories"),
      data: totalWork?.totalUserStories,
    },
    {
      name: t("tasks"),
      data: totalWork?.totalTasks,
    },
    {
      name: t("bugs"),
      data: totalWork?.totalBugs,
    },
    {
      name: t("reviews"),
      data: totalWork?.totalReviews,
    },
    {
      name: t("subTasks"),
      data: totalWork?.totalSubtasks,
    },
  ];

  const pieChartOptions: any = {
    chart: {
      type: "pie",
    },
    labels: [
      t("userStories"),
      t("tasks"),
      t("bugs"),
      t("reviews"),
      t("subTasks"),
    ],
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
      name: t("todo"),
      data:
        members?.map((member) => assignedIssues[member.userId]?.todo || 0) ||
        [],
    },
    {
      name: t("inProgress"),
      data:
        members?.map(
          (member) => assignedIssues[member.userId]?.inProgress || 0
        ) || [],
    },
    {
      name: t("done"),
      data:
        members?.map((member) => assignedIssues[member.userId]?.done || 0) ||
        [],
    },
  ];
  const userStoryTags =
    sprint?.userStories?.map((userStory: any, index: number) => (
      <Tag
        key={index}
        color="blue"
        className="text-base mb-2 mr-2"
        style={{ fontSize: "1rem" }}
      >
        {userStory.title}
      </Tag>
    )) ?? [];
  return (
    <div className="site-layout-content">
      <Title level={2} className="text-xl font-semibold text-gray-800 mb-4">
        {t("dashboard")}
      </Title>
      <Row gutter={[16, 16]}>
        <Col span={12}>
          <Card className="border border-gray-200 shadow-md">
            <div className="p-4">
              <Title level={3}>{project?.name}</Title>
              <Title level={5}>
                {t("productGoal")}: {project?.productGoal}
              </Title>
              <Text>{project?.description}</Text>
            </div>
            <div className="ml-4">
              <Title level={5}>{t("members")}</Title>
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
                <Text strong>{t("goal")}: </Text>
                <Text>{sprint?.goal}</Text>
                <div className="flex justify-between pt-2">
                  <div>{userStoryTags}</div>
                </div>
                <div className="text-base text-gray-500">
                  <Text strong>{t("totalUserStoryPoints")}: </Text>
                  {sprint.totalUserStoryPoints}
                </div>
                <Text strong>{t("time")}: </Text>
                <Text className="text-base text-gray-500">
                  {sprint?.startDate
                    ? `${dayjs(sprint?.startDate).format(
                        "DD/MM/YYYY"
                      )} - ${dayjs(sprint?.endDate).format("DD/MM/YYYY")}`
                    : ""}
                </Text>
              </div>
            ) : (
              <div className="p-4">
                <Title level={3}>{t("noCurrentSprint")}</Title>
              </div>
            )}
          </Card>
        </Col>
        <Col span={12}>
          <Card className="border border-gray-200 shadow-md">
            <div className="p-4">
              <Title level={3}>
                {t("totalWork")}: {totalWork?.total}
              </Title>
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
              <Title level={3}>{t("memberProgress")}</Title>
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
