<template>
    <div class="f-header">
        <span class="f-logo">
            <!-- <el-icon class="mr-1"><HomeFilled /></el-icon> -->
            <span class="logo-text">zhzy admin</span>
        </span>

        <el-icon class="icon-btn" @click="$store.commit('handleAsideWidth')">
            <Fold v-if="$store.state.asideWidth == '250px'" />
            <Expand v-else/>
        </el-icon>

        <el-tooltip
            effect="dark"
            content="刷新"
            placement="bottom"
        >
            <el-icon class="icon-btn" @click="handleRefresh"><Refresh /></el-icon>
        </el-tooltip>

        <div class="ml-auto flex items-center">
            <el-tooltip
                effect="dark"
                placement="bottom"
            >
                <template #content>{{computedObj.fullScreenTips}}</template>
                <el-icon class="icon-btn" @click="toggle">
                    <FullScreen v-if="!isFullscreen" />
                    <Close v-else />
                </el-icon>
            </el-tooltip>

            <el-tooltip
                effect="dark"
                placement="bottom"
            >
                <template #content>夜间模式</template>
                <el-icon class="icon-btn"  @click="switchThemes">
                    <Moon v-if="themeIsDark" />
                    <Sunny v-else />
                </el-icon>

            </el-tooltip>

            <el-tooltip
                effect="dark"
                placement="bottom"
                content="通知"
            >
                <el-icon class="icon-btn"
                    ref="noticeRef"
                    v-click-outside="onClickOutside">
                    <Bell />
                </el-icon>

            </el-tooltip>
            <el-popover
                placement="bottom"
                :width="400"
                trigger="click"
                ref="popoverRef"
                :virtual-ref="noticeRef"
                title="With title"
                virtual-triggering
            >
                    123123132
            </el-popover>

            <!--command 点击菜单项触发的事件回调 菜单中标记事件名称 -->
            <el-dropdown class="dropdown" @command="handleCommand">
                <span class="flex items-center">

                    <el-avatar class="mr-2" shape="square" :size="25" :src="$store.state.user.avatar" />
                    {{ $store.state.user.username }}

                    <el-icon class="el-icon--right">
                        <arrow-down />
                    </el-icon>
                </span>
                <template #dropdown>
                <el-dropdown-menu>
                    <el-dropdown-item command="rePassword">修改密码</el-dropdown-item>
                    <el-dropdown-item command="setters">设置</el-dropdown-item>
                    <el-dropdown-item command="logout">退出登录</el-dropdown-item>
                </el-dropdown-menu>
                </template>
            </el-dropdown>

        </div>
    </div>


    <!-- 对话框model -->
    <FormDialog ref="formDialogRef"  title="设置">
        这是内容
    </FormDialog>

    <!-- 抽屉model -->
    <FormDrawer ref="formDrawerRef"
        title="修改密码"
        destroyOnClose
        @submit="onSubmit">

        <el-form :model="form" :rules="rules" ref="ruleFormRef">
            <el-form-item prop="oldPassword" label="旧密码" label-width="82px" >
                <el-input v-model="form.oldPassword" type="password"  showPassword placeholder="请输入旧密码">
                    <template #prefix>
                        <el-icon class="el-input__icon"><Lock /></el-icon>
                    </template>
                </el-input>
            </el-form-item>

            <el-form-item prop="password" label="新密码" label-width="82px" >
                <el-input v-model="form.password"  type="password" showPassword placeholder="请输入新密码">
                    <template #prefix>
                        <el-icon class="el-input__icon"><Lock /></el-icon>
                    </template>
                </el-input>
            </el-form-item>

            <el-form-item prop="password" label="确认新密码" label-width="82px" >
                <el-input v-model="form.rePassword" type="password" showPassword placeholder="请确认新密码" >
                    <template #prefix>
                        <el-icon class="el-input__icon"><Lock /></el-icon>
                    </template>
                </el-input>
            </el-form-item>

        </el-form>

    </FormDrawer>

</template>

