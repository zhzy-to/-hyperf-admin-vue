<template>
    <div>
        <el-row :gutter="20" v-permission="['system:statistic:order']">

            <template v-if="panels.length == 0">
                <el-col :span="6" :offset="0" v-for="i in 4" :key="i">
                    <el-skeleton  animated loading>
                        <template #template>
                            <el-card shadow="hover" class="border-0">
                                <template #header>
                                    <div class=" flex justify-between">
                                        <el-skeleton-item variant="text" style="width: 60%" />
                                        <el-skeleton-item variant="text" style="width: 10%" />
                                    </div>

                                </template>
                                <!--body-->
                                <el-skeleton-item variant="h3" style="width: 80%" />

                                <el-divider></el-divider>

                                <div class="flex justify-between text-sm text-gray-400">
                                    <el-skeleton-item variant="text" style="width: 50%" />
                                    <el-skeleton-item variant="text" style="width: 10%" />
                                </div>

                            </el-card>

                        </template>
                    </el-skeleton>
                </el-col>
            </template>


            <el-col :span="6" :offset="0" v-for="(item,index) in panels" :key="index">
                <el-card shadow="hover" class="border-0">
                    <template #header>
                        <div class=" flex justify-between">
                            <span>{{ item.title }}</span>
                            <el-tag type="info" effect="plain">
                                {{ item.unit }}
                            </el-tag>
                        </div>

                    </template>



                    <!--body-->
                    <span class=" text-3xl font-bold text-gray-500">
                        <CountTo :toValue="item.value"></CountTo>
                    </span>

                    <el-divider></el-divider>

                    <div class="flex justify-between text-sm text-gray-400">
                        <span>{{ item.subTitle }}</span>
                        <span>{{ item.subValue }}</span>
                    </div>

                </el-card>
            </el-col>
        </el-row>

        <IndexNavs/>


        <el-row :gutter="20" class="mt-5">
            <el-col :span="12" :offset="0">
                <IndexChart v-permission="['system:statistic:chart']"/>
            </el-col>
            <el-col :span="12" :offset="0">
                <IndexCard v-permission="['system:statistic:goods']" title="提示" tips="提示信息" :btns="goods" />
            </el-col>
        </el-row>


    </div>
</template>

<script setup>
    import { ref } from 'vue'
    import { getStatics, getStaticForShop } from "~/api/index";
    import CountTo from '~/components/CountTo.vue';
    import IndexNavs from "~/components/IndexNavs.vue";
    import IndexChart from '~/components/IndexChart.vue';
    import IndexCard from '~/components/IndexCard.vue';

    const panels = ref([])

    getStatics().then(res => {
        panels.value = res.panels
    })

    const goods = ref([])
    const order = ref([])
    getStaticForShop().then(res => {
        goods.value = res.goods
        order.value = res.order
    })
</script>
