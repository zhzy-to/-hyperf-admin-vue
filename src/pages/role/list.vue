<template>
    <el-card shadow="never" class="border-0">

        <!-- 搜索 -->
        <el-form :inline="true" :model="searchForm" label-width="80px" class="mb-3" size="small">
            <el-row :gutter="20">

                <el-form-item label="名称" class="!mr-1">
                    <el-input v-model="searchForm.name" placeholder="name" clearable />
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
<!--            <el-table-column prop="username" label="账户" width="200">-->
<!--                <template #default="{ row }">-->
<!--                    <div class="flex items-center">-->
<!--                        <div class="ml-3">-->
<!--                            <h6>{{ row.name }}</h6>-->
<!--                            <small>{{ row.id }}</small>-->
<!--                        </div>-->
<!--                    </div>-->
<!--                </template>-->
<!--            </el-table-column>-->
            <el-table-column prop="id" label="ID" />
            <el-table-column prop="name" label="名称" />
            <el-table-column prop="desc" label="描述" />

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
            <el-table-column label="操作" width="220" align="center">
                <template #default="scope">
                    <el-button type="primary" size="small" text @click="openSetRule(scope.row)">权限</el-button>
                    <el-button type="primary" size="small" text @click="handleEdit(scope.row)">修改</el-button>

                    <el-popconfirm title="是否删除？" confirmButtonText="确认" cancelButtonText="取消" @confirm="handleDelete(scope.row.id)">
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

                <el-form-item label="名称" prop="name">
                    <el-input v-model="form.name" placeholder="名称" ></el-input>
                </el-form-item>

                <el-form-item label="描述" prop="desc">
                    <el-input v-model="form.desc" placeholder="用户名"></el-input>
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

        <!--权限配置-->
        <FormDrawer ref="setRuleFormDrawerRef" title="权限配置" @submit="handleSetRuleSubmit">
            <el-tree-v2 ref="elTreeRef" node-key="id"
                        :check-strictly="checkStrictly"
                        :data="ruleList"
                        :default-expanded-keys="defaultExpandedKeys"
                        :props="{ label:'title', children:'child' }"
                        show-checkbox
                        :height="treeHeight"
                        @check="handleCheck"
            >

                <template #default="{ node,data }">
                    <div class="flex items-center">
                        <el-tag :type="data.menu ? '': 'info'" size="small">{{data.menu ? '菜单': '权限'}}</el-tag>
                        <span class="ml-2 text-sm">{{ data.title }}</span>
                    </div>

                </template>
            </el-tree-v2>
        </FormDrawer>

    </el-card>
</template>
<script setup>
import { ref,reactive,computed,onMounted} from "vue"
import ListHeader from "~/components/ListHeader.vue";
import FormDrawer from "~/components/FormDrawer.vue";
import {
    getRoleList,
    createRole,
    updateRole,
    delRole,
    setRules
} from "~/api/role"
import { useInitTable, useInitForm } from "~/composables/useCommon"
import {
    getMenuList,
} from "~/api/menu.js";

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
        name: '',
        status: ''
    },
    getList: getRoleList,
    getListSuccessfully: (res) => {
        //console.log(res.items);
        tableData.value = res.items.map(item => {
            item.statusLoading = false
            return item
        })
        total.value = res.pageInfo.total
    },
    delete: delRole,
    update: updateRole
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
        name: "",
        desc: "",
        status: 1
    },
    rules: {
        name:[{
            required: true,
            message: '名称不能为空',
            trigger: 'blur'
        }],
        desc:[{
            required: true,
            message: '描述不能为空',
            trigger: 'blur'
        }],
    },
    getData,
    update: updateRole,
    create: createRole,
})

const roles = ref([])

//组件完成初始渲染并创建 DOM 节点后
// onMounted(() => {
//     getData().then(res => {
//         roles.value = res
//     })
// })

const setRuleFormDrawerRef = ref(null)
const ruleList = ref([])
const defaultExpandedKeys = ref([])
const treeHeight = ref(0)
const roleId = ref(0)
const roleIds = ref([])
const elTreeRef = ref(null)
const checkStrictly = ref(false)

const openSetRule = (row) => {
    roleId.value = row.id
    treeHeight.value = window.innerHeight - 170
    checkStrictly.value = true
    getMenuList().then(res => {
        ruleList.value = res.items
        defaultExpandedKeys.value = res.items.map(val => val.id)
        // 获取当前角色权限
        roleIds.value = row.menus.map(val => val.id)
        setRuleFormDrawerRef.value.open()

        setTimeout(()=> {
            elTreeRef.value.setCheckedKeys(roleIds.value)
            checkStrictly.value = false
        },150)
    })

}

function handleCheck(...e) {
    const { checkedKeys, halfCheckedKeys } = e[1]
    roleIds.value = [...checkedKeys, ...halfCheckedKeys]
}

const handleSetRuleSubmit = () => {
    setRuleFormDrawerRef.value.showLoading()
    setRules(roleId.value,{rule_ids:roleIds.value}).then(res => {
        getData()
        setRuleFormDrawerRef.value.close()
    })
    .finally(() => {
        setRuleFormDrawerRef.value.hideLoading()
    })
}

</script>
