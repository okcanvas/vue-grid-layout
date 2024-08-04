<template>
  <div class="layout">
    <div style="position: absolute; top: 10px; right: 10px; z-index: 999; ">
      <v-btn density="compact" icon="mdi-plus" :class="{active: !isEditMode}" @click="doToggleDrawer(true)">#</v-btn>
    </div>
    <div
      v-show="isEditMode"
      style="position: absolute; top: 0; right: 0; width: 200px; height: 100vh; background: #fff; z-index: 999; border-left: solid 1px #C0C4CC;"   
    >

      <div>
        <v-btn class="btn" :class="{active: !isEditMode}" @click="doToggleDrawer(false)">close</v-btn> 
      </div> 
        
      <widget-preview 
        :item="{ x: -1, y: -1, w: 1, h: 4, i: '', component: 'BarChart'}" 
        :onDrag="onDrag"
        :onDrop="onDrop"
      />
      <widget-preview 
        :item="{ x: -1, y: -1, w: 1, h: 4, i: '', component: 'PieChart'}" 
        :onDrag="onDrag"
        :onDrop="onDrop"
      />
      <widget-preview 
        :item="{ x: -1, y: -1, w: 1, h: 4, i: '', component: 'LineChart'}" 
        :onDrag="onDrag"
        :onDrop="onDrop"
      />
      <widget-preview 
        :item="{ x: -1, y: -1, w: 2, h: 4, i: '', component: 'WidgetCalendar'}" 
        :onDrag="onDrag"
        :onDrop="onDrop"
      />

         
    </div>

    <v-card subtitle="dashboard" title="HOME"></v-card>
    

    <div id="content">
      <GridLayout
        ref="refLayout"
        v-model:layout="mainLayout"
        :responsive="responsive"
        :col-num="colNum"
        :row-height="50"
        :vertical-compact="true"
        :use-css-transforms="true"
        :is-draggable="isEditing"
        :is-resizable="isEditing"
        style="height: calc(100vh - 100px);" 
      >
        <grid-item
          v-for="item in mainLayout"
          :ref="(el: any) => set$Children(el)"
          :key="item.i"
          :class="item.i == dropId ? 'grid-layout-item grid-layout-dummy' : 'grid-layout-item'"
          :x="item.x"
          :y="item.y"
          :w="item.w"
          :h="item.h"
          :i="item.i"
          :static="item.static"
          :min-h="4"
          :min-w="1"
          v-slot="{style}"
          @resized="handleResize"
        >
          <!--<custom-drag-element :text="item.i"></custom-drag-element>-->
          <div>
            <!-- {{ style }} -->
              <component
                :is="ComponentsLib[item.component]"
                v-if="item.component"
                :style-obj="style"
            />
              <!--
            <component
                :is="ComponentsLib[item.component]"
                v-if="item.component"
                :style-obj="style"
            />
            -->
          </div>
          <!--<button @click="clicked">CLICK ME!</button>-->
        </grid-item>
      </GridLayout>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref, reactive, watch, onMounted, nextTick, markRaw} from "vue"
import {testData} from "./test"
import _ from 'lodash'
import {GridLayout, GridItem} from "./components/grid-layout"

import LineChart from "@/components/echart/LineChart.vue"
import BarChart from "@/components/echart/BarChart.vue"
import PieChart from "@/components/echart/PieChart.vue"
import TableWidget from "@/components/echart/TableWidget.vue"
import WidgetCalendar from "@/components/echart/widgetCalendar.vue"

import widgetPreview from './widget_preview.vue'

const ComponentsLib = markRaw({
  LineChart,
  BarChart,
  PieChart,
  TableWidget,
  WidgetCalendar,
})




const mainLayout = ref(testData)
const refLayout = ref()
const colNum = ref<number>(3)
const mapCache: Map<string, any> = new Map()
const isDragging = ref<boolean>(false)
const isEditMode = ref<boolean>(false)
const isEditing = ref<boolean>(false)

const doToggleDrawer = (status: boolean)  => {
  isEditMode.value = status;
  isEditing.value = status;
}

function handleResize(i: string | number, w: number, h: number, x: number, y: number) {
  console.log(i, w, h, x, y)
}
const responsive = ref<boolean>(true)

function set$Children(vm: any) {
  if (vm && vm.i) {
    mapCache.set(vm.i, vm)
  }
}
// {x: number | null; y: number | null}

