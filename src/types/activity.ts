import { IUserInfo } from "./user";

export interface IActivity {
  id: string;
  user: IUserInfo;
  projectId: string;
  taskId?: string;
  type:
    | "create"
    | "update"
    | "delete"
    | "comment"
    | "upload"
    | "assign"
    | "join"
    | "leave";
  entityType: "project" | "taskgroup" | "task" | "user";
  entity: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}
