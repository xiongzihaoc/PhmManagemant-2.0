<template>
  <div>
    <el-row :gutter="24">
      <!-- 添加用户按钮 -->
      <div :span="4" style="text-align:right">
        <el-button
          type="primary"
          @click.prevent.stop="jumpSuss"
          icon="el-icon-circle-plus-outline"
          size="mini"
        >新增建议</el-button>
      </div>
    </el-row>
    <!-- 调用公用表格组件 -->
    <EleTable :data="userList" :header="tableHeaderBig" row-key="id">
      <el-table-column align="center" slot="fixed" fixed="right" prop="advice" label="建议">
        <template slot-scope="scope">{{(scope.row.advice).slice(0,5)}}</template>
      </el-table-column>
      <el-table-column align="center" slot="fixed" fixed="right" label="操作" width="180">
        <template slot-scope="scope">
          <!-- 修改按钮 -->
          <el-button
            size="mini"
            @click="Editdialog(scope.row)"
            type="primary"
            icon="el-icon-edit"
          >编辑</el-button>
          <!-- 修改按钮 -->
          <el-button
            size="mini"
            @click="delEditdialog(scope.row)"
            type="danger"
            icon="el-icon-edit"
          >删除</el-button>
          <!-- 跳转按钮 -->
        </template>
      </el-table-column>
    </EleTable>
  </div>
</template>

<script>
import EleTable from "../../commonModule/table";
export default {
  components: { EleTable },
  data() {
    return {
      tableHeaderBig: [
        { label: "序号", type: "index" ,width:60},
        { prop: "comment", label: "评语" },
        { prop: "scoreCron", label: "分数表达式" }
      ],
      sheetUuid: "",
      userList: []
    };
  },
  created() {
    this.sheetUuid = JSON.parse(window.localStorage.getItem("sheetUuid")).uuid;
    this.getInfoList();
  },
  methods: {
    //  获取评语建议列表
    async getInfoList() {
      const { data: res } = await this.$http.post(
        this.$ajax + "sheet/adviceCommentList",
        {
          sheetUuid: this.sheetUuid
        }
      );
      this.userList = res.rows;
    },
    // 编辑
    Editdialog(info) {
      console.log(info);
      this.$router.push({
        path: "editAdvice",
        query: { info: JSON.stringify(info) }
      });
    },
    // 新增
    jumpSuss() {
      this.$router.push({ path: "addAdvice" });
    },
    // 删除
    async delEditdialog(info) {
      const confirmResult = await this.$confirm(
        "你确定要执行此操作, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).catch(err => console.log(err));
      if (confirmResult != "confirm") {
        return this.$message.info("取消删除");
      }
      const { data: res } = await this.$http.post(
        this.$ajax + "sheet/delAdviceComment",
        {
          id: info.id
        }
      );
      if (res.code != 200) return this.$message.error("删除失败");
      this.$message.success("删除成功");
      this.getInfoList();
    }
  }
};
</script>
<style lang='less'>
</style>