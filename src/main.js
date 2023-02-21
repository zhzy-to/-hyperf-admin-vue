import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import 'virtual:windi.css'

import 'element-plus/theme-chalk/dark/css-vars.css'
import '~/assets/styles/dark/css-vars.scss'

import { router } from './router'
import store from './store'

import * as ElementPlusIconsVue from '@element-plus/icons-vue'

const app = createApp(App)

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}

app.use(router)
app.use(store)
app.use(ElementPlus)

//路由守卫
import './permission.js'

//自定义指令
import permission from "~/directives/permission.js";
app.use(permission)

app.mount('#app')
