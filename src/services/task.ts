import api from "@/plugins/axios";
import { IServerData, ITask, ITaskGroup, IUser } from "@/types";

const prefix = "/tasks/";

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
