import {
    createRouter,
    createWebHashHistory
} from "vue-router"

import Layout from '~/layout/admin.vue'
import Index from '~/pages/index.vue'
import Login from '~/pages/login.vue'
import NotFound from '~/pages/404.vue'
import Test from '~/pages/test.vue'
import ImageList from '~/pages/image/list.vue'
import NoticeList from '~/pages/notice/list.vue'
import ManagerList from '~/pages/manager/list.vue'
import AccessList from '~/pages/access/list.vue'
import RoleList from '~/pages/role/list.vue'

// 默认
const routes = [
    {
        path: '/',
        name: 'Layout',
        component: Layout,
        meta: {
            needLogin: true,
            title: '首页'
        }
    },
    {
        path: '/login',
        component: Login,
        meta: {
            needLogin: false,
            title: '登录'
        }
    },
    {
        path: '/test',
        component: Test,
        meta: {
            needLogin: false,
            title: '测试'
        }
    },
    // 将匹配所有内容并将其放在 `$route.params.pathMatch` 下
    {
        path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound,
        meta: {
            needLogin: false,
            title: '404'
        }
    },
]

// 动态路由

const asyncRoutes = [
    {
        path: '/',
        name: '/',
        component: Index,
        meta: {
            needLogin: true,
            title: '控制台'
        }
    },
    {
        path:"/image/list",
        name:"/image/list",
        component:ImageList,
        meta:{
            title:"图库列表"
        }
    },
    {
        path:"/notice/list",
        name:"/notice/list",
        component:NoticeList,
        meta:{
            title:"公告列表"
        }
    },
    {
        path:"/manager/list",
        name:"/manager/list",
        component:ManagerList,
        meta:{
            title:"管理员"
        }
    },
    {
        path:"/access/list",
        name:"/access/list",
        component:AccessList,
        meta:{
            title:"权限"
        }
    },
    {
        path:"/role/list",
        name:"/role/list",
        component:RoleList,
        meta:{
            title:"角色"
        }
    },
]

export const router = createRouter({
    history: createWebHashHistory(),
    routes
})

// 动态添加路由方法
export function addRouters(menus) {

    // 是否存在新的路由
    let hasNewRoute = false

    const toAddfromMenus = (arr) => {
        arr.forEach(e => {
            // 是否存在
            let item = asyncRoutes.find( o => o.path == e.uri)

            if (item && !router.hasRoute(item.path)) {
                hasNewRoute = true

                router.addRoute(
                    'Layout',
                    item
                )
            }

            if (e.child && e.child.length > 0) {
                toAddfromMenus(e.child)
            }
        });
    }


    toAddfromMenus(menus)
    //console.log(router.getRoutes)
    return hasNewRoute
}
