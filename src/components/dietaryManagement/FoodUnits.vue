<template>
  <div>
    <!-- 卡片视图 -->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="7">
          <el-input placeholder="请输入内容" @keyup.13.native="foodUnitSearch" v-model="input" clearable>
            <el-button slot="append" icon="el-icon-search" @click="foodUnitSearch"></el-button>
          </el-input>
        </el-col>
        <!-- 添加用户按钮 -->
        <el-col :span="4">
          <el-button type="primary" @click="addWater">新增食物单位</el-button>
        </el-col>
      </el-row>
      <!-- 表格 -->
      <el-table
        :header-cell-style="{background:'#f5f5f5'}"
        :data="foodUnitList"
        stripe
        style="width: 100%"
      >
        <el-table-column align="center" type="selection" width="60"></el-table-column>
        <el-table-column align="center" type="index" label="序号" width="60"></el-table-column>
        <el-table-column align="center" prop="fuUnit" label="单位名称"></el-table-column>
        <el-table-column align="center" prop="fuWeight" label="重量 (g)"></el-table-column>
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
      <!-- 修改页面 -->
      <el-dialog
        :title="dialogTitle"
        :visible.sync="editDialogVisible"
        width="40%"
        @closed="editDialogClosed"
        v-dialogDrag
      >
        <el-form :model="editForm" ref="editFormRef" label-width="80px">
          <el-form-item label="单位名称" prop="fuUnit">
            <el-input v-model="editForm.fuUnit"></el-input>
          </el-form-item>
          <el-form-item label="重量" prop="fuWeight">
            <el-input v-model="editForm.fuWeight"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editEnter">确 定</el-button>
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
      foodId: "",
      foodUnitList: [],
      editDialogVisible: false,
      editForm: {
        fuUnit: "",
        fuWeight: ""
      },
      id: 0,
      dialogTitle: ""
    };
  },
  created() {
    this.foodId = this.$route.query.id;
    this.getFoodUnitList();
  },
  methods: {
    async getFoodUnitList() {
      const { data: res } = await this.$http.post(
        "foodUnit/getPFoodUnitList.do",
        { foodId: this.foodId }
      );
      console.log(res);

      this.foodUnitList = res.rows;
      this.total = res.total;
    },
    // 修改
    showEditdialog(info) {
      this.dialogTitle = "修改";
      this.id = info.id;
      this.editForm = JSON.parse(JSON.stringify(info));
      this.editDialogVisible = true;
    },
    editDialogClosed() {
      this.$refs.editFormRef.resetFields();
    },
    editEnter() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return this.$message.error("失败");
        let httpUrl = "";
        let parm = {};
        if (this.dialogTitle == "修改") {
          httpUrl = "foodUnit/updatePFoodUnit.do";
          parm = {
            id: this.id,
            foodId: this.foodId,
            fuUnit: this.editForm.fuUnit,
            fuWeight: this.editForm.fuWeight
          };
        } else {
          httpUrl = "foodUnit/savePFoodUnit.do";
          parm = {
            foodId: this.foodId,
            fuUnit: this.editForm.fuUnit,
            fuWeight: this.editForm.fuWeight
          };
        }
        const { data: res } = await this.$http.post(httpUrl, parm);
        if (res.code != 200) return this.$message.error(res.msg);
        this.$message.success(res.msg);
        this.getFoodUnitList();
        this.editDialogVisible = false;
      });
    },
    // 搜索
    foodUnitSearch() {
      this.getFoodUnitList();
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
      const { data: res } = await this.$http.post("foodUnit/delPFoodUnit.do", {
        id: info
      });
      if (res.code == 200) {
        this.$message.success("删除成功");
        this.getFoodUnitList();
      } else {
        this.$message.error("删除失败");
        return;
      }
    },
    addWater() {
      this.dialogTitle = "新增";
      this.editForm = {};
      this.editDialogVisible = true;
    }
  }
};
</script>
<style lang='less' scoped>
</style>