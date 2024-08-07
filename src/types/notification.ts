import { IProject } from "./project";
import { IUserInfo } from "./user";

export type INotificationAction =
  | "invite_to_project"
  | "accept_join_project"
  | "unaccept_join_project"
  | "left_project"
  | "was_kicked_project"
  | "request_approval"
  | "accept_approval"
  | "reject_approval"
  | "task_assigned"
  | "project_due"
  | "task_due";

export interface INotification {
  id: string;
  sender?: IUserInfo;
  receivers: string[];
  project?: IProject;
  type: "normal" | "invitation";
  datas: any;
  action: INotificationAction;
  readBy: string[];
  respondedBy?: string[];
  createdAt: string;
  updatedAt: string;
}
