import { IUserInfo } from "./user";
import { ITask } from "./task";

export interface ITaskGroup {
  id: string;
  name: string;
  description?: string;
  background?: string;
  createdBy: IUserInfo;
  status: "active" | "archived";
  project: string;
  tasks: ITask[];
  createdAt: string;
  updatedAt: string;
}
