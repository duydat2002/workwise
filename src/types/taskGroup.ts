import { ITask } from "./task";

export interface ITaskGroup {
  id: string;
  name: string;
  color: string;
  createdBy: string;
  projectId: string;
  isArchived: boolean;
  tasks: ITask[];
  createdAt: string;
  updatedAt: string;
}
