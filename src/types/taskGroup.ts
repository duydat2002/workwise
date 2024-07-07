import { ITask } from "./task";

export interface ITaskGroup {
  id: string;
  name: string;
  description?: string;
  color?: string;
  createdBy: string;
  projectId: string;
  status: "active" | "archived";
  tasks: ITask[];
  createdAt: string;
  updatedAt: string;
}
