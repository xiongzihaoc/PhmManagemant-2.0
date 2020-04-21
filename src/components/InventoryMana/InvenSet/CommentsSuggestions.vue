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
        { prop: "comment", label: "评语" },
        { prop: "advice", label: "建议", width: 100 },
        { prop: "scoreCron", label: "分数表达式" }
      ],
      sheetUuid: "",
      userList: []
    };
  },
  created() {
    this.sheetUuid = window.localStorage.getItem("sheetUuid");
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
      var obj = {};
      res.rows.forEach(item => {
        obj = {
          comment: item.comment,
          advice: item.advice.slice(0, 50),
          scoreCron: item.scoreCron
        };
        this.userList.push(obj);
      });
    },
    // 编辑
    Editdialog() {
      this.$router.push({ path: "editAdvice" });
    },
    // 新增
    jumpSuss() {
      this.$router.push({ path: "addAdvice" });
    },
    // 删除
    delEditdialog() {}
  }
};
</script>
<style lang='less'>
</style>