<template>
    <div class="f-menu" :style="{ width: $store.state.asideWidth }">
        <el-menu class="border-0"
                @select="handleSelect"
                :collapse="isCollapse"
                :unique-opened="true"
                :collapse-transition="false"
                :default-active="defaultActive"
                active-text-color="#4C60A3"
                text-color="#777"
            >
            <template v-for="(item, index) in asideMenus" :key="index">

                <el-sub-menu v-if="item.child && item.child.length > 0"
                    :index="item.title">

                    <template #title>
                        <el-icon>
                            <component :is="item.icon"></component>
                        </el-icon>
                        <span>{{item.title}}</span>
                    </template>
                        <el-menu-item v-for="(childItem, childIndex) in item.child"
                            :key="childIndex"
                            :index="childItem.uri"
                        >
                            <el-icon>
                                <component :is="childItem.icon"></component>
                            </el-icon>
                            <span>{{childItem.title}}</span>
                        </el-menu-item>
                </el-sub-menu>

                <el-menu-item v-else :index="item.uri">
                    <el-icon>
                        <component :is="item.icon"></component>
                    </el-icon>
                    <span>{{item.title}}</span>
                </el-menu-item>

            </template>

        </el-menu>
    </div>
</template>

<script setup>
    import { useRouter, useRoute, onBeforeRouteUpdate } from 'vue-router'
    import { computed, ref } from 'vue'
    import { useStore } from 'vuex'

    const store = useStore()
    const router = useRouter()
    const route = useRoute()

    const isCollapse = computed({
        get() {
            return store.state.asideWidth == '250px' ? false : true;
        }
    })

    // 默认当前路径
    const defaultActive = ref(route.path)

    // 监听路由变化
    onBeforeRouteUpdate((to, from) => {
        defaultActive.value = to.path
    })

    const asideMenus = computed(() => store.state.menus)

    // 监听菜单选择
    const handleSelect = (e) => {
        router.push({
            path: e
        })
    }
</script>

<style lang="scss" scoped>
.f-menu {
    transition: all 0.3s;
    letter-spacing: 0.4px;
    top: 60px;
    bottom: 0;
    left: 0;
    overflow-y: auto;
    overflow-x: hidden;
    @apply shadow-md fixed bg-light-50;

    .el-sub-menu {
        padding-left: 0px;
        @apply antialiased font-medium;
    }
}

:deep(.el-sub-menu__title:hover) {
    background-color: none !important;
}

// 隐藏滚动条
.f-menu::-webkit-scrollbar {
    width: 0px;
}
</style>
