<template>
  <el-card shadow="never">
    <template #header>
      <div class="flex justify-between">
        <span class="text-sm"></span>
        <div>
          <el-check-tag
            v-for="(item, index) in options"
            :key="index"
            :checked="current == item.value"
            @click="handleChoose(item.value)"
            style="margin-right: 8px"
          >
            {{ item.text }}
          </el-check-tag>
        </div>
      </div>
    </template>
    <!-- card body -->
    <div ref="el" id="chart" style="width: 100%; height: 300px"></div>
  </el-card>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import * as echarts from "echarts";
import { useResizeObserver } from "@vueuse/core";
import { getStaticForChart } from "~/api";
import { get } from "@vueuse/shared";

const current = ref("week");

const options = [
  {
    text: "近一小时",
    value: "hour",
  },
  {
    text: "近一周",
    value: "week",
  },
  {
    text: "近一个月",
    value: "month",
  },
];

const handleChoose = (type) => {
  current.value = type;
  getData();
};

var myChart = null;
onMounted(() => {
  var chartDom = document.getElementById("chart");
  if (chartDom) {
      myChart = echarts.init(chartDom);
      getData();
  }
});

onBeforeUnmount(() => {
  if (myChart) myChart.dispose();
});

function getData() {
  let option = {
    xAxis: {
      type: "category",
      data: [],
    },
    yAxis: {
      type: "value",
    },
    series: [
      {
        data: [],
        type: "line",
        showBackground: true,
      },
    ],
  };

  myChart.showLoading();

  getStaticForChart(current.value)
    .then((res) => {
      option.xAxis.data = res.x;
      option.series[0].data = res.y;
      option && myChart.setOption(option);
      myChart.hideLoading();
    })
    .finally(() => {
      myChart.hideLoading();
    });
}

const el = ref(null);
useResizeObserver(el, (entries) => myChart.resize());
</script>
