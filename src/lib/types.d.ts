export type User = {
  id: number;
  name: string;
  email: string;
  avatar?: string;
  job?: string;
  organization?: string;
};

export type Project = {
  id: number;
  name: string;
  image?: string;
  repo?: string;
  description?: string;
  leader?: Leader;
};

export type ProjectDetail = {
  id: number;
  name: string;
  image?: string;
  repo?: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
};

export type Leader = {
  userId: number;
  projectId: number;
  name: string;
  avatar: string;
  email: string;
  isAdmin: boolean;
};

export type Member = {
  id: number;
  isAdmin: boolean;
  projectId: number;
  name: string;
  avatar: string;
  email: string;
  userId: number;
};

export type List = {
  id: number;
  name: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
  projectId: number;
};

export type Issue = {
  id: number;
  order: number;
  priority: number;
  type: number;
  summary: string;
  descr?: string;
  createdAt: Date;
  updatedAt: Date;
  list?: List;
  listId: number;
  user?: User;
  reporterId: number;
  comments?: Comment[];
  assignees?: Assignee[];
};

export type Assignee = {
  id: number;
  createdAt: Date;
  user?: User;
  userId: number;
  issue?: Issue;
  issueId: number;
  project?: Project;
  projectId: number;
};

export type IssueComment = {
  id: number;
  descr: string;
  createdAt: Date;
  userId: number;
  name: string;
  avatar: string;
};
