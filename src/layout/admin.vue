<template>
    <el-container>

        <el-header>
            <Header></Header>
        </el-header>

        <el-container>

            <el-aside :width="$store.state.asideWidth">
                <Menu></Menu>
            </el-aside>

            <el-main>
                <TagList></TagList>

                <!-- <div class="admin-container"> -->
                    <router-view v-slot="{ Component }">

                        <transition name="fade">

                            <keep-alive :max="10">
                                <component :is="Component"></component>
                            </keep-alive>

                        </transition>

                    </router-view>
                <!-- </div> -->

            </el-main>

        </el-container>

    </el-container>
</template>

<script setup>
import Header from './components/Header.vue'
import Menu from './components/Menu.vue'
import TagList from './components/TagList.vue'
</script>

<style lang="scss" scoped>
    .el-aside {
        transition: all 0.3s;
    }
    // .admin-container {
    //     @apply shadow-xl;
    //     height: 100vh;
    //     background-color: #EFF1F7;
    // }

    // 设置动画时长
    .fade-enter-active,
    .fade-leave-active {
        transition: opacity 0.3s;
    }

    // 延迟
    .fade-enter-active {
        transition-delay: 0.3s;
    }

    // 进入之前
    .fade-enter-from {
        opacity: 0;
    }
    // 进入之后
    .fade-enter-to {
        opacity: 1;
    }

    // 离开之前
    .fade-leave-from {
        opacity: 1;
    }
    // 离开之后
    .fade-leave-to {
        opacity: 0;
    }
</style>
