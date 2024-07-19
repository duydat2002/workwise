import { IUserInfo } from "./user";

interface IInfo {
  id: string;
  name: string;
}

interface IInfoColor extends IInfo {
  color: string;
}

export type IActivityType =
  | "update_project"
  | "archive_project"
  | "unarchive_project"
  | "member_join_project"
  | "member_left_project"
  | "change_role_member_project"
  | "remove_member_project"
  | "create_taskgroup"
  | "update_taskgroup"
  | "archive_taskgroup"
  | "unarchive_taskgroup"
  | "remove_taskgroup"
  | "create_task"
  | "update_task"
  | "archive_task"
  | "unarchive_task"
  | "remove_task"
  | "assign_task"
  | "unassign_task"
  | "approval_task"
  | "comment_task"
  | "add_attachment_task"
  | "remove_attachment_task";

export interface IActivity {
  id: string;
  user: IUserInfo;
  project: IInfo;
  taskGroup?: IInfoColor;
  task?: IInfo;
  datas: any;
  type: IActivityType;
  createdAt: string;
  updatedAt: string;
}
