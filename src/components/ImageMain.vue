<template>
    <el-main class="image-main" v-loading="loading">
        <div class="top p-3">
            <el-row :gutter="20">
                <el-col :span="6" :offset="0" v-if="list.length > 0" v-for="(item,index) in list" :key="index">
                    <el-card shadow="hover" class="relative mb-3" :body-style="{'padding':0}"
                             :class="{'border-blue-500': item.checked}"
                    >

                        <el-image :src="item.path" fit="cover" :lazy="true" class="w-full h-[150px]"
                                  style="width: 100%;"
                                  :preview-src-list="[item.path]"
                                  :initial-index="0"
                        ></el-image>
                        <div class="image-title">{{ item.name }}</div>
                        <div class="flex items-center justify-center p-2">

                            <el-checkbox v-if="openChoose" v-model="item.checked" @change="handleChooseChange(item)"/>

                            <el-button type="primary" size="small" text @click="handelEdit(item)">重命名</el-button>
                            <el-popconfirm title="确认删除 ?" confirm-button-text="确认" cancel-button-text="取消"
                                           @confirm="handelDelete(item.id)"
                            >
                                <template #reference>
                                <el-button class="!m-0" type="primary" size="small" text @click="">删除</el-button>
                                </template>
                            </el-popconfirm>
                        </div>
                    </el-card>
                </el-col>

                <div v-else style="width: 100%;">
                    <el-empty  description="No Data" />
                </div>

            </el-row>
        </div>

        <div class="bottom">
            <el-pagination background layout="prev,pager,next"
                           :total="total"
                           :current-page="currentPage"
                           :page-size="limit"
                           @current-change="getData"
            />
        </div>
    </el-main>

    <el-drawer
        v-model="drawer"
        title="上传图片"
    >
        <UploadFile :data="{class_id: imageClassId}" @success="handleUploadSuccess"></UploadFile>
    </el-drawer>

</template>
<script setup>
import { getImageList, updateImage, deleteImage } from "~/api/image.js"
import {computed, ref} from "vue";
import {showPrompt, toast} from "~/utils/toast.js"
import UploadFile from "~/components/UploadFile.vue"

// 上传图片
const drawer = ref(false)
const openUpload = () => drawer.value = true;


const imageClassId = ref(0)

const loading = ref(false)

// 分页
const currentPage = ref(1)
const total = ref(0)
const limit = ref(10)
const list = ref([])

// 重命名
function handelEdit(item) {
    showPrompt("重命名",item.name)
    .then( ({value}) => {
        loading.value = true
        updateImage(item.id,{
            name:value
        }).then(res => {
            toast('success');
            getData();
        }).finally(()=> {
            loading.value = false
        })
    })
}

// 删除
function handelDelete(id) {
    loading.value = true

    deleteImage(id).then(res => {
        getData();
    })
    .finally(() => {
        loading.value = false
    })
}

function getData(p = null) {
    if (typeof p == "number") {
        currentPage.value = p
    }
    loading.value = true
    getImageList(imageClassId.value,{page:currentPage.value})
        .then(res => {
            //console.log(res)
            list.value = res.items.map(val => {
                val.checked = false
                return val
            })

            total.value = res.pageInfo.total
        })
        .finally(() => {
            loading.value = false
        })
}

const loadData = (id) => {
    currentPage.value = 1;
    imageClassId.value = id
    getData()
}

const handleUploadSuccess = () => getData()

//选中图片
const emit = defineEmits(['choose']);

//const chooseImage = computed(() => list.value.filter(o => o.checked))
const handleChooseChange = (item) => {
    list.value.map(val => {
        if (val.id !== item.id) {
            val.checked = false
        }
        return val
    })
    item.checked = true
    emit("choose",item)
}

defineProps({
    openChoose: {
        type: Boolean,
        default: false
    }
})

defineExpose({
    loadData,
    openUpload,
})

</script>
<style lang="scss" scoped>
.image-main {
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

    .image-title {
        position: absolute;
        top: 122px;
        left: -1px;
        right: -1px;
        @apply text-sm truncate text-gray-100 bg-opacity-50 bg-gray-800 px-2 py-1;
    }
}
</style>
