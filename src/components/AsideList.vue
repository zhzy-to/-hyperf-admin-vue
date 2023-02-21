<template>
    <div class="aside-list" :class="{'active' : active}">
        <span class="truncate">
            <!--插槽展示组件调用中的内容-->
            <slot />
        </span>
        <!-- @click.stop 防止触发事件冒泡 -->
        <el-button class="ml-auto px-1" type="primary" size="small" text @click.stop="$emit('edit')">
            <el-icon :size="12"><Edit /></el-icon>
        </el-button>

        <el-popconfirm title="确认删除 ?" confirm-button-text="确认" cancel-button-text="取消"
            @confirm="$emit('delete')"
        >
            <template #reference>
            <el-button class="px-1" type="primary" size="small" text>
                <el-icon :size="12"><Close /></el-icon>
            </el-button>
            </template>
        </el-popconfirm>
    </div>
</template>

<script setup>
defineProps({
    active: {
        type: Boolean,
        default: false
    }
})

// 子组件向 父组件 事件穿透
defineEmits([
    'edit',
    'delete'
])
</script>

<style lang="scss" scoped>
.aside-list {
    border-bottom: 1px solid #f4f4f4;
    @apply flex items-center p-3 text-sm text-grat-600;
    cursor: pointer;
}
.aside-list:hover, .active {
    @apply bg-blue-50;
}
</style>
