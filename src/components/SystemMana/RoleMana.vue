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
        <!-- 添加角色按钮 -->
        <el-col :span="4">
          <el-button type="primary" @click="addFoodType">新增角色</el-button>
        </el-col>
      </el-row>
      <!-- 表格 -->
      <el-table
        :data="RoleList"
        ref="singleTable"
        stripe
        :header-cell-style="{background:'#f5f5f5'}"
        style="width: 100%"
      >
        <el-table-column align="center" type="selection" width="60"></el-table-column>
        <el-table-column align="center" prop="roleId" label="序号" width="60"></el-table-column>
        <el-table-column align="center" prop="roleName" label="角色"></el-table-column>
        <el-table-column align="center" prop="operate" label="操作" width="220">
          <template slot-scope="scope">
            <!-- 修改按钮 -->
            <el-button
              size="mini"
              @click="showEditdialog(scope.row)"
              type="primary"
              icon="el-icon-edit"
            >编辑</el-button>
            <!-- 分配权限 -->
            <el-button
              size="mini"
              @click="REVOKE(scope.row)"
              type="warning"
              icon="el-icon-s-operation"
            >分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 弹框页面 -->
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
        <el-form-item label="状态" prop="status" v-show="dialogTitle == '修改信息'?true:false">
          <el-select v-model="AddEditForm.status" placeholder="请选择">
            <el-option label="启用" :value="'1'"></el-option>
            <el-option label="禁用" :value="'0'"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editAddDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="AddEdit">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 权限选择页面 -->
    <el-dialog title="选择权限" :visible.sync="powerDialogVisible" width="40%" v-dialogDrag>
      <el-form
        :model="powerChooseForm"
        ref="powerEditFormRef"
        label-width="80px"
        @closed="powerChooseClosed"
      >
        <el-form-item prop="deptName">
          <el-tree
            class="EditTree"
            :data="hosMenuList"
            :props="defaultProps"
            node-key="id"

            show-checkbox
            default-expand-all
            @node-click="handleNodeAddClick"
            @check="handleNodeAddClick"
          ></el-tree>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="powerChooseVisible = false">取 消</el-button>
        <el-button type="primary" @click="powerChooseEnter">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      input: "",
      RoleList: [],
      hosMenuList: [],
      editAddDialogVisible: false,
      powerDialogVisible: false,
      dialogTitle: "",
      AddEditForm: {
        roleName: "",
        status: "",
      },
      powerChooseForm: {},
      id: "",
      powerId: "",
      powerValue: "",
      editPowerArr: [1],
      defaultProps: {
        label: "menuName",
        children: "child",
        value: "menuId"
      }
    };
  },
  created() {
    this.getRoleList();
    this.getMenuList();
  },
  methods: {
    // 获取列表
    async getRoleList() {
      const { data: res } = await this.$http.post("role/list", {
        roleName: this.input
      });
      if (res.code != 200) return this.$message.error("列表获取失败");
      console.log(res);
      this.RoleList = res.rows;
      this.AddEditForm.status = res.rows.status;
    },
    // 获取菜单列表
    async getMenuList() {
      const { data: res } = await this.$http.post("menu/list");
      this.hosMenuList = res.data;
      console.log(res);
    },
    // 弹框
    showEditdialog(info) {
      this.AddEditForm = JSON.parse(JSON.stringify(info));
      this.dialogTitle = "修改信息";
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
    AddEdit() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return this.$message.error("修改失败");
        let httpUrl = "";
        let parm = {};
        if (this.dialogTitle == "修改信息") {
          httpUrl = "role/update";
          parm = {
            roleId: this.id,
            roleName: this.AddEditForm.roleName,
            status: this.AddEditForm.status
          };
        } else {
          httpUrl = "role/add";
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
    // 分配权限
    REVOKE(info) {
      this.powerId = info.roleId;
      this.powerDialogVisible = true;
    },
    // 权限修改
    async powerChooseEnter() {
      let set = new Set(this.editPowerArr);
      let newArr = Array.from(set);
      let html = newArr.join(",");
      console.log(html);
      this.powerDialogVisible = false;
      const { data: res } = await this.$http.post("role/authSysRoleMenu", {
        roleId: this.powerId,
        menuIds: html
      });
      console.log(res);
    },
    powerChooseClosed() {},
    handleNodeAddClick(val) {
      this.editPowerArr.push(val.menuId);
      console.log(val);
    }
  }
};
</script>
<style lang='less' scoped>
</style>