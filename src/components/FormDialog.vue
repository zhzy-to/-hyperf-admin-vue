<template>
    <el-dialog
        v-model="dialogFormVisible"
        :title="title"
        :show-close="false"
        :draggable="true"
        :fullscreen="fullscreenVisible"
        :close-on-click-modal="false"
        :destroy-on-close="true"
        >
        <template #header="{ close, titleId, titleClass }">
            <div class="my-header">
                <h4 :id="titleId" :class="titleClass">{{title}}</h4>
                <div>
                    <el-icon class="el-icon--left" @click="toFullScreen">
                        <FullScreen v-if="!fullscreenVisible" />
                        <Notification v-else />
                    </el-icon>
                    <el-icon class="el-icon--left" @click="close"><Close /></el-icon>
                </div>
            </div>
        </template>

        <slot></slot>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="close">取消</el-button>
                <el-button type="primary" color="#586CB1" @click="submit" :loading="loading">{{ confirmText }}</el-button>
            </span>
        </template>

    </el-dialog>
</template>

<script setup>
    import { ref } from 'vue'

    const fullscreenVisible = ref(false)
    const toFullScreen = () => {
       fullscreenVisible.value = !fullscreenVisible.value
    }

    const props = defineProps({
        title: String,
        confirmText: {
            type: String,
            default: '确定'
        }
    })

    const dialogFormVisible = ref(false)


    const emit = defineEmits(['submit'])
    const submit = () => emit('submit')

    const open = () => dialogFormVisible.value = true
    const close = () => {
        dialogFormVisible.value = false
        //fullscreenVisible.value = false
    }

    const loading = ref(false)
    const showLoading = () => loading.value = true
    const hideLoading = () => loading.value = false

    defineExpose({
        open,
        close,
        showLoading,
        hideLoading
    })
</script>

<style lang="scss" scoped>
    .my-header {
      display: flex;
      flex-direction: row;
      justify-content: space-between;

      .el-icon--left {
        cursor: pointer;
      }
    }
</style>
