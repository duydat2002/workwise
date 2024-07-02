import { IProject } from "./project";

export interface IUser {
  id: string;
  uid: string;
  email: string;
  fullname: string;
  avatar?: string;
  emailVerified: boolean;
  projectLabels?: ILabel[];
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

export interface ILabel {
  name: string;
  color: string;
}
