<template>
    <el-row class="login-container">
        <el-col :lg="8" :md="12" class="right">
            <h2 class="title">Account Login</h2>
            <div class="text-xs text-gray-500 my-8">Welcome back, please login to your account.</div>
            <div class="title-zh">
                <span class="line"></span>
                <span>账户登录</span>
                <span class="line"></span>
            </div>
            <el-form :model="form" :rules="rules" ref="ruleFormRef" class="w-[250px]">
                <el-form-item prop="username">
                    <el-input v-model="form.username" placeholder="请输入用户名" autocomplete="off">
                        <template #prefix>
                            <el-icon class="el-input__icon"><User /></el-icon>
                        </template>
                    </el-input>
                </el-form-item>

                <el-form-item prop="password">
                    <el-input v-model="form.password" type="password" showPassword placeholder="请输入密码" autocomplete="off" >
                        <template #prefix>
                            <el-icon class="el-input__icon"><Lock /></el-icon>
                        </template>
                    </el-input>
                </el-form-item>

                <el-form-item>
                    <el-button :loading="loading"  class="w-[250px] " color="#586CB1" type="primary" @click="onSubmit">Submit</el-button>
                </el-form-item>

            </el-form>
        </el-col>

        <!-- layout 共24  el 响应式 >= 2000px 占 16  >= 992px 占 12  -->
        <el-col :lg="16" :md="12" class="left">
            <div>
                <div class="">Welcome here</div>
                <div class="">This is a backend administration based on vite vue3 element-plus windicss</div>
            </div>
        </el-col>
    </el-row>
</template>

<script setup>
    import {ref, reactive, onMounted, onUnmounted} from 'vue'
    import { useRouter,useRoute } from 'vue-router'
    import { useStore } from 'vuex'
    import {toast} from "~/utils/toast.js";

    const router = useRouter()
    const route = useRoute()

    const store = useStore()

    // do not use same name with ref
    const form = reactive({
      username: '',
      password: '',
    })

    const ruleFormRef = ref(null)
    let loading = ref(false)

    const validatePass = (rule, value, callback) => {
        if (value === '') {
            callback(new Error('Please input the password'))
        } else {
            callback()
        }
    }

    const rules = reactive({
        username: [
            { required: true, message: 'Please input Activity name', trigger: 'blur' },
            { min: 3, max: 12, message: 'Length should be 3 to 12', trigger: 'blur' },
        ],
        password: [{ validator: validatePass, trigger: 'blur' }],
    })



    const onSubmit = () => {

        ruleFormRef.value.validate((vaild) => {
            if (!vaild) {
                return false
            }

            loading.value = true
            store.dispatch('login',{
                username: form.username,
                password: form.password,
            }).then(res => {
                // 获取用户信息
                store.dispatch('getInfo').then(res => {
                        toast('登录成功')
                        router.push({ path: route.query.redirect || '/' })
                    }).catch(err => {
                        toast(err)
                    })
            }).finally(() => {
                loading.value = false
            })

        })

    }

    // 回车
    function onKeyUp(e) {
        if (e.key === 'Enter') onSubmit()
    }
    onMounted(() => {
        // 监听键盘事件
        document.addEventListener('keyup',onKeyUp)
    })
    onUnmounted(() => {
        document.removeEventListener('keyup',onKeyUp)
    })
</script>

<style lang="scss" scoped>
    .login-container {
        @apply bg-indigo-500 min-h-screen;

        .left {
            background-image: url("../assets/bg.jpg");
            background-size: cover;
            @apply flex items-center justify-center;
            div > div:first-child {
                @apply font-bold text-5xl text-light-50 mb-4;
            }

            div > div:last-child {
                @apply text-gray-200 text-sm;
            }
        }

        .right {
            @apply bg-light-50 flex items-center justify-center flex-col;

            .title {
                @apply text-3xl text-gray-800;
            }

            .title-zh {
                @apply flex text-xs items-center justify-center my-5 text-gray-300 space-x-2;
            }

            .line {
                @apply h-[1px] w-16 bg-gray-200;
            }
        }
    }
</style>
