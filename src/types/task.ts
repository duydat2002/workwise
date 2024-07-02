import { ILabel, IUserInfo } from "./user";

export interface ITask {
  id: string;
  name: string;
  description?: string;
  createdBy: IUserInfo;
  priority: "none" | "low" | "medium" | "high";
  labels?: ILabel[];
  assignee?: IUserInfo | null;
  startDate: string;
  dueDate: string;
  finishDate: string;
  status: "active" | "archived";
  project: string;
  taskGroup: string;
  createdAt: string;
  updatedAt: string;
}
