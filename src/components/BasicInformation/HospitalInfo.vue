<template>
  <div class="Boxheight">
    <!-- 卡片视图 -->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="7">
          <el-input
            placeholder="请输入内容"
            v-model="input"
            @keyup.13.native="systemSearch"
            clearable
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="systemSearch"
            ></el-button>
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
        :header-cell-style="{ background: '#f5f5f5' }"
        style="width: 100%"
      >
        <el-table-column
          align="center"
          type="index"
          label="序号"
          width="60"
        ></el-table-column>
        <el-table-column
          align="center"
          prop="hospital"
          label="医院名称"
        ></el-table-column>
        <el-table-column
          align="center"
          prop="account"
          label="医院账号"
          width="100"
        ></el-table-column>
        <el-table-column align="center" prop="hospitalLogo" label="医院图片">
          <template slot-scope="scope">
            <img
              id="img"
              v-if="scope.row.hospitalLogo != null"
              :src="scope.row.hospitalLogo"
            />
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="address"
          label="省市区"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          align="center"
          prop="detailedAddress"
          label="详细地址"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          align="center"
          prop="customer"
          label="对接人"
        ></el-table-column>
        <el-table-column
          align="center"
          prop="customerTel"
          label="对接人账号"
          width="120"
        ></el-table-column>
        <el-table-column
          align="center"
          prop="salesmanUuid"
          label="销售人员"
        ></el-table-column>
        <el-table-column
          align="center"
          prop="description"
          label="医院介绍"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          align="center"
          prop="collectMode"
          label="收费模式"
          :formatter="ifendcaseSfms"
        ></el-table-column>
        <el-table-column
          align="center"
          prop="detectionType"
          label="检测卡类型"
          :formatter="ifendcaseJck"
        ></el-table-column>
        <el-table-column
          align="center"
          prop="patientAnswerWay"
          label="用户答题方式"
          :formatter="ifendcaseDtfs"
        ></el-table-column>
        <el-table-column
          align="center"
          prop="checked"
          label="检测报告是否审核"
          :formatter="ifendcaseAudit"
        >
          <template slot-scope="scope">
            <span
              style="color:#13ce66;font-weight:700;"
              v-if="scope.row.checked === '1'"
              >{{ ifendcaseAudit(scope.row) }}</span
            >
            <span v-else style="color:#ff4949;font-weight:700;">{{
              ifendcaseAudit(scope.row)
            }}</span>
          </template>
        </el-table-column>

        <el-table-column
          align="center"
          prop="dataSharing"
          label="数据是否共享"
          :formatter="ifendcaseData"
        >
          <template slot-scope="scope">
            <span
              style="color:#13ce66;font-weight:700;"
              v-if="scope.row.dataSharing === '1'"
              >{{ ifendcaseData(scope.row) }}</span
            >
            <span v-else style="color:#ff4949;font-weight:700;">{{
              ifendcaseData(scope.row)
            }}</span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="patientView"
          label="检测报告是否可见"
          :formatter="ifendcaseReport"
        >
          <template slot-scope="scope">
            <span
              style="color:#13ce66;font-weight:700;"
              v-if="scope.row.patientView === '1'"
              >{{ ifendcaseReport(scope.row) }}</span
            >
            <span v-else style="color:#ff4949;font-weight:700;">{{
              ifendcaseReport(scope.row)
            }}</span>
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
              >编辑</el-button
            >
            <!-- 删除按钮 -->
            <el-button
              size="mini"
              @click="removeUserById(scope.row)"
              type="danger"
              icon="el-icon-delete"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChangev"
        :current-page="pageNum"
        :page-sizes="[10, 20, 50]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
    <!-- 增改页面 -->
    <el-dialog
      :title="infoTitle"
      :visible.sync="editDialogVisible"
      v-dialogDrag
      @close="editDialogClosed"
    >
      <el-form
        ref="loginFormRef"
        :model="editAddForm"
        label-width="125px"
        label-position="center"
      >
        <li style="display:flex;justify-content: space-between;">
          <el-form-item label="医院名称" prop="hospital" style="width:48%">
            <el-input v-model="addEditValue" @click.native="deptAdd"></el-input>
          </el-form-item>
          <el-form-item label="医院账号" prop="account" style="width:48%">
            <el-input v-model="editAddForm.account"></el-input>
          </el-form-item>
        </li>
        <li style="display:flex;justify-content: space-between;">
          <el-form-item label="地址" prop="address" style="width:48%">
            <el-cascader
              ref="addressRef"
              v-model="newStr"
              :options="regionData"
              @change="handleChange"
              style="width:100%"
            ></el-cascader>
          </el-form-item>
          <el-form-item
            label="详细地址"
            prop="detailedAddress"
            style="width:48%"
          >
            <el-input v-model="editAddForm.detailedAddress"></el-input>
          </el-form-item>
        </li>
        <li style="display:flex;justify-content: space-between;">
          <el-form-item label="对接人" prop="customer" style="width:48%">
            <el-input v-model="editAddForm.customer"></el-input>
          </el-form-item>
          <el-form-item label="对接人账号" prop="customerTel" style="width:48%">
            <el-input v-model="editAddForm.customerTel"></el-input>
          </el-form-item>
        </li>
        <li style="display:flex;justify-content: space-between;">
          <el-form-item label="销售人员" prop="salesmanUuid" style="width:48%">
            <el-input v-model="editAddForm.salesmanUuid"></el-input>
          </el-form-item>
          <el-form-item label="医院介绍" prop="description" style="width:48%">
            <el-input
              type="textarea"
              v-model="editAddForm.description"
            ></el-input>
          </el-form-item>
        </li>

        <li style="display:flex;justify-content: space-between;">
          <el-form-item label="收费模式" prop="collectMode" style="width:48%">
            <el-select
              v-model="editAddForm.collectMode"
              placeholder="请选择"
              style="width:100%"
            >
              <el-option
                v-for="item in SfmsNameList"
                :key="item.id"
                :label="item.name"
                :value="item.dictValue"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="检测卡类型"
            prop="detectionType"
            style="width:48%"
          >
            <el-select
              v-model="editAddForm.detectionType"
              placeholder="请选择"
              style="width:100%"
            >
              <el-option
                v-for="item in TJKNameList"
                :key="item.id"
                :label="item.name"
                :value="item.dictValue"
              ></el-option>
            </el-select>
          </el-form-item>
        </li>
        <li style="display:flex;justify-content: space-between;">
          <el-form-item
            label="用户答题方式"
            prop="patientAnswerWay"
            style="width:48%"
          >
            <el-select
              v-model="editAddForm.patientAnswerWay"
              placeholder="请选择"
              style="width:100%"
            >
              <el-option
                v-for="item in DtfsNameList"
                :key="item.id"
                :label="item.name"
                :value="item.dictValue"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="检测报告是否审核"
            prop="checked"
            style="width:48%"
          >
            <el-select
              v-model="editAddForm.checked"
              placeholder="请选择"
              style="width:100%"
            >
              <el-option label="是" :value="'1'"></el-option>
              <el-option label="否" :value="'0'"></el-option>
            </el-select>
          </el-form-item>
        </li>
        <li style="display:flex;justify-content: space-between;">
          <el-form-item
            label="数据是否共享"
            prop="dataSharing"
            style="width:48%"
          >
            <el-select
              v-model="editAddForm.dataSharing"
              placeholder="请选择"
              style="width:100%"
            >
              <el-option label="是" :value="'1'"></el-option>
              <el-option label="否" :value="'0'"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="检测报告是否可见"
            prop="patientView"
            style="width:48%"
          >
            <el-select
              v-model="editAddForm.patientView"
              placeholder="请选择"
              style="width:100%"
            >
              <el-option label="是" :value="'1'"></el-option>
              <el-option label="否" :value="'0'"></el-option>
            </el-select>
          </el-form-item>
        </li>
        <el-form-item label="医院图片" prop="hospitalLogo">
          <el-upload
            class="avatar-uploader"
            :action="this.UPLOAD_IMG"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :on-progress="uploadVideoProcess"
            :before-upload="beforeAvatarUpload"
          >
            <img
              v-if="editAddForm.hospitalLogo"
              :src="editAddForm.hospitalLogo"
              class="avatar"
            />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
          <el-progress
            v-if="videoFlag == true"
            :percentage="percentageFile"
            style="margin-top:20px;"
          ></el-progress>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editPageEnter">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 部门新增页面 -->
    <el-dialog
      title="选择医院科室"
      :visible.sync="addDeptDialogVisible"
      width="40%"
      v-dialogDrag
    >
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
import {
  provinceAndCityData,
  regionData,
  provinceAndCityDataPlus,
  regionDataPlus,
  CodeToText,
  TextToCode
} from "element-china-area-data";
export default {
  data() {
    return {
      input: "",
      userList: [],
      // 获取用户列表的参数对象
      pageSize: 10,
      pageNum: 1,
      total: 0,
      infoTitle: "",
      editDialogVisible: false,
      // 修改
      editAddForm: {
        hospital: "",
        account: "",
        address: [],
        hospitalLogo: "",
        deptUuid: "",
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
      addDeptDialogVisible: false,
      addDeptForm: {},
      defaultProps: {
        label: "deptName",
        children: "child"
      },
      idArr: [],
      tranMidName: "",
      addEditValue: "",
      videoFlag: false,
      percentageFile: 0,
      TJKNameList: [],
      SfmsNameList: [],
      DtfsNameList: [],
      regionData,
      newStr: [],
      addDialogVisible: false,
      RoleList: [],
      hosMenuList: []
    };
  },
  created() {
    // console.log(regionData);
    this.getUserList();
    this.getHosMenuList();
    this.getDictionaryEleListOne();
    this.getDictionaryEleListTwo();
    this.getDictionaryEleListThree();
  },
  methods: {
    // 获取医院列表
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
    // 根据数据字典字段获取数据
    async getDictionaryEleListOne() {
      const { data: res } = await this.$http.post("dict/getPreviewData", {
        dictValue: "TJKLX"
      });
      this.TJKNameList = res.data;
    },
    async getDictionaryEleListTwo() {
      const { data: res } = await this.$http.post("dict/getPreviewData", {
        dictValue: "sfms"
      });
      this.SfmsNameList = res.data;
    },
    async getDictionaryEleListThree() {
      const { data: res } = await this.$http.post("dict/getPreviewData", {
        dictValue: "input_patient_version"
      });
      this.DtfsNameList = res.data;
    },
    // 获取部门列表
    async getHosMenuList() {
      const { data: res } = await this.$http.post("dept/list", {});
      this.hosMenuList = res.data;
      this.idArr.push(res.data[0].id);
    },
    // 修改
    showEditdialog(info) {
      console.log(info);
      this.editAddForm = JSON.parse(JSON.stringify(info));
      this.newStr = info.addressCodes.split(",");      
      this.addEditValue = info.hospital;
      this.editId = info.id;
      this.infoTitle = "修改信息";
      this.editDialogVisible = true;
    },
    editDialogClosed() {
      this.newStr = [];
      this.editAddForm = {};
      this.addEditValue = "";
    },
    async editPageEnter() {
      // 区域码转中文
      let ele = this.$refs.addressRef
        .getCheckedNodes()[0]
        .pathLabels.join(",");
      let httpUrl = "";
      let parm = {};
      if (this.infoTitle == "修改信息") {
        httpUrl = "hospital/updateHospitalDetail";
        parm = {
          id: this.editId,
          account: this.editAddForm.account,
          hospitalLogo: this.editAddForm.hospitalLogo,
          address: ele.replace(/,/g, ""),
          addressCodes: this.newStr,
          deptUuid: this.editAddForm.deptUuid,
          detailedAddress: this.editAddForm.detailedAddress,
          customer: this.editAddForm.customer,
          customerTel: this.editAddForm.customerTel,
          salesmanUuid: this.editAddForm.salesmanUuid,
          description: this.editAddForm.description,
          collectMode: this.editAddForm.collectMode,
          checked: this.editAddForm.checked,
          detectionType: this.editAddForm.detectionType,
          dataSharing: this.editAddForm.dataSharing,
          patientView: this.editAddForm.patientView,
          patientAnswerWay: this.editAddForm.patientAnswerWay
        };
      } else {
        httpUrl = "hospital/saveHospitalDetail";
        parm = {
          account: this.editAddForm.account,
          hospitalLogo: this.editAddForm.hospitalLogo,
          address: ele.replace(/,/g, ""),
          addressCodes: this.newStr,
          deptUuid: this.editAddForm.deptUuid,
          detailedAddress: this.editAddForm.detailedAddress,
          customer: this.editAddForm.customer,
          customerTel: this.editAddForm.customerTel,
          salesmanUuid: this.editAddForm.salesmanUuid,
          description: this.editAddForm.description,
          collectMode: this.editAddForm.collectMode,
          checked: this.editAddForm.checked,
          detectionType: this.editAddForm.detectionType,
          dataSharing: this.editAddForm.dataSharing,
          patientView: this.editAddForm.patientView,
          patientAnswerWay: this.editAddForm.patientAnswerWay
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
    },
    // 级联选择地址
    handleChange(val) {
      console.log(val.toString());
      this.newStr = val.toString();
    },
    // 部门新增
    deptAdd() {
      this.addDeptDialogVisible = true;
    },
    addDeptDialogClosed() {
      this.$refs.deptAddFormRef.resetFields();
    },
    addDeptEnter() {
      this.addEditValue = this.tranMidName;
      this.addDeptDialogVisible = false;
    },
    handleNodeAddClick(val) {
      this.editAddForm.deptUuid = val.code;
      this.tranMidName = val.deptName;
    },
    // 删除
    async removeUserById(info) {
      console.log(info);

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
    // 检测报告是否审核状态码数字转中文
    ifendcaseAudit(val) {
      if (val.checked == "1") {
        return "是";
      } else {
        return "否";
      }
    },
    // 数据是否共享状态码数字转中文
    ifendcaseData(val) {
      if (val.dataSharing == "1") {
        return "是";
      } else {
        return "否";
      }
    },
    // 检测报告是否可见状态码数字转中文
    ifendcaseReport(val) {
      if (val.patientView == "1") {
        return "是";
      } else {
        return "否";
      }
    },
    // 收费模式状态码数字转中文
    ifendcaseSfms(val) {
      if (val.collectMode == "zcs") {
        return "总次数";
      } else {
        return "量表价格";
      }
    },
    // 检测卡类型状态码数字转中文
    ifendcaseJck(val) {
      if (val.detectionType == "1") {
        return "虚拟卡";
      } else if (val.detectionType == "2") {
        return "实体卡";
      } else if (val.detectionType == "3") {
        return "虚拟卡 + 实体卡";
      }
    },
    // 用户答题方式状态码数字转中文
    ifendcaseDtfs(val) {
      if (val.patientAnswerWay == "smtz") {
        return "扫码跳转";
      } else {
        return "直接跳转";
      }
    },
    handleAvatarSuccess(res, file) {
      if (res.code != 200) return this.$message.error("上传失败");
      this.percentageFile = 0;
      this.videoFlag = false;
      this.editAddForm.hospitalLogo = res.data;
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
<style scoped>
li {
  list-style: none;
}
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

.avatar-uploader .el-upload {
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader-icon {
  display: block;
  font-size: 28px;
  color: #8c939d;
  width: 70px;
  height: 70px;
  line-height: 70px;
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
.formFlex {
  display: flex;
}
</style>
