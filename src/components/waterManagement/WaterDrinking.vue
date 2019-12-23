<template>
  <div>
    <el-card>
      <el-row :gutter="20">
        <el-col :span="7">
          <el-input placeholder="请输入内容" @keyup.13.native="WaterSearch" v-model="input" clearable>
            <el-button slot="append" icon="el-icon-search" @click="WaterSearch"></el-button>
          </el-input>
        </el-col>
        <!-- 添加饮水方案按钮 -->
        <el-col :span="4">
          <el-button type="primary" @click="addWaterGuideType">新增饮水指导</el-button>
        </el-col>
      </el-row>
      <!-- 表格 -->
      <el-table
        :data="waterguideList"
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
        <el-table-column align="center" prop="drinkWaterAmount" show-overflow-tooltip label="饮水总量"></el-table-column>
        <el-table-column align="center" prop="description" show-overflow-tooltip label="描述"></el-table-column>
        <el-table-column align="center" prop="operate" label="操作" width="300">
          <template slot-scope="scope">
            <!-- 修改按钮 -->
            <el-button
              size="mini"
              @click="showEditdialog(scope.row)"
              type="primary"
              icon="el-icon-edit"
            >编辑</el-button>
            <!-- 指导详情按钮 -->
            <el-button
              size="mini"
              @click="jumpElementList(scope.row)"
              type="success"
              icon="el-icon-s-unfold"
            >指导详情</el-button>
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

      <el-dialog
        :title="dialogTitle"
        :visible.sync="editDialogVisible"
        width="40%"
        @closed="editDialogClosed"
        v-dialogDrag
      >
        <el-form :model="editAddForm" ref="editAddFormRef" label-width="80px">
          <el-form-item label="名称" prop="name">
            <el-input v-model="editAddForm.name"></el-input>
          </el-form-item>
          <el-form-item label="饮水量" prop="drinkWaterAmount">
            <el-input v-model="editAddForm.drinkWaterAmount"></el-input>
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
      waterguideList: [],
      dialogTitle: "",
      editAddForm: {
        drinkWaterAmount: "",
        name: "",
        description: ""
      },
      DialogVisible: false,
      editDialogVisible: false,
      pageSize: 10,
      pageNum: 1,
      total: 0,
      input: ""
    };
  },
  created() {
    this.getWaterguideList();
  },
  methods: {
    // 获取饮水方案列表
    async getWaterguideList() {
      const { data: res } = await this.$http.post(
        "water/guide/getPDrinkWaterGuideList.do",
        {
          pageSize: this.pageSize,
          pageNum: this.pageNum,
          name: this.input
        }
      );
      this.waterguideList = res.rows;
      this.total = res.total;
    },
    // 搜索
    WaterSearch() {
      this.getWaterguideList();
    },
    handleCurrentChange(val) {
      this.currentRow = val;
    },
    // 添加
    addWaterGuideType() {
      this.dialogTitle = "新增";
      this.editAddForm = {};
      this.editDialogVisible = true;
    },
    editDialogClosed() {
      this.$refs.editAddFormRef.resetFields();
    },
    // 确定修改或添加
    editAddEnter() {
      this.$refs.editAddFormRef.validate(async valid => {
        if (!valid) return this.$message.error("失败");
        let httpUrl = "";
        let parm = {};
        if (this.dialogTitle == "修改") {
          httpUrl = "water/guide/updatePDrinkWaterGuide.do";
          parm = {
            id: this.id,
            name: this.editAddForm.name,
            drinkWaterAmount: this.editAddForm.drinkWaterAmount,
            description: this.editAddForm.description
          };
        } else {
          httpUrl = "water/guide/savePDrinkWaterGuide.do";
          parm = {
            name: this.editAddForm.name,
            drinkWaterAmount: this.editAddForm.drinkWaterAmount,
            description: this.editAddForm.description
          };
        }
        const { data: res } = await this.$http.post(httpUrl, parm);
        if (res.code != 200) return this.$message.error(res.msg);
        this.$message.success(res.msg);
        this.getWaterguideList();
        this.editDialogVisible = false;
      });
    }, // 分页
    handleSizeChange(newSize) {
      this.pageSize = newSize;
      this.getWaterguideList();
    },
    handleCurrentChangev(newPage) {
      this.pageNum = newPage;
      this.getWaterguideList();
    },
    // 修改
    showEditdialog(info) {
      this.dialogTitle = "修改";
      this.id = info.id;
      this.editAddForm = JSON.parse(JSON.stringify(info));
      this.editDialogVisible = true;
    },
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
        "water/guide/delPDrinkWaterGuide.do",
        {
          id: info
        }
      );
      if (res.code == 200) {
        this.$message.success("删除成功");
        this.getWaterguideList();
      } else {
        this.$message.error("删除失败");
        return;
      }
    }, // 跳转到元素列表
    jumpElementList(info) {
      this.$router.push({
        path: "/water/WaterDrinkingDetail",
        query: { id: info.id }
      });
    }
  }
};
</script>
<style lang='less' scoped>
.el-form {
  margin-right: 15px;
}
</style>
