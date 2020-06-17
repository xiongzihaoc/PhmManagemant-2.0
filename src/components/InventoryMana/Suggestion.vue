<template>
  <div class="Boxheight">
    <!-- 卡片视图 -->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="7">
          <el-input
            placeholder="请输入内容"
            v-model="input"
            @keyup.13.native="systemSearch"
            clearable
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="systemSearch"
            ></el-button>
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
        :header-cell-style="{ background: '#f5f5f5' }"
        style="width: 100%"
      >
        <el-table-column
          align="center"
          type="index"
          label="序号"
          width="60"
        ></el-table-column>
        <el-table-column align="center" prop="advKind" label="建议库">
          <template slot-scope="scope">
            <span v-if="scope.row.advKind === '1'">{{ "心理类" }}</span>
            <span v-else>{{ "疾病类" }}</span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="advFlag"
          label="标签名称"
        ></el-table-column>
        <el-table-column
          align="center"
          prop="identify"
          label="标签属性"
        ></el-table-column>
        <el-table-column
          align="center"
          prop="advValue"
          label="赋值"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          align="center"
          prop="advSelectNum"
          label="筛选序号"
        ></el-table-column>
        <el-table-column
          align="center"
          prop="advKeyWord"
          label="关键词"
        ></el-table-column>
        <el-table-column
          align="center"
          prop="advContent"
          label="建议内容"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column align="center" prop="operate" label="操作" width="200">
          <template slot-scope="scope">
            <!-- 修改按钮 -->
            <el-button
              size="mini"
              @click="showEditdialog(scope.row)"
              type="primary"
              icon="el-icon-edit"
              >编辑</el-button
            >
            <!-- 修改按钮 -->
            <el-button
              size="mini"
              @click="deleteBtn(scope.row)"
              type="danger"
              icon="el-icon-delete"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChangev"
        :current-page="pageNum"
        :page-sizes="[10, 20, 50]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
    <!-- 增改页面 -->
    <el-dialog
      :title="infoTitle"
      :visible.sync="editDialogVisible"
      width="40%"
      v-dialogDrag
    >
      <el-form
        ref="loginFormRef"
        :model="editAddForm"
        label-width="80px"
        @closed="editDialogClosed"
      >
        <el-form-item label="建议库" prop="advKind">
          <el-select
            v-model="editAddForm.advKind"
            clearable
            placeholder="请选择"
          >
            <el-option label="疾病类" value="0"></el-option>
            <el-option label="心理类" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="标签名称" prop="labelValue">
          <el-cascader
            v-model="editAddForm.labelValue"
            :options="menuList"
            :props="optionProps"
            ref="myCascader"
            @change="handleCas"
            :show-all-levels="false"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="标签属性" prop="identify">
          <el-input v-model="editAddForm.identify"></el-input>
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
          <el-input
            type="textarea"
            :rows="5"
            v-model="editAddForm.advContent"
          ></el-input>
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
      showEditId: null,
      editDialogVisible: false,
      editAddForm: {
        advKind: "",
        labelValue: [],
        advFlag: "",
        advValue: null,
        advSelectNum: null,
        advKeyWord: "",
        advContent: "",
        identify: ""
      },
      menuList: [],
      optionProps: {
        value: "id",
        label: "name",
        children: "child"
      }
    };
  },
  created() {
    this.getScaleList();
    this.getMenuList();
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
      if (res.code != 200) return this.$message.error("数获取失败");
      console.log(res);
      this.infoList = res.rows;
      this.total = res.total;
    },
    // 获取标签列表
    async getMenuList() {
      const { data: res } = await this.$http.post(
        this.$ajax + "lable/list",
        {}
      );
      // console.log(res);
      this.menuList = res.data;
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
    // 标签下拉框change事件
    handleCas(val) {
      console.log(111);

      var ValLength = val.length;
      if (val.length == 1) {
        this.editAddForm.labelValue = val;
      } else if (val.length == 0) {
        return;
      } else {
        this.editAddForm.labelValue = val[ValLength - 1];
      }
    },
    editPageEnter() {
      let httpUrl = "";
      let parm = {};
      if (this.infoTitle == "修改信息") {
        httpUrl = "sheetAdv/update";
        parm = {
          id: this.showEditId,
          advKind: this.editAddForm.advKind,
          labelValue: this.editAddForm.labelValue,
          advValue: this.editAddForm.advValue,
          advSelectNum: this.editAddForm.advSelectNum,
          advKeyWord: this.editAddForm.advKeyWord,
          advFlag: this.$refs["myCascader"].inputValue,
          advContent: this.editAddForm.advContent,
          identify: this.editAddForm.identify
        };
      } else if (this.infoTitle == "新增建议") {
        httpUrl = "sheetAdv/add";
        parm = {
          advKind: this.editAddForm.advKind,
          labelValue: this.editAddForm.labelValue,
          advValue: this.editAddForm.advValue,
          advSelectNum: this.editAddForm.advSelectNum,
          advKeyWord: this.editAddForm.advKeyWord,
          advFlag: this.$refs["myCascader"].inputValue,
          advContent: this.editAddForm.advContent,
          identify: this.editAddForm.identify
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
    // 删除建议
    async deleteBtn(info) {
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
      const { data: res } = await this.$http.post(this.$ajax + "sheetAdv/del", {
        id: info.id
      });
      if (res.code != 200) return this.$message.error("删除失败");
      this.getScaleList();
    },
    // 搜索
    systemSearch() {
      this.getScaleList();
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
  },
  watch: {}
};
</script>
<style lang="less" scoped>
.el-select,
.el-cascader {
  width: 100%;
}
</style>
