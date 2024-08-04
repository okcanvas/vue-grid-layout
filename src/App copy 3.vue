<script setup lang="ts">
import {ref, reactive, watch, onMounted, nextTick, markRaw} from "vue"
import {testData} from "./test"
import _ from 'lodash'
import {GridLayout, GridItem} from "./components/grid-layout"

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




let mainLayout = ref(testData)

const refLayout = ref()

const colNum = ref<number>(3)

const mapCache: Map<string, any> = new Map()

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
let DragPos = {x: 0, y: 0, w: 1, h: 4, i: "", component: ''}

function drag(e: DragEvent) {
  e.stopPropagation()
  e.preventDefault()
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
  if (mouseInGrid === true && mainLayout.value.findIndex(item => item.i === "drop") === -1) {
    mainLayout.value.push({
      x: (mainLayout.value.length * 2) % colNum.value,
      y: mainLayout.value.length + colNum.value, // puts it at the bottom
      w: 1,
      h: 4,
      i: "drop",
      component: ''
    })
  }

  let index = mainLayout.value.findIndex(item => item.i === "drop")

  if (index !== -1) {
    try {
      refLayout.value.defaultGridItem.$el.style.display = "none"
    } catch {}
    let el = mapCache.get("drop")
    if (!el) return
    console.log("jjj")

    el.dragging = {top: mouseXY.y - parentRect.top, left: mouseXY.x - parentRect.left}
    let new_pos = el.calcXY(mouseXY.y - parentRect.top, mouseXY.x - parentRect.left)
    if (mouseInGrid === true) {
      refLayout.value.dragEvent("dragstart", "drop", new_pos.x, new_pos.y, 1, 4)
      DragPos.i = String(index)
      DragPos.x = mainLayout.value[index].x
      DragPos.y = mainLayout.value[index].y
    }
    if (mouseInGrid === false) {
      refLayout.value.dragEvent("dragend", "drop", new_pos.x, new_pos.y, 1, 4)
      mainLayout.value = mainLayout.value.filter(obj => obj.i !== "drop")
    }
  }
}

function dragend() {
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

  if (mouseInGrid === true) {
    refLayout.value.dragEvent("dragend", "drop", DragPos.x, DragPos.y, 1, 4)
    mainLayout.value = mainLayout.value.filter(obj => obj.i !== "drop")
    // UNCOMMENT below if you want to add a grid-item
    nextTick(() => {
      mainLayout.value.push({
        x: DragPos.x,
        y: DragPos.y,
        w: 1,
        h: 4,
        i: DragPos.i,
        component: DragPos.component,
      })
      refLayout.value.dragEvent("dragend", DragPos.i, DragPos.x, DragPos.y, 1, 4)
      mapCache.delete("drop")
    })
  }
}

function addDragOverEvent(e: DragEvent) {
  mouseXY.x = e.clientX
  mouseXY.y = e.clientY
}
onMounted(() => {
  document.addEventListener("dragover", addDragOverEvent)
})
</script>

<template>
  <div class="layout">
    <div
      class="droppable-element"
      draggable="true"
      unselectable="on"
      @drag="drag"
      @dragend="dragend"
    >
      Droppable Element (Drag me!)
    </div>
    <div id="content">
      <GridLayout
        ref="refLayout"
        v-model:layout="mainLayout"
        :responsive="responsive"
        :col-num="colNum"
        :row-height="30"
        :vertical-compact="true"
        :use-css-transforms="true"
      >
        <grid-item
          v-for="item in mainLayout"
          :ref="(el: any) => set$Children(el)"
          :key="item.i"
          class="test"
          :x="item.x"
          :y="item.y"
          :w="item.w"
          :h="item.h"
          :i="item.i"
          :min-h="4"
          :min-w="1"
          @resized="handleResize"
          v-slot="{style}"
        >
          <!--<custom-drag-element :text="item.i"></custom-drag-element>-->
          <div>
            <!-- {{ style }} -->
            {{ style }}
          </div>
          <!--<button @click="clicked">CLICK ME!</button>-->
        </grid-item>
      </GridLayout>
    </div>
  </div>
</template>

<style scoped>
.layout {
  background-color: #eee;
}
.test {
  background-color: #ddd;
  touch-action: none
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
