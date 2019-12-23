<template>
  <div>
    <!-- 卡片视图 -->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="7">
          <el-input placeholder="请输入内容" @keyup.13.native="WaterSearch" v-model="input" clearable>
            <el-button slot="append" icon="el-icon-search" @click="WaterSearch"></el-button>
          </el-input>
        </el-col>
        <!-- 添加饮水方案按钮 -->
        <el-col :span="4">
          <el-button type="primary" @click="addWaterType">新增饮水方案</el-button>
        </el-col>
      </el-row>
      <!-- 表格 -->
      <el-table
        :data="waterTypeList"
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
        <el-table-column align="center" prop="name" label="名称" width="120"></el-table-column>
        <el-table-column align="center" prop="allowWater" show-overflow-tooltip label="推荐饮水种类"></el-table-column>
        <el-table-column align="center" prop="noWater" show-overflow-tooltip label="不推荐饮水种类"></el-table-column>
        <el-table-column align="center" prop="drinkWaterAmount" label="每日饮水量 (ml)"></el-table-column>
        <el-table-column align="center" prop="drinkWaterRange" label="饮水范围 (ml)"></el-table-column>
        <el-table-column align="center" prop="description" show-overflow-tooltip label="描述"></el-table-column>
        <el-table-column align="center" prop="operate" label="操作" width="200">
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
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChangev"
        :current-page="pageNum"
        :page-sizes="[10, 20,50]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
      <!-- 修改添加页面 -->
      <el-dialog
        :title="dialogTitle"
        :visible.sync="DialogVisible"
        width="40%"
        @closed="DialogClosed"
        v-dialogDrag
      >
        <el-form :model="editAddForm" ref="editAddFormRef" label-width="80px">
          <el-form-item label="名称" prop="name">
            <el-input v-model="editAddForm.name"></el-input>
          </el-form-item>
          <el-form-item label="推荐类" prop="addAllowWaterIds">
            <el-select
              v-model="editAddForm.addAllowWaterIds"
              clearable
              filterable
              multiple
              placeholder="请选择"
            >
              <el-option
                v-for="item in DrinkTypeList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="不推荐类" prop="addNoWaterIds">
            <el-select
              v-model="editAddForm.addNoWaterIds"
              filterable
              multiple
              clearable
              placeholder="请选择"
            >
              <el-option
                v-for="item in DrinkTypeList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="每日饮水" prop="drinkWaterAmount">
            <el-input v-model="editAddForm.drinkWaterAmount"></el-input>
          </el-form-item>
          <el-form-item label="饮水范围" prop="drinkWaterRange">
            <el-input v-model="editAddForm.drinkWaterRange"></el-input>
          </el-form-item>
          <el-form-item label="描述" prop="description">
            <el-input v-model="editAddForm.description"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editAddEnter">确 定</el-button>
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
      waterTypeList: [],
      pageSize: 10,
      pageNum: 1,
      total: 0,
      DialogVisible: false,
      dialogTitle: "",
      editAddForm: {
        addAllowWaterIds: [],
        addNoWaterIds: [],
        allowWaterIds: "",
        noWaterIds: "",
        name: "",
        allowWater: "",
        noWater: "",
        drinkWaterAmount: "",
        drinkWaterRange: "",
        description: ""
      },
      id: 0,
      DrinkTypeList: [],
      options: [],
      currentRow: null
    };
  },
  created() {
    this.getDrinkTypeList();
    this.getWaterTypeList();
  },
  methods: {
    // 获取饮水方案列表
    async getWaterTypeList() {
      const { data: res } = await this.$http.post(
        "water/plan/getPWaterPlanList.do",
        {
          pageSize: this.pageSize,
          pageNum: this.pageNum,
          name: this.input
        }
      );
      this.waterTypeList = res.rows;
      this.total = res.total;
    },
    // 获取饮水种类
    async getDrinkTypeList() {
      const { data: res } = await this.$http.post(
        "water/type/getPWaterTypeList.do",
        { pageSize: 15000, pageNum: this.pageNum }
      );
      this.DrinkTypeList = res.rows;
    },
    // 分页
    handleSizeChange(newSize) {
      this.pageSize = newSize;
      this.getWaterTypeList();
    },
    handleCurrentChangev(newPage) {
      this.pageNum = newPage;
      this.getWaterTypeList();
    },
    // 修改
    showEditdialog(info) {
      this.dialogTitle = "修改";
      this.id = info.id;
      this.editAddForm = {
        ...this.editAddForm,
        ...info
      };
      this.editAddForm.addAllowWaterIds = this.editAddForm.allowWaterIds
        .split(",")
        .filter(n => n)
        .map(n => Number(n));
      this.editAddForm.addNoWaterIds = this.editAddForm.noWaterIds
        .split(",")
        .filter(n => n)
        .map(n => Number(n));

      this.DialogVisible = true;
    },
    DialogClosed() {
      this.$refs.editAddFormRef.resetFields();
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
      const { data: res } = await this.$http.post(
        "water/plan/delPWaterPlan.do",
        {
          id: info
        }
      );
      if (res.code == 200) {
        this.$message.success("删除成功");
        this.getWaterTypeList();
      } else {
        this.$message.error("删除失败");
        return;
      }
    },
    // 搜索
    WaterSearch() {
      this.getWaterTypeList();
    },

    // 添加
    addWaterType() {
      this.dialogTitle = "新增";
      this.editAddForm = {};
      this.DialogVisible = true;
    },
    // 确定修改或添加
    editAddEnter() {
      this.$refs.editAddFormRef.validate(async valid => {
        if (!valid) return this.$message.error("失败");
        let stringIds = this.editAddForm.addAllowWaterIds.join(",");
        let stringIds1 = this.editAddForm.addNoWaterIds.join(",");
        let httpUrl = "";
        let parm = {};
        if (this.dialogTitle == "修改") {
          httpUrl = "water/plan/updatePWaterPlan.do";
          parm = {
            id: this.id,
            name: this.editAddForm.name,
            allowWaterIds: stringIds,
            noWaterIds: stringIds1,
            drinkWaterAmount: this.editAddForm.drinkWaterAmount,
            drinkWaterRange: this.editAddForm.drinkWaterRange,
            description: this.editAddForm.description
          };
        } else {
          httpUrl = "water/plan/savePWaterPlan.do";
          parm = {
            name: this.editAddForm.name,
            allowWaterIds: stringIds,
            noWaterIds: stringIds1,
            drinkWaterAmount: this.editAddForm.drinkWaterAmount,
            drinkWaterRange: this.editAddForm.drinkWaterRange,
            description: this.editAddForm.description
          };
        }
        const { data: res } = await this.$http.post(httpUrl, parm);
        if (res.code != 200) return this.$message.error(res.msg);
        this.$message.success(res.msg);
        this.getWaterTypeList();
        this.DialogVisible = false;
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
.el-form {
  margin-right: 15px;
}
</style>