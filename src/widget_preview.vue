<template>
  <div class="widget-wrapper" 
    draggable="true" 
    @dragstart="handleDragStart"
    @dragover="handleDragOver"
    @drop="handleDrop"
  >
    <p>{{id}}</p>
  </div>
</template>

<script>
import { defineComponent } from 'vue';
//import eventBus from 'vue3-eventbus'
//  vue-grid-item vue-resizable cssTransforms l-item

export default defineComponent({
  props: {
    id: {
      type: String,
      default: 'default_id'
    },
    x: {
      type: Number,
      default: 0
    },
    y: {
      type: Number,
      default: 0
    }
  },
  methods: {
    handleDragStart(event) {
      event.dataTransfer.setData("text/plain", JSON.stringify({ id: this.id, x: 0, y: 0 }));
    },
    handleDragOver(event) {
      event.preventDefault();
    },
    handleDrop(event) {
      //event.preventDefault();
      //const data = event.dataTransfer.getData("text/plain");
      //eventBus.emit('gridItemDropped', id.value, x.value, y.value, data);
    },
  }
});
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