"use client";
import { fetchPullRequests, fetchRepoDetail } from "@/app/api/repoApi";
import { PullRequest, Repo } from "@/lib/types";
import {
  GithubOutlined,
  StarOutlined,
  ForkOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { Button, Card, Empty, Space, Spin, Table, Tag } from "antd";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import useSWR from "swr";
import dayjs from "dayjs";
import { useTranslations } from "next-intl";

const PullRequestsManagementPage = () => {
  const t = useTranslations("pullRequests");
  const pathname = usePathname();
  const projectId = Number(pathname.split("/")[4]);

  const { data: repo } = useSWR<Repo>(`repo-${projectId}`, () =>
    fetchRepoDetail(projectId)
  );
  const { data: pullRequests, error: pullRequestsError } = useSWR<
    PullRequest[]
  >(`pull-requests-${projectId}`, () => fetchPullRequests(projectId));

  const columns: any[] = [
    {
      title: t("date"),
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => dayjs(date).format("DD/MM/YYYY"),
      sorter: (a: any, b: any) =>
        dayjs(a.createdAt).unix() - dayjs(b.createdAt).unix(),
    },
    {
      title: t("title"),
      dataIndex: "title",
      key: "title",
      width: "30%",
    },
    {
      title: t("state"),
      dataIndex: "state",
      key: "state",
      render: (state: string) => (
        <Tag
          color={state === "open" ? "#87d068" : "red"}
          className="text-base pb-0.5 rounded-full"
        >
          {state}
        </Tag>
      ),
    },
    {
      title: t("user"),
      dataIndex: "user",
      key: "user",
    },
    {
      title: t("head"),
      dataIndex: "head",
      key: "head",
    },
    {
      title: t("base"),
      dataIndex: "base",
      key: "base",
    },
    {
      title: t("detail"),
      key: "url",
      render: (record: any) => (
        <Space size="middle">
          <Button
            type="primary"
            shape="round"
            style={{ backgroundColor: "#1890ff", fontSize: "16px" }}
          >
            <Link href={record.url} target="_blank">
              <SearchOutlined />
            </Link>
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="site-layout-content">
      <h1 className="mb-4 text-xl font-semibold text-c-text">Repository</h1>
      {repo && "message" in repo ? (
        <Empty description="Failed to load repository details. Please check your repo URL in setting" />
      ) : repo ? (
        <Card
          title={
            <Link
              href={repo.url}
              target="_blank"
              className="text-xl cursor-pointer hover:text-blue-600"
            >
              {repo?.owner}/{repo?.name} <GithubOutlined className="ml-2" />
            </Link>
          }
          bordered={false}
          className="mb-4 repo-card bg-gray-100 shadow-md rounded-lg"
        >
          <div className="px-4 ">
            {repo?.description && (
              <p className="text-gray-600">{repo?.description}</p>
            )}
            <div className="flex mt-4 items-center">
              {repo?.language && (
                <Tag color="blue" className="text-base pb-0.5 rounded-full">
                  {repo?.language}
                </Tag>
              )}
            </div>
            <div className="mt-4 flex gap-2">
              <Tag
                color="blue"
                icon={<StarOutlined />}
                className="text-base pb-1 pt-0.5 rounded-full"
              >
                Star
                <Tag color="geekblue" className="ml-2 rounded-full">
                  {repo?.stars || 0}
                </Tag>
              </Tag>
              <Tag
                color="blue"
                icon={<ForkOutlined />}
                className="text-base pb-1 pt-0.5 rounded-full"
              >
                Fork
                <Tag color="geekblue" className="ml-2 rounded-full">
                  {repo?.forks || 0}
                </Tag>
              </Tag>
            </div>
          </div>
        </Card>
      ) : (
        <Spin />
      )}

      <h1 className="mb-4 text-xl font-semibold text-c-text">Pull requests</h1>
      <Table
        columns={columns}
        dataSource={
          pullRequests && Array.isArray(pullRequests) ? pullRequests : []
        }
        loading={!pullRequests && !pullRequestsError}
        rowKey="id"
      />
    </div>
  );
};

export default PullRequestsManagementPage;
