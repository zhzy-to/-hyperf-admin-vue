// 权限验证
import { router, addRouters } from '~/router'
import { close, start } from "~/utils/nprogress-plugin.js";
import { getToken } from "~/utils/auth.js";
import { toast } from "~/utils/toast.js";
import store from "~/store/index.js";

// 路由全局前置守卫
let hasGetInfo = false
router.beforeEach(async (to, from, next) => {

    const token = getToken()
    const needLogin = to.meta.hasOwnProperty('needLogin') ? to.meta.needLogin : false

    if (!token && needLogin) {
        toast('请先登录', 'warning')
        return next({
            path: '/login'
        })
    }

    if (token && to.path === '/login') {
        return next({
            path: from.path ? from.path : '/'
        })
    }

    // 获取用户信息是否存在
    //const userID = store.getters.id

    let hasNewRoute = false

    //console.log("userID",userID)
    // 重新拉取信息
    if (token && !hasGetInfo) {
        //let res = await store.dispatch('getInfo')
        let { routers } = await store.dispatch('getInfo')

        // 添加路由信息
        hasNewRoute = addRouters(routers)

        hasGetInfo = true
    }

    document.title = (to.meta.title || '') + ' - zhzy后台管理'

    start()

    // 手动指定路由
    hasNewRoute ? next(to.fullPath) : next()
})


router.afterEach((to, from, next) => {
    close()
})
