<template>
    <div>
      <el-result
        icon="warning"
        title="404 not found"
        sub-title="页面不存在"
      >
        <template #extra>
          <el-button type="primary" @click="$router.push('/')">Back Home</el-button>
        </template>
      </el-result>
    </div>
</template>