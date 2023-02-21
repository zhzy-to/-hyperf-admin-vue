import store from "~/store/index.js";

/**
 * 当前储存的权限信息中 是否包含 指令传递过来的值
 * @param value
 * @param el
 * @returns {boolean}
 */
function hasPermission(value,el = false) {
    if (!Array.isArray(value)) {
        throw new Error(`需要配置权限数据,如 v-permission="['test']"`)
    }

    // -1 未查询到
    const has = value.findIndex(v => store.state.ruleNames.includes(v)) !== -1
    if (el && !has) {
        el.parentNode && el.parentNode.removeChild(el)
    }

    return has
}

// 自定义指令 - 权限按钮级
export default {
    install(app) {
        // 得到main.js中 createApp后的对象
        //console.log(app)
        // 注册一个全局自定义指令 `v-名称`
        app.directive('permission', {
            // 当被绑定的元素插入到 DOM 中时……
            mounted(el,binding) {
                // Focus the element
                //el.focus()
                //console.log(el,binding)
                hasPermission(binding.value,el)
            }
        })
    }
}
