<template>
  <div style="height:100%">
    <el-card>
      <el-row :gutter="20">
        <el-col :span="7">
          <el-input placeholder="请输入内容" v-model="input" @keyup.13.native="systemSearch" clearable>
            <el-button slot="append" icon="el-icon-search" @click="systemSearch"></el-button>
          </el-input>
        </el-col>
        <!-- 添加用户按钮 -->
        <el-col :span="4">
          <el-button type="primary" @click="addUsers">新增因子建议</el-button>
        </el-col>
      </el-row>
      <!-- 调用公用表格组件 -->
      <EleTable :data="userList" :header="tableHeaderBig" row-key="id">
        <el-table-column align="center" slot="fixed" fixed="right" label="操作" width="220">
          <template slot-scope="scope">
            <!-- 修改按钮 -->
            <el-button
              size="mini"
              @click="showEditdialog(scope.row)"
              type="primary"
              icon="el-icon-edit"
            >编辑</el-button>
            <!-- 删除按钮 -->
            <el-button
              size="mini"
              @click="removeById(scope.row)"
              type="danger"
              icon="el-icon-delete"
            >删除</el-button>
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
        <el-form ref="loginFormRef" :model="editAddForm" label-width="120px">
          <el-form-item label="建议" prop="advice">
            <el-input v-model="editAddForm.advice"></el-input>
          </el-form-item>
          <el-form-item label="评语" prop="comment">
            <el-input v-model="editAddForm.comment"></el-input>
          </el-form-item>
          <el-form-item label="分数表达式" prop="scoreCron">
            <el-input v-model="editAddForm.scoreCron"></el-input>
          </el-form-item>
          <el-form-item label="等级" prop="level">
            <el-select v-model="editAddForm.level" placeholder="请选择">
              <el-option label="轻度" value="轻度"></el-option>
              <el-option label="中度" value="中度"></el-option>
              <el-option label="重度" value="重度"></el-option>
              <el-option label="阴性" value="阴性"></el-option>
              <el-option label="阳性" value="阳性"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editPageEnter">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>
<script>
import EleTable from "../../commonModule/table";
export default {
  components: { EleTable },
  data() {
    return {
      factorId: "",
      infoTitle: "",
      tableHeaderBig: [
        { prop: "advice", label: "建议" },
        { prop: "comment", label: "评语" },
        { prop: "level", label: "等级" },
        { prop: "scoreCron", label: "分数表达式" }
      ],
      userList: [],
      input: "",
      editAddForm: {
        advice: "",
        comment: "",
        level: "",
        scoreCron: ""
      },
      editId: "",
      editDialogVisible: false
    };
  },
  created() {
    this.factorId = this.$route.query.id;
    this.getDiviList();
  },
  methods: {
    // 获取列表
    async getDiviList() {
      const { data: res } = await this.$http.post(
        this.$ajax + "sheet/factorAdviceList",
        {
          factorId: this.factorId
        }
      );
      this.userList = res.rows;
    },
    // 修改
    showEditdialog(info) {
      this.editAddForm = JSON.parse(JSON.stringify(info));
      this.editDialogVisible = true;
      this.editId = info.id;
      this.infoTitle = "修改";
    },
    // 增加
    addUsers() {
      this.editAddForm = {};
      this.editDialogVisible = true;
      this.infoTitle = "新增";
    },
    // 删除
    async removeById(info) {
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
        this.$ajax + "sheet/delFactorAdvice",
        { id: info.id }
      );
      if (res.code != 200) return this.$message.error("删除失败");
      this.$message.success("删除成功");
      this.getDiviList();
    },
    editPageEnter() {
      let httpUrl = "";
      let parm = {};
      if (this.infoTitle == "修改") {
        httpUrl = "sheet/updateFactorAdvice";
        parm = {
          id: this.editId,
          advice: this.editAddForm.advice,
          comment: this.editAddForm.comment,
          level: this.editAddForm.level,
          scoreCron: this.editAddForm.scoreCron
        };
      } else {
        httpUrl = "sheet/addFactorAdvice";
        parm = {
          factorId: this.factorId,
          advice: this.editAddForm.advice,
          comment: this.editAddForm.comment,
          level: this.editAddForm.level,
          scoreCron: this.editAddForm.scoreCron
        };
      }
      this.$refs.loginFormRef.validate(async valid => {
        if (!valid) return;
        const { data: res } = await this.$http.post(this.$ajax + httpUrl, parm);
        if (res.code != 200) return this.$message.error(res.msg);
        this.editDialogVisible = false;
        this.getDiviList();
      });
    },
    editDialogClosed() {
      this.editAddForm = {};
    },
    // 搜索
    systemSearch() {}
  }
};
</script>
<style scoped>
</style>