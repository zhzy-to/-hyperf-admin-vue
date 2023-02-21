<template>
    <el-card shadow="never" class="border-0">

        <!-- 搜索 -->
        <el-form :inline="true" :model="searchForm" label-width="80px" class="mb-3" size="small">
            <el-row :gutter="20">

                <el-form-item label="账号" class="!mr-1">
                    <el-input v-model="searchForm.username" placeholder="user account" clearable />
                </el-form-item>
                <el-form-item label="名称" class="!mr-1">
                    <el-input v-model="searchForm.name" placeholder="user name" clearable />
                </el-form-item>
                <el-form-item label="状态" class="!mr-1">
                    <el-select v-model="searchForm.status" placeholder=" status" >
                        <el-option label="正常" value="1" />
                        <el-option label="禁用" value="0" />
                    </el-select>
                </el-form-item>

            </el-row>

            <el-row :gutter="20">
                <el-col :span="8" :offset="0"></el-col>
                <el-col :span="8" :offset="8">
                    <div class="flex item-center justify-end">
                        <el-button type="primary" @click="getData">搜索</el-button>
                        <el-button @click="resetSearchForm">重置</el-button>
                    </div>
                </el-col>
            </el-row>

        </el-form>

        <!-- 新增|刷新 -->
        <ListHeader @create="handleCreate" @refresh="getData" />

        <el-table :data="tableData" stripe style="width: 100%" v-loading="loading">
            <el-table-column prop="username" label="账户" width="200">
                <template #default="{ row }">
                    <div class="flex items-center">
                        <el-avatar :size="40" :src="row.avatar" >
                            <img
                                src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png"
                            />
                        </el-avatar>

                        <div class="ml-3">
                            <h6>{{ row.username }}</h6>
                            <small>{{ row.id }}</small>
                        </div>
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="name" label="名称" />
            <el-table-column label="角色">
                <template #default="{ row }">
                    <el-tag type="success" size="small" round v-if="row.roles" v-for="(item,index) in row.roles" :key="index">
                        {{item.name}}
                    </el-tag>
                </template>
            </el-table-column>
            <el-table-column label="状态" width="120">
                <template #default="{ row }">
                    <el-switch
                        :modelValue="row.status"
                        :active-value="1"
                        :inactive-value="0"
                        :loading="row.statusLoading"
                        @change="handleStatusChange($event,row)"
                    />
                </template>
            </el-table-column>
            <el-table-column prop="created_at" label="创建时间" width="300" />
            <el-table-column label="操作" width="180" align="center">
                <template #default="scope">
                    <el-button type="primary" size="small" text @click="handleEdit(scope.row)">修改</el-button>

                    <el-popconfirm title="是否要删除该人员？" confirmButtonText="确认" cancelButtonText="取消" @confirm="handleDelete(scope.row.id)">
                        <template #reference>
                            <el-button text type="primary" size="small">删除</el-button>
                        </template>
                    </el-popconfirm>
                </template>
            </el-table-column>
        </el-table>

        <div class="flex items-center justify-center mt-5">
            <el-pagination background layout="prev, pager ,next" :total="total" :current-page="currentPage" :page-size="limit" @current-change="getData"/>
        </div>

        <FormDrawer ref="formDrawerRef" :title="drawerTitle" @submit="handleSubmit">
            <el-form :model="form" ref="formRef" :rules="rules" label-width="80px" :inline="false">
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="form.username" placeholder="用户名"></el-input>
                </el-form-item>
                <el-form-item label="名称" prop="name">
<!--                    <el-input v-model="form.name" placeholder="名称" type="textarea" :rows="5"></el-input>-->
                    <el-input v-model="form.name" placeholder="名称" ></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input v-model="form.password" placeholder="密码"></el-input>
                </el-form-item>

                <el-form-item label="头像" prop="avatar">

                    <ChooseImage v-model="form.avatar" />
                </el-form-item>

                <el-form-item label="所属角色" prop="role_ids">
                    <el-select v-model="form.role_ids" multiple placeholder="选择角色">
                        <el-option
                            v-for="item in roles"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item label="状态" prop="status">
                    <el-switch
                        v-model="form.status"
                        :active-value="1"
                        :inactive-value="0"
                    />
                </el-form-item>
            </el-form>
        </FormDrawer>

    </el-card>
</template>
<script setup>
import {ref, onMounted} from "vue"
import FormDrawer from "~/components/FormDrawer.vue"
import ChooseImage from "~/components/ChooseImage.vue"

import {
    getManagerList,
    updateManager,
    createManager,
    getRoles,
} from "~/api/manager"

import { useInitTable, useInitForm } from "~/composables/useCommon"
import ListHeader from "~/components/ListHeader.vue";

const {
    searchForm,
    resetSearchForm,
    tableData,
    loading,
    currentPage,
    total,
    limit,
    getData,
    handleDelete,
    handleStatusChange,
} = useInitTable({
    searchForm: {
        username: '',
        name: '',
        status: ''
    },
    getList: getManagerList,
    getListSuccessfully: (res) => {
        tableData.value = res.items.map(item => {
            item.statusLoading = false
            return item
        })
        total.value = res.pageInfo.total
    },
    delete: null,
    update: updateManager
})

const {
    formDrawerRef,
    formRef,
    form,
    drawerTitle,
    handleSubmit,
    handleCreate,
    handleEdit,
} = useInitForm({
    form: {
        username: "",
        name: "",
        password: "",
        role_ids: "",
        status: 1,
        avatar: "",
    },
    rules: {
        username:[{
            required: true,
            message: '账户名不能为空',
            trigger: 'blur'
        }],
        name:[{
            required: true,
            message: '名称不能为空',
            trigger: 'blur'
        }],
        password:[{
            required: true,
            message: '密码不能为空',
            trigger: 'blur'
        }],
    },
    getData,
    update: updateManager,
    create: createManager,
})

const roles = ref([])
//组件完成初始渲染并创建 DOM 节点后
onMounted(() => {
    //console.log(`the component is now mounted.`)
    getRoles().then(res => {
        roles.value = res
    })
})



</script>
