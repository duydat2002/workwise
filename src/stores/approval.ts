import { IActivity, IApproval } from "@/types";
import { defineStore } from "pinia";

interface IState {
  approvals: IApproval[];
}

export const useApprovalStore = defineStore("approval", {
  state: (): IState => ({
    approvals: [],
  }),
  actions: {},
  persist: true,
});
