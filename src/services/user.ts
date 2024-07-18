import api from "@/plugins/axios";
import { ILabel, INotification, IServerData, IUser } from "@/types";

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

export async function findUsersByNameOrEmail(search: string) {
  return await api.get<any, IServerData<{ users: IUser[] }>>(
    prefix + "find-by-name-or-email",
    {
      params: { search },
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

//Project members
export async function acceptInviteProject(
  projectId: string,
  senderId: string,
  notificationId: string
) {
  return await api.post<any, IServerData>(prefix + "accept-join-project", {
    projectId,
    senderId,
    notificationId,
  });
}

export async function unacceptInviteProject(
  projectId: string,
  senderId: string,
  notificationId: string
) {
  return await api.post<any, IServerData>(prefix + "unaccept-join-project", {
    projectId,
    senderId,
    notificationId,
  });
}

export async function leaveProject(projectId: string) {
  return await api.post<any, IServerData>(prefix + "leave-project", {
    projectId,
  });
}

// CreatedProjectLabels
export async function getUserProjectLabels() {
  return await api.get<any, IServerData<{ createdProjectLabels: ILabel[] }>>(
    prefix + "created-labels"
  );
}

export async function createUserProjectLabel(name: string, color: string) {
  return await api.post<any, IServerData<{ label: ILabel }>>(
    prefix + "created-labels",
    { name, color }
  );
}

export async function updateUserProjectLabel(
  labelId: string,
  name: string,
  color: string
) {
  return await api.patch<any, IServerData<{ label: ILabel }>>(
    prefix + "created-labels/" + labelId,
    { name, color }
  );
}

export async function deleteUserProjectLabel(labelId: string) {
  return await api.delete<any, IServerData>(
    prefix + "created-labels/" + labelId
  );
}

// Notifications
export async function getNotifications() {
  return await api.get<any, IServerData<{ notifications: INotification[] }>>(
    prefix + "notifications"
  );
}

export async function readNotification(notificationId: string) {
  return await api.post<any, IServerData>(
    prefix + "notifications/" + notificationId + "/read"
  );
}

export async function unreadNotification(notificationId: string) {
  return await api.post<any, IServerData>(
    prefix + "notifications/" + notificationId + "/unread"
  );
}
