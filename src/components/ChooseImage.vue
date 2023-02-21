<template>
    <div v-if="modelValue">
        <el-image style="display: inherit;" :src="modelValue" fit="cover" class="mr-2 w-[100px] h-[100px] rounded border"></el-image>
    </div>

    <div class="choose-image-btn" @click="open">
        <el-icon :size="25" class="text-gray-500"><Plus /></el-icon>
    </div>

    <el-dialog
        v-model="dialogVisible"
        title="选择"
        width="80%"
        top="5vh"
    >
        <el-container class="bg-white rounded" style="height: 70vh;">
            <el-header class="image-header">
                <el-button type="primary" size="small" @click="handleOpenCreate">新增素材分类</el-button>
                <el-button type="warning" size="small" @click="handleOpenUpload">上传图片</el-button>
            </el-header>
            <el-container>

                <ImageAside ref="imageAsideRef" @change="handleAsideChange"></ImageAside>
                <ImageMain openChoose ref="imageMainRef" @choose="handleChose"></ImageMain>

            </el-container>
        </el-container>

        <template #footer>
          <span class="dialog-footer">
            <el-button @click="close">Cancel</el-button>
            <el-button type="primary" @click="submit">
              Confirm
            </el-button>
          </span>
        </template>
    </el-dialog>

</template>

<script setup>
import ImageAside from "~/components/ImageAside.vue"
import ImageMain from "~/components/ImageMain.vue"
import {ref} from "vue";
import {toast} from "~/utils/toast.js";

const dialogVisible = ref(false);

const open = () => {
    dialogVisible.value = true
}
const close = () => dialogVisible.value = false;

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

const props = defineProps({
    modelValue: [String,Array]
})

const emit = defineEmits(["update:modelValue"])

let path = null
const handleChose = (e) => {
    //console.log(e.path)
    //urls = e.map(o=>o.url)
    path = e.path
}

const submit = () => {
    if (path) {
        emit("update:modelValue",path)
        close()
    } else {
        toast("请至少选中一项","error")
    }
}
</script>

<style scoped>
    .choose-image-btn {
        @apply w-[100px] h-[100px] rounded border flex justify-center items-center
        cursor-pointer hover:(bg-gray-100);

    }
    .image-header {
        border-bottom: 1px solid #eeeeee;
        @apply flex items-center
    }
</style>
