import { IUserInfo } from "./user";

export interface IComment {
  author: IUserInfo;
  taskId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}
