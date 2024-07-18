import { ILabel } from "./label";
import { IUserInfo } from "./user";
import { ITaskGroup } from "./taskGroup";
import { IActivity } from "./activity";

export interface IMember {
  user: IUserInfo;
  role: "admin" | "member";
  status: "pending" | "accepted";
  createdAt: string;
  updatedAt: string;
}

export interface IProject {
  id: string;
  name: string;
  description?: string;
  background: string;
  labels: ILabel[];
  createdBy: IUserInfo;
  members: IMember[];
  createdTaskLabels: ILabel[];
  isArchived: boolean;
  startDate?: string;
  dueDate?: string;
  taskGroups: ITaskGroup[];
  createdAt: string;
  updatedAt: string;
}
