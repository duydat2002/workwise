import { IAttachment } from "./attachment";
import { IUserInfo } from "./user";

export interface IApproval {
  id: string;
  requestedBy: IUserInfo;
  reviewedBy: IUserInfo;
  description?: string;
  approvedAt?: string;
  feekback?: string;
  status: "pending" | "approved" | "rejected";
  attachments: IAttachment[];
  createdAt: string;
  updatedAt: string;
}
