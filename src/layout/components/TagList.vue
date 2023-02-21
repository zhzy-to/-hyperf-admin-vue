<template>
    <div class="zhzy-tag-list" :style="{ left: $store.state.asideWidth }">
        <el-tabs v-model="activeTab"
                type="card"
                class="flex-1"
                style="min-width:  100px;"
                @tab-remove="removeTab"
                @tab-change="tabChange"
             >
            <el-tab-pane v-for="item in tabList" :key="item.path"
                :label="item.title" :name="item.path"
                :closable="item.path != '/'"
            >

            </el-tab-pane>
        </el-tabs>

        <span class="tag-btn">
            <el-dropdown @command="handleCloseTab">
                <span class="el-dropdown-link">
                    <el-icon>
                        <arrow-down />
                    </el-icon>
                </span>
                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item command="clearAll">全部关闭</el-dropdown-item>
                        <el-dropdown-item command="clearOther">关闭其它</el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
        </span>

    </div>

    <div style="height:44px;"></div>
</template>

<script setup>
    import { ref } from 'vue'
    import { useRouter, useRoute, onBeforeRouteUpdate } from 'vue-router';
    import { useCookies } from '@vueuse/integrations/useCookies'

    const route = useRoute()
    const router = useRouter()
    const cookie = useCookies()

    const activeTab = ref(route.path)
    const tabList = ref([
        {
            title: '控制台',
            path: '/'
        }
    ])

    function addTab(tab) {
        let notFound = tabList.value.findIndex((t) => t.path == tab.path) == -1
        if (notFound) {
            tabList.value.push(tab)
        }
        cookie.set("zhzy-admin-tabs",tabList.value)
    }

    function initTabList() {
        let tabs = cookie.get('zhzy-admin-tabs')
        if (tabs) {
            tabList.value = tabs
        }
    }

    initTabList()

    // 监听路由变化
    onBeforeRouteUpdate((to,form) => {
        activeTab.value = to.path
        addTab({
            title: to.meta.title,
            path: to.path
        })
    })


    const tabChange = (t) => {
        //alert(t)
        router.push(t)
    }

    const removeTab = (target) => {
        let tabs = tabList.value
        let active = activeTab.value

        if (target == active) {
            tabs.forEach((tab,index) => {
                if (tab.path == target) {
                    const newTab = tabs[index + 1] || tabs[index - 1]
                    if (newTab) {
                        active = newTab.path
                    }
                }
            })
        }

        activeTab.value = active
        // 过滤关闭tab
        tabList.value = tabList.value.filter(tab => tab.path != target)

        cookie.set("zhzy-admin-tabs",tabList.value)
    }


    const handleCloseTab = (c) => {
        console.log(c)
        if (c == 'clearAll') {
            activeTab.value = '/'
            //tabList.value = tabList.value.filter(tab => tab.path == '/')
            tabList.value = [{
                title : '控制台',
                path : '/'
            }]
        }

        if (c == 'clearOther') {
            tabList.value = tabList.value.filter(tab => tab.path == '/' || tab.path == activeTab.value)
        }

        cookie.set("zhzy-admin-tabs",tabList.value)
    }
</script>

<style lang="scss" scoped>
    .zhzy-tag-list {
        @apply fixed bg-gray-100 flex items-center px-2;
        top: 66px;
        right: 0;
        height: 44px;
        z-index: 100;

        // 样式穿透 否则修改无效
        :deep(.el-tabs__header) {
            @apply mb-0;
            border: 0;
        }
        :deep(.el-tabs__nav) {
            border: 0 !important;
        }

    }

    .tag-btn {
        @apply bg-white rounded ml-auto flex items-center justify-center px-2;
        height: 32px;
    }

    :deep(.el-tabs__item) {
        border: 0;
        height: 32px;
        line-height: 32px;
        @apply bg-white mx-1 rounded font-medium;
    }

    :deep(.el-tabs) {
        --el-tabs-header-height: 32px;
    }
    :deep(.el-tabs__nav-next), :deep(.el-tabs__nav-prev) {
        line-height: 32px !important;
        height: 32px;
    }

    :deep(.is-active) {
        color: #4C60A3;
    }

    :deep(.is-disabled) {
        cursor: not-allowed;
        @apply text-gray-50;
    }
</style>
