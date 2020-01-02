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
          <el-button type="primary" @click="addUsers">新增医生信息</el-button>
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
        <!-- <el-table-column align="center" prop="userId" label="序号" width="60"></el-table-column> -->
        <el-table-column align="center" prop="name" label="姓名"></el-table-column>
        <el-table-column align="center" prop="gender" label="性别"></el-table-column>
        <el-table-column align="center" prop="title" label="职位"></el-table-column>
        <el-table-column align="center" prop="dcDept" label="部门"></el-table-column>
        <el-table-column align="center" prop="phone" label="手机号"></el-table-column>
        <el-table-column align="center" prop="photoUrl" label="照片">
          <template slot-scope="scope">
            <img id="img" v-if="scope.row.logo != null " :src="scope.row.photoUrl" />
          </template>
        </el-table-column>
        <el-table-column align="center" prop="userName" label="登录名"></el-table-column>
        <el-table-column align="center" prop="introduction" label="简介" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" prop="status" label="状态" :formatter="ifendcase">
          <template slot-scope="scope">
            <span style="color:#13ce66" v-if="scope.row.status=== '1'">{{ ifendcase(scope.row) }}</span>
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
    <!-- 增改页面 -->
    <el-dialog :title="infoTitle" :visible.sync="editDialogVisible" width="40%" v-dialogDrag>
      <el-form ref="editFormRef" :model="editAddForm" label-width="80px" @closed="editDialogClosed">
        <el-form-item label="姓名" prop="name">
          <el-input v-model="editAddForm.name"></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="gender">
          <el-select v-model="editAddForm.gender" placeholder="请选择">
            <el-option label="男" value="男"></el-option>
            <el-option label="女" value="女"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="职位" prop="title">
          <el-input v-model="editAddForm.title"></el-input>
        </el-form-item>
        <el-form-item label="部门" prop="dcDept">
          <el-input v-model="editAddForm.dcDept"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="editAddForm.phone"></el-input>
        </el-form-item>
        <el-form-item label="登录名" prop="userName">
          <el-input v-model="editAddForm.userName" :disabled="isdisabled"></el-input>
        </el-form-item>
        <el-form-item label="简介" prop="introduction">
          <el-input v-model="editAddForm.introduction"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="status" v-if="infoTitle == '新增医生信息'" v-show="false">
          <el-select v-model="editAddForm.status" placeholder="请选择">
            <el-option label="启用" :value="'1'"></el-option>
            <el-option label="禁用" :value="'0'"></el-option>
          </el-select>
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
      isdisabled: false,
      infoTitle: "",
      editId: null,
      // 修改
      editAddForm: {
        name: "",
        gender: "",
        title: "",
        dcDept: "",
        phone: null,
        userName: "",
        introduction: "",
        status: ""
      },
      addDialogVisible: false,
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
      const { data: res } = await this.$http.post("doctor/getDoctorList", {
        pageSize: this.pageSize,
        pageNum: this.pageNum,
        userName: this.input
      });
      if (res.code != 200) return this.$message.error("数获取失败");
      console.log(res);
      this.userList = res.rows;
      this.total = res.total;
    },
    // // 获取部门列表
    // async getHosMenuList() {
    //   const { data: res } = await this.$http.post("dept/getDeptList.do", {});
    //   this.hosMenuList = res.data;
    //   this.idArr.push(res.data[0].id);
    // },
    // 修改
    showEditdialog(info) {
      console.log(info);
      this.infoTitle = "修改信息";
      this.isdisabled = true;
      this.editDialogVisible = true;
      this.editAddForm = JSON.parse(JSON.stringify(info));
      this.editId = info.id;
    },
    editDialogClosed() {
      this.$refs.editFormRef.resetFields();
    },
    async editPageEnter() {
      let httpUrl = "";
      let parm = {};
      if (this.infoTitle == "修改信息") {
        httpUrl = "doctor/updateDoctor";
        parm = {
          id: this.editId,
          name: this.editAddForm.name,
          gender: this.editAddForm.gender,
          title: this.editAddForm.title,
          phone: this.editAddForm.phone,
          dcDept: this.editAddForm.dcDept,
          introduction: this.editAddForm.introduction,
          status: this.editAddForm.status
        };
      } else {
        httpUrl = "doctor/saveDoctor";
        parm = {
          name: this.editAddForm.name,
          gender: this.editAddForm.gender,
          title: this.editAddForm.title,
          phone: this.editAddForm.phone,
          dcDept: this.editAddForm.dcDept,
          introduction: this.editAddForm.introduction,
          status: this.editAddForm.status
        };
      }
      const { data: res } = await this.$http.post(httpUrl, parm);
      if (res.code != 200) return this.$message.error(res.msg);
      this.$message.success(res.msg);
      this.getUserList();
      this.editDialogVisible = false;
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
      this.infoTitle = "新增医生信息";
      this.editDialogVisible = true;
      this.editAddForm = {};
    },
    // 状态码数字转中文
    ifendcase(val) {
      if (val.status == "1") {
        return "启用";
      } else {
        return "禁用";
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
