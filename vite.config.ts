import {defineConfig} from "vite"
import vue from "@vitejs/plugin-vue"
import Components from "unplugin-vue-components/vite"
import {AntDesignVueResolver} from "unplugin-vue-components/resolvers"
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    Components({
      resolvers: [AntDesignVueResolver()]
    })
  ],
  resolve: {
    alias: {
      "@/": new URL("./src/", import.meta.url).pathname
    }
  }
  // build: {
  //   lib: {
  //     entry: path.resolve(__dirname, "./src/components/index.ts"), //指定组件编译入口文件
  //     name: "vue3-gird-layout",
  //     fileName: "vue3-grid-layout",
  //     formats: ["es", "umd"]
  //   },
  //   rollupOptions: {
  //     external: ["vue"],

  //     output: {
  //       globals: {
  //         vue: "Vue"
  //       }
  //     }
  //   }
  // }
})
