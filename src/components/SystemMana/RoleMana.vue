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
        <el-table-column align="center" prop="status" label="状态" :formatter="ifendcase">
          <template slot-scope="scope">
            <span
              style="color:#13ce66;font-weight:700;"
              v-if="scope.row.status=== '1'"
            >{{ ifendcase(scope.row) }}</span>
            <span v-else style="color:#ff4949;font-weight:700;">{{ ifendcase(scope.row) }}</span>
          </template>
        </el-table-column>
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
    <el-dialog
      title="选择权限"
      :visible.sync="powerDialogVisible"
      width="40%"
      @closed="powerDialogClosed"
      v-dialogDrag
    >
      <el-form :model="powerChooseForm" ref="powerEditFormRef" label-width="80px">
        <el-form-item prop="deptName">
          <el-tree
            class="EditTree"
            :data="hosMenuList"
            :props="defaultProps"
            :default-checked-keys="defKeys"
            node-key="menuId"
            show-checkbox
            default-expand-all
            ref="treeRef"
          ></el-tree>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="powerDialogVisible = false">取 消</el-button>
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
      pageSize: 10,
      pageNum: 1,
      total: 0,
      RoleList: [],
      hosMenuList: [],
      editAddDialogVisible: false,
      powerDialogVisible: false,
      dialogTitle: "",
      AddEditForm: {
        roleName: "",
        status: ""
      },
      powerChooseForm: {},
      id: "",
      powerId: "",
      powerValue: "",
      defKeys: [],
      defaultProps: {
        label: "menuName",
        children: "child",
        value: "menuId"
      }
    };
  },
  created() {
    this.getRoleList();
    // this.getMenuList();
  },
  methods: {
    // 获取列表
    async getRoleList() {
      const { data: res } = await this.$http.post("role/list", {
        roleName: this.input,
        pageSize: 15000,
        pageNum: 15000
      });
      if (res.code != 200) return this.$message.error("列表获取失败");
      this.RoleList = res.rows;
      this.total = res.total;
      this.AddEditForm.status = res.rows.status;
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
      this.dialogTitle = "新增角色";
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
    // 分配权限弹框
    async REVOKE(info) {
      this.powerId = info.roleId;
      // 获取菜单数据
      const { data: res } = await this.$http.post("menu/list");
      this.hosMenuList = res.data;
      var str = info.menuIds;
      var arr = str.split(",");
      for (var i = 0; i < arr.length; i++) {
        if (
          arr[i] == "1" ||
          arr[i] == "14" ||
          arr[i] == "2" ||
          arr[i] == "19" ||
          arr[i] == "24" ||
          arr[i] == "27"
        ) {
          arr.splice(i, 1);
        }
      }
      this.defKeys = arr;
      this.powerDialogVisible = true;
    },
    powerDialogClosed() {
      this.defKeys = [];
    },
    // 权限修改确定
    async powerChooseEnter() {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ];
      const idStr = keys.join(",");
      const { data: res } = await this.$http.post("role/authSysRoleMenu", {
        roleId: this.powerId,
        menuIds: idStr
      });

      this.powerDialogVisible = false;
      if (res.code != 200) {
        //更新权限失败
        return this.$message.error("分配权限失败");
      }
      this.$message.success("分配权限成功");
      this.getRoleList();
    },
    // 状态判断
    ifendcase(val) {
      if (val.status == "1") {
        return "启用";
      } else {
        return "禁用";
      }
    }
  }
};
</script>
<style lang='less' scoped>
</style>