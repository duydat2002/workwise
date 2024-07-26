import api from "@/plugins/axios";
import { IAttachment, IServerData } from "@/types";

const prefix = "/attachments/";

export async function addTaskAttachment(taskId: string, data: FormData) {
  return await api.post<any, IServerData<{ attachments: IAttachment[] }>>(
    prefix + "tasks/" + taskId,
    data,
    {
      headers: {
        "Content-Type": "multipart/form-data",
        "Content-Encoding": "gzip, deflate, br",
      },
    }
  );
}

export async function updateTaskAttachment(attachmentId: string, name: string) {
  return await api.patch<any, IServerData>(prefix + attachmentId, { name });
}

export async function deleteTaskAttachment(attachmentId: string) {
  return await api.delete<any, IServerData>(prefix + attachmentId);
}
