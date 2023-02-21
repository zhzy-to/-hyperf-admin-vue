<template>
    <el-drawer 
        v-model="showDrawer"
        :title="title"
        :with-header="true"
        :close-on-click-modal="false"
        :size="size"
        :destroy-on-close="destroyOnClose"
        >
        <div class="formDrawer">
            <div class="body">

                <slot></slot>
            </div>
            <div class="actions">
                <el-button color="#586CB1" type="primary" @click="submit" :loading="loading"> {{ confirmText }} </el-button>
                <el-button type="default" @click="close">取消</el-button>
            </div>
        </div>

    </el-drawer>
</template>

<script setup>
    import { ref } from 'vue'
    const showDrawer = ref(false)

    const open = () => showDrawer.value = true
    const close = () => showDrawer.value = false

    // 暴露属性
    const props = defineProps({
        title: String,
        size: {
            type: String,
            default: "35%"
        },
        destroyOnClose: {
            type: Boolean,
            default: false
        },
        confirmText: {
            type: String,
            default: '确定'
        }
    })

    const emit = defineEmits(['submit'])
    const submit = () => emit('submit')

    const loading = ref(false)
    const showLoading = () => loading.value = true
    const hideLoading = () => loading.value = false

    // 向父组件暴露方法
    defineExpose({
        open,
        close,
        showLoading,
        hideLoading
    })
</script>

<style lang="scss" scoped>
    .formDrawer {
        width: 100%;
        height: 100%;
        position: relative;
        @apply flex flex-col;
        
        .body {
            flex: 1;
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 50px;
            overflow-y: auto;
        }

        .actions {
            height: 50px;
            @apply mt-auto flex items-center;
        }
    }
</style>