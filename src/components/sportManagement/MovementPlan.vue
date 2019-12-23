<template>
  <div>
    <!-- 卡片视图 -->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="7">
          <el-input
            placeholder="请输入内容"
            @keyup.13.native="movemenPlanSearch"
            v-model="input"
            clearable
          >
            <el-button slot="append" icon="el-icon-search" @click="movemenPlanSearch"></el-button>
          </el-input>
        </el-col>
        <!-- 添加用户按钮 -->
        <el-col :span="4">
          <el-button type="primary" @click="addSportType">新增运动方案</el-button>
        </el-col>
      </el-row>
      <!-- 表格 -->
      <el-table
        tooltip-effect="dark"
        :data="movemenPlanList"
        ref="singleTable"
        highlight-current-row
        :header-cell-style="{background:'#f5f5f5'}"
        @current-change="handleCurrentChange"
        stripe
        style="width: 100%"
      >
        <el-table-column align="center" type="selection" width="60"></el-table-column>
        <el-table-column align="center" type="index" label="序号" width="60"></el-table-column>
        <el-table-column align="center" prop="name" label="名称"></el-table-column>
        <el-table-column align="center" prop="sportGroupNum" label="运动组数"></el-table-column>
        <el-table-column align="center" prop="sportGroupRange" label="运动范围"></el-table-column>
        <el-table-column align="center" show-overflow-tooltip prop="sportDescribe" label="描述"></el-table-column>
        <el-table-column align="center" prop="operate" label="操作" width="290">
          <template slot-scope="scope">
            <!-- 修改按钮 -->
            <el-button
              size="mini"
              @click="showEditdialog(scope.row)"
              type="primary"
              icon="el-icon-edit"
            >编辑</el-button>
            <!-- 运动介绍 -->
            <el-button
              size="mini"
              @click="movementInfo(scope.row)"
              type="success"
              icon="el-icon-s-unfold"
            >运动介绍</el-button>
            <!-- 删除按钮 -->
            <el-button
              size="mini"
              @click="removeUserById(scope.row.id)"
              type="danger"
              icon="el-icon-delete"
            >删除</el-button>
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
      <!-- 修改页面 -->
      <el-dialog
        :title="dialogTitle"
        :visible.sync="editDialogVisible"
        width="40%"
        @closed="editDialogClosed"
        v-dialogDrag
      >
        <el-form :model="editForm" ref="editFormRef" label-width="80px">
          <el-form-item label="方案名称" prop="name">
            <el-input v-model="editForm.name"></el-input>
          </el-form-item>
          <el-form-item label="运动组数" prop="sportGroupNum">
            <el-input v-model="editForm.sportGroupNum"></el-input>
          </el-form-item>
          <el-form-item label="运动范围" prop="sportGroupRange">
            <el-input v-model="editForm.sportGroupRange"></el-input>
          </el-form-item>
          <el-form-item label="描述" prop="sportDescribe">
            <el-input v-model="editForm.sportDescribe"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editEnter">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>
<script>
export default {
  data() {
    return {
      input: "",
      movemenPlanList: [],
      pageSize: 10,
      pageNum: 1,
      total: 0,
      editDialogVisible: false,
      editForm: {
        name: "",
        sportGroupNum: "",
        sportGroupRange: "",
        sportDescribe: ""
      },
      id: 0,
      dialogTitle: "",
      currentRow: null
    };
  },
  created() {
    this.getMovemenPlanList();
  },
  methods: {
    async getMovemenPlanList() {
      const { data: res } = await this.$http.post(
        "sportPlan/getPSportPlanList.do",
        { pageSize: this.pageSize, pageNum: this.pageNum, name: this.input }
      );
      this.movemenPlanList = res.rows;
      this.total = res.total;
    },
    // 分页
    handleSizeChange(newSize) {
      this.pageSize = newSize;
      this.getMovemenPlanList();
    },
    handleCurrentChangev(newPage) {
      this.pageNum = newPage;
      this.getMovemenPlanList();
    },
    // 修改
    showEditdialog(info) {
      this.dialogTitle = "修改";
      this.id = info.id;
      this.editForm = JSON.parse(JSON.stringify(info));
      this.editDialogVisible = true;
    },
    editDialogClosed() {
      this.$refs.editFormRef.resetFields();
    },
    editEnter() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return this.$message.error("失败");
        let httpUrl = "";
        let parm = {};
        if (this.dialogTitle == "修改") {
          httpUrl = "sportPlan/updatePSportPlan.do";
          parm = {
            id: this.id,
            name: this.editForm.name,
            sportGroupNum: this.editForm.sportGroupNum,
            sportGroupRange: this.editForm.sportGroupRange,
            sportDescribe: this.editForm.sportDescribe
          };
        } else {
          httpUrl = "sportPlan/savePSportPlan.do";
          parm = {
            name: this.editForm.name,
            sportGroupNum: this.editForm.sportGroupNum,
            sportGroupRange: this.editForm.sportGroupRange,
            sportDescribe: this.editForm.sportDescribe
          };
        }
        const { data: res } = await this.$http.post(httpUrl, parm);
        if (res.code != 200) return this.$message.error(res.msg);
        console.log(res);
        this.$message.success(res.msg);
        this.getMovemenPlanList();
        this.editDialogVisible = false;
      });
    },
    // 搜索
    movemenPlanSearch() {
      this.getMovemenPlanList();
    },
    // 删除
    async removeUserById(info) {
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
        "sportPlan/delPSportPlan.do",
        {
          id: info
        }
      );
      if (res.code == 200) {
        this.$message.success("删除成功");
        this.getMovemenPlanList();
      } else {
        this.$message.error("删除失败");
        return;
      }
    },
    addSportType() {
      this.dialogTitle = "新增";
      this.editForm = {};
      this.editDialogVisible = true;
    },
    // 跳转到运动介绍
    movementInfo(info) {
      console.log(info);

      window.sessionStorage.setItem("movementVal", info.id);
      this.$router.push("/sport/MovementIntroduced");
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
.avatar-uploader .el-upload {
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader-icon:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  display: block;
  font-size: 28px;
  color: #8c939d;
  width: 80px;
  height: 80px;
  line-height: 80px;
  text-align: center;
  border: 1px dashed #ccc;
}
.avatar {
  width: 60px;
  height: 80px;
  display: block;
}
</style>