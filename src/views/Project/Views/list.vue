<script setup lang="ts">
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
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
import SettingIcon from "@icons/settings.svg";
import DragIcon from "@icons/drag.svg";
import CheckIcon from "@icons/check.svg";
import { AgGridVue } from "ag-grid-vue3";
import {
  GridReadyEvent,
  GridApi,
  GridOptions,
  CellValueChangedEvent,
} from "ag-grid-community";
import { computed, nextTick, ref, watch } from "vue";
import { IProject, ITask } from "@/types";
import { ColDef } from "ag-grid-community";
import { formatDate } from "@/helpers";
import { storeToRefs } from "pinia";
import { useProjectStore, useUserStore } from "@/stores";
import { cloneDeep } from "lodash";
import Fillters from "@/components/Pages/Project/Filters.vue";
import TaskNotFound from "@/components/Pages/Task/TaskNotFound.vue";
import { VueDraggable } from "vue-draggable-plus";
import { changeStatusTask, updateTask } from "@/services/task";
import { onMounted } from "vue";
import TProgressCell from "@/components/Pages/Project/List/TProgressCell.vue";

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

const { user } = storeToRefs(useUserStore());
const { project } = storeToRefs(useProjectStore());

const hasPermission = computed(() => {
  return !!(
    project.value &&
    !project.value.isArchived &&
    !project.value.finishDate &&
    project.value.members.some(
      (m) => m.role == "admin" && m.user.id == user.value?.id
    )
  );
});

const defaultColDef = ref<ColDef>({
  editable: (params) => hasPermission.value,
  sortable: true,
  resizable: true,
  suppressAutoSize: false,
  singleClickEdit: true,
  enableCellChangeFlash: true,
  suppressHeaderMenuButton: false,
  hide: false,
});