let mouseXY = {x: 0, y: 0}
let dragItem = {x: 0, y: 0, w: 1, h: 4, i: '', component: ''}
const dropId = 'dummy-drop-item'


function addDragOverEvent(e: DragEvent) {
  mouseXY.x = e.clientX
  mouseXY.y = e.clientY
}
onMounted(() => {
  document.addEventListener("dragover", addDragOverEvent)
})

const onDrag = (event: DragEvent, data: any) => {
  event.stopPropagation()
  event.preventDefault()

  //
  dragItem.w = data.w;
  dragItem.h = data.h;

  const t = document.getElementById("content") as HTMLElement
  let parentRect = t.getBoundingClientRect()
  let mouseInGrid = false
  if (
    mouseXY.x > parentRect.left &&
    mouseXY.x < parentRect.right &&
    mouseXY.y > parentRect.top &&
    mouseXY.y < parentRect.bottom
  ) {
    mouseInGrid = true
  }
  if (mouseInGrid === true && mainLayout.value.findIndex((item: any) => item.i === dropId) === -1) {
    mainLayout.value.push({
      x: (mainLayout.value.length * 2) % colNum.value,
      y: mainLayout.value.length + colNum.value, // puts it at the bottom
      w: dragItem.w,
      h: dragItem.h,
      i: dropId,
      component: ''
    })
  }

  let index = mainLayout.value.findIndex((item: any) => item.i === dropId)

  if (index !== -1) {
    try {
      refLayout.value.defaultGridItem.$el.style.display = "none"
    } catch {}
    let el = mapCache.get(dropId)
    if (!el) return

    el.dragging = {top: mouseXY.y - parentRect.top, left: mouseXY.x - parentRect.left}
    let newPos = el.calcXY(mouseXY.y - parentRect.top, mouseXY.x - parentRect.left)
    if (mouseInGrid) {
      refLayout.value.dragEvent("dragstart", dropId, newPos.x, newPos.y, data.h, data.w)
      dragItem.i = String(index)
      dragItem.x = mainLayout.value[index].x
      dragItem.y = mainLayout.value[index].y
    } else {
      refLayout.value.dragEvent("dragend", dropId, newPos.x, newPos.y, data.h, data.w)
      mainLayout.value = mainLayout.value.filter((obj: any) => obj.i !== dropId)
    }
  }
}

const onDrop = (event: DragEvent, data: any) => {
  event.stopPropagation()
  event.preventDefault()

  isDragging.value = false
  mainLayout.value = mainLayout.value.filter((obj: any) => obj.i !== dropId)

  const t = document.getElementById("content") as HTMLElement
  const parentRect = t.getBoundingClientRect()
  if (!parentRect || !refLayout.value) return

  const mouseInGrid =
    mouseXY.x > parentRect.left &&
    mouseXY.x < parentRect.right &&
    mouseXY.y > parentRect.top &&
    mouseXY.y < parentRect.bottom

  if (mouseInGrid === true) {
    refLayout.value.dragEvent("dragend", dropId, dragItem.x, dragItem.y, data.h, data.w)
    mainLayout.value = mainLayout.value.filter((obj: any) => obj.i !== dropId)
    nextTick(() => {
      const id = `widget-${new Date().getTime()}`;
      mainLayout.value.push({
        i: id,
        x: dragItem.x,
        y: dragItem.y,
        w: data.w,
        h: data.h,
        component: data.component,
      })
      refLayout.value.dragEvent("dragend", id, dragItem.x, dragItem.y, data.h, data.w)
      mainLayout.value = mainLayout.value.filter((obj: any) => obj.i !== dropId)
      mapCache.delete(dropId)
    })
    //
    isEditing.value = false;
    setTimeout(() => {
      isEditing.value = true; 
    }, 100);
  }
}

</script>



<style scoped lang="scss">
.layout {
  background-color: #fff;
}
.grid-layout-item {
  //background-color: #ddd;
  touch-action: none;
  background: #fff;
  border: 1px solid #C0C4CC;
}
.grid-layout-dummy {
  background: #fdd;
}
.droppable-element {
  width: 150px;
  text-align: center;
  background: #fdd;
  border: 1px solid black;
  margin: 10px 0;
  padding: 10px;
}
</style>
