<template>
  <div>
    <!-- 卡片视图 -->
    <el-card>
      <el-table
        :data="menuList"
        :tree-props="{children: 'child', hasChildren: 'hasChildren'}"
        :header-cell-style="{background:'#f5f5f5'}"
        row-key="menuId"
        ref="singleTable"
        :expand-row-keys="['1']"
        highlight-current-row
        @current-change="handleCurrentChange"
        style="width: 100%;margin-bottom: 20px;"
      >
        <el-table-column align="center" prop="menuName" label="名称" sortable width="180"></el-table-column>
        <el-table-column align="center" prop="menuType" label="菜单类型" sortable width="180"></el-table-column>
        <el-table-column align="center" prop="url" label="路径"></el-table-column>
        <el-table-column align="center" prop="icon" label="样式"></el-table-column>
        <el-table-column align="center" prop="orderNum" label="排序号"></el-table-column>
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
        <el-table-column align="center" prop="operate" label="操作" width="180">
          <template slot-scope="scope">
            <!-- 修改按钮 -->
            <el-button
              size="mini"
              @click="showEditdialog(scope.row)"
              type="primary"
              icon="el-icon-edit"
            >编辑</el-button>
            <!-- 新增按钮 -->
            <el-button
              size="mini"
              @click="addDialog(scope.row)"
              type="success"
              icon="el-icon-circle-plus"
            >新增</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 添加提示框 -->
    <el-dialog title="添加选项" :visible.sync="addDialogVisible" width="40%" v-dialogDrag>
      <el-form ref="editFormRef" :model="addForm" label-width="80px">
        <el-form-item label="上一级">
          <el-input v-model="goBack" disabled></el-input>
        </el-form-item>
        <el-form-item label="名称">
          <el-input v-model="addForm.menuName"></el-input>
        </el-form-item>
        <el-form-item label="菜单类型">
          <el-input v-model="addForm.menuType"></el-input>
        </el-form-item>
        <el-form-item label="路径">
          <el-input v-model="addForm.url"></el-input>
        </el-form-item>
        <el-form-item label="样式">
          <el-input v-model="addForm.icon"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addEnter">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑提示框 -->
    <el-dialog
      title="编辑选项"
      :visible.sync="editDialogVisible"
      width="40%"
      @closed="editDialogClosed"
      v-dialogDrag
    >
      <el-form ref="editFormRef" :model="editForm" label-width="80px">
        <el-form-item label="名称" prop="menuName">
          <el-input v-model="editForm.menuName"></el-input>
        </el-form-item>
        <el-form-item label="菜单类型" prop="menuType">
          <el-input v-model="editForm.menuType"></el-input>
        </el-form-item>
        <el-form-item label="路径" prop="url">
          <el-input v-model="editForm.url"></el-input>
        </el-form-item>
        <el-form-item label="样式" prop="icon">
          <el-input v-model="editForm.icon"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editEnter">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      input: "",
      currentRow: null,
      menuList: [],
      addDialogVisible: false,
      addForm: {
        menuName: "",
        menuType: "",
        icon: "",
        url: ""
      },
      addId: 0,
      editDialogVisible: false,
      editForm: {
        menuName: "",
        menuType: "",
        icon: "",
        url: ""
      },
      idArr: [],
      editId: 0,
      goBack: ""
    };
  },
  created() {
    this.getMenuList();
  },
  methods: {
    // 获取菜单列表
    async getMenuList() {
      const { data: res } = await this.$http.post("menu/getMenuList2.do");
      this.menuList = res.data;
    },
    // 修改弹框
    showEditdialog(val) {
      this.editId = val.menuId;
      this.editForm = JSON.parse(JSON.stringify(val));
      this.editDialogVisible = true;
    },
    // 修改弹框关闭
    editDialogClosed() {
      this.$refs.editFormRef.resetFields();
    },
    // 确定修改
    editEnter() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return this.$message.error("登录失败");
        const { data: res } = await this.$http.post("menu/updateSysMenu.do", {
          menuId: this.editId,
          menuName: this.editForm.menuName,
          menuType: this.editForm.menuType,
          url: this.editForm.url,
          icon: this.editForm.icon
        });
        if (res.code != 200) return this.$message.error("操作失败");
        this.editDialogVisible = false;
        this.$message.success("操作成功");
        this.getMenuList();
      });
    },
    // 改变状态按钮
    async userStateChanged(userinfo) {
      const { data: res } = await this.$http.post("menu/updateSysMenu.do", {
        menuId: userinfo.menuId,
        status: userinfo.status
      });
      if (res.code != 200) {
        userinfo.status = !userinfo.status;
        return this.$message.error("更新用户状态失败");
      }
      this.getMenuList();
      this.$message.success("更新用户状态成功");
    },
    // 增加菜单弹框
    addDialog(val) {
      this.goBack = val.menuName;
      this.addId = val.menuId;
      this.addDialogVisible = true;
    },
    // 确定增加
    addEnter() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return this.$message.error("操作失败");
        const { data: res } = await this.$http.post("menu/saveSysMenu.do", {
          parentId: this.addId,
          menuName: this.addForm.menuName,
          menuType: this.addForm.menuType,
          url: this.addForm.url,
          icon: this.addForm.icon
        });
        this.addDialogVisible = false;
      });
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