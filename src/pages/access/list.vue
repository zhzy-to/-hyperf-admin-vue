<template>
    <el-card shadow="never" class="border-0">

        <ListHeader @create="handleCreate" @refresh="getData" />

        <el-tree :data="tableData" :props="{ label:'title', children:'child' }"
                 v-loading="loading"
                 node-key="id"
                 :default-expanded-keys="defaultExpandedKeys"
                 :expand-on-click-node="false"
                 :filter-node-method="filterNode"
                 ref="treeRef"
        >
            <template #default="{ node, data }">
                <div class="custom-tree-node">
                    <el-tag size="small" :type=" data.menu ? '' : 'info' ">
                        {{ data.menu ? "菜单" : "权限" }}
                    </el-tag>

                    <el-icon v-if="data.icon" size="16" class="ml-2">
                        <component :is="data.icon" />
                    </el-icon>

                    <span>{{ node.label }}</span>

                    <div class="ml-auto">
                        <el-switch :model-value="data.status" :active-value="1" :inactive-value="0"
                                   @change="handleStatusChange($event,data)"
                        />

                        <el-button text type="primary" size="small" @click="handleEdit(data)">修改</el-button>
                        <el-button text type="primary" size="small" @click="addChild(data.id)">新增</el-button>
                        <el-popconfirm
                            width="220"
                            confirm-button-text="确定"
                            cancel-button-text="取消"
                            :icon="InfoFilled"
                            icon-color="#626AEF"
                            title="Are you sure to delete this?"
                            @confirm="handleDelete(data.id)"
                        >
                            <template #reference>
                            <el-button text type="danger" size="small">删除</el-button>
                            </template>
                        </el-popconfirm>
                    </div>
                </div>

            </template>

        </el-tree>


        <FormDrawer ref="formDrawerRef" :title="drawerTitle" @submit="handleSubmit">
            <el-form :model="form" ref="formRef" :rules="rules" label-width="80px" :inline="false">
                <el-form-item label="上级菜单" prop="parent_id">
                    <el-cascader v-model="form.parent_id"
                                 :options="menus"
                                 :props="{ label:'title', children:'child', value:'id' ,checkStrictly:true, emitPath:false }"
                                 placeholder="上级菜单"
                                 clearable />
                </el-form-item>

                <el-form-item label="菜单/权限" prop="parent_id">
                    <el-radio-group v-model="form.menu">
                        <el-radio :label="1" border>菜单</el-radio>
                        <el-radio :label="0" border>权限</el-radio>
                    </el-radio-group>
                </el-form-item>

                <el-form-item label="名称" prop="parent_id">
                    <el-input v-model="form.title" placeholder="名称" style="width: 60%;"></el-input>
                </el-form-item>

                <el-form-item label="图标" prop="parent_id" v-if="form.menu === 1">
                    <IconSelect v-model="form.icon" />
                </el-form-item>

                <el-form-item label="前端路由" prop="parent_id" v-if="form.menu === 1 && form.parent_id > 0">
                    <el-input v-model="form.uri" placeholder="前端路由"></el-input>
                </el-form-item>

                <el-form-item label="后端规则" prop="parent_id" v-if="form.menu === 0">
                    <el-input v-model="form.condition" placeholder="后端规则"></el-input>
                </el-form-item>

                <el-form-item label="请求类型" prop="parent_id" v-if="form.menu === 0">
                    <el-select v-model="form.method" placeholder="请求类型">
                        <el-option
                            v-for="item in ['GET','POST','PUT','DELETE']"
                            :key="item"
                            :label="item"
                            :value="item"
                        />
                    </el-select>
                </el-form-item>

                <el-form-item label="排序" prop="parent_id">
                    <el-input-number
                        v-model="form.order"
                        :min="0"
                        :max="10"
                        controls-position="right"
                    />
                </el-form-item>

            </el-form>
        </FormDrawer>

    </el-card>

</template>

<script setup>
import ListHeader from "~/components/ListHeader.vue";
import FormDrawer from "~/components/FormDrawer.vue";
import IconSelect from "~/components/IconSelect.vue";
import { InfoFilled } from '@element-plus/icons-vue'

import {
    getMenuList,
    createMenu,
    updateMenu,
    deleteMenu,
    updateMenuStatus
} from "~/api/menu.js";

import {
    useInitTable,
    useInitForm
} from "~/composables/useCommon.js"

import {ref} from "vue";


// 默认展开节点
const defaultExpandedKeys = ref([])
const treeRef = ref(null)
const menus = ref([])

const {
    loading,
    tableData,
    getData,
    handleStatusChange,
    handleDelete,
} = useInitTable({
    getList: getMenuList,
    update: updateMenuStatus,
    delete: deleteMenu,
    getListSuccessfully: (res) => {
        tableData.value = res.items
        menus.value = res.menus
        defaultExpandedKeys.value = res.items.map(val => val.id)
    }
})



// setTimeout(() => {
//     treeRef.value.filter(1)
// },3000)

// 过滤方法
const filterNode = (value, data) => {
    if (!value) return true
    //return data.title.includes(value)
    //return data.menu === value
    return true
}


const {
    formDrawerRef,
    formRef,
    form,
    rules,
    drawerTitle,
    handleSubmit,
    handleCreate,
    handleEdit,
} = useInitForm({
    form: {
        parent_id: 0,
        order: 0,
        title: "",
        icon: "",
        menu: 1,
        uri: "",
        condition: "",
        method: "GET",
        status: 1,
    },
    rules: {
        title:[{
            required: true,
            message: 'title不能为空',
            trigger: 'blur'
        }],
    },
    getData,
    update: updateMenu,
    create: createMenu,
})

// 添加子菜单
const addChild = (parentId) => {
    handleCreate()
    form.parent_id = parentId
    form.status = 1
}

</script>

<style>
    .custom-tree-node {
        flex: 1;
        display: flex;
        align-items: center;
        font-size: 14px;
        padding-right: 8px;
    }
    .el-tree-node__label {
        display: flex;
        width: 100%;
    }
    .el-tree-node__content {
        padding: 20px 0;
    }
</style>
