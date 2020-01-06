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
          <el-button type="primary" @click="addUsers">新增医院信息</el-button>
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
        <el-table-column align="center" type="selection" width="60"></el-table-column>
        <!-- <el-table-column align="center" type="index" label="序号" width="60"></el-table-column> -->
        <el-table-column align="center" prop="account" label="医院账号"></el-table-column>
        <el-table-column align="center" prop="hospitalLogo" label="医院logo"></el-table-column>
        <el-table-column align="center" prop="address" label="地址"></el-table-column>
        <el-table-column align="center" prop="detailedAddress" label="详细地址"></el-table-column>
        <el-table-column align="center" prop="customer" label="对接人"></el-table-column>
        <el-table-column align="center" prop="customerTel" label="对接人账号" width="120"></el-table-column>
        <el-table-column align="center" prop="salesmanUuid" label="销售人员"></el-table-column>
        <el-table-column align="center" prop="description" label="医院介绍" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" prop="collectMode" label="收费模式"></el-table-column>
        <el-table-column align="center" prop="checked" label="检测报告是否审核"></el-table-column>
        <el-table-column align="center" prop="detectionType" label="检测卡类型"></el-table-column>
        <el-table-column align="center" prop="dataSharing" label="数据是否共享"></el-table-column>
        <el-table-column align="center" prop="patientView" label="检测报告是否可见"></el-table-column>
        <!-- <el-table-column align="center" prop="inputPatientVersion" label="web用户录入版本"></el-table-column> -->
        <el-table-column align="center" prop="patientAnswerWay" label="用户答题方式"></el-table-column>
        <el-table-column align="center" prop="operate" label="操作" width="180">
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
              @click="removeUserById(scope.row)"
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
    <!-- 增改页面 -->
    <el-dialog :title="infoTitle" :visible.sync="editDialogVisible" width="40%" v-dialogDrag>
      <el-form
        ref="loginFormRef"
        :model="editAddForm"
        label-width="80px"
        @closed="editDialogClosed"
      >
        <el-form-item label="医院账号" prop="account">
          <el-input v-model="editAddForm.account"></el-input>
        </el-form-item>
        <el-form-item label="医院logo" prop="hospitalLogo">
          <el-input v-model="editAddForm.hospitalLogo"></el-input>
        </el-form-item>
        <el-form-item label="地址" prop="address">
          <el-cascader v-model="hosAddress" :options="hosOptions" @change="handleChange"></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="detailedAddress">
          <el-input v-model="editAddForm.detailedAddress"></el-input>
        </el-form-item>
        <el-form-item label="对接人" prop="customer">
          <el-input v-model="editAddForm.customer"></el-input>
        </el-form-item>
        <el-form-item label="对接人账号" prop="customerTel">
          <el-input v-model="editAddForm.customerTel"></el-input>
        </el-form-item>
        <el-form-item label="销售人员" prop="salesmanUuid">
          <el-input v-model="editAddForm.salesmanUuid"></el-input>
        </el-form-item>
        <el-form-item label="医院介绍" prop="description">
          <el-input v-model="editAddForm.description"></el-input>
        </el-form-item>
        <el-form-item label="收费模式" prop="collectMode">
          <el-input v-model="editAddForm.collectMode"></el-input>
        </el-form-item>
        <el-form-item label="检测报告是否审核" prop="checked">
          <el-input v-model="editAddForm.checked"></el-input>
        </el-form-item>
        <el-form-item label="检测卡类型" prop="detectionType">
          <el-select v-model="editAddForm.detectionType" placeholder="请选择">
            <el-option
              v-for="item in TJKNameList"
              :key="item.id"
              :label="item.name"
              :value="item.dictValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="数据是否共享" prop="dataSharing">
          <el-select v-model="editAddForm.dataSharing" placeholder="请选择">
            <el-option label="是" :value="'1'"></el-option>
            <el-option label="否" :value="'0'"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="检测报告是否可见" prop="patientView">
          <el-input v-model="editAddForm.patientView"></el-input>
        </el-form-item>
        <el-form-item label="用户答题方式" prop="patientAnswerWay">
          <el-input v-model="editAddForm.patientAnswerWay"></el-input>
        </el-form-item>

        <el-form-item label="状态" prop="status">
          <el-select v-model="editAddForm.status" placeholder="请选择">
            <el-option label="启用" :value="1"></el-option>
            <el-option label="禁用" :value="0"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editPageEnter">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { regionData } from "element-china-area-data";
export default {
  data() {
    return {
      input: "",
      userList: [],
      // 获取用户列表的参数对象
      pageSize: 10,
      pageNum: 1,
      total: 0,
      currentRow: null,
      infoTitle: "",
      editDialogVisible: false,
      // 修改
      editAddForm: {
        account: "",
        hospitalLogo: "",
        address: "",
        detailedAddress: "",
        customer: "",
        customerTel: "",
        salesmanUuid: "",
        customerTel: null,
        salesmanUuid: "",
        description: "",
        collectMode: "",
        checked: "",
        detectionType: "",
        dataSharing: "",
        patientView: "",
        patientAnswerWay: "",

        roleId: null,
        deptId: null,
        status: 0
      },
      TJKNameList: [],
      hosAddress: "",
      hosOptions: regionData,
      addDialogVisible: false,
      RoleList: [],
      hosMenuList: []
    };
  },
  created() {
    this.getUserList();
    this.getDictionaryEleList();
  },
  methods: {
    // 获取用户列表
    async getUserList() {
      const { data: res } = await this.$http.post(
        "hospital/getHospitalDetailList",
        {
          pageSize: this.pageSize,
          pageNum: this.pageNum
        }
      );
      if (res.code != 200) return this.$message.error("数获取失败");
      this.userList = res.rows;
      this.total = res.total;
    },
    async getDictionaryEleList() {
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
      this.$refs.loginFormRef.resetFields();
    },
    async editPageEnter() {
      let httpUrl = "";
      let parm = {};
      if (this.infoTitle == "修改信息") {
        httpUrl = "hospital/updateHospitalDetail";
        parm = {
          id: this.editId,
          name: this.editAddForm.name,
          userName: this.editAddForm.userName,
          gender: this.editAddForm.gender
        };
      } else {
        httpUrl = "hospital/saveHospitalDetail";
        parm = {
          name: this.editAddForm.name,
          userName: this.editAddForm.userName,
          password: this.$md5(this.editAddForm.password)
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
      this.infoTitle = "新增医院信息";
      this.editDialogVisible = true;
      this.editAddForm = {};
    },
    // 级联选择地址
    handleChange() {},
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
      const { data: res } = await this.$http.get(
        "/hospital/delHospitalDetail",
        { id: info.id }
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
    // 状态码数字转中文
    ifendcase(val) {
      if (val.appStatus == "1") {
        return "已激活";
      } else {
        return "未激活";
      }
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
      this.editAddForm.fdPhotoPath = res.data;
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
.el-dialog__header {
  height: 30px !important;
  background-color: #4991e3;
  padding: 15px 20px 10px !important;
}
</style>
