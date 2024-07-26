import api from "@/plugins/axios";
import { IComment, IServerData } from "@/types";

const prefix = "/comments/";

export async function getComments(taskId: string) {
  return await api.get<any, IServerData<{ comments: IComment[] }>>(
    prefix + taskId
  );
}

export async function commentTask(taskId: string, content: string) {
  return await api.post<any, IServerData>(prefix, { taskId, content });
}

export async function updateComment(commentId: string, content: string) {
  return await api.patch<any, IServerData>(prefix + commentId, { content });
}

export async function deleteComment(commentId: string) {
  return await api.delete<any, IServerData>(prefix + commentId);
}
