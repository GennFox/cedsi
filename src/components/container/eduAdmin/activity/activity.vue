<template>
  <div id="eduActivity">
    <el-button type="primary" @click="addActivity" size="small">新增活动</el-button>
    <div class="spaceLine"></div>
    <el-table :data="currentList" style="width: 100%;">
      <el-table-column type="index" label="序号" width="180" align="center"></el-table-column>
      <el-table-column prop="ACTIVITY_TITLE" label="活动名称" align="center"></el-table-column>
      <el-table-column prop="ACTIVITY_PLACE" label="活动地点" align="center"></el-table-column>
      <el-table-column prop="ACTIVITY_TIME" label="活动时间" align="center"></el-table-column>
      <el-table-column label="操作" align="center">
        <template>
          <el-button type="text" disabled>编辑</el-button>
          <el-button type="text" disabled>查看学生</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="spaceLine"></div>
    <!-- 分页 -->
    <el-pagination
      background
      layout="prev, pager, next"
      @current-change="handlePageChange"
      @prev-click="handlePageChange"
      @next-click="handlePageChange"
      :page-size="limit"
      :total="tempActivityList.length"
    ></el-pagination>
  </div>
</template>

<script>
import instance from "../../../../axios-auth.js";

export default {
  data() {
    return {
      currentList: [], //当前绑定的活动列表
      allActivityList: [], //获取到的整个活动列表
      tempActivityList: [], //临时的学生列表
      limit: 6
    };
  },
  created() {
    this.getActivity();
  },
  methods: {
    addActivity() {
      this.$router.push({ path: "/eduAdmin/activity/addActivity" });
    },
    handlePageChange(pageIndex) {
      let start = (pageIndex - 1) * this.limit;
      let end = start + this.limit;
      this.currentList = this.tempActivityList.slice(start, end);
    },
    getActivity() {
      let token = localStorage.getItem("idToken");
      const config = { headers: { Authorization: token } };
      instance
        .get("/eduadmin/activity", config)
        .then(res => {
          console.log(res);
          this.allActivityList = res.data;
          console.log(this.allActivityList);
          this.tempActivityList = this.allActivityList;
          this.handlePageChange(1);
        })
        .catch(err => {
          console.error(err);
        });
    }
  }
};
</script>

<style scoped>
#eduActivity {
  margin: 0 20px 20px 20px;
}
#eduActivity .spaceLine {
  height: 15px;
}
</style>