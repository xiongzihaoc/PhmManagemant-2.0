<template>
  <div>
    <!-- 卡片视图 -->
    <el-card>
      <el-table
        :data="menuList"
        :tree-props="{children: 'child', hasChildren: 'hasChildren'}"
        :header-cell-style="{background:'#f5f5f5'}"
        row-key="id"
        ref="singleTable"
        :expand-row-keys="['0']"
        style="width: 100%;margin-bottom: 20px;"
      >
        <el-table-column align="left" prop="name" label="名称" label-class-name="ccc"></el-table-column>
        <el-table-column align="center" prop="orderNum" label="排序号"></el-table-column>
        <el-table-column align="center" prop="remark" label="备注"></el-table-column>
        <el-table-column align="center" prop="status" label="状态" :formatter="ifendcase">
          <template slot-scope="scope">
            <span
              style="color:#13ce66;font-weight:700;"
              v-if="scope.row.state=== '1'"
            >{{ ifendcase(scope.row) }}</span>
            <span v-else style="color:#ff4949;font-weight:700;">{{ ifendcase(scope.row) }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="280">
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
            <!-- 删除按钮 -->
            <el-button
              size="mini"
              @click="removeUserById(scope.row)"
              type="danger"
              icon="el-icon-delete"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 编辑提示框 -->
    <el-dialog
      :title="infoTitle"
      :visible.sync="editDialogVisible"
      width="40%"
      @closed="editDialogClosed"
      v-dialogDrag
    >
      <el-form ref="editFormRef" :model="editForm" label-width="80px">
        <el-form-item label="上一级" v-show="this.infoTitle=='新增信息'?true:false">
          <el-input v-model="goBack" disabled></el-input>
        </el-form-item>
        <el-form-item label="名称" prop="name">
          <el-input v-model="editForm.name"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="editForm.remark"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="status" v-show="this.infoTitle=='新增信息'?false:true">
          <el-select v-model="editForm.state" placeholder="请选择">
            <el-option label="启用" :value="'1'"></el-option>
            <el-option label="禁用" :value="'0'"></el-option>
          </el-select>
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
      menuList: [],
      infoTitle: "",
      editDialogVisible: false,
      editForm: {
        name: "",
        remark: "",
        state: ""
      },
      idArr: [],
      editId: "",
      parentId: "",
      goBack: ""
    };
  },
  created() {
    this.getMenuList();
  },
  methods: {
    // 获取标签列表
    async getMenuList() {
      const { data: res } = await this.$http.post(
        this.$ajax + "lable/list",
        {}
      );
      console.log(res);
      this.menuList = res.data;
    },
    // 修改
    showEditdialog(info) {
      this.editDialogVisible = true;
      this.infoTitle = "修改信息";
      this.editId = info.id;
      this.editForm = JSON.parse(JSON.stringify(info));
    },
    // 新增
    addDialog(info) {
      this.editDialogVisible = true;
      this.infoTitle = "新增信息";
      this.goBack = info.name;
      this.parentId = info.id;
    },
    editEnter() {
      let httpUrl = "";
      let parm = {};
      if (this.infoTitle == "修改信息") {
        httpUrl = "lable/update";
        parm = {
          id: this.editId,
          name: this.editForm.name,
          remark: this.editForm.remark,
          state: this.editForm.state
        };
      } else {
        httpUrl = "lable/add";
        parm = {
          parentId: this.parentId,
          name: this.editForm.name,
          remark: this.editForm.remark
        };
      }
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return;
        const { data: res } = await this.$http.post(this.$ajax + httpUrl, parm);
        if (res.code != 200) return this.$message.error(res.msg);
        this.$message.success(res.msg);
        this.getMenuList();
        this.editDialogVisible = false;
      });
    },
    editDialogClosed() {
      this.editForm = {};
      this.$refs.editFormRef.resetFields();
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
      const { data: res } = await this.$http.post(this.$ajax + "lable/del", {
        id: info.id
      });
      if (res.code != 200) return this.$message.error("删除失败");
      this.$message.success("删除成功");
      this.getMenuList();
    },
    // 状态判断
    ifendcase(val) {
      if (val.state == "1") {
        return "启用";
      } else {
        return "禁用";
      }
    }
  }
};
</script>
<style>
.ccc {
  padding-left: 20px !important;
}
</style>