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
        <!-- 添加用户按钮 -->
        <el-col :span="4">
          <el-button type="primary" @click="addWater">新增食物管理</el-button>
        </el-col>
      </el-row>
      <!-- 表格 -->
      <el-table
        tooltip-effect="dark"
        :data="EstimateFoodList"
        ref="singleTable"
        highlight-current-row
        @current-change="handleCurrentChange"
        stripe
        :header-cell-style="{background:'#f5f5f5'}"
        style="width: 100%"
      >
        <el-table-column align="center" type="selection" width="60"></el-table-column>
        <el-table-column align="center" type="index" label="序号" width="60"></el-table-column>
        <el-table-column align="center" prop="fmName" label="名称"></el-table-column>
        <el-table-column align="center" label="图片">
          <template slot-scope="scope">
            <img id="img" :src="scope.row.fmPhotoPath" />
          </template>
        </el-table-column>
        <el-table-column align="center" prop="fmTypeValue" label="类型"></el-table-column>
        <el-table-column align="center" prop="fmWeight" label="重量(g)"></el-table-column>
        <el-table-column align="center" prop="fmDescribe" show-overflow-tooltip label="描述"></el-table-column>
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
      <!-- 修改页面 -->
      <el-dialog
        :title="dialogTitle"
        :visible.sync="editDialogVisible"
        width="40%"
        @closed="editDialogClosed"
        v-dialogDrag
      >
        <el-form :model="editForm" ref="editFormRef" label-width="80px">
          <el-form-item label="名称" prop="fmName">
            <el-input v-model="editForm.fmName"></el-input>
          </el-form-item>
          <el-form-item label="图标" prop="fmPhotoPath">
            <el-upload
              class="avatar-uploader"
              :action="this.UPLOAD_IMG"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :on-progress="uploadVideoProcess"
              :before-upload="beforeAvatarUpload"
            >
              <img v-if="editForm.fmPhotoPath" :src="editForm.fmPhotoPath" class="avatar" />
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
            <el-progress v-if="videoFlag == true" :percentage="percentageFile"></el-progress>
          </el-form-item>
          <el-form-item label="类型" prop="fmType">
            <el-select v-model="editForm.fmType" placeholder="请选择">
              <el-option
                v-for="item in EstimateTypeList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="重量" prop="fmWeight">
            <el-input v-model="editForm.fmWeight"></el-input>
          </el-form-item>
          <el-form-item label="描述" prop="fmDescribe">
            <el-input v-model="editForm.fmDescribe"></el-input>
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
      EstimateFoodList: [],
      EstimateTypeList: [],
      pageSize: 10,
      pageNum: 1,
      total: 0,
      editDialogVisible: false,
      editForm: {
        fmName: "",
        fmType: "",
        fmWeight: "",
        fmPhotoPath: "",
        fmDescribe: ""
      },
      id: 0,
      dialogTitle: "",
      imageUrl: "",
      videoFlag: false,
      percentageFile: 0,
      currentRow: null
    };
  },
  created() {
    this.getEstimateTypeList();
    this.getEstimateFoodList();
  },
  methods: {
    async getEstimateTypeList() {
      const { data: res } = await this.$http.post(
        "foodMeasureType/getPFoodMeasureTypeList.do",
        {}
      );

      this.EstimateTypeList = res.rows;
    },
    async getEstimateFoodList() {
      const { data: res } = await this.$http.post(
        "foodMeasure/getPFoodMeasureList.do",
        { pageSize: this.pageSize, pageNum: this.pageNum, fmName: this.input }
      );
      this.EstimateFoodList = res.rows;
      this.total = res.total;
      console.log(res);
    },
    // 分页
    handleSizeChange(newSize) {
      this.pageSize = newSize;
      this.getEstimateFoodList();
    },
    handleCurrentChangev(newPage) {
      this.pageNum = newPage;
      this.getEstimateFoodList();
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
      this.imageUrl = "";
    },
    editEnter() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return this.$message.error("失败");
        let httpUrl = "";
        let parm = {};
        if (this.dialogTitle == "修改") {
          httpUrl = "foodMeasure/updatePFoodMeasure.do";
          parm = {
            id: this.id,
            fmName: this.editForm.fmName,
            fmType: this.editForm.fmType,
            fmWeight: this.editForm.fmWeight,
            fmPhotoPath: this.editForm.fmPhotoPath,
            fmDescribe: this.editForm.fmDescribe
          };
        } else {
          httpUrl = "foodMeasure/savePFoodMeasure.do";
          parm = {
            fmName: this.editForm.fmName,
            fmType: this.editForm.fmType,
            fmWeight: this.editForm.fmWeight,
            fmPhotoPath: this.editForm.fmPhotoPath,
            fmDescribe: this.editForm.fmDescribe
          };
        }
        const { data: res } = await this.$http.post(httpUrl, parm);
        if (res.code != 200) return this.$message.error(res.msg);
        this.$message.success(res.msg);
        this.getEstimateFoodList();
        this.editDialogVisible = false;
      });
    },
    // 搜索
    WaterSearch() {
      this.getEstimateFoodList();
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
        "foodMeasure/delPFoodMeasure.do",
        {
          id: info
        }
      );
      if (res.code == 200) {
        this.$message.success("删除成功");
        this.getEstimateFoodList();
      } else {
        this.$message.error("删除失败");
        return;
      }
    },
    addWater() {
      this.dialogTitle = "新增";
      this.editForm = {};
      this.editDialogVisible = true;
    },

    handleAvatarSuccess(res, file) {
      if (res.code != 200) return this.$message.error("上传失败");
      this.percentageFile = 0;
      this.videoFlag = false;
      this.imageUrl = res.data;
      this.editForm.fmPhotoPath = res.data;
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
.avatar-uploader .el-upload {
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader-icon:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  display: block;
  font-size: 28px;
  color: #8c939d;
  width: 80px;
  height: 80px;
  line-height: 80px;
  text-align: center;
  border: 1px dashed #ccc;
}
.avatar {
  width: 60px;
  height: 80px;
  display: block;
}
</style>