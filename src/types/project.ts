import { ILabel } from "./label";
import { IUserInfo } from "./user";
import { ITaskGroup } from "./taskGroup";
import { IActivity } from "./activity";

export interface IProject {
  id: string;
  name: string;
  description?: string;
  background: string;
  labels: ILabel[];
  createdBy: IUserInfo;
  members: {
    user: IUserInfo;
    role: "admin" | "member";
    createdAt: string;
    updatedAt: string;
  }[];
  createdTaskLabels: ILabel[];
  status: "active" | "archived";
  startDate: string;
  dueDate: string;
  taskGroups: ITaskGroup[];
  activities: IActivity[];
  createdAt: string;
  updatedAt: string;
}
