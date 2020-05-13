<template>
  <div>
    <!-- 卡片视图 -->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="7">
          <el-input placeholder="请输入内容" v-model="input" @keyup.13.native="dicSearch" clearable>
            <el-button slot="append" icon="el-icon-search" @click="dicSearch"></el-button>
          </el-input>
        </el-col>
        <!-- 添加按钮 -->
        <el-col :span="4">
          <el-button type="primary" @click="addDictionary">新增字典</el-button>
        </el-col>
      </el-row>
      <el-table
        :data="menuList"
        :lazy="true"
        style="width: 100%;margin-bottom: 20px;"
        :header-cell-style="{background:'#f5f5f5'}"
        row-key="id"
        ref="singleTable"
      >
        <el-table-column align="center" prop="dictSort" label="排序号"></el-table-column>
        <el-table-column align="center" prop="name" label="名称"></el-table-column>
        <el-table-column align="center" prop="dictValue" label="键值"></el-table-column>
        <el-table-column align="center" prop="remark" label="备注" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" prop="id" label="字典编码"></el-table-column>
        <el-table-column align="center" prop="isEnable" label="状态" :formatter="ifendcase">
          <template slot-scope="scope">
            <span
              style="color:#13ce66;font-weight:700;"
              v-if="scope.row.isEnable=== '1'"
            >{{ ifendcase(scope.row) }}</span>
            <span v-else style="color:#ff4949;font-weight:700;">{{ ifendcase(scope.row) }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="operate" label="操作" width="260">
          <template slot-scope="scope">
            <!-- 修改按钮 -->
            <el-button
              size="mini"
              @click="showEditdialog(scope.row)"
              type="primary"
              icon="el-icon-edit"
            >编辑</el-button>
            <!-- 跳转按钮 -->
            <el-button
              size="mini"
              @click="jumpDictionarybtn(scope.row)"
              type="success"
              icon="el-icon-s-unfold"
            >详情</el-button>
            <!-- 删除按钮 -->
            <el-button
              size="mini"
              @click="removeById(scope.row)"
              type="danger"
              icon="el-icon-delete"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 修改添加提示框 -->
    <el-dialog
      :title="dialogTitle"
      :visible.sync="DialogVisible"
      width="40%"
      @closed="AddEditDialogClosed"
      v-dialogDrag
    >
      <el-form ref="addFormRef" :model="addEditForm" label-width="80px">
        <el-form-item label="名称">
          <el-input v-model="addEditForm.name"></el-input>
        </el-form-item>
        <el-form-item label="键值">
          <el-input :disabled="disabled" v-model="addEditForm.dictValue"></el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="addEditForm.remark"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="isEnable" v-if="this.dialogTitle=='修改信息'" v-show="true">
          <el-select v-model="addEditForm.isEnable" placeholder="请选择">
            <el-option label="启用" :value="'1'"></el-option>
            <el-option label="禁用" :value="'0'"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="DialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addEditEnter">确 定</el-button>
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
      addEditForm: {
        name: "",
        dictValue: "",
        remark: "",
        isEnable: ""
      },
      parentId: 1,
      selfId: null,
      DialogVisible: false,
      dialogTitle: "",
      goBack: "",
      disabled: false,
      labelTitle: ""
    };
  },
  created() {
    this.getDictionaryList();
  },
  methods: {
    async getDictionaryList() {
      const { data: res } = await this.$http.post("dict/list", {
        parentId: 1,
        name: this.input
      });

      this.menuList = res.data;
    },
    // 确定修改或添加
    addEditEnter() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return this.$message.error("失败");
        let httpUrl = "";
        let parm = {};
        if (this.dialogTitle == "修改信息") {
          httpUrl = "dict/update";
          parm = {
            id: this.selfId,
            name: this.addEditForm.name,
            remark: this.addEditForm.remark,
            isEnable: this.addEditForm.isEnable
          };
        } else {
          httpUrl = "dict/add";
          parm = {
            parentId: this.parentId,
            name: this.addEditForm.name,
            dictValue: this.addEditForm.dictValue,
            remark: this.addEditForm.remark
          };
        }
        const { data: res } = await this.$http.post(httpUrl, parm);
        if (res.code != 200) return this.$message.error(res.msg);
        this.$message.success(res.msg);
        this.getDictionaryList();
        this.DialogVisible = false;
      });
    },
    // 修改
    showEditdialog(info) {
      this.selfId = info.id;
      this.disabled = true;
      this.dialogTitle = "修改信息";
      this.addEditForm = JSON.parse(JSON.stringify(info));
      this.DialogVisible = true;
    },
    // 重置
    AddEditDialogClosed() {
      this.$refs.addFormRef.resetFields();
    },
    // 搜索
    dicSearch() {
      this.getDictionaryList();
    },
    // 删除
    async removeById(info) {
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
      const { data: res } = await this.$http.post("sys/dict/delSysDict.do", {
        id: info.id
      });
      if (res.code == 200) {
        this.$message.success("删除成功");
        this.getDictionaryList();
      } else {
        this.$message.error("删除失败");
        return;
      }
    },
    // 添加按钮
    addDictionary() {
      this.dialogTitle = "新增字典";
      this.disabled = false;
      this.addEditForm = {};
      this.DialogVisible = true;
    },
    // 跳转下一级
    jumpDictionarybtn(info) {
      this.$router.push({
        path: "/JumpDictionaryNext",
        query: { id: info.id }
      });
    },
    // 状态判断
    ifendcase(val) {
      if (val.isEnable == "1") {
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