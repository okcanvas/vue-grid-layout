<template>
  <div class="widget-wrapper" 
    draggable="true" 
    @dragstart="onDragStart"
    @dragend="onDragEnd"
    @drag="onDrag"
  >
    <p>{{item}}</p>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps } from 'vue';
import _ from 'lodash'
//import eventBus from 'vue3-eventbus'

const props = defineProps<{
  item: {
    type: any,
    default: {
      x: 0,
      y: 0,
      w: 0,
      h: 0,
      i: '',
      component: ''
    }
  },
  onDrag?: (event: DragEvent, item: any) => void;
  onDrop?: (event: DragEvent, item: any) => void;
}>()

const isDragging = ref<boolean>(false)

const onDragStart = (event: DragEvent) => {
  isDragging.value = true;
  event.dataTransfer?.setData("text/plain", JSON.stringify(props.item));
}

const onDragEnd = (event: DragEvent) => {
  if (!isDragging.value) return;
  if (props.onDrop) props.onDrop(event, props.item)
  isDragging.value = false;
}

const onDrag = _.throttle((event: DragEvent) => {
  if (!isDragging.value) return;
  if (props.onDrag) props.onDrag(event, props.item)
}, 200, { trailing: true })



</script>

<style scoped>
.widget-wrapper {
  width: 180px;
  height: 100px;
  background-color: lightblue;
  text-align: center;
  margin: 10px;
  cursor: move;
}
</style>