<script setup>
    import { computed, reactive, ref, unref } from 'vue'
    import { useRouter } from "vue-router";
    import { useStore } from "vuex";
    import { showModel, toast } from "~/utils/toast.js";
    import { logout, rePassword as updatePassword } from "~/api/manager.js";
    // 全屏
    import { useFullscreen, useDark, useToggle  } from '@vueuse/core'

    import FormDrawer from '~/components/FormDrawer.vue';
    import FormDialog from '~/components/FormDialog.vue';

    import { ClickOutside as vClickOutside } from 'element-plus'
    const noticeRef = ref()
    const popoverRef = ref()

    const onClickOutside = () => {
        unref(popoverRef).popperRef?.delayHide?.()
    }

    const themeIsDark = ref(false)

    // 获取主题状态
    function initTheme () {
        let darkVal = localStorage.getItem("useDarkKEY")
        if (darkVal == 'dark') {
            themeIsDark.value = true
        } else {
            themeIsDark.value = false
        }
    }
    initTheme()


    // 切换模式
    const isDark = useDark({
        storageKey: 'useDarkKEY',
        // 暗黑class名字
        valueDark: 'dark',
        // 高亮class名字
        valueLight: 'light',
    })

    function switchThemes() {
      const toggleDark = useToggle(isDark)

      themeIsDark.value = toggleDark()
    }

    // const { isFullscreen, enter, exit, toggle } = useFullscreen()
    const {
        // 是否全屏状态
        isFullscreen,
        // 切换
        toggle
    } = useFullscreen()

    // 重置密码
    const {
        formDrawerRef,
        form,
        rules,
        ruleFormRef,
        openRepassModel,
        onSubmit
    } = useRepassword()

    const router = useRouter()
    const store = useStore()

    function logOut() {
        showModel('是否退出登录?').then(() => {
            // 确认
            logout().finally(() => {
                toast('退出成功!','success')
                store.dispatch('logout')
                router.push({ path: '/login' })
            })
        }).catch(() => {
            // 取消
        })
    }

    // 全屏文字提示
    const computedObj = reactive({
        fullScreenTips: '全屏'
    })

    computedObj.fullScreenTips = computed({
        get() {
            return isFullscreen.value ? `退出全屏` : `全屏`;
        }
    })


    const formDialogRef = ref(null)

    // 监听el-dropdown 下拉
    const handleCommand = (e) => {
        switch(e) {
            case 'rePassword':
                openRepassModel()
                break
            case 'setters':
                console.log(formDialogRef.value)
                formDialogRef.value.open()
                break
            case 'logout':
                logOut()
                break
            default:
                console.log('未匹配事件')
                break
        }
        console.log(e)
    }

    const handleRefresh = () => {
        store.dispatch('getInfo').finally(() => {
            location.reload()
        })
    }

    // 修改密码表单 以及 业务代码
    function useRepassword() {
        // 修改密码抽屉
        const formDrawerRef = ref(null)

        // do not use same name with ref
        const form = reactive({
            oldPassword: '',
            rePassword: '',
            password: '',
        })

        const ruleFormRef = ref(null)

        const validatePass = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('Please input the password'))
            } else {
                callback()
            }
        }

        const rules = reactive({
            oldPassword: [{ validator: validatePass, trigger: 'blur' }],
            password: [{ validator: validatePass, trigger: 'blur' }],
            rePassword: [{ validator: validatePass, trigger: 'blur' }],
        })

        const onSubmit = () => {
            ruleFormRef.value.validate((vaild) => {
                if (!vaild) {
                    return false
                }
                formDrawerRef.value.showLoading()

                //console.log(form)
                updatePassword(form).then(res => {

                    toast('操作成功, 请重新登录')
                    store.dispatch('logout')
                    router.push({ path: '/login' })

                }).finally(() => {
                    formDrawerRef.value.hideLoading()

                })
            })
        }


        const openRepassModel = () => formDrawerRef.value.open()
        return {
            formDrawerRef,
            form,
            rules,
            ruleFormRef,
            openRepassModel,
            onSubmit
        }
    }
</script>

<style lang="scss" scoped>
    $header-height: 54px;

    .f-header {
        @apply flex items-center bg-light-50 text-gray-700 fixed top-0 left-0 right-0 shadow-md;
        height: $header-height;
        z-index: 100;
        //box-shadow: 0 20px 40px 0rgba(0,0,0,.05);
        //border-bottom: 1px solid #ccc;

        .dropdown {
            height: $header-height;
            cursor: pointer;
            @apply flex justify-center items-center text-gray-700 mx-5;
        }
    }

    .f-logo {
        width: 250px;
        @apply flex justify-center items-center text-xl font-thin;

        .logo-text {
            color: #4b5ea0;
            @apply font-medium text-lg;
        }
    }

    .icon-btn {
        @apply flex justify-center items-center;
        width: 42px;
        height: $header-height;
        cursor: pointer;
    }
    .icon-btn:hover {
        @apply bg-light-200
    }
</style>
