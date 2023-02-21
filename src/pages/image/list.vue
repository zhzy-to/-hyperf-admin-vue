<template>
    <el-container class="image-container rounded" :style="{height: (h + 'px')}">
        <el-header class="image-header">
            <el-button type="primary" size="small" @click="handleOpenCreate">新增素材分类</el-button>
            <el-button type="warning" size="small" @click="handleOpenUpload">上传图片</el-button>
        </el-header>
        <el-container>

            <ImageAside ref="imageAsideRef" @change="handleAsideChange"></ImageAside>
            <ImageMain ref="imageMainRef"></ImageMain>

        </el-container>
    </el-container>
</template>

<script setup>
import ImageAside from "~/components/ImageAside.vue"
import ImageMain from "~/components/ImageMain.vue"
import {ref} from "vue";
const windowHeight = window.innerHeight || document.body.clientHeight
const h = windowHeight - 64 - 44 - 40

const imageAsideRef = ref(null)
const imageMainRef = ref(null)

const handleOpenCreate = () => {
    imageAsideRef.value.handleCreate()
}

const handleAsideChange = (classId) => {
    imageMainRef.value.loadData(classId)
}

const handleOpenUpload = () => {
    imageMainRef.value.openUpload()
}
</script>

<style lang="scss" scoped>
.image-container {
    @apply bg-white
}
.image-header {
    border-bottom: 1px solid #eeeeee;
    @apply flex items-center
}
</style>
