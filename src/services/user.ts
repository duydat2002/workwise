import api from "@/plugins/axios";
import { IServerData, IUser } from "@/types";

const prefix = "/users/";

export async function getUser() {
  return await api.get<any, IServerData<{ user: IUser }>>(prefix + "get");
}

export async function findUserByUid(uid: string) {
  return await api.get<any, IServerData<{ user: IUser | null }>>(
    prefix + "find-by-uid",
    {
      params: { uid },
    }
  );
}

export async function findUsersByEmail(email: string) {
  return await api.get<any, IServerData<{ users: IUser[] }>>(
    prefix + "find-by-email",
    {
      params: { email },
    }
  );
}

export async function verifyUserEmail(uid: string) {
  return await api.post<any, IServerData>(prefix + "verify-email", { uid });
}

export async function createUser(
  uid: string,
  email: string,
  fullname: string,
  emailVerified: boolean,
  avatar?: string | null
) {
  return await api.post<any, IServerData<{ user: IUser }>>(prefix + "create", {
    uid,
    email,
    fullname,
    avatar,
    emailVerified,
  });
}

export async function updateUserInfo(
  fullname: string,
  emailVerified?: boolean
) {
  return await api.patch<any, IServerData>(prefix + "/update-info", {
    fullname,
    emailVerified,
  });
}

export async function updateAvatar(data: FormData) {
  return await api.patch<any, IServerData<{ avatar: string }>>(
    prefix + "/update-avatar",
    data,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
}

export async function deleteAvatar() {
  return await api.delete<any, IServerData>(prefix + "/delete-avatar");
}

export async function getTest() {
  return await api.get<any, IServerData>(prefix + "test");
}
