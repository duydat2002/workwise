import { IApproval } from "./approval";
import { ITask } from "./task";
import { IUserInfo } from "./user";

export interface IAttachment {
  id: string;
  createdBy: IUserInfo;
  task: ITask;
  approval: IApproval;
  name: string;
  minetype: string;
  url: string;
  createdAt: string;
  updatedAt: string;
}
