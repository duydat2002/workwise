import { IUserInfo } from "./user";

export type INotificationAction =
  | "invite_to_project"
  | "accept_join_project"
  | "unaccept_join_project"
  | "left_project"
  | "was_kicked_project"
  | "request_approval"
  | "task_assigned";

export interface INotification {
  id: string;
  sender: IUserInfo;
  receivers: string[];
  project?: {
    id: string;
    name: string;
    background: string;
  };
  type: "normal" | "invitation";
  datas: any;
  action: INotificationAction;
  readBy: string[];
  respondedBy?: string[];
  createdAt: string;
  updatedAt: string;
}
