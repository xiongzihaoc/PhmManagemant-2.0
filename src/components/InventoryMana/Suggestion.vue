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
          <el-button type="primary" @click="addUsers">新增建议</el-button>
        </el-col>
      </el-row>
      <!-- 表格 -->
      <el-table
        tooltip-effect="dark"
        stripe
        ref="singleTable"
        :data="infoList"
        :header-cell-style="{background:'#f5f5f5'}"
        style="width: 100%"
      >
        <el-table-column align="center" type="index" label="序号" width="60"></el-table-column>
        <el-table-column align="center" prop="advKind" label="建议库"></el-table-column>
        <el-table-column align="center" prop="advFlag" label="标签名称"></el-table-column>
        <el-table-column align="center" prop="advValue" label="赋值" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" prop="advSelectNum" label="筛选序号"></el-table-column>
        <el-table-column align="center" prop="advKeyWord" label="关键词"></el-table-column>
        <el-table-column align="center" prop="advContent" label="建议内容" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" prop="operate" label="操作" width="200">
          <template slot-scope="scope">
            <!-- 修改按钮 -->
            <el-button
              size="mini"
              @click="showEditdialog(scope.row)"
              type="primary"
              icon="el-icon-edit"
            >编辑</el-button>
            <!-- 修改按钮 -->
            <!-- <el-button
              size="mini"
              @click="cloneDialog(scope.row)"
              type="warning"
              icon="el-icon-document-copy"
            >删除</el-button>-->
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
      <el-form
        ref="loginFormRef"
        :model="editAddForm"
        label-width="80px"
        @closed="editDialogClosed"
      >
        <el-form-item label="建议库" prop="advKind">
          <el-input v-model="editAddForm.advKind"></el-input>
        </el-form-item>
        <el-form-item label="标签名称" prop="advFlag">
          <el-input v-model="editAddForm.advFlag"></el-input>
        </el-form-item>
        <el-form-item label="赋值" prop="advValue">
          <el-input v-model="editAddForm.advValue"></el-input>
        </el-form-item>
        <el-form-item label="筛选序号" prop="advSelectNum">
          <el-input v-model="editAddForm.advSelectNum"></el-input>
        </el-form-item>
        <el-form-item label="关键词" prop="advKeyWord">
          <el-input v-model="editAddForm.advKeyWord"></el-input>
        </el-form-item>
        <el-form-item label="建议内容" prop="advContent">
          <el-input v-model="editAddForm.advContent"></el-input>
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
      infoList: [],
      pageSize: 10,
      pageNum: 1,
      total: 0,
      infoTitle: "",
      editDialogVisible: false,
      editAddForm: {
        advKind: "",
        advFlag: "",
        advValue: null,
        advSelectNum: null,
        advKeyWord: "",
        advContent: ""
      }
    };
  },
  created() {
    this.getScaleList();
  },
  methods: {
    // 获取量表列表
    async getScaleList() {
      const { data: res } = await this.$http.post(
        this.$ajax + "sheetAdv/list",
        {
          pageSize: this.pageSize,
          pageNum: this.pageNum,
          name: this.input
        }
      );
      console.log(res);

      if (res.code != 200) return this.$message.error("数获取失败");
      this.infoList = res.rows;
      this.total = res.total;
    },
    // 修改
    showEditdialog(info) {
      console.log(info);
      this.editAddForm = JSON.parse(JSON.stringify(info));
      this.infoTitle = "修改信息";
      this.editDialogVisible = true;
      this.showEditId = info.id;
    },
    editDialogClosed() {
      this.$refs.editFormRef.resetFields();
    },
    // 添加用户
    addUsers() {
      this.infoTitle = "新增建议";
      this.editDialogVisible = true;
      this.editAddForm = {};
      this.addEditValue = "";
    },
    editPageEnter() {
      let httpUrl = "";
      let parm = {};
      if (this.infoTitle == "修改信息") {
        httpUrl = "sheetAdv/update";
        parm = {
          id: this.showEditId,
          advKind: this.editAddForm.advKind,
          advFlag: this.editAddForm.advFlag,
          advValue: this.editAddForm.advValue,
          advSelectNum: this.editAddForm.advSelectNum,
          advKeyWord: this.editAddForm.advKeyWord,
          advContent: this.editAddForm.advContent
        };
      } else if (this.infoTitle == "新增建议") {
        httpUrl = "sheetAdv/add";
        parm = {
          advKind: this.editAddForm.advKind,
          advFlag: this.editAddForm.advFlag,
          advValue: this.editAddForm.advValue,
          advSelectNum: this.editAddForm.advSelectNum,
          advKeyWord: this.editAddForm.advKeyWord,
          advContent: this.editAddForm.advContent
        };
      }
      this.$refs.loginFormRef.validate(async valid => {
        if (!valid) return;
        const { data: res } = await this.$http.post(this.$ajax + httpUrl, parm);
        if (res.code != 200) return this.$message.error(res.msg);
        this.$message.success(res.msg);
        this.getScaleList();
        this.editDialogVisible = false;
      });
    },
    // 复用克隆此量表
    cloneDialog(info) {
      console.log(info);

      this.editAddForm = JSON.parse(JSON.stringify(info));
      this.infoTitle = "克隆量表";
      this.editDialogVisible = true;
      this.cloneEditId = info.uuid;
    },
    // 搜索
    systemSearch() {
      this.getScaleList();
    },
    // 状态码数字转中文
    ifendcase(val) {
      if (val.state == "1") {
        return "有效";
      } else {
        return "无效";
      }
    },
    // 分页
    handleSizeChange(newSize) {
      this.pageSize = newSize;
      this.getScaleList();
    },
    handleCurrentChangev(newPage) {
      this.pageNum = newPage;
      this.getScaleList();
    }
  }
};
</script>
<style lang='less' scoped>
</style>