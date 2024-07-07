import { IUserInfo } from "./user";

export interface IAttachment {
  id: string;
  createdBy: IUserInfo;
  ownerType: "Task" | "Approval";
  ownerId: string;
  name: string;
  minetype: string;
  url: string;
  createdAt: string;
  updatedAt: string;
}
