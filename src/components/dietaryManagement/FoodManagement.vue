<template>
  <div>
    <!-- 卡片视图 -->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="7">
          <el-input placeholder="请输入内容" v-model="input" @keyup.13.native="foodSearch" clearable>
            <el-button slot="append" icon="el-icon-search" @click="foodSearch"></el-button>
          </el-input>
        </el-col>
        <!-- 添加食物按钮 -->
        <el-col :span="4">
          <el-button type="primary" @click="addFood">新增食物</el-button>
        </el-col>
      </el-row>
      <!-- 表格 -->
      <el-table
        :data="foodList"
        tooltip-effect="dark"
        ref="singleTable"
        highlight-current-row
        @current-change="handleCurrentChange"
        stripe
        :header-cell-style="{background:'#f5f5f5'}"
        style="width: 100%"
      >
        <el-table-column align="center" type="selection" width="60"></el-table-column>
        <el-table-column align="center" type="index" label="序号" width="60"></el-table-column>
        <el-table-column align="center" prop="fdName" label="名称"></el-table-column>
        <el-table-column align="center" label="图标" width="60">
          <template slot-scope="scope">
            <img id="img" :src="scope.row.fdPhotoPath" />
          </template>
        </el-table-column>
        <el-table-column align="center" prop="fdTypeValue" label="类型" width="160"></el-table-column>
        <el-table-column align="center" prop="elementName" show-overflow-tooltip label="元素名称"></el-table-column>
        <el-table-column align="center" prop="fdState" label="是否常见 (1: 是 0: 否)"></el-table-column>
        <el-table-column align="center" prop="fdDescribe" show-overflow-tooltip label="描述"></el-table-column>
        <el-table-column align="center" prop="operate" label="操作" width="400">
          <template slot-scope="scope">
            <!-- 修改按钮 -->
            <el-button
              size="mini"
              @click="showEditdialog(scope.row)"
              type="primary"
              icon="el-icon-edit"
            >编辑</el-button>
            <!-- 微量元素 -->
            <el-button
              size="mini"
              @click="jumpScruple(scope.row)"
              type="success"
              icon="el-icon-s-unfold"
            >微量元素</el-button>
            <!-- 食物单位 -->
            <el-button
              size="mini"
              @click="jumpUnits(scope.row)"
              type="success"
              icon="el-icon-s-unfold"
            >食物单位</el-button>
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
    </el-card>
    <!-- 修改页面 -->
    <el-dialog :title="dialogTitle" :visible.sync="editDialogVisible" width="40%" v-dialogDrag>
      <el-form :model="editForm" ref="editFormRef" @closed="editDialogClosed" label-width="80px">
        <el-form-item label="食物名称" prop="fdName">
          <el-input v-model="editForm.fdName"></el-input>
        </el-form-item>
        <el-form-item label="食物类型" prop="fdType">
          <el-select v-model="editForm.fdTypeValue" placeholder="请选择">
            <el-option
              v-for="item in foodTypeList"
              :key="item.id"
              :label="item.ftName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否常见" prop="fdState">
          <el-select v-model="editForm.fdState" placeholder="请选择">
            <el-option label="否" :value="0"></el-option>
            <el-option label="是" :value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="食物描述" prop="fdDescribe">
          <el-input
            type="textarea"
            :autosize="{ minRows: 5, maxRows: 10}"
            placeholder="请输入内容..."
            v-model="editForm.fdDescribe"
          ></el-input>
        </el-form-item>
        <el-form-item label="食物图片" prop="fdPhotoPath">
          <el-upload
            class="avatar-uploader"
            :action="this.UPLOAD_IMG"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :on-progress="uploadVideoProcess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="editForm.fdPhotoPath" :src="editForm.fdPhotoPath" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
          <el-progress v-if="videoFlag == true" :percentage="percentageFile" style="margin-top:20px;"></el-progress>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="edit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      foodList: [],
      input: "",
      pageSize: 10,
      pageNum: 1,
      total: 0,
      dialogTitle: "",
      editDialogVisible: false,
      editForm: {
        fdName: "",
        fdTypeValue: "",
        fdType: "",
        fdState: 0,
        fdDescribe: "",
        fdPhotoPath: ""
      },
      imageUrl: "",
      foodId: 0,
      value: "",
      foodTypeList: [],
      videoFlag: false,
      percentageFile: 0,
      currentRow: null
    };
  },

  created() {
    this.getTypeList();
    this.getFoodList();
  },

  methods: {
    // 获取食物列表
    async getFoodList() {
      const { data: res } = await this.$http.post("food/getPFoodList.do", {
        fdName: this.input,
        pageSize: this.pageSize,
        pageNum: this.pageNum
      });
      console.log(res);
      if (res.code != 200) return this.$message.error("获取食物列表失败");
      this.foodList = res.rows;
      this.total = res.total;
    },
    // 获取类型列表
    async getTypeList() {
      const { data: res } = await this.$http.post(
        "foodType/getPFoodTypeList.do",
        {
          pageSize: this.pageSize,
          pageNum: this.pageNum
        }
      );
      this.foodTypeList = res.data;
    },
    // 分页
    handleSizeChange(newSize) {
      this.pageSize = newSize;
      this.getFoodList();
    },
    handleCurrentChangev(newPage) {
      this.pageNum = newPage;
      this.getFoodList();
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
      const { data: res } = await this.$http.post("food/delPFood.do", {
        id: info
      });
      if (res.code == 200) {
        this.$message.success("删除成功");
        this.getFoodList();
      } else {
        this.$message.error("删除失败");
        return;
      }
    },
    // 修改
    showEditdialog(info) {
      // console.log(info);
      this.dialogTitle = "修改";
      this.foodId = info.id;
      this.editForm = JSON.parse(JSON.stringify(info));
      this.editDialogVisible = true;
    },
    editDialogClosed() {
      this.$refs.editFormRef.resetFields();
      this.imageUrl = "";
    },
    edit() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return this.$message.error("失败");
        let httpUrl = "";
        let parm = {};
        if (this.dialogTitle == "修改") {
          httpUrl = "food/updatePFood.do";
          parm = {
            id: this.foodId,
            fdName: this.editForm.fdName,
            fdState: this.editForm.fdState,
            fdDescribe: this.editForm.fdDescribe,
            fdType: this.editForm.fdType,
            fdPhotoPath: this.editForm.fdPhotoPath
          };
        } else {
          httpUrl = "food/savePFood.do";
          parm = {
            fdName: this.editForm.fdName,
            fdState: this.editForm.fdState,
            fdDescribe: this.editForm.fdDescribe,
            fdType: this.editForm.fdType,
            fdPhotoPath: this.editForm.fdPhotoPath
          };
        }
        const { data: res } = await this.$http.post(httpUrl, parm);
        if (res.code != 200) return this.$message.error(res.msg);
        this.$message.success(res.msg);
        this.getFoodList();
        this.imageUrl = "";
        this.editDialogVisible = false;
      });
    },
    addFood() {
      this.dialogTitle = "新增";
      this.editForm = {};
      this.editDialogVisible = true;
    },
    handleAvatarSuccess(res, file) {
      if (res.code != 200) return this.$message.error("上传失败");
      this.percentageFile = 0;
      this.videoFlag = false;
      this.imageUrl = res.data;
      this.editForm.fdPhotoPath = res.data;
    },
    uploadVideoProcess(event, file, fileList) {
      this.videoFlag = true;
      this.percentageFile = parseInt(file.percentage);
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isGIF = file.type === "image/gif";
      const isPNG = file.type === "image/png";
      const isBMP = file.type === "image/bmp";
      const isLt10M = file.size / 1024 / 1024 < 10;

      if (!isJPG && !isGIF && !isPNG && !isBMP) {
        this.$message.error("上传图片必须是JPG/GIF/PNG/BMP 格式!");
      }
      if (!isLt10M) {
        this.$message.error("上传图片大小不能超过 10MB!");
      }
      return (isJPG || isBMP || isGIF || isPNG) && isLt10M;
    },
    // 搜索
    foodSearch() {
      this.getFoodList();
    },
    // 实现表格单行选择高亮
    setCurrent(row) {
      this.$refs.singleTable.setCurrentRow(row);
    },
    handleCurrentChange(val) {
      this.currentRow = val;
    },
    // 跳转到微量元素页面
    jumpScruple(info) {
      this.$router.push({ path: "/food/Microelement", query: { id: info.id } });
    },
    // 跳转到食物单位
    jumpUnits(info) {
      this.$router.push({ path: "/food/Units", query: { id: info.id } });
    }
  }
};
</script>
<style lang='less' scoped>
.el-card {
  margin-top: 10px;
}

.el-table {
  margin-top: 10px;
}
.avatar-uploader .el-upload {
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader-icon {
  display: block;
  font-size: 28px;
  color: #8c939d;
  width: 100px;
  height: 100px;
  line-height: 100px;
  text-align: center;
  border: 1px dashed #ccc;
}
.avatar-uploader-icon:hover {
  border-color: #409eff;
}
.avatar {
  width: 100px;
  height: 100px;
  display: block;
}
.diseaseDes {
  display: block;
  height: 100px;
}
</style>