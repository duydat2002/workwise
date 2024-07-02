import { ILabel, IUserInfo } from "./user";
import { ITaskGroup } from "./taskGroup";

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
  }[];
  taskLabels: ILabel[];
  status: "active" | "archived";
  startDate: string;
  dueDate: string;
  taskGroups: ITaskGroup[];
  createdAt: string;
  updatedAt: string;
}
