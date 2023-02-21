### vscode 插件
 -  WindiCSS IntelliSense
 -  Vue 3 Snippets
 -  Vue Language Features (Volar)


### 官方文档

```

// vite
https://cn.vitejs.dev/config/shared-options.html#resolve-alias

// vue
https://cn.vuejs.org/guide/quick-start.html#creating-a-vue-application

// element-plus
https://element-plus.gitee.io/zh-CN

// windicss
https://cn.windicss.org/utilities/animations/transitions.html

// animate css
https://animate.style/

https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.css

// 查找需要的动画效果复制


// gsap
https://www.npmjs.com/package/gsap

//axios-js
http://www.axios-js.com/

// vue-router
https://router.vuejs.org/zh/guide/essentials/dynamic-matching.htm

```

###  vite 中 process is not defined

- 官方推荐使用
默认情况下，开发服务器 (dev 命令) 运行在 development (开发) 模式，而 build 命令则运行在 production (生产) 模式

```js
import.meta.env 代替 process.env
```

- vite.config 中增加 define
```js
import { defineConfig } from 'vite'
// ...
export default defineConfig({
  // ...
  define: {
    'process.env': {}
  }
})

// 或者

import { defineConfig } from 'vite'
// ...
export default defineConfig({
  // ...
  define: {
    'process.env': process.env
  }
})

```


### vite 使用mock js

- 安装
```bash
npm install mockjs --save-dev

npm i vite-plugin-mock cross-env -D
```

- 在 package.json 中设置环境变量
```json
{
    "scripts": {
        // 修改dev构建脚本的命令
        "dev": "cross-env NODE_ENV=development vite",
        "build": "vite build",
        "serve": "vite preview"
    }
}
```

- 修改 vite.config.js
```js

import { viteMockServe } from "vite-plugin-mock"

export default defineConfig({
    plugins: [
        vue(),
        viteMockServe({
            supportTs: true,     //如果使用 js发开，则需要配置 supportTs 为 false
            logger: true,
            mockPath: "./mock/"
        })
    ]
})

```

- 新建mock 目录 /mock/index.js
```js
// 导出
export default [
    {
        url: "/dev-api/admin/login",
        method: "post",
        response: () => {
            return {
                code: 0,
                message: "ok",
                data: ["tom", "jerry"],
            }
        }
    }
]

// 如果没有做代理 那么url 就是 axios 请求的地址 注意请求方式要统一
```

### vueUse

```shell
vue 官方工具库
地址: vueuse.org 
```

### webstorm 不识别项目路径别名解决

```json
// 在项目根目录新建文件 jsconfig.json

// 填写
{
    "compilerOptions": {
    "baseUrl": ".",
        "paths": {
        "~/*": ["./src/*"]
      }
    }
}

```

### 知识点

```js
// 插槽的使用
 <slot />

// 子组件父组件通信
defineProps 暴露属性
defineEmits
defineExpose

// 自定义指令
directive


```
