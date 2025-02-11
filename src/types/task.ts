import { IApproval } from "./approval";
import { IAttachment } from "./attachment";
import { IComment } from "./comment";
import { ILabel } from "./label";
import { IProject } from "./project";
import { ITaskGroup } from "./taskGroup";
import { IUserInfo } from "./user";

export interface ITask {
  _id?: string;
  id: string;
  name: string;
  description?: string;
  createdBy: IUserInfo;
  priority: "none" | "low" | "medium" | "high";
  labels: ILabel[];
  assignee?: IUserInfo | null;
  startDate: string;
  dueDate: string;
  finishDate?: string;
  status: "todo" | "inprogress" | "completed";
  progress: number;
  isArchived: boolean;
  project: IProject;
  taskGroup: ITaskGroup;
  attachments: IAttachment[];
  approvals: IApproval[];
  comments: IComment[];
  createdAt: string;
  updatedAt: string;
  isHidden?: boolean;
}
