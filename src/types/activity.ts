import { IProject } from "./project";
import { IUserInfo } from "./user";

interface IInfo {
  id: string;
  name: string;
}

export type IActivityType =
  | "update_project"
  | "archive_project"
  | "unarchive_project"
  | "complete_project"
  | "reopen_project"
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
  | "move_task"
  | "update_task"
  | "archive_task"
  | "unarchive_task"
  | "remove_task"
  | "assign_task"
  | "unassign_task"
  | "create_approval_task"
  | "update_approval_task"
  | "accept_approval_task"
  | "reject_approval_task"
  | "revoked_approval_task"
  | "comment_task"
  | "add_attachment_task"
  | "remove_attachment_task";

export interface IActivity {
  id: string;
  user: IUserInfo;
  project: IProject;
  task?: IInfo;
  datas: any;
  type: IActivityType;
  createdAt: string;
  updatedAt: string;
}
