import api from "@/plugins/axios";
import { IServerData, ITaskGroup, IUser } from "@/types";

const prefix = "/task-groups/";

export async function getTaskGroups(projectId: string) {
  return await api.get<any, IServerData<{ taskGroups: ITaskGroup[] }>>(
    prefix + projectId
  );
}

export async function createTaskGroups(
  projectId: string,
  name: string,
  color: string
) {
  return await api.post<any, IServerData<{ taskGroup: ITaskGroup }>>(
    prefix + "create",
    {
      projectId,
      name,
      color,
    }
  );
}

export async function updateTaskGroup(
  taskGroupId: string,
  name: string,
  color: string
) {
  return await api.patch<any, IServerData<{ taskGroup: ITaskGroup }>>(
    prefix + taskGroupId,
    {
      name,
      color,
    }
  );
}

export async function reorderTaskGroup(projectId: string, orders: string[]) {
  return await api.patch<any, IServerData>(prefix + projectId + "/reorder", {
    orders,
  });
}

export async function archiveTaskGroup(taskGroupId: string) {
  return await api.patch<any, IServerData>(prefix + taskGroupId + "/archive");
}

export async function unarchiveTaskGroup(taskGroupId: string) {
  return await api.patch<any, IServerData>(prefix + taskGroupId + "/unarchive");
}

export async function deleteTaskGroup(taskGroupId: string) {
  return await api.delete<any, IServerData>(prefix + taskGroupId);
}
