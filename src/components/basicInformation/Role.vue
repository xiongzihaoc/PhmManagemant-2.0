<template>
  <div>
    <!-- 卡片视图 -->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="7">
          <el-input placeholder="请输入内容" v-model="input" @keyup.13.native="Foodsearch" clearable>
            <el-button slot="append" icon="el-icon-search" @click="Foodsearch"></el-button>
          </el-input>
        </el-col>
        <!-- 添加食物按钮 -->
        <el-col :span="4">
          <el-button type="primary" @click="addFoodType">新增角色</el-button>
        </el-col>
      </el-row>
      <!-- 表格 -->
      <el-table
        :data="RoleList"
        ref="singleTable"
        highlight-current-row
        @current-change="handleCurrentChange"
        stripe
        :header-cell-style="{background:'#f5f5f5'}"
        style="width: 100%"
      >
        <el-table-column align="center" type="selection" width="60"></el-table-column>
        <el-table-column align="center" prop="roleId" label="序号" width="60"></el-table-column>
        <el-table-column align="center" prop="roleName" label="角色"></el-table-column>
        <el-table-column align="center" prop="status" label="状态">
          <!-- 作用域插槽 -->
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.status"
              active-color="#409167"
              inactive-color="#ccc"
              active-value="0"
              inactive-value="1"
              @change="userStateChanged(scope.row)"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="operate" label="操作" width="140">
          <template slot-scope="scope">
            <!-- 修改按钮 -->
            <el-button
              size="mini"
              @click="showEditdialog(scope.row)"
              type="primary"
              icon="el-icon-edit"
            >编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 修改页面 -->
      <el-dialog :title="dialogTitle" :visible.sync="editAddDialogVisible" width="40%" v-dialogDrag>
        <el-form
          :model="AddEditForm"
          ref="editFormRef"
          label-width="80px"
          @closed="editAddDialogClosed"
        >
          <el-form-item label="角色" prop="roleName">
            <el-input v-model="AddEditForm.roleName"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editAddDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="AddEdit">确 定</el-button>
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
      RoleList: [],
      editAddDialogVisible: false,
      dialogTitle: "",
      AddEditForm: {
        roleName: ""
      },
      id: "",
      currentRow: null
    };
  },
  created() {
    this.getRoleList();
  },
  methods: {
    // 获取列表
    async getRoleList() {
      const { data: res } = await this.$http.post("role/getSysRoleList.do", {
        roleName: this.input
      });
      if (res.code != 200) return this.$message.error("列表获取失败");
      this.RoleList = res.rows;
    },
    // 弹框
    showEditdialog(info) {
      this.AddEditForm =  JSON.parse(JSON.stringify(info));;
      this.dialogTitle = "修改";
      this.id = info.roleId;
      this.editAddDialogVisible = true;
    },
    // 添加
    addFoodType() {
      this.dialogTitle = "新增";
      this.AddEditForm = {};
      this.editAddDialogVisible = true;
    },
    editAddDialogClosed() {
      this.$refs.editFormRef.resetFields();
    },
    async AddEdit() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return this.$message.error("登录失败");
        let httpUrl = "";
        let parm = {};
        if (this.dialogTitle == "修改") {
          httpUrl = "role/updateSysRole.do";
          parm = {
            roleId: this.id,
            roleName: this.AddEditForm.roleName
          };
        } else {
          httpUrl = "role/saveSysRole.do";
          parm = {
            roleName: this.AddEditForm.roleName
          };
        }
        const { data: res } = await this.$http.post(httpUrl, parm);
        if (res.code != 200) return this.$message.error(res.msg);
        this.$message.success(res.msg);
        this.getRoleList();
        this.editAddDialogVisible = false;
      });
    },
    // 搜索
    Foodsearch() {
      this.getRoleList();
    },
    // 改变状态
    async userStateChanged(info) {
      const { data: res } = await this.$http.post("role/updateSysRole.do", {
        roleId: info.roleId,
        status: info.status
      });
      if (res.code != 200) {
        info.status = !info.status;
        return this.$message.error("更新用户状态失败");
      }
      this.$message.success("更新用户状态成功");
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