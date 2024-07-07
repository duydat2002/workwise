import { IUserInfo } from "./user";

export interface INotification {
  sender: IUserInfo;
  receivers: string[];
  type: "normal" | "invitation";
  entityType: "project" | "taskgroup" | "task";
  entity: string;
  content: string;
  readBy: string[];
  createdAt: string;
  updatedAt: string;
}
