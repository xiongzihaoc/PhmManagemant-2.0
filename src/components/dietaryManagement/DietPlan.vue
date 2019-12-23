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
          <el-button type="primary" @click="addFoodType">新增饮食方案</el-button>
        </el-col>
      </el-row>
      <!-- 表格 -->
      <el-table
        :data="foodTypeList"
        ref="singleTable"
        tooltip-effect="dark"
        highlight-current-row
        @current-change="handleCurrentChange"
        stripe
        :header-cell-style="{background:'#f5f5f5'}"
        style="width: 100%"
      >
        <el-table-column align="center" type="selection" width="60"></el-table-column>
        <el-table-column align="center" type="index" label="序号" width="60"></el-table-column>
        <el-table-column align="center" prop="dsName" label="名称" width="200"></el-table-column>
        <el-table-column align="center" prop="dsTabooFood" show-overflow-tooltip label="禁忌食物" width="200"></el-table-column>
        <el-table-column align="center" prop="dsTabooDescribe" show-overflow-tooltip label="禁忌食物描述"></el-table-column>
        <el-table-column align="center" prop="dsDescribe" show-overflow-tooltip label="描述"></el-table-column>
        <el-table-column align="center" prop="operate" label="操作" width="300">
          <template slot-scope="scope">
            <!-- 修改按钮 -->
            <el-button
              size="mini"
              @click="showEditdialog(scope.row)"
              type="primary"
              icon="el-icon-edit"
            >编辑</el-button>
            <!-- 元素列表按钮 -->
            <el-button
              size="mini"
              @click="jumpElementList(scope.row)"
              type="success"
              icon="el-icon-s-unfold"
            >元素列表</el-button>
            <!-- 删除按钮 -->
            <el-button
              size="mini"
              @click="removeUserById(scope.row.id)"
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
      <!-- 修改页面 -->
      <el-dialog :title="dialogTitle" :visible.sync="editAddDialogVisible" width="40%" v-dialogDrag>
        <el-form
          :model="AddEditForm"
          ref="editFormRef"
          label-width="80px"
          @closed="editAddDialogClosed"
        >
          <el-form-item label="名称" prop="dsName">
            <el-input v-model="AddEditForm.dsName"></el-input>
          </el-form-item>
          <el-form-item label="禁忌食物" prop="addFoodIds">
            <el-select
              v-model="AddEditForm.addFoodIds"
              filterable
              multiple
              clearable
              placeholder="请选择"
            >
              <el-option
                v-for="item in foodList"
                :key="item.id"
                :label="item.fdName"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="禁忌描述" prop="dsTabooDescribe">
            <el-input
              type="textarea"
              :autosize="{ minRows: 5, maxRows: 10}"
              placeholder="请输入内容..."
              v-model="AddEditForm.dsTabooDescribe"
            ></el-input>
          </el-form-item>
          <el-form-item label="描述" prop="dsDescribe">
            <el-input
              type="textarea"
              :autosize="{ minRows: 5, maxRows: 10}"
              placeholder="请输入内容..."
              v-model="AddEditForm.dsDescribe"
            ></el-input>
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
      pageSize: 10,
      pageNum: 1,
      total: 0,
      foodTypeList: [],
      editAddDialogVisible: false,
      dialogTitle: "",
      AddEditForm: {
        addFoodIds: [],
        dsName: "",
        dsTabooFoodId: "",
        dsTabooDescribe: "",
        dsDescribe: ""
      },
      id: "",
      currentRow: null,
      foodList: [],
      list: [],
      options: [],
      loading: false,
      query: ""
    };
  },
  created() {
    this.getFoodTypeList();
    this.getFoodManagemant();
  },
  methods: {
    // 获取食物列表
    async getFoodManagemant() {
      const { data: res } = await this.$http.post("food/getPFoodList.do", {
        pageSize: 15000,
        pageNum: this.pageNum,
        // fdName: this.query
      });
      this.foodList = res.rows;
    },
    // 获取列表
    async getFoodTypeList() {
      const { data: res } = await this.$http.post(
        "foodPlan/getPFoodPlanList.do",
        {
          dsName: this.input,
          pageSize: this.pageSize,
          pageNum: this.pageNum
        }
      );
      if (res.code != 200) return this.$message.error("列表获取失败");
      this.foodTypeList = res.rows;
      this.total = res.total;
    },
    // 分页
    handleSizeChange(newSize) {
      this.pageSize = newSize;
      this.getFoodTypeList();
    },
    handleCurrentChangev(newPage) {
      this.pageNum = newPage;
      this.getFoodTypeList();
    },
    // 弹框
    showEditdialog(info) {
      this.dialogTitle = "修改";
      this.id = info.id;
      this.AddEditForm = {
        ...this.AddEditForm,
        ...info
      };
      this.AddEditForm.addFoodIds = this.AddEditForm.dsTabooFoodId
        .split(",")
        .filter(n => n)
        .map(n => Number(n));
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
        if (!valid) return this.$message.error("失败");
        let httpUrl = "";
        let parm = {};
        if (this.dialogTitle == "修改") {
          httpUrl = "foodPlan/updatePFoodPlan.do";
          parm = {
            id: this.id,
            dsName: this.AddEditForm.dsName,
            dsTabooFoodId: this.AddEditForm.addFoodIds + "",
            dsTabooDescribe: this.AddEditForm.dsTabooDescribe,
            dsDescribe: this.AddEditForm.dsDescribe
          };
        } else {
          httpUrl = "foodPlan/savePFoodPlan.do";
          parm = {
            dsName: this.AddEditForm.dsName,
            dsTabooFoodId: this.AddEditForm.addFoodIds + "",
            dsTabooDescribe: this.AddEditForm.dsTabooDescribe,
            dsDescribe: this.AddEditForm.dsDescribe
          };
        }
        const { data: res } = await this.$http.post(httpUrl, parm);
        if (res.code != 200) return this.$message.error(res.msg);
        this.$message.success(res.msg);
        this.getFoodTypeList();
        this.editAddDialogVisible = false;
      });
    },
    // 刪除
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
      const { data: res } = await this.$http.post("foodPlan/delPFoodPlan.do", {
        id: id
      });
      if (res.code == 200) {
        this.$message.success("删除成功");
        this.getFoodTypeList();
      } else {
        this.$message.error("删除失败");
        return;
      }
    },
    // 搜索
    Foodsearch() {
      this.getFoodTypeList();
    },
    // 跳转到元素列表
    jumpElementList(info) {
      this.$router.push({ path: "/food/ElementList", query: { id: info.id } });
    },
    // 实现表格单行选择高亮
    setCurrent(row) {
      this.$refs.singleTable.setCurrentRow(row);
    },
    handleCurrentChange(val) {
      this.currentRow = val;
    },
  },
};
</script>
<style lang='less' scoped>
</style>