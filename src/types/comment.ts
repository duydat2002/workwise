import { IProject } from "./project";
import { ITask } from "./task";
import { IUserInfo } from "./user";

export interface IComment {
  id: string;
  author: IUserInfo;
  project: IProject;
  task: ITask;
  content: string;
  isUpdated: boolean;
  createdAt: string;
  updatedAt: string;
}
