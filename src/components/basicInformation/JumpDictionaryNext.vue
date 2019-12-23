<template>
  <div>
    <!-- 卡片视图 -->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="7">
          <el-input placeholder="请输入内容" v-model="input" @keyup.enter.native="dicSearch" clearable>
            <el-button slot="append" icon="el-icon-search" @click="dicSearch"></el-button>
          </el-input>
        </el-col>
        <!-- 添加按钮 -->
        <el-col :span="4">
          <el-button type="primary" @click="addDictionaryInfo">新增字典数据</el-button>
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
        <el-table-column align="center    " prop="name" label="名称" sortable></el-table-column>
        <el-table-column align="center" prop="dictValue" label="键值" sortable></el-table-column>
        <el-table-column align="center" prop="remark" label="备注" sortable></el-table-column>
        <el-table-column align="center" prop="dictSort" label="排序号"></el-table-column>
        <el-table-column align="center" prop="isEnable" label="状态">
          <!-- 作用域插槽 -->
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.isEnable"
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
            ></el-button>
            <!-- 删除按钮 -->
            <el-button
              size="mini"
              @click="removeById(scope.row)"
              type="danger"
              icon="el-icon-delete"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 修改提示框 -->
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
      dialogTitle: "",
      DialogVisible: false,
      menuList: [],
      id: null,
      disabled: false,
      selfId: null,
      addEditForm: {
        name: "",
        dictValue: "",
        remark: ""
      }
    };
  },
  created() {
    this.id = this.$route.query.id;
    this.getDictionaryList();
  },
  methods: {
    // 获取详情
    async getDictionaryList() {
      const { data: res } = await this.$http.post(
        "sys/dict/getSysDictList.do",
        { parentId: this.id, name: this.input }
      );
      console.log(res);
      this.menuList = res.data;
    },
    // 修改
    showEditdialog(info) {
      this.selfId = info.id;
      this.disabled = true;
      this.dialogTitle = "修改";
      this.addEditForm = JSON.parse(JSON.stringify(info));
      this.DialogVisible = true;
    },
    AddEditDialogClosed() {
      this.$refs.addFormRef.resetFields();
    },
    async addEditEnter() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return this.$message.error("登录失败");
        let httpUrl = "";
        let parm = {};
        if (this.dialogTitle == "修改") {
          httpUrl = "sys/dict/updateSysDict.do";
          parm = {
            id: this.selfId,
            name: this.addEditForm.name,
            remark: this.addEditForm.remark
          };
        } else {
          httpUrl = "sys/dict/saveSysDict.do";
          parm = {
            parentId: this.id,
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
    // 改变状态
    async userStateChanged(userinfo) {
      const { data: res } = await this.$http.post("sys/dict/updateSysDict.do", {
        id: userinfo.id,
        isEnable: userinfo.isEnable
      });
      if (res.code != 200) {
        userinfo.isEnable = !userinfo.isEnable;
        return this.$message.error("更新用户状态失败");
      } else {
        this.$message.success("更新用户状态成功");
      }
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
    // 添加字典数据
    addDictionaryInfo() {
      this.disabled = false;
      this.dialogTitle = "新增";
      this.addEditForm = {};
      this.DialogVisible = true;
    },
    // 搜索
    dicSearch() {
      this.getDictionaryList();
    }
  }
};
</script>
<style lang='less' scoped>
</style>\