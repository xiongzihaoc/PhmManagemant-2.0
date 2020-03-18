<template>
  <div>
    <el-row :gutter="24">
      <!-- 添加用户按钮 -->
      <el-col :span="4">
        <el-button
          type="primary"
          @click="addDivisor"
          icon="el-icon-circle-plus-outline"
          size="mini"
        >新增因子</el-button>
      </el-col>
    </el-row>
    <el-table stripe ref="singleTable" :data="userList" style="width: 100%">
      <el-table-column align="center" type="index" label="序号" width="60"></el-table-column>
      <el-table-column align="center" prop="facName" label="因子名称"></el-table-column>
      <el-table-column align="center" prop="facQues" label="关联题目"></el-table-column>
      <el-table-column align="center" prop="facCalc" label="计分方式"></el-table-column>
      <el-table-column align="center" prop="align" label="操作" width="180">
        <template slot-scope="scope">
          <!-- 修改按钮 -->
          <el-button
            size="mini"
            @click="showEditdialog(scope.row)"
            type="primary"
            icon="el-icon-edit"
          >编辑</el-button>
          <el-button
            size="mini"
            @click="delEditdialog(scope.row)"
            type="danger"
            icon="el-icon-edit"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 增改页面 -->
    <el-dialog
      :title="infoTitle"
      :visible.sync="editDialogVisible"
      width="40%"
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
export default {
  data() {
    return {
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
    var Uuid = window.localStorage.getItem("sheetUuid");
    this.sheetUuid = Uuid;
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
      this.editDialogVisible = true;
      this.infoTitle = "新增因子";
    },
    editPageEnter() {
      let httpUrl = "";
      let parm = {};
      if (this.infoTitle == "修改因子") {
        httpUrl = "hospital/updateHospitalDetail";
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
        // if (res.code != 200) return this.$message.error(res.msg);
        console.log(res);

        this.editDialogVisible = false;
      });
    },
    // 编辑因子
    showEditdialog(info) {
      this.editId = info.id;
      this.infoTitle = "修改因子";
      this.editDialogVisible = true;
    },
    // 删除因子
    delEditdialog() {},
    editDialogClosed() {}
  }
};
</script>
<style lang='less'>
</style>