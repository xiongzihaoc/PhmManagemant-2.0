<template>
  <div>
    <!-- 卡片视图 -->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="7">
          <el-input placeholder="请输入内容" v-model="input" @keyup.13.native="systemSearch" clearable>
            <el-button slot="append" icon="el-icon-search" @click="systemSearch"></el-button>
          </el-input>
        </el-col>
        <!-- 添加用户按钮 -->
        <el-col :span="4">
          <el-button type="primary" @click="addUsers">新增体检卡信息</el-button>
        </el-col>
      </el-row>
      <!-- 表格 -->
      <el-table
        stripe
        ref="singleTable"
        tooltip-effect="dark"
        :data="userList"
        :header-cell-style="{background:'#f5f5f5'}"
        style="width: 100%"
      >
        <el-table-column align="center" type="selection" width="60"></el-table-column>
        <el-table-column align="center" type="index" label="序号" width="60"></el-table-column>
        <el-table-column align="center" prop="name" label="患者姓名"></el-table-column>
        <el-table-column align="center" prop="phone" label="手机号"></el-table-column>
        <el-table-column align="center" prop="batchName" label="批次名称"></el-table-column>
        <el-table-column align="center" prop="officeCode" label="科室code"></el-table-column>
        <el-table-column align="center" prop="cardNum" label="检测卡号"></el-table-column>
        <el-table-column align="center" prop="cardType" label="检测卡类型"></el-table-column>
        <el-table-column align="center" prop="medicalStatus" label="是否检测" :formatter="ifendcase">
          <template slot-scope="scope">
            <span
              style="color:#13ce66"
              v-if="scope.row.medicalStatus=== '1'"
            >{{ ifendcase(scope.row) }}</span>
            <span v-else style="color:#ff4949">{{ ifendcase(scope.row) }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="operate" label="操作" width="180">
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
              @click="removeUserById(scope.row.acId)"
              type="danger"
              icon="el-icon-delete"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
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
    <!-- 修改页面 -->
    <el-dialog :title="infoTitle" :visible.sync="editDialogVisible" width="40%" v-dialogDrag>
      <el-form ref="editFormRef" :model="editAddForm" label-width="80px" @closed="editDialogClosed">
        <el-form-item label="患者姓名" prop="name" v-if="this.infoTitle != '新增体检卡信息'" v-show="true">
          <el-input v-model="editAddForm.name"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="phone" v-if="this.infoTitle != '新增体检卡信息'" v-show="true">
          <el-input v-model="editAddForm.phone"></el-input>
        </el-form-item>
        <el-form-item label="批次名称" prop="batchName">
          <el-input v-model="editAddForm.batchName"></el-input>
        </el-form-item>
        <el-form-item label="科室code" prop="officeCode">
          <el-input v-model="editAddForm.officeCode"></el-input>
        </el-form-item>
        <el-form-item label="检测卡号" prop="cardNum">
          <el-input v-model="editAddForm.cardNum"></el-input>
        </el-form-item>
        <el-form-item label="检测卡类型" prop="cardType">
          <el-input v-model="editAddForm.cardType"></el-input>
        </el-form-item>
        <el-form-item label="是否检测" prop="medicalStatus">
          <el-input v-model="editAddForm.medicalStatus"></el-input>
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
      input: "",
      userList: [],
      // 获取用户列表的参数对象
      pageSize: 10,
      pageNum: 1,
      total: 0,
      currentRow: null,
      editDialogVisible: false,
      // 修改
      editAddForm: {
        userName: "",
        email: "",
        userPhone: "",
        roleId: null,
        deptId: null,
        status: 0
      },
      infoTitle: "",
      editId: 0,
      addTransit: "",
      addValue: "",
      RoleList: [],
      hosMenuList: []
    };
  },
  created() {
    this.getUserList();
    // this.getHosMenuList();
  },

  methods: {
    // 获取用户列表
    async getUserList() {
      const { data: res } = await this.$http.post("medical/getMedicalList", {
        pageSize: this.pageSize,
        pageNum: this.pageNum
      });
      if (res.code != 200) return this.$message.error("数获取失败");
      console.log(res);

      this.userList = res.rows;
      this.total = res.total;
    },

    // 修改
    showEditdialog(info) {
      this.infoTitle = "修改信息";
      this.editDialogVisible = true;
    },
    editDialogClosed() {
      this.$refs.editFormRef.resetFields();
    },
    async editPageEnter() {
      const { data: res } = await this.$http.post("user/update", {
        userId: this.editId,
        roleId: this.editForm.roleId,
        deptId: this.editForm.deptId,
        userName: this.editForm.userName,
        email: this.editForm.email,
        userPhone: this.editForm.userPhone,
        status: this.editForm.status
      });
      if (res.code != 200) {
        return this.$message.error("修改用户信息失败");
      } else {
        this.$message.success("修改用户成功");
        this.editDialogVisible = false;
        this.getUserList();
      }
    },
    // 删除
    async removeUserById(id) {
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
      const { data: res } = await this.$http.get(
        "user/delSysUser.do?acId=" + id
      );
      if (res.code != 200) return this.$message.error("删除失败");
      this.$message.success("删除成功");
      this.getUserList();
    },
    // 搜索
    systemSearch() {
      this.getUserList();
    },
    // 添加用户
    addUsers() {
      this.infoTitle = "新增体检卡信息";
      this.editDialogVisible = true;
    },
    // 状态码数字转中文
    ifendcase(val) {
      if (val.medicalStatus == "1") {
        return "是";
      } else {
        return "否";
      }
    },
    // 分页
    handleSizeChange(newSize) {
      this.pageSize = newSize;
      this.getUserList();
    },
    handleCurrentChangev(newPage) {
      this.pageNum = newPage;
      this.getUserList();
    },

    timesChangeDate(times) {
      var da = new Date(times);
      var year = da.getFullYear();
      var month = da.getMonth() + 1;
      var date = da.getDate();
      return [year, month, date].join("-");
    },
    handleAvatarSuccess(res, file) {
      this.imageUrl = res.data;
      this.editForm.fdPhotoPath = res.data;
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isGIF = file.type === "image/gif";
      const isPNG = file.type === "image/png";
      const isBMP = file.type === "image/bmp";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG && !isGIF && !isPNG && !isBMP) {
        this.common.errorTip("上传图片必须是JPG/GIF/PNG/BMP 格式!");
      }
      if (!isLt2M) {
        this.common.errorTip("上传图片大小不能超过 2MB!");
      }
      return (isJPG || isBMP || isGIF || isPNG) && isLt2M;
    }
  }
};
</script>
<style scoped>
.mytree /deep/ .el-tree > .el-tree-node:after {
  border-top: none;
  border-left: none;
}
.tree /deep/ .el-tree-node {
  position: relative;
  padding-left: 16px;
  font-weight: 700;
  color: #333;
}

.tree /deep/ .el-tree-node__children {
  padding-left: 16px;
}

.tree /deep/ .el-tree-node :last-child:before {
  height: 38px;
  color: #409eff;
}
.tree /deep/ .el-tree-node :first-child:before {
  color: #409eff;
}

.tree /deep/ .el-tree > .el-tree-node:before {
  border-left: none !important;
}

.mytree /deep/ .el-tree > .el-tree-node:after {
  border-top: none;
}

.tree /deep/ .el-tree-node:before {
  content: "";
  left: -4px;
  position: absolute;
  right: auto;
}

.tree /deep/ .el-tree-node:after {
  content: "";
  left: -4px;
  position: absolute;
  right: auto;
  border-width: 1px;
}

.tree /deep/ .el-tree-node:before {
  border-left: 1px solid #ccc;
  bottom: 0px;
  height: 100%;
  top: -26px;
  width: 1px;
}

.tree /deep/ .el-tree-node:after {
  border-top: 1px solid #ccc;
  height: 20px;
  top: 12px;
  width: 24px;
}

.mytree {
  overflow: hidden;
}
</style>
