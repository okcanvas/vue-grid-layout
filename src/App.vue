<template>
  <div class="card-layout" >
    <div>
      <v-btn class="btn" :class="{active: !drawer}" @click="doToggleDrawer">config</v-btn>
    </div>
    <v-layout>
      <v-navigation-drawer
        v-if="drawer"
        v-model="drawer"
        :rail="rail"
        location="right"
        permanent
        :width="200"
      >
        
        <v-divider></v-divider>
        
        <div>
          <v-btn class="btn" :class="{active: !drawer}" @click="drawer = false">close</v-btn> 
        </div> 
        
         
        <widget-preview id="LineChart" />
        <widget-preview id="BarChart" />
        <widget-preview id="PieChart" />
       

      </v-navigation-drawer>
      <v-main>
        <GridLayout
          v-model:layout="layoutJSON"
          :is-draggable="mode"
          :is-resizable="mode"
          :col-num="12"
          :row-height="30"

          @dragenter="handleDragEnter" 
          @dragleave="handleDragLeave" 
          @dragover.prevent 
          @drop="handleDrop"

          style="height: calc(100vh - 40px);" 
        >
          <GridItem
            v-for="item in layoutJSON"
            :key="item.i"
            v-slot="{style}"
            class="l-item"
            :static="item.static"
            :x="item.x"
            :y="item.y"
            :w="item.w"
            :h="item.h"
            :i="item.i"
          >
            <div class="l-item-slot">
              <component
                :is="ComponentsLib[item.component]"
                v-if="item.component"
                :style-obj="style"
              ></component>
            </div>
          </GridItem>
        </GridLayout>
      </v-main>
    </v-layout>
  </div>

</template>
<script lang="ts">
export default {
  name: "CardLayout"
}
</script>
<script lang="ts" setup>
import {ref, onMounted, defineAsyncComponent, markRaw, computed} from "vue"
import {GridLayout, GridItem} from "vue3-grid-layout-next"
import {testData} from "./test"
//import {LayoutItemMore, CardLayoutData} from "@/interface/cardData"
import widgetPreview from './widget_preview.vue'
//import eventBus from 'vue3-eventbus'

import LineChart from "@/components/echart/LineChart.vue"
import BarChart from "@/components/echart/BarChart.vue"
import PieChart from "@/components/echart/PieChart.vue"
import TableWidget from "@/components/echart/TableWidget.vue"
const ComponentsLib = markRaw({
  LineChart,
  BarChart,
  PieChart,
  TableWidget,
})


const drawer = ref<boolean>(false)
const rail = ref<boolean>(false)
const mode = ref<boolean>(false)
const isDragOver = ref<boolean>(false)
//const layoutJSON = ref<Array<LayoutItemMore>>(testData)
const layoutJSON = ref<Array<any>>(testData)

  

onMounted(() => {
  layoutJSON.value = testData;
/*
  console.log(eventBus)

  eventBus.on('gridItemDragged', (id: string, x: number, y: number) => {
    // 받은 정보를 이용하여 Grid Layout 업데이트 로직 작성
    console.log(id, x, y)
  });
  */
})

const doToggleDrawer = ()  => {
  if (drawer.value) {
    drawer.value = false;
    mode.value = false;
  } else {
    drawer.value = true;
    mode.value = true;
  }
}

const onInsertWidget = (component: string, id: string) => {
  layoutJSON.value.push({
    x: 0,
    y: 0,
    w: 4,
    h: 8,
    i: id,
    component: component
  })  
  mode.value = false;
  setTimeout(() => {
    mode.value = true; 
  }, 50);
}

const handleDragEnter = (event: DragEvent) => {
  
  event.preventDefault();
  isDragOver.value = true;
};

const handleDragLeave = () => {
  isDragOver.value = false;
};

const handleDrop = (event: DragEvent) => {
  event.preventDefault();
  isDragOver.value = false;

  let { x, y } = event;
  console.log(x, y)

  const data = event.dataTransfer?.getData("text/plain");
  if (data) {
    const { id, x, y } = JSON.parse(data);
    if (id == 'LineChart') onInsertWidget(id, `widget_${new Date().getTime()}`);
    if (id == 'BarChart')  onInsertWidget(id, `widget_${new Date().getTime()}`);
    if (id == 'PieChart')  onInsertWidget(id, `widget_${new Date().getTime()}`);
  }
};

</script>

<style lang="scss" scoped>
.card-layout {
  overflow-x: scroll;
}
.l-item {
  border: 1px solid #ccc;
}
.mode-control {
  height: 50px;
  display: flex;
  padding-left: 10px;
  margin-top: 10px;
  .btn {
    width: 100px;
    border: none;
    border-radius: 3px;
    &:last-child {
      margin-left: 10px;
    }
  }
  .active {
    background-color: #87ceeb;
  }
}
</style>
