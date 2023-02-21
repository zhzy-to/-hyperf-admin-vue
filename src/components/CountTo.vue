<template>
    <!-- 保留两位 -->
    {{ d.num.toFixed(2) }}
</template>

<script setup>
    import gsap from 'gsap'
    import { reactive, watch } from 'vue'

    const props = defineProps({
        toValue: {
            type: Number,
            default: 0
        }
    })

    const d = reactive({
        num: 0
    })

    function animateToValue() {
        gsap.to(d,{
            duration: 0.5,
            num: props.toValue
        })
    }

    animateToValue()

    // 监听是否发生变化 重新启动动画
    watch(() => props.toValue, () => animateToValue())
</script>