const defaultColDefs = ref<ColDef[]>([
  {
    headerName: "Tên công việc",
    field: "name",
    width: 200,
    cellRenderer: TNameCell,
    cellRendererParams: {
      hasLine: true,
      hasPermission: hasPermission.value,
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
    valueFormatter: (p) => p.value,
    valueGetter: (p: any) => p.data.taskGroup.name ?? p.data.taskGroup,
    cellEditor: TTaskGroupEditCell,
    cellEditorPopup: true,
  },
  {
    headerName: "Trạng thái",
    field: "status",
    width: 150,
    cellRenderer: TStatusCell,
    cellEditor: TStatusEditCell,
    cellEditorPopup: true,
  },
  {
    headerName: "Tiến độ",
    field: "progress",
    width: 150,
    cellRenderer: TProgressCell,
  },
  {
    headerName: "Ngày đến hạn",
    field: "dueDate",
    width: 150,
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
    headerName: "Người thực hiện",
    field: "assignee",
    width: 150,
    valueFormatter: (p) => p.value,
    valueParser: (p) => p.newValue,
    cellRenderer: TAssigneeCell,
    cellEditor: TAssigneeEditCell,
    cellEditorPopup: true,
  },
  {
    headerName: "Nhãn",
    field: "labels",
    width: 200,
    sortable: false,
    valueFormatter: (p) => p.value,
    valueParser: (p) => p.newValue,
    cellRenderer: TLabelCell,
    cellEditor: TLabelEditCell,
    cellEditorPopup: true,
  },
  {
    headerName: "Độ ưu tiên",
    field: "priority",
    width: 150,
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
    cellEditor: TNameEditCell,
    cellEditorParams: {
      placeholder: "Nhập mô tả công việc...",
    },
    cellEditorPopup: true,
  },
]);

const priorityOrder = ["none", "low", "medium", "high"];

const gridOptions = ref<GridOptions>({
  suppressRowHoverHighlight: true,
  noRowsOverlayComponent: TaskNotFound,
});

const showDisplaySetting = ref(false);
const projectTemp = ref<IProject | null>(cloneDeep(project.value));
const gridApi = ref<GridApi | null>(null);
const rowData = ref<ITask[]>([]);
const colDefs = ref<ColDef[]>(cloneDeep(defaultColDefs.value));

const onGridReady = async (params: GridReadyEvent) => {
  gridApi.value = params.api;
};

const setDefaultCols = () => {
  colDefs.value = cloneDeep(defaultColDefs.value);
};

const onCellValueChanged = async (event: CellValueChangedEvent<ITask>) => {
  const task = event.data;

  if (event.column.getColId() == "status") {
    const data = await changeStatusTask(task.id, task.status);
    if (data.success) {
    } else {
    }
  } else {
    const data = await updateTask(task);
    if (data.success) {
    } else {
    }
  }
};

const handleFilter = (temp: IProject) => {
  projectTemp.value = temp;
  const tasks = projectTemp.value?.taskGroups
    .flatMap((g) => g.tasks)
    .filter((t) => !t.isHidden);
  rowData.value = tasks ?? [];
};

watch(
  () => project.value,
  () => {
    projectTemp.value = cloneDeep(project.value);
    const tasks = projectTemp.value?.taskGroups.flatMap((g) => g.tasks);
    rowData.value = tasks ?? [];
  },
  { deep: true, immediate: true }
);
</script>

<template>
  <div class="w-full h-full flex flex-col pt-4">
    <Fillters @filter="handleFilter">
      <div
        class="relative h-full"
        v-click-outside.short="
          () => {
            showDisplaySetting = false;
          }
        "
      >
        <div
          class="flex items-center h-full px-2 py-1 rounded-md bg-bgColor-secondary hover:bg-hover cursor-pointer"
          @click="
            () => {
              showDisplaySetting = !showDisplaySetting;
            }
          "
        >
          <SettingIcon class="w-3 fill-textColor-primary mr-1" />
          <span class="text-sm font-semibold text-textColor-primary"
            >Hiển thị</span
          >
        </div>
        <div
          v-if="showDisplaySetting"
          class="absolute top-full right-0 min-w-full w-max pt-1 z-10"
        >
          <div
            class="flex flex-col py-2 w-[320px] bg-bgColor-primary rounded-md shadow overflow-visible z-10"
          >
            <div
              class="flex items-center justify-between border-b border-borderColor px-3 pb-2 mb-2"
            >
              <span class="text-sm text-textColor-primary font-semibold"
                >Tùy chỉnh hiển thị cột
              </span>
              <span
                class="text-xs text-textColor-secondary hover:text-primary active:text-primary hover:underline cursor-pointer"
                @click="setDefaultCols"
                >Đặt lại mặc định</span
              >
            </div>
            <div class="flex flex-col max-h-[200px] not-lastchild:mb-3 mb-2">
              <VueDraggable
                class="flex flex-col w-full pb-1 overflow-y-scroll scroll-vert"
                :animation="150"
                v-model="colDefs"
                chosenClass="chosen"
                dragClass="drag"
                ghostClass="ghost"
              >
                <div class="flex-shrink-0" v-for="(col, i) in colDefs" :key="i">
                  <div
                    class="flex items-center cursor-pointer hover:bg-primary-extraLight px-3 py-1"
                    :class="{
                      active: !col.hide,
                    }"
                    @click="
                      () => {
                        col.hide = !col.hide;
                      }
                    "
                  >
                    <div
                      class="w-4 h-4 flex flex-center rounded-sm border border-textColor-secondary"
                      :class="!col.hide ? 'bg-blue-400' : 'bg-bgColor-primary'"
                    >
                      <CheckIcon v-if="!col.hide" class="w-3 fill-white" />
                    </div>
                    <span
                      class="flex-1 text-sm font-medium text-textColor-primary px-3 py-1"
                      >{{ col.headerName }}</span
                    >
                    <DragIcon class="w-4 fill-textColor-secondary" />
                  </div>
                </div>
              </VueDraggable>
            </div>
          </div>
        </div>
      </div>
    </Fillters>
    <div class="w-full h-full flex-1 px-5">
      <ag-grid-vue
        class="ag-theme-quartz"
        style="height: 100%; width: 100%"
        :rowData="rowData"
        :columnDefs="colDefs"
        :defaultColDef
        :gridOptions
        @grid-ready="onGridReady"
        @cell-value-changed="onCellValueChanged"
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
