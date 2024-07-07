import { ILabel } from "./label";
import { IProject } from "./project";

export interface IUser {
  id: string;
  uid: string;
  email: string;
  fullname: string;
  avatar?: string;
  emailVerified: boolean;
  createdProjectLabels: ILabel[];
  projects: IProject[];
  createdAt: string;
  updatedAt: string;
}

export interface IUserInfo {
  id: string;
  email: string;
  fullname: string;
  avatar?: string;
}
