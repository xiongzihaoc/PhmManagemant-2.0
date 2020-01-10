<template>
  <div>
    <!-- 卡片视图 -->
    <el-card>
      <el-table
        tooltip-effect="dark"
        :data="hosMenuList"
        :lazy="true"
        :header-cell-style="{background:'#f5f5f5'}"
        style="width: 100%;margin-bottom: 20px;"
        row-key="id"
        ref="singleTable"
        :expand-row-keys="['1']"
        :tree-props="{children: 'child', hasChildren: 'hasChildren'}"
      >
        <el-table-column align="left" prop="deptName" label="###     名称" width="180"></el-table-column>
        <el-table-column align="center" prop="deptManager" label="负责人"></el-table-column>
        <el-table-column align="center" prop="phone" label="联系方式" width="110"></el-table-column>
        <el-table-column align="center" prop="deptTypeValue" label="组织类型"></el-table-column>
        <el-table-column align="center" prop="officeLabelValue" label="科室标签"></el-table-column>
        <el-table-column align="center" prop="logo" label="图标">
          <template slot-scope="scope">
            <img
              id="img"
              v-if="scope.row.logo != null && scope.row.logo != '#'"
              :src="scope.row.logo"
            />
          </template>
        </el-table-column>
        <el-table-column align="center" prop="address" label="地址" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" prop="orderNum" label="排序号" width="70"></el-table-column>
        <el-table-column align="center" prop="status" label="状态" :formatter="ifendcase" width="80">
          <template slot-scope="scope">
            <span style="color:#13ce66;font-weight:700;" v-if="scope.row.status=== '1'">{{ ifendcase(scope.row) }}</span>
            <span v-else style="color:#ff4949;font-weight:700;">{{ ifendcase(scope.row) }}</span>
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
            >编辑</el-button>
            <!-- 新增按钮 -->
            <el-button
              size="mini"
              @click="addDictionarybtn(scope.row)"
              type="success"
              icon="el-icon-circle-plus"
            >新增</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-dialog :title="dynamicTitle" :visible.sync="dynamicDialogVisible" width="40%" v-dialogDrag>
      <el-form
        ref="addFormRef"
        :model="dynamicForm"
        label-width="80px"
        @closed="dynamicDialogClosed"
      >
        <el-form-item label="上一级">
          <el-input v-model="goback" disabled></el-input>
        </el-form-item>
        <el-form-item label="名称" prop="deptName">
          <el-input v-model="dynamicForm.deptName"></el-input>
        </el-form-item>
        <el-form-item label="组织类型" prop="deptTypeValue">
          <el-select v-model="dynamicForm.deptTypeValue" clearable placeholder="请选择">
            <el-option
              v-for="item in DEPNameList"
              :key="item.id"
              :label="item.name"
              :value="item.dictValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="科室标签" prop="officeLabelValue">
          <el-select v-model="dynamicForm.officeLabelValue" clearable placeholder="请选择">
            <el-option
              v-for="item in TJKNameList"
              :key="item.id"
              :label="item.name"
              :value="item.dictValue"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dynamicDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dynamicEnter">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      input: "",
      hosMenuList: [],
      TJKNameList: [],
      DEPNameList: [],
      dynamicForm: {
        deptName: "",
        officeLabelValue: "",
        deptTypeValue: ""
      },
      dynamicTitle: "",
      dynamicDialogVisible: false,
      addParentId: null,
      addParentCode: "",
      goback: "",
      imageUrl: ""
    };
  },
  created() {
    this.getHosMenuList();
    this.getDictionaryEleListOne();
    this.getDictionaryEleListTwo();
  },
  methods: {
    async getHosMenuList() {
      const { data: res } = await this.$http.post("dept/list", {});
      this.hosMenuList = res.data;
      console.log(res);
    },
    async getDictionaryEleListOne() {
      const { data: res } = await this.$http.post("dict/getPreviewData", {
        dictValue: "officeType"
      });
      this.TJKNameList = res.data;
    },
    async getDictionaryEleListTwo() {
      const { data: res } = await this.$http.post("dict/getPreviewData", {
        dictValue: "deptType"
      });
      this.DEPNameList = res.data;
      console.log(res);
    },
    // 增加
    addDictionary() {},
    // 修改
    showEditdialog() {},
    // 搜索
    hospSearch() {},
    // 操作里面新增
    addDictionarybtn(info) {
      console.log(info);
      
      this.dynamicForm = {};
      this.addParentId = info.id;
      this.addParentCode = info.code;
      this.dynamicDialogVisible = true;
      this.dynamicTitle = "新增信息";
      this.goback = info.deptName;
    },
    async dynamicEnter() {
      let httpUrl = "";
      let parm = {};
      if (this.dialogTitle == "修改信息") {
        httpUrl = "role/update";
        parm = {
          roleId: this.id,
          roleName: this.AddEditForm.roleName,
          status: this.AddEditForm.status
        };
      } else {
        httpUrl = "dept/add";
        parm = {
          parentId: this.addParentId,
          deptName: this.dynamicForm.deptName,
          deptType: this.dynamicForm.deptTypeValue,
          officeLabel: this.dynamicForm.officeLabelValue,
          parentCode: this.addParentCode
        };
      }
      const { data: res } = await this.$http.post(httpUrl, parm);
      if (res.code != 200) return this.$message.error(res.msg);
      this.$message.success(res.msg);
      this.getHosMenuList();
      this.dynamicDialogVisible = false;
    },
    dynamicDialogClosed() {},
    // 状态判断
    ifendcase(val) {
      if (val.status == "1") {
        return "启用";
      } else {
        return "禁用";
      }
    },
    handleAvatarSuccess(res, file) {
      this.imageUrl = res.data;
      this.editForm.fdPhotoPath = res.data;
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isGIF = file.type === "image/gif";
      const isPNG = file.type === "image/png";
      const isBMP = file.type === "image/bmp";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG && !isGIF && !isPNG && !isBMP) {
        this.common.errorTip("上传图片必须是JPG/GIF/PNG/BMP 格式!");
      }
      if (!isLt2M) {
        this.common.errorTip("上传图片大小不能超过 2MB!");
      }
      return (isJPG || isBMP || isGIF || isPNG) && isLt2M;
    }
  }
};
</script>
<style lang='less' scoped>
</style>