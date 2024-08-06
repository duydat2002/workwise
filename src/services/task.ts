import api from "@/plugins/axios";
import { IActivity, IServerData, ITask } from "@/types";

const prefix = "/tasks/";

export async function getTasksByProjectId(projectId: string) {
  return await api.get<any, IServerData<{ tasks: ITask[] }>>(
    prefix + "get-by-project/" + projectId
  );
}

export async function getTaskById(taskId: string) {
  return await api.get<any, IServerData<{ task: ITask }>>(prefix + taskId);
}

export async function createTask(
  projectId: string,
  taskGroupId: string,
  name: string
) {
  return await api.post<any, IServerData<{ task: ITask }>>(prefix + "create", {
    projectId,
    taskGroupId,
    name,
  });
}

export async function reorderTask(
  taskId: string,
  fromTaskGroupId: string,
  toTaskGroupId: string,
  orders: string[]
) {
  return await api.patch<any, IServerData>(prefix + taskId + "/reorder", {
    fromTaskGroupId,
    toTaskGroupId,
    orders,
  });
}

export async function updateTask(task: ITask, labels?: string) {
  return await api.patch<any, IServerData>(prefix + task.id, {
    name: task.name,
    description: task.description,
    priority: task.priority,
    labels: labels,
    assignee: task.assignee?.id,
    startDate: task.startDate,
    dueDate: task.dueDate,
    finishDate: task.finishDate,
    progress: task.progress,
  });
}

export async function changeStatusTask(taskId: string, status: string) {
  return await api.patch<any, IServerData>(prefix + taskId + "/change-status", {
    status,
  });
}

export async function assignTask(taskId: string, assignee?: string) {
  return await api.patch<any, IServerData>(prefix + taskId + "/assign", {
    assignee: assignee ?? null,
  });
}

export async function archiveTask(taskId: string) {
  return await api.patch<any, IServerData>(prefix + taskId + "/archive");
}

export async function unarchiveTask(taskId: string) {
  return await api.patch<any, IServerData>(prefix + taskId + "/unarchive");
}

export async function deleteTask(taskId: string) {
  return await api.delete<any, IServerData>(prefix + taskId);
}

// Task activities
export async function getTaskActivities(
  taskId: string,
  page: number,
  pageSize: number,
  sortNewest: boolean = true
) {
  return await api.get<any, IServerData<{ activities: IActivity[] }>>(
    prefix + taskId + "/activities",
    {
      params: {
        page,
        pageSize,
        sortNewest,
      },
    }
  );
}
