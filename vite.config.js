import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import WindiCSS from 'vite-plugin-windicss'
import { viteMockServe } from "vite-plugin-mock"

// node 内置模块
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      "~": path.resolve(__dirname,"src")
    }
  },
  plugins: [
    vue(),
    WindiCSS(),
    // viteMockServe({
    //   supportTs: false,    //如果使用 js发开，则需要配置 supportTs 为 false
    //   mockPath: "./mock/"
    // })
  ],
  server: {
    proxy: {
      "/dev-api": {
        target: "http://127.0.0.1:9501/api",
        changeOrigin: true,
        rewrite: path => path.replace(/^\/dev-api/, '')
      },
    },
  },
})
