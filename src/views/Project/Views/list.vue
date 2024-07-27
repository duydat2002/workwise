<script setup lang="ts">
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { AgGridVue } from "ag-grid-vue3";
import { GridReadyEvent, GridApi } from "ag-grid-community";
import { ref } from "vue";
import { getTasksByProjectId } from "@/services/task";
import { ITask } from "@/types";
import TStatusCell from "@/components/Pages/Project/List/TStatusCell.vue";
import TDateEditCell from "@/components/Pages/Project/List/TDateEditCell.vue";
import TStatusEditCell from "@/components/Pages/Project/List/TStatusEditCell.vue";
import TTaskGroupEditCell from "@/components/Pages/Project/List/TTaskGroupEditCell.vue";
import TPriorityCell from "@/components/Pages/Project/List/TPriorityCell.vue";
import TPriorityEditCell from "@/components/Pages/Project/List/TPriorityEditCell.vue";
import TNameCell from "@/components/Pages/Project/List/TNameCell.vue";
import TNameEditCell from "@/components/Pages/Project/List/TNameEditCell.vue";
import TLabelCell from "@/components/Pages/Project/List/TLabelCell.vue";
import TLabelEditCell from "@/components/Pages/Project/List/TLabelEditCell.vue";
import TAssigneeCell from "@/components/Pages/Project/List/TAssigneeCell.vue";
import TAssigneeEditCell from "@/components/Pages/Project/List/TAssigneeEditCell.vue";
import { ColDef } from "ag-grid-community";
import { formatDate } from "@/helpers";
import { storeToRefs } from "pinia";
import { useProjectStore } from "@/stores";
import { toast } from "vue3-toastify";

const defaultColDef = {
  // editable: true,
  sortable: true,
  resizable: true,
  suppressAutoSize: false,
  singleClickEdit: true,
  enableCellChangeFlash: true,
};

const dateComparator = (
  valueA: any,
  valueB: any,
  nodeA?: any,
  nodeB?: any,
  isDescending?: boolean
) => {
  const dateA = valueA && new Date(valueA).getTime();
  const dateB = valueB && new Date(valueB).getTime();

  if (isNaN(dateA) && isNaN(dateB)) return 0;
  if (isNaN(dateA)) return isDescending ? -1 : 1;
  if (isNaN(dateB)) return isDescending ? 1 : -1;

  return dateB - dateA;
};

const priorityOrder = ["none", "low", "medium", "high"];

const { project } = storeToRefs(useProjectStore());

const gridApi = ref<GridApi | null>(null);
const rowData = ref<ITask[]>([]);
const colDefs = ref<ColDef[]>([
  {
    headerName: "Tên công việc",
    field: "name",
    width: 200,
    editable: true,
    cellRenderer: TNameCell,
    cellRendererParams: {
      hasLine: true,
    },
    cellEditor: TNameEditCell,
    cellEditorParams: {
      placeholder: "Nhập tên công việc...",
    },
    cellEditorPopup: true,
    singleClickEdit: false,
  },
  {
    headerName: "Nhóm công việc",
    field: "taskGroup",
    width: 150,
    valueGetter: (p: any) => p.data.taskGroup.name,
    editable: true,
    cellEditor: TTaskGroupEditCell,
    cellEditorPopup: true,
  },
  {
    headerName: "Trạng thái",
    field: "status",
    width: 150,
    editable: true,
    cellRenderer: TStatusCell,
    cellEditor: TStatusEditCell,
    cellEditorPopup: true,
  },
  {
    headerName: "Ngày đến hạn",
    field: "dueDate",
    width: 150,
    editable: true,
    comparator: dateComparator,
    valueFormatter: (p: any) => {
      if (p.value) return formatDate(p.value, "dd/MM/yyyy");
      else {
        return "";
      }
    },
    cellEditor: TDateEditCell,
    cellEditorPopup: true,
  },
  {
    headerName: "Nhãn",
    field: "labels",
    width: 200,
    sortable: false,
    editable: true,
    valueFormatter: (p) => p.value,
    valueParser: (p) => p.newValue,
    cellRenderer: TLabelCell,
    cellEditor: TLabelEditCell,
    cellEditorPopup: true,
  },
  {
    headerName: "Người thực hiện",
    field: "assignee",
    width: 150,
    valueFormatter: (p) => p.value,
    valueParser: (p) => p.newValue,
    editable: true,
    cellRenderer: TAssigneeCell,
    cellEditor: TAssigneeEditCell,
    cellEditorPopup: true,
  },
  {
    headerName: "Độ ưu tiên",
    field: "priority",
    width: 150,
    editable: true,
    cellRenderer: TPriorityCell,
    cellEditor: TPriorityEditCell,
    cellEditorPopup: true,
    comparator: (valueA, valueB) => {
      const indexA = priorityOrder.indexOf(valueA);
      const indexB = priorityOrder.indexOf(valueB);
      return indexA - indexB;
    },
  },
  {
    headerName: "Ngày bắt đầu",
    field: "startDate",
    width: 150,
    editable: true,
    comparator: dateComparator,
    valueFormatter: (p: any) => {
      if (p.value) return formatDate(p.value, "dd/MM/yyyy");
      else {
        return "";
      }
    },
    cellEditor: TDateEditCell,
    cellEditorPopup: true,
  },
  {
    headerName: "Ngày hoàn thành",
    field: "finishDate",
    width: 150,
    editable: true,
    comparator: dateComparator,
    valueFormatter: (p: any) => {
      if (p.value) return formatDate(p.value, "dd/MM/yyyy");
      else {
        return "";
      }
    },
    cellEditor: TDateEditCell,
    cellEditorPopup: true,
  },
  {
    headerName: "Mô tả",
    field: "description",
    width: 150,
    editable: true,
    cellEditor: TNameEditCell,
    cellEditorParams: {
      placeholder: "Nhập mô tả công việc...",
    },
    cellEditorPopup: true,
  },
]);

const onGridReady = async (params: GridReadyEvent) => {
  gridApi.value = params.api;

  const data = await getTasksByProjectId(project.value?.id ?? "1");

  if (data.success) {
    rowData.value = data.result!.tasks;
  } else {
    rowData.value = [];
    toast.error("Đã có lỗi xảy ra! Hãy thử lại sau.");
  }
};
</script>

<template>
  <div class="w-full h-full flex p-5">
    <div class="w-full h-full flex-1">
      <ag-grid-vue
        :rowData="rowData"
        :columnDefs="colDefs"
        :defaultColDef
        style="height: 100%; width: 100%"
        class="ag-theme-quartz"
        :suppressRowHoverHighlight="true"
        @grid-ready="onGridReady"
      >
      </ag-grid-vue>
    </div>
  </div>
</template>

<style scoped>
:deep(.ag-cell) {
  padding-left: 12px;
  padding-right: 12px;
}
</style>
