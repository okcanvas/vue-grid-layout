div<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
// you can import from 'lodash-es' or implement it by yourself
import _ from 'lodash'

import { GridLayout, GridItem } from 'grid-layout-plus'
//import {GridLayout, GridItem} from "vue3-grid-layout-next"

const layout = ref([
  { x: 0, y: 0, w: 4, h: 4, i: '0', resizable: false },
  { x: 4, y: 0, w: 8, h: 4, i: '1', resizable: false },
  { x: 0, y: 4, w: 4, h: 4, i: '2', resizable: false },
  { x: 4, y: 4, w: 4, h: 4, i: '3', resizable: false },
  { x: 8, y: 4, w: 4, h: 4, i: '4', resizable: false },
  
])

const wrapper = ref<HTMLElement>()
const gridLayout = ref<InstanceType<typeof GridLayout>>()

console.log(gridLayout)

onMounted(() => {
  document.addEventListener('dragover', syncMousePosition)
})

onBeforeUnmount(() => {
  document.removeEventListener('dragover', syncMousePosition)
})

const mouseAt = { x: -1, y: -1 }

function syncMousePosition(event: MouseEvent) {
  mouseAt.x = event.clientX
  mouseAt.y = event.clientY
}

const dropId = 'drop'
const dragItem = { x: -1, y: -1, w: 4, h: 4, i: '' }

const drag = _.throttle(() => {
  console.log(wrapper.value)

  const parentRect = wrapper.value?.getBoundingClientRect()

  if (!parentRect || !gridLayout.value) return

  const mouseInGrid =
    mouseAt.x > parentRect.left &&
    mouseAt.x < parentRect.right &&
    mouseAt.y > parentRect.top &&
    mouseAt.y < parentRect.bottom

  if (mouseInGrid && !layout.value.find(item => item.i === dropId)) {
    layout.value.push({
      x: (layout.value.length * 2) % 12,
      y: layout.value.length + 12, // puts it at the bottom
      w: 2,
      h: 2,
      i: dropId,
      resizable: false
    })
  }

  const index = layout.value.findIndex(item => item.i === dropId)

  if (index !== -1) {
    const item = gridLayout.value.getItem(dropId)

    if (!item) return

    try {
      item.wrapper.style.display = 'none'
    } catch (e) {}

    Object.assign(item.state, {
      top: mouseAt.y - parentRect.top,
      left: mouseAt.x - parentRect.left
    })
    const newPos = item.calcXY(mouseAt.y - parentRect.top, mouseAt.x - parentRect.left)

    if (mouseInGrid) {
      gridLayout.value.dragEvent('dragstart', dropId, newPos.x, newPos.y, dragItem.h, dragItem.w)
      dragItem.i = String(index)
      dragItem.x = layout.value[index].x
      dragItem.y = layout.value[index].y
    } else {
      gridLayout.value.dragEvent('dragend', dropId, newPos.x, newPos.y, dragItem.h, dragItem.w)
      layout.value = layout.value.filter(item => item.i !== dropId)
    }
  }
})

function dragEnd() {
  const parentRect = wrapper.value?.getBoundingClientRect()

  if (!parentRect || !gridLayout.value) return

  const mouseInGrid =
    mouseAt.x > parentRect.left &&
    mouseAt.x < parentRect.right &&
    mouseAt.y > parentRect.top &&
    mouseAt.y < parentRect.bottom

  if (mouseInGrid) {
    //alert(`Dropped element props:\n${JSON.stringify(dragItem, ['x', 'y', 'w', 'h'], 2)}`)
    gridLayout.value.dragEvent('dragend', dropId, dragItem.x, dragItem.y, dragItem.h, dragItem.w)
    layout.value = layout.value.filter(item => item.i !== dropId)
  } else {
    return
  }

  layout.value.push({
    x: dragItem.x,
    y: dragItem.y,
    w: dragItem.w,
    h: dragItem.h,
    i: dragItem.i,
    resizable: true,
  })
  gridLayout.value.dragEvent('dragend', dragItem.i, dragItem.x, dragItem.y, dragItem.h, dragItem.w)

  const item = gridLayout.value.getItem(dropId)

  if (!item) return

  try {
    item.wrapper.style.display = ''
  } catch (e) {}
}
</script>

<template>
  <div class="layout-json">
    Displayed as <code>[x, y, w, h]</code>:
    <div class="columns">
      <div v-for="item in layout" :key="item.i" class="layout-item">
        <b>{{ item.i }}</b>: [{{ item.x }}, {{ item.y }}, {{ item.w }}, {{ item.h }}]
      </div>
    </div>
  </div>
  <br />
  <div
    class="droppable-element"
    draggable="true"
    unselectable="on"
    @drag="drag"
    @dragend="dragEnd"
  >
    Droppable Element (Drag me!)
  </div>
  
  <div ref="wrapper">
    <GridLayout ref="gridLayout" 
      v-model:layout="layout" 
      :col-num="12"
      :row-height="30"
      :is-draggable="true"
      :is-resizable="true"
      style="height: calc(100vh - 40px);" 
    >
      <GridItem
        v-for="item in layout"
        :key="item.i"
        
        class="l-item"
        :is-resizable="item.resizable"
        
        :x="item.x"
        :y="item.y"
        :w="item.w"
        :h="item.h"
        :i="item.i"
      >
        <div class="l-item-slot" contentEditable="true" style="padding: 10px">
          sdfs
          <!--
          <component
            :is="ComponentsLib[item.component]"
            v-if="item.component"
            :style-obj="style"
          ></component>
          -->
        </div>
      </GridItem>


      <!--
      v-slot="{style}"
      <GridItem v-for="item in layout" :key="item.i"
                   :x="item.x"
                   :y="item.y"
                   :w="item.w"
                   :h="item.h"
                   :i="item.i"
                   :is-draggable="true"
                   v-bind:class="item.static ? 'static' : ''"
                   
      >
        <span style="display: inline; width: 200px; height: 200px;">fsdfdsf</span>
      </GridItem>
      
      v-bind:class="item.static ? 'static' : ''"

      <template #item="{ item }">
        <span class="text">{{ item.i }}</span>
      </template>
      -->
    </GridLayout>
  </div>
</template>

<style scoped>
.vgl-layout {
  background-color: #eee;
}

:deep(.vgl-item:not(.vgl-item--placeholder)) {
  background-color: #ccc;
  border: 1px solid black;
}

:deep(.vgl-item--resizing) {
  opacity: 90%;
}

:deep(.vgl-item--static) {
  background-color: #cce;
}

.text {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  margin: auto;
  font-size: 24px;
  text-align: center;
}

.layout-json {
  padding: 10px;
  margin-top: 10px;
  background-color: #ddd;
  border: 1px solid black;
}

.columns {
  columns: 120px;
}

.droppable-element {
  width: 150px;
  padding: 10px;
  margin: 10px 0;
  text-align: center;
  background-color: #fdd;
  border: 1px solid black;
}
</style>

<style scoped>
.static {
  border: red dashed 2px;
  margin: 0;
  padding: 0;
}
.removeItem {
  position: absolute;
  right: 2px;
  top: 2px;
  font-size: 20px;
  cursor: pointer;
  color: #000;
  background-color: #fff;
  border-radius: 3px;
  padding: 2px 10px;
  z-index: 10;
}
</style>
