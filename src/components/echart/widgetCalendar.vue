<template>
  <div :style="myStyle">
    <v-img
  :width="300"
  aspect-ratio="16/9"
  cover
  src="https://cdn.vuetifyjs.com/images/parallax/material.jpg"
></v-img>
  </div>
</template>

<script lang='ts'>
import { defineComponent } from 'vue';
//import '@fullcalendar/core/vdom' // solve problem with Vite
import FullCalendar, { CalendarOptions, EventApi, DateSelectArg, EventClickArg } from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'

export default defineComponent({
  components: {
    FullCalendar,
  },
  props: {
    id: {
      type: String,
      default: 'default_id'
    },
    styleObj: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  computed: {
    myStyle() {
      return {
        width: this.styleObj.width,
        height: this.styleObj.height,
        padding: '10px',
        'padding-top': '30px',
      }
    },
    gridStyle() {
      return {
        weight: '50%',
        height: `calc(100%)`,
      }
    }
  },
  data() {
    return {
      calendarOptions: {
        plugins: [ dayGridPlugin, interactionPlugin ],
        initialView: 'dayGridMonth'
      }
    }
  },
  mounted() {
    document.readyState === 'complete' ? this.init() : window.onload = this.init;
  },
  methods: {
    init() {
      
    }
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
.fc { /* the calendar root */
  max-width: 1100px;
  margin: 0 auto;
}
</style>