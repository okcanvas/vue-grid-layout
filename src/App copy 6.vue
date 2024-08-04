<template>
  <div id="app">
    <header>
      <h1>Vue Dashboard</h1>
      <h2>Built with <a href="https://cube.dev/" target="_blank" rel="noopener noreferrer">Cube.js</a> + <a href="https://vueblocks.github.io/ve-charts/#/">ve-charts</a> + <a href="https://xiaoluoboding.github.io/vue-smart-widget/#/home">vue-smart-widget</a></h2>
    </header>
    <smart-widget simple>
          <h3>Simple Widget Without Header</h3>
          <p>
            {{placeholder}}
          </p>
        </smart-widget>

        <smart-widget simple>
          <h3>Simple Widget Without Header</h3>
          <p>
            {{placeholder}}
          </p>
        </smart-widget>
  </div>
</template>

<script>
import { SmartWidget, SmartWidgetGrid } from "./components/vue-smart-widget"

export default {
  name: 'App',
  components: {
    SmartWidget, SmartWidgetGrid
  },
  data() {
    return {
      placeholder: 'asfsafd'
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

header {
  text-align: center;
  color: #2c3e50;
}
</style>
