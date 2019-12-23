<template>
  <div>
    <!-- 卡片视图 -->
    <el-card>
      <el-table
        :data="hosMenuList"
        :lazy="true"
        :header-cell-style="{background:'#f5f5f5'}"
        style="width: 100%;margin-bottom: 20px;"
        row-key="id"
        ref="singleTable"
        :expand-row-keys="['1']"
        highlight-current-row
        @current-change="handleCurrentChange"
        :tree-props="{children: 'child', hasChildren: 'hasChildren'}"
      >
        <el-table-column align="center" prop="deptName" label="名称" sortable></el-table-column>
        <el-table-column align="center" prop="deptManager" label="负责人" sortable></el-table-column>
        <el-table-column align="center" prop="phone" label="联系方式" sortable></el-table-column>
        <el-table-column align="center" prop="logo" label="图标" sortable>
          <template slot-scope="scope">
            <img id="img" v-if="scope.row.logo != '#'" :src="scope.row.logo" />
          </template>
        </el-table-column>
        <el-table-column align="center" prop="deptType" label="组织类型" sortable></el-table-column>
        <el-table-column align="center" prop="address" label="地址" sortable></el-table-column>
        <el-table-column align="center" prop="orderNum" label="排序号" sortable></el-table-column>
        <el-table-column align="center" prop="status" label="状态">
          <!-- 作用域插槽 -->
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.status"
              active-color="#409167"
              inactive-color="#ccc"
              active-value="0"
              inactive-value="1"
              @change="userStateChanged(scope.row)"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="operate" label="操作" width="180">
          <template slot-scope="scope">
            <!-- 修改按钮 -->
            <el-button
              size="mini"
              @click="showEditdialog(scope.row.acId)"
              type="primary"
              icon="el-icon-edit"
            >编辑</el-button>
            <!-- 新增按钮 -->
            <el-button
              size="mini"
              @click="addDictionarybtn(scope.row.acId)"
              type="success"
              icon="el-icon-circle-plus"
            >新增</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>
<script>
export default {
  data() {
    return {
      input: "",
      hosMenuList: [],
      imageUrl: "",
      currentRow: null
    };
  },
  created() {
    this.getHosMenuList();
  },
  methods: {
    async getHosMenuList() {
      const { data: res } = await this.$http.post("dept/getDeptList.do", {});
      console.log(res);
      this.hosMenuList = res.data;
    },
    // 增加
    addDictionary() {},
    // 修改
    showEditdialog() {},
    // 改变状态按钮
    async userStateChanged(userinfo) {

    },
    // 搜索
    hospSearch() {},
    // 操作里面新增
    addDictionarybtn() {},
    // 实现表格单行选择高亮
    setCurrent(row) {
      this.$refs.singleTable.setCurrentRow(row);
    },
    handleCurrentChange(val) {
      this.currentRow = val;
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