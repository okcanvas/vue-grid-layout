import {createApp} from "vue"
import { vuetify } from "./plugins/vuetify";
import eventBus from 'vue3-eventbus'

import App from "./App.vue"
import "@/assets/style/index.scss"


createApp(App)
.use(vuetify)
.use(eventBus)
.mount("#app")
