<template>

    <el-aside width="220px" class="image-aside" v-loading="loading">
        <div class="top">

            <AsideList v-for="(item,key) in list" :key="key" :active="activeId === item.id"
                       @edit="handleEdit(item)"
                       @delete="handleDelete(item)"
                       @click="handleChangeActive(item.id)"
            >{{item.name}}</AsideList>

        </div>

        <div class="bottom">
            <el-pagination background layout="prev, next"
                           :total="total"
                           :current-page="currentPage"
                           :page-size="limit"
                           @current-change="getData"
            />
        </div>

    </el-aside>

    <FormDialog :title="drawerTitle" ref="formDialogRef" @submit="handleSubmit">
        <el-form :model="form" :rules="rules" ref="formRef" label-width="80px" :inline="false">

            <el-form-item prop="name" label="分类名称">
                <el-input v-model="form.name" placeholder="请输入名称" autocomplete="off"></el-input>
            </el-form-item>

            <el-form-item prop="sort" label="排序">
                <el-input-number v-model="form.sort" :min="0" :max="100000" />
            </el-form-item>

        </el-form>
    </FormDialog>

</template>

<script setup>
import { getImageClass, createImageClass, updateImageClass,deleteImageClass } from "~/api/image_class.js";
import AsideList from "~/components/AsideList.vue"
import {computed, reactive, ref} from "vue";
import FormDialog from "~/components/FormDialog.vue"
import { toast } from "~/utils/toast.js"


const loading = ref(false)
const list = ref([])
// 分页
const currentPage = ref(1)
const total = ref(0)
const limit = ref(10)


function getData(p = null) {
    if (typeof p == "number") {
        currentPage.value = p
    }
    loading.value = true
    getImageClass(currentPage.value)
        .then(res => {
            //console.log(res)
            list.value = res.items
            total.value = res.pageInfo.total
            let defaultActiveItem = res.items[0]
            if (defaultActiveItem) {
                handleChangeActive(defaultActiveItem.id)
            }
        })
    .finally(() => {
        loading.value = false
    })
}
getData()

const formDialogRef = ref(null)
const form = reactive({
    name: '',
    sort: 50
})
const editId = ref(0)
const drawerTitle = computed(() => editId.value ? "更新" : "新增")

const rules ={
    name: [
        { required: true, message: 'Please input Activity name', trigger: 'blur' },
        { min: 3, max: 60, message: 'Length should be 3 to 60', trigger: 'blur' },
    ],
}
const formRef = ref(null)

const handleSubmit = () => {
    console.log('提交表单')
    formRef.value.validate((valid) => {
        if (!valid) return false;
        formDialogRef.value.showLoading()

        // 待合并对象
        let editData = {id: editId.value};

        const fun = editId.value ? updateImageClass(editId.value , Object.assign(editData,form)) : createImageClass(form)

        fun.then(res => {
            toast(drawerTitle.value + "操作成功")
            getData(editId.value ? currentPage.value : 1)
        }).finally(() => {
            // 关闭表单弹窗
            formDialogRef.value.hideLoading()
            formDialogRef.value.close()
        })
    })
}

const handleCreate = () => {
    editId.value = 0
    form.name = ""
    form.sort = 0
    formDialogRef.value.open()
}

const handleEdit = (row) => {
    editId.value = row.id
    form.name = row.name
    form.sort = row.sort ? row.sort : 0
    formDialogRef.value.open()
}

const handleDelete = (row) => {
    let data = {
        ids: row.id
    }
    loading.value = true
    deleteImageClass(data).then(res => {
        toast( "操作成功")
        getData()
    }).finally(() => {
        loading.value = false
    })
}

const activeId = ref(0)
const emit = defineEmits(["change"])
// 切换分类事件
function handleChangeActive(id) {
    activeId.value = id
    // 通知父组件
    emit("change",id)
}

defineExpose({
    handleCreate,
})
</script>

<style lang="scss" scoped>
.image-aside {
    border-right: 1px solid #eeeeee;
    position: relative;
    .top {
        position: absolute;
        top: 0;
        right: 0;
        left: 0;
        bottom: 50px;
        overflow-y: auto;
    }
    .bottom{
        @apply flex items-center justify-center;
        position: absolute;
        bottom: 0;
        height: 50px;
        left: 0;
        right: 0;
    }
}

</style>
