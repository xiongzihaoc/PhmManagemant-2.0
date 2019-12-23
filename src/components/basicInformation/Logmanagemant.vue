<template>
  <div>
    <!-- 卡片视图 -->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="7">
          <!-- 搜索 -->
          <el-input placeholder="请输入内容" v-model="input" @keyup.13.native="dicSearch" clearable>
            <el-button slot="append" icon="el-icon-search" @click="dicSearch"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <el-table
        :data="menuList"
        :lazy="true"
        style="width: 100%;margin-bottom: 20px;"
        :header-cell-style="{background:'#f5f5f5'}"
        row-key="id"
        ref="singleTable"
        highlight-current-row
        @current-change="handleCurrentChange"
      >
        <el-table-column align="center" prop="operId" label="日志编号" sortable></el-table-column>
        <el-table-column align="center" prop="title" label="系统模块" sortable></el-table-column>
        <el-table-column align="center" prop="operType" label="操作类型" sortable></el-table-column>
        <el-table-column align="center" prop="operName" label="操作人员" sortable></el-table-column>
        <el-table-column align="center" prop="deptName" label="部门名称"></el-table-column>
        <el-table-column align="center" prop="operIp" label="主机"></el-table-column>
        <el-table-column align="center" prop="operLocation" label="操作地点"></el-table-column>
        <el-table-column align="center" prop="operTime" label="操作时间">
          <template slot-scope="scope">
            <div>{{timesChangeDate(scope.row.operTime)}}</div>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChangev"
        :current-page="pageNum"
        :page-sizes="[10, 20,50]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
  </div>
</template>
<script>
export default {
  data() {
    return {
      input: "",
      menuList: [],
      pageSize: 10,
      pageNum: 1,
      total: 0,
      currentRow: null
    };
  },
  created() {
    this.getLogList();
  },
  methods: {
    async getLogList() {
      const { data: res } = await this.$http.post("oper/log/getSysOperLogList.do",
        { pageSize: this.pageSize, pageNum: this.pageNum, operName: this.input }
      );
      if (res.code != 200) return this.$message.error("数据获取失败");
      this.menuList = res.rows;
      this.total = res.total;
    },
    // 搜索
    dicSearch() {
      this.getLogList();
    },
    // 分页
    handleSizeChange(newSize) {
      this.pageSize = newSize;
      this.getLogList();
    },
    handleCurrentChangev(newPage) {
      this.pageNum = newPage;
      this.getLogList();
    },
    // 转换时间格式
    timesChangeDate(times) {
      var date = new Date(times);
      var y = date.getFullYear();
      var mon = date.getMonth() + 1;
      var d = date.getDate();
      var h = date.getHours();
      var m = date.getMinutes();
      var s = date.getSeconds();
      if (mon < 10) {
        mon = "0" + mon;
      }
      if (d < 10) {
        d = "0" + d;
      }
      if (h < 10) {
        h = "0" + h;
      }
      if (m < 10) {
        m = "0" + m;
      }
      if (s < 10) {
        s = "0" + s;
      }
      return `${y}-${mon}-${d} ${h}:${m}:${s}`;
    },
    // 实现表格单行选择高亮
    setCurrent(row) {
      this.$refs.singleTable.setCurrentRow(row);
    },
    handleCurrentChange(val) {
      this.currentRow = val;
    }
  }
};
</script>
<style lang='less' scoped>
</style>