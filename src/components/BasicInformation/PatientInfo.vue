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
          <el-button type="primary" @click="addUsers">新增患者信息</el-button>
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
        <!-- <el-table-column align="center" type="selection" width="60"></el-table-column> -->
        <el-table-column align="center" type="index" label="序号" width="60"></el-table-column>
        <el-table-column align="center" prop="name" label="姓名"></el-table-column>
        <el-table-column align="center" prop="gender" label="性别"></el-table-column>
        <el-table-column align="center" prop="phone" label="手机号" width="110"></el-table-column>
        <el-table-column align="center" prop="birthday" label="出生日期">
          <template slot-scope="scope">
            <div>{{timesChangeDate(scope.row.birthday)}}</div>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="height" label="身高(cm)"></el-table-column>
        <el-table-column align="center" prop="weight" label="体重(kg)"></el-table-column>
        <el-table-column align="center" prop="culture" label="文化程度"></el-table-column>
        <el-table-column align="center" prop="job" label="职业"></el-table-column>
        <el-table-column align="center" prop="marriage" label="婚姻状况"></el-table-column>
        <el-table-column align="center" prop="address" label="家庭住址" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" prop="appStatus" label="激活app" :formatter="ifendcase">
          <template slot-scope="scope">
            <span style="color:#13ce66;font-weight:700;" v-if="scope.row.appStatus == '1'">{{ ifendcase(scope.row) }}</span>
            <span v-else style="color:#ff4949;font-weight:700;">{{ ifendcase(scope.row) }}</span>
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
    <el-dialog title="修改信息" :visible.sync="editDialogVisible" width="40%" v-dialogDrag>
      <el-form
        :rules="addFormRules"
        ref="editFormRef"
        :model="editForm"
        label-width="80px"
        @closed="editDialogClosed"
      >
        <el-form-item label="用户名" prop="userName">
          <el-input v-model="editForm.userName"></el-input>
        </el-form-item>
        <el-form-item label="登录名" prop="loginName">
          <el-input v-model="editForm.loginName" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="userPhone">
          <el-input v-model="editForm.userPhone"></el-input>
        </el-form-item>
        <!-- <el-form-item label="部门" prop="deptName">
          <el-input v-model="EditValue" @click.native="deptEdit"></el-input>
        </el-form-item>-->
        <el-form-item label="角色" prop="roleName">
          <el-select v-model="editForm.roleId" placeholder="请选择">
            <el-option
              v-for="item in RoleList"
              :key="item.roleId"
              :label="item.roleName"
              :value="item.roleId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="editForm.status" placeholder="请选择">
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
    <!-- 添加页面 -->
    <el-dialog title="新增用戶" :visible.sync="addDialogVisible" width="40%" v-dialogDrag>
      <el-form
        :rules="addFormRules"
        ref="addFormRef"
        :model="addForm"
        label-width="80px"
        @closed="addDialogClosed"
      >
        <el-form-item label="用户名" prop="userName">
          <el-input v-model="addForm.userName"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="登录名" prop="loginName">
          <el-input v-model="addForm.loginName"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="userPhone">
          <el-input v-model="addForm.userPhone"></el-input>
        </el-form-item>
        <!-- <el-form-item label="部门" prop="deptName">
          <el-input v-model="addValue" @click.native="deptAdd"></el-input>
        </el-form-item>-->
        <el-form-item label="角色" prop="roleName">
          <el-select v-model="addForm.roleId" placeholder="请选择">
            <el-option
              v-for="item in RoleList"
              :key="item.roleId"
              :label="item.roleName"
              :value="item.roleId"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addEnter">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    var checkEmaile = (rule, value, cb) => {
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/;
      if (regEmail.test(value)) {
        return cb();
      }
      return cb(new Error("请输入合法的邮箱"));
    };
    var checkMobile = (rule, value, cb) => {
      const regMoblie = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;
      if (regMoblie.test(value)) {
        return cb();
      }
      return cb(new Error("请输入合法的手机号"));
    };
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
      editForm: {
        userName: "",
        email: "",
        userPhone: "",
        roleId: null,
        deptId: null,
        status: 0
      },
      addDialogVisible: false,
      // 新增
      addForm: {
        userName: "",
        email: "",
        userPhone: "",
        loginName: "",
        password: "",
        roleId: null,
        deptId: null
      },
      editId: 0,
      addTransit: "",
      addValue: "",
      // 部门增加
      addDeptForm: {},
      addDeptDialogVisible: false,
      idArr: [],
      defaultProps: {
        label: "deptName",
        children: "child",
        value: "id"
      },
      // 部门修改
      editTransit: "",
      EditValue: "",
      DeptEditForm: {},
      DeptEditDialogVisible: false,
      RoleList: [],
      hosMenuList: [],
      addFormRules: {
        userName: [
          { required: true, message: "请输入用户", trigger: "blur" },
          { min: 2, max: 10, message: "长度在 2 到 10 个字符", trigger: "blur" }
        ],
        loginName: [
          { required: true, message: "请输入登录名", trigger: "blur" },
          { min: 2, max: 10, message: "长度在 2 到 10 个字符", trigger: "blur" }
        ],
        userPassword: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 2, max: 10, message: "长度在 2 到 10 个字符", trigger: "blur" }
        ],
        userEmail: [
          { required: true, message: "邮箱不能为空", trigger: "blur" },
          { validator: checkEmaile, trigger: "blur" }
        ],
        userPhone: [
          { required: true, message: "手机号不能为空", trigger: "blur" },
          { validator: checkMobile, trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getUserList();
    // this.getHosMenuList();
  },

  methods: {
    // 获取用户列表
    async getUserList() {
      const { data: res } = await this.$http.post("patient/getPatientList", {
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
    // 分页
    handleSizeChange(newSize) {
      this.pageSize = newSize;
      this.getUserList();
    },
    handleCurrentChangev(newPage) {
      this.pageNum = newPage;
      this.getUserList();
    },

    // 修改
    showEditdialog(info) {
      this.editId = info.userId;
      this.editForm = JSON.parse(JSON.stringify(info));
      this.editDialogVisible = true;
      this.EditValue = info.deptName;
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
      this.addDialogVisible = true;
      this.addForm = {};
    },
    async addEnter() {
      const { data: res } = await this.$http.post("user/add", {
        userName: this.addForm.userName,
        email: this.addForm.email,
        loginName: this.addForm.loginName,
        userPhone: this.addForm.userPhone,
        password: this.$md5(this.addForm.password),
        roleId: this.addForm.roleId,
        deptId: this.addForm.deptId
      });
      this.addDialogVisible = false;
      this.getUserList();
    },
    addDialogClosed() {
      // this.$refs.addFormRef.resetFields();
    },
    // 部门新增
    deptAdd() {
      this.addDeptDialogVisible = true;
    },
    addDeptDialogClosed() {
      this.$refs.addFormRef.resetFields();
    },
    addDeptEnter() {
      this.addDeptDialogVisible = false;
      this.addValue = this.addTransit;
    },
    handleNodeAddClick(val) {
      this.addTransit = val.deptName;
      this.addForm.deptId = val.id;
    },
    // 部门修改
    deptEdit() {
      this.DeptEditDialogVisible = true;
    },
    DeptEditEnter() {
      this.DeptEditDialogVisible = false;
      this.EditValue = this.editTransit;
    },
    editDeptDialogClosed() {
      this.$refs.addFormRef.resetFields();
    },
    handleNodeEditClick(val) {
      this.editTransit = val.deptName;
      this.editForm.deptId = val.id;
    },
    // 状态码数字转中文
    ifendcase(val) {
      if (val.appStatus == "1") {
        return "已激活";
      } else {
        return "未激活";
      }
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
