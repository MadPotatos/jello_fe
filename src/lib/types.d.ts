export type User = {
  id: string;
  name: string;
  email: string;
  avatar?: string;
};

export type Project = {
  id: number;
  name: string;
  image?: string;
  repo?: string;
  description?: string;
  leader?: Leader;
};

export type Leader = {
  userId: number;
  projectId: number;
  name: string;
  avatar: string;
  email: string;
  isAdmin: boolean;
};
