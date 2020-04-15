<template>
  <div>
    <!-- 卡片视图 -->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="7">
          <el-input placeholder="请输入内容" v-model="input" @keyup.13.native="systemSearch" clearable>
            <el-button slot="append" icon="el-icon-search" @click="systemSearch"></el-button>
          </el-input>
        </el-col>
        <!-- 添加用户按钮 -->
        <el-col :span="4">
          <el-button type="primary" @click="addUsers">新增体检卡信息</el-button>
        </el-col>
      </el-row>
      <!-- 表格 -->
      <el-table
        stripe
        ref="singleTable"
        tooltip-effect="dark"
        :data="userList"
        :header-cell-style="{background:'#f5f5f5'}"
        style="width: 100%"
      >
        <!-- <el-table-column align="center" type="selection" width="60"></el-table-column> -->
        <el-table-column align="center" type="index" label="序号" width="60"></el-table-column>
        <el-table-column align="center" prop="batchName" label="批次名称"></el-table-column>
        <el-table-column align="center" prop="cardNum" label="检测卡号"></el-table-column>
        <el-table-column align="center" prop="cardTypeValue" label="检测卡类型"></el-table-column>
        <el-table-column align="center" prop="name" label="患者姓名"></el-table-column>
        <el-table-column align="center" prop="phone" label="手机号"></el-table-column>
        <el-table-column align="center" prop="hospital" label="医院"></el-table-column>
        <el-table-column align="center" prop="office" label="科室"></el-table-column>
        <!-- <el-table-column align="center" prop="operate" label="操作" width="180">
          <template slot-scope="scope"> -->
            <!-- 修改按钮 -->
            <!-- <el-button
              size="mini"
              @click="showEditdialog(scope.row)"
              type="primary"
              icon="el-icon-edit"
            >编辑</el-button> -->
            <!-- 删除按钮 -->
            <!-- <el-button
              size="mini"
              @click="removeUserById(scope.row.acId)"
              type="danger"
              icon="el-icon-delete"
            >删除</el-button>
          </template> -->
        <!-- </el-table-column> -->
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
    <!-- 增改页面 -->
    <el-dialog :title="infoTitle" :visible.sync="editDialogVisible" width="40%" v-dialogDrag>
      <el-form ref="loginFormRef" :model="editAddForm" label-width="80px" @closed="editDialogClosed">
        <el-form-item label="医院科室" prop="office">
          <el-input v-model="addEditValue" @click.native="deptAdd"></el-input>
        </el-form-item>
        <el-form-item label="批次名称" prop="batchName">
          <el-input v-model="editAddForm.batchName"></el-input>
        </el-form-item>
        <el-form-item label="检测卡数量" prop="cardNum">
          <el-input v-model="editAddForm.cardNum"></el-input>
        </el-form-item>
        <el-form-item label="检测卡类型" prop="cardTypeValue">
          <!-- <el-input v-model="editAddForm.cardTypeValue"></el-input> -->
          <el-select v-model="editAddForm.cardType" placeholder="请选择">
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
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editPageEnter">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 部门选择页面 -->
    <el-dialog title="选择医院科室" :visible.sync="addDeptDialogVisible" width="40%" v-dialogDrag>
      <el-form
        ref="deptAddFormRef"
        :model="addDeptForm"
        label-width="80px"
        @closed="addDeptDialogClosed"
      >
        <el-form-item prop="deptName">
          <div class="mytree">
            <el-tree
              class="tree"
              accordion
              highlight-current
              :data="hosMenuList"
              :props="defaultProps"
              node-key="id"
              :indent="0"
              icon-class="el-icon-circle-plus"
              :default-expanded-keys="idArr"
              @node-click="handleNodeAddClick"
            ></el-tree>
          </div>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDeptDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addDeptEnter">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      input: "",
      userList: [],

      // 获取用户列表的参数对象
      pageSize: 10,
      pageNum: 1,
      total: 0,
      editDialogVisible: false,
      // 修改
      editAddForm: {
        batchName: "",
        cardNum: "",
        cardType: "",
        officeCode: ""
      },
      addDeptDialogVisible: false,
      addDeptForm: {},
      defaultProps: {
        label: "deptName",
        children: "child"
      },
      addEditValue: "",
      infoTitle: "",
      editId: 0,
      addTransit: "",
      addValue: "",
      RoleList: [],
      idArr: [],
      hosMenuList: [],
      TJKNameList:[],
    };
  },
  created() {
    this.getUserList();
    this.getHosMenuList();
    this.getDictionaryEleListOne();
  },

  methods: {
    // 获取用户列表
    async getUserList() {
      const { data: res } = await this.$http.post("medical/getMedicalList", {
        pageSize: this.pageSize,
        pageNum: this.pageNum
      });
      if (res.code != 200) return this.$message.error("数获取失败");
      this.userList = res.rows;
      this.total = res.total;
      console.log(res.rows);
    },
    // 获取部门列表
    async getHosMenuList() {
      const { data: res } = await this.$http.post("dept/list", {});
      this.hosMenuList = res.data;
      this.idArr.push(res.data[0].id);
    },
    // 獲取字典數據
    async getDictionaryEleListOne() {
      const { data: res } = await this.$http.post("dict/getPreviewData", {
        dictValue: "TJKLX"
      });

      this.TJKNameList = res.data;
    },
    // 修改
    showEditdialog(info) {
      this.infoTitle = "修改信息";
      this.editDialogVisible = true;
    },
    editDialogClosed() {
      this.$refs.editFormRef.resetFields();
    },
    async editPageEnter() {
      let httpUrl = "";
      let parm = {};
      if (this.infoTitle == "修改信息") {
        httpUrl = "hospital/updateHospitalDetail";
        parm = {
          id: this.editId,
          batchName: "",
          cardNum: "",
          cardType: "",
          dcDept: ""
        };
      } else {
        httpUrl = "medical/saveMedical";
        parm = {
          batchName: this.editAddForm.batchName,
          cardSum: this.editAddForm.cardNum,
          cardType: this.editAddForm.cardType,
          officeCode: this.editAddForm.dcDept
        };
      }
      this.$refs.loginFormRef.validate(async valid => {
        if (!valid) return;
        const { data: res } = await this.$http.post(httpUrl, parm);
        if (res.code != 200) return this.$message.error(res.msg);
        this.$message.success(res.msg);
        this.getUserList();
        this.editDialogVisible = false;
      });
    },
    // 添加用户
    addUsers() {
      this.infoTitle = "新增体检卡信息";
      this.editDialogVisible = true;
    },
    // 部门新增
    deptAdd() {
      this.addDeptDialogVisible = true;
    },
    addDeptEnter() {
      this.addEditValue = this.tranMidName;
      this.addDeptDialogVisible = false;
    },
    addDeptDialogClosed() {},
    handleNodeAddClick(val) {
      this.editAddForm.dcDept = val.code;
      this.tranMidName = val.deptName;
    },
    // 删除
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
      const { data: res } = await this.$http.get(
        "user/delSysUser.do?acId=" + id
      );
      if (res.code != 200) return this.$message.error("删除失败");
      this.$message.success("删除成功");
      this.getUserList();
    },
    // 搜索
    systemSearch() {
      this.getUserList();
    },
    // 分页
    handleSizeChange(newSize) {
      this.pageSize = newSize;
      this.getUserList();
    },
    handleCurrentChangev(newPage) {
      this.pageNum = newPage;
      this.getUserList();
    },

    timesChangeDate(times) {
      var da = new Date(times);
      var year = da.getFullYear();
      var month = da.getMonth() + 1;
      var date = da.getDate();
      return [year, month, date].join("-");
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
<style scoped>
.mytree /deep/ .el-tree > .el-tree-node:after {
  border-top: none;
  border-left: none;
}
.tree /deep/ .el-tree-node {
  position: relative;
  padding-left: 16px;
  font-weight: 700;
  color: #333;
}

.tree /deep/ .el-tree-node__children {
  padding-left: 16px;
}

.tree /deep/ .el-tree-node :last-child:before {
  height: 38px;
  color: #409eff;
}
.tree /deep/ .el-tree-node :first-child:before {
  color: #409eff;
}

.tree /deep/ .el-tree > .el-tree-node:before {
  border-left: none !important;
}

.mytree /deep/ .el-tree > .el-tree-node:after {
  border-top: none;
}

.tree /deep/ .el-tree-node:before {
  content: "";
  left: -4px;
  position: absolute;
  right: auto;
}

.tree /deep/ .el-tree-node:after {
  content: "";
  left: -4px;
  position: absolute;
  right: auto;
  border-width: 1px;
}

.tree /deep/ .el-tree-node:before {
  border-left: 1px solid #ccc;
  bottom: 0px;
  height: 100%;
  top: -26px;
  width: 1px;
}

.tree /deep/ .el-tree-node:after {
  border-top: 1px solid #ccc;
  height: 20px;
  top: 12px;
  width: 24px;
}

.mytree {
  overflow: hidden;
}
</style>
