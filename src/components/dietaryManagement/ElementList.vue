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
          <el-button type="primary" @click="addFoodType">新增元素</el-button>
        </el-col>
      </el-row>
      <!-- 表格 -->
      <el-table
        :data="ElementList"
        ref="singleTable"
        highlight-current-row
        @current-change="handleCurrentChange"
        stripe
        :header-cell-style="{background:'#f5f5f5'}"
        style="width: 100%"
      >
        <el-table-column align="center" type="selection" width="60"></el-table-column>
        <el-table-column align="center" type="index" label="序号" width="60"></el-table-column>
        <el-table-column align="center" prop="elementName" label="元素名称" width="200"></el-table-column>
        <el-table-column align="center" prop="elementUnit" label="元素单位" width="200"></el-table-column>
        <el-table-column align="center" prop="elementMinValue" label="最小临界值" width="200"></el-table-column>
        <el-table-column align="center" prop="elementMaxValue" label="最大临界值"></el-table-column>
        <el-table-column align="center" prop="description" label="描述"></el-table-column>
        <el-table-column align="center" prop="operate" label="操作" width="240">
          <template slot-scope="scope">
            <!-- 修改按钮 -->
            <el-button
              size="mini"
              @click="showEditdialog(scope.row)"
              type="primary"
              icon="el-icon-edit"
            >编辑</el-button>
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
      <!-- 修改页面 -->
      <el-dialog :title="dialogTitle" :visible.sync="editAddDialogVisible" width="40%" v-dialogDrag>
        <el-form
          :model="AddEditForm"
          ref="editFormRef"
          label-width="80px"
          @closed="editAddDialogClosed"
        >
          <el-form-item label="元素名称" prop="elementName">
            <el-select v-model="AddEditForm.elementName" placeholder="请选择">
              <el-option
                v-for="item in eleNameList"
                :key="item.id"
                :label="item.name"
                :value="item.name"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="元素单位" prop="elementUnit">
            <el-select v-model="AddEditForm.elementUnit" placeholder="请选择">
              <el-option
                v-for="item in eleUnitList"
                :key="item.id"
                :label="item.name"
                :value="item.name"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="最小临界值" prop="elementMinValue">
            <el-input v-model="AddEditForm.elementMinValue"></el-input>
          </el-form-item>
          <el-form-item label="最大临界值" prop="elementMaxValue">
            <el-input v-model="AddEditForm.elementMaxValue"></el-input>
          </el-form-item>
          <el-form-item label="描述" prop="description">
            <el-input
              type="textarea"
              :autosize="{ minRows: 5, maxRows: 10}"
              placeholder="请输入内容..."
              v-model="AddEditForm.description"
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
      ElementList: [],
      eleNameList: [],
      eleUnitList: [],
      editAddDialogVisible: false,
      dialogTitle: "",
      AddEditForm: {
        elementName: "",
        elementUnit: "",
        elementMinValue: "",
        elementMaxValue: ""
      },
      id: "",
      foodPlanId: "",
      currentRow: null
    };
  },
  created() {
    this.foodPlanId = this.$route.query.id;
    this.getElementList();
    this.getDictionaryEleList();
    this.getDictionaryUnitList();
  },
  methods: {
    // 数据字典元素名称列表
    async getDictionaryEleList() {
      const { data: res } = await this.$http.post(
        "sys/dict/getPreviewData.do",
        { dictValue: "food_element" }
      );
      this.eleNameList = res.data;
    },
    // 数据字典元素单位列表
    async getDictionaryUnitList() {
      const { data: res } = await this.$http.post(
        "sys/dict/getPreviewData.do",
        { dictValue: "element" }
      );
      this.eleUnitList = res.data;
    },
    // 获取列表
    async getElementList() {
      const { data: res } = await this.$http.post(
        "foodPlanElement/getPFoodPlanElementList.do",
        { foodPlanId: this.foodPlanId }
      );
      console.log(res);
      if (res.code != 200) return this.$message.error("列表获取失败");
      this.ElementList = res.rows;
    },
    // 弹框
    showEditdialog(info) {
      this.AddEditForm = info;
      this.dialogTitle = "修改";
      this.id = info.id;
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
        if (!valid) return this.$message.error("失败");
        let httpUrl = "";
        let parm = {};
        if (this.dialogTitle == "修改") {
          httpUrl = "foodPlanElement/updatePFoodPlanElement.do";
          parm = {
            id: this.id,
            foodPlanId: this.foodPlanId,
            elementName: this.AddEditForm.elementName,
            elementUnit: this.AddEditForm.elementUnit,
            elementMinValue: this.AddEditForm.elementMinValue,
            elementMaxValue: this.AddEditForm.elementMaxValue,
            description: this.AddEditForm.description
          };
        } else {
          httpUrl = "foodPlanElement/savePFoodPlanElement.do";
          parm = {
            foodPlanId: this.foodPlanId,
            elementName: this.AddEditForm.elementName,
            elementUnit: this.AddEditForm.elementUnit,
            elementMinValue: this.AddEditForm.elementMinValue,
            elementMaxValue: this.AddEditForm.elementMaxValue,
            description: this.AddEditForm.description
          };
        }
        const { data: res } = await this.$http.post(httpUrl, parm);
        if (res.code != 200) return this.$message.error(res.msg);
        this.$message.success(res.msg);
        this.getElementList();
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
      const { data: res } = await this.$http.post(
        "foodPlanElement/delPFoodPlanElement.do",
        {
          id: id
        }
      );
      if (res.code == 200) {
        this.$message.success("删除成功");
        this.getElementList();
      } else {
        this.$message.error("删除失败");
        return;
      }
    },
    // 搜索
    async Foodsearch() {
      this.getElementList();
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