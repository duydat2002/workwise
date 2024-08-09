<script setup lang="ts">
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { AgGridVue } from "ag-grid-vue3";
import { GridOptions, ColDef, ColGroupDef } from "ag-grid-community";
import { computed } from "vue";
import TaskNotFound from "../Pages/Task/TaskNotFound.vue";

const props = defineProps<{
  gridOptions?: GridOptions;
  defaultColDef?: ColDef;
  columnDefs: (ColDef | ColGroupDef)[];
  rowData: any;
}>();

const defaultColRefComp = computed(() => {
  return {
    sortable: true,
    resizable: true,
    suppressAutoSize: false,
    enableCellChangeFlash: true,
    suppressHeaderMenuButton: false,
    hide: false,
    ...props.defaultColDef,
  } as ColDef;
});

const gridOptionsComp = computed(() => {
  return (
    props.gridOptions ??
    ({
      autoSizeStrategy: {
        type: "fitGridWidth",
        defaultMinWidth: 100,
      },
      suppressRowHoverHighlight: true,
      noRowsOverlayComponent: TaskNotFound,
      domLayout: "autoHeight",
    } as GridOptions)
  );
});
</script>

<template>
  <ag-grid-vue
    class="ag-theme-quartz"
    :rowData
    :columnDefs
    :defaultColDef="defaultColRefComp"
    :gridOptions="gridOptionsComp"
  >
  </ag-grid-vue>
</template>
