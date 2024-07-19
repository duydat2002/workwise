import api from "@/plugins/axios";
import { IServerData, IProject, IActivity } from "@/types";

const prefix = "/projects/";

export async function getProjects() {
  return await api.get<any, IServerData<{ projects: IProject[] }>>(prefix);
}

export async function getProjectById(projectId: string) {
  return await api.get<any, IServerData<{ project: IProject }>>(
    prefix + projectId
  );
}

export async function createProject(data: FormData) {
  return await api.post<any, IServerData<{ project: IProject }>>(
    prefix + "/create",
    data,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
}

export async function updateProject(projectId: string, data: FormData) {
  return await api.patch<any, IServerData>(prefix + projectId, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

export async function archiveProject(projectId: string) {
  return await api.patch<any, IServerData>(prefix + projectId + "/archive");
}

export async function unarchiveProject(projectId: string) {
  return await api.patch<any, IServerData>(prefix + projectId + "/unarchive");
}

export async function deleteProject(projectId: string) {
  return await api.delete<any, IServerData>(prefix + projectId);
}

// Project members
export async function inviteProjectMember(
  projectId: string,
  members: string[],
  role: string
) {
  return await api.post<any, IServerData>(
    prefix + projectId + "/invite-members",
    {
      members,
      role,
    }
  );
}

export async function changeProjectMemberRole(
  projectId: string,
  member: string,
  role: string
) {
  return await api.patch<any, IServerData>(
    prefix + projectId + "/change-role",
    {
      member,
      role,
    }
  );
}

export async function deleteProjectMember(projectId: string, member: string) {
  return await api.post<any, IServerData>(
    prefix + projectId + "/delete-member",
    {
      member,
    }
  );
}

// Project activities
export async function getProjectActivities(projectId: string) {
  return await api.get<any, IServerData<{ activities: IActivity[] }>>(
    prefix + projectId + "/activities"
  );
}
