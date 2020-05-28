<template>
  <div>
    <el-row :gutter="24">
      <!-- 添加用户按钮 -->
      <div :span="4" style="text-align:right">
        <el-button
          type="info"
          plain
          @click.prevent.stop="addDivisor"
          icon="el-icon-circle-plus-outline"
          size="mini"
          style="margin-right:15px"
        >新增因子</el-button>
      </div>
    </el-row>
    <!-- 调用公用表格组件 -->
    <EleTable :data="userList" :header="tableHeaderBig" row-key="id">
      <el-table-column align="center" slot="fixed" fixed="right" label="操作" width="300">
        <template slot-scope="scope">
          <!-- 修改按钮 -->
          <el-button
            size="mini"
            @click="showEditdialog(scope.row)"
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
          <el-button
            size="mini"
            @click="addDiviSuggess(scope.row)"
            type="success"
            icon="el-icon-edit"
          >因子建议</el-button>
        </template>
      </el-table-column>
    </EleTable>
    <!-- 增改页面 -->
    <el-dialog
      :title="infoTitle"
      :visible.sync="editDialogVisible"
      width="50%"
      :modal="false"
      v-dialogDrag
      @close="editDialogClosed"
    >
      <el-form ref="loginFormRef" :model="editAddForm" label-width="80px">
        <el-form-item label="因子名称" prop="facName">
          <el-input v-model="editAddForm.facName"></el-input>
        </el-form-item>
        <el-form-item label="关联题目" prop="facQues">
          <el-input v-model="editAddForm.facQues"></el-input>
        </el-form-item>
        <el-form-item label="计分方式" prop="facCalc">
          <el-input v-model="editAddForm.facCalc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editPageEnter">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import EleTable from "../../commonModule/table";
export default {
  components: { EleTable },
  data() {
    return {
      tableHeaderBig: [
        { label: "序号", type: "index", width: 60 },
        { prop: "facName", label: "因子名称" },
        { prop: "facQues", label: "关联题目" },
        { prop: "facCalc", label: "计分方式" }
      ],
      userList: [],
      sheetUuid: "",
      infoTitle: "",
      editDialogVisible: false,
      editAddForm: {
        facName: "",
        facQues: "",
        facCalc: ""
      },
      editId: null
    };
  },
  created() {
    this.sheetUuid = JSON.parse(window.localStorage.getItem("sheetUuid")).uuid;
    this.getFactorList();
  },
  methods: {
    //   获取因子列表
    async getFactorList() {
      const { data: res } = await this.$http.post(
        this.$ajax + "sheet/factorList ",
        { sheetUuid: this.sheetUuid }
      );
      this.userList = res.rows;
      console.log(res.rows);
    },
    //   添加因子
    addDivisor() {
      this.editAddForm = {};
      this.editDialogVisible = true;
      this.infoTitle = "新增因子";
    },
    editPageEnter() {
      let httpUrl = "";
      let parm = {};
      if (this.infoTitle == "修改因子") {
        httpUrl = "sheet/updateFactor";
        parm = {
          id: this.editId,
          sheetUuid: this.sheetUuid,
          facName: this.editAddForm.facName,
          facQues: this.editAddForm.facQues,
          facCalc: this.editAddForm.facCalc
        };
      } else {
        httpUrl = "sheet/addFactor";
        parm = {
          sheetUuid: this.sheetUuid,
          facName: this.editAddForm.facName,
          facQues: this.editAddForm.facQues,
          facCalc: this.editAddForm.facCalc
        };
      }
      this.$refs.loginFormRef.validate(async valid => {
        if (!valid) return;
        const { data: res } = await this.$http.post(this.$ajax + httpUrl, parm);
        if (res.code != 200) return this.$message.error(res.msg);
        this.editDialogVisible = false;
        this.getFactorList();
      });
    },
    // 编辑因子
    showEditdialog(info) {
      this.editAddForm = JSON.parse(JSON.stringify(info));
      this.editId = info.id;
      this.infoTitle = "修改因子";
      this.editDialogVisible = true;
    },
    // 关联因子建议
    addDiviSuggess(info) {
      this.$router.push({
        path: "sheet/DivisorSetSugg",
        query: { id: info.id }
      });
    },
    // 删除因子
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
        this.$ajax + "sheet/removeFactor",
        { id: info.id }
      );
      if (res.code != 200) return this.$message.error("删除失败");
      this.$message.success("删除成功");
      this.getFactorList();
    },
    editDialogClosed() {}
  }
};
</script>
<style lang='less' scoped>
</style>