import api from "@/plugins/axios";
import { IApproval, IServerData } from "@/types";

const prefix = "/approvals/";

export async function getTaskApprovals(taskId: string) {
  return await api.get<any, IServerData<{ approvals: IApproval[] }>>(
    prefix + "tasks/" + taskId
  );
}

export async function createTaskApproval(taskId: string, data: FormData) {
  return await api.post<any, IServerData<{ approval: IApproval }>>(
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

export async function updateTaskApproval(
  approvalId: string,
  reviewedBy: string,
  description: string
) {
  return await api.patch<any, IServerData>(prefix + approvalId, {
    reviewedBy,
    description,
  });
}

export async function acceptTaskAproval(approvalId: string, feedback: string) {
  return await api.patch<any, IServerData>(prefix + approvalId + "/accept", {
    feedback,
  });
}

export async function rejectTaskAproval(approvalId: string, feedback: string) {
  return await api.patch<any, IServerData>(prefix + approvalId + "/reject", {
    feedback,
  });
}

export async function deleteTaskApproval(approvalId: string) {
  return await api.delete<any, IServerData>(prefix + approvalId);
}
