<template>
  <div class="Boxheight">
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
          <el-button type="primary" @click="addUsers">新增医生信息</el-button>
        </el-col>
      </el-row>
      <!-- 调用公用表格组件 -->
      <EleTable :data="userList" :header="tableHeaderBig" row-key="id">
        <el-table-column align="center" slot="fixed" fixed="right" prop="photoUrl" label="照片">
          <template slot-scope="scope">
            <img id="img" v-if="scope.row.photoUrl != null " :src="scope.row.photoUrl" />
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          slot="fixed"
          fixed="right"
          prop="appStatus"
          label="激活app"
          :formatter="ifendcaseApp"
        >
          <template slot-scope="scope">
            <span
              style="color:#13ce66;font-weight:700;"
              v-if="scope.row.appStatus=== '1'"
            >{{ ifendcaseApp(scope.row) }}</span>
            <span v-else style="color:#ff4949;font-weight:700;">{{ ifendcaseApp(scope.row) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          slot="fixed"
          fixed="right"
          prop="isEnable"
          label="状态"
          :formatter="ifendcase"
        >
          <template slot-scope="scope">
            <span
              style="color:#13ce66;font-weight:700;"
              v-if="scope.row.status=== '1'"
            >{{ ifendcase(scope.row) }}</span>
            <span v-else style="color:#ff4949;font-weight:700;">{{ ifendcase(scope.row) }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" slot="fixed" fixed="right" label="操作" width="100">
          <template slot-scope="scope">
            <!-- 修改按钮 -->
            <el-button
              size="mini"
              @click="showEditdialog(scope.row)"
              type="primary"
              icon="el-icon-edit"
            >编辑</el-button>
            <!-- 跳转按钮 -->
          </template>
        </el-table-column>
      </EleTable>
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
    <el-dialog
      :title="infoTitle"
      :visible.sync="editDialogVisible"
      width="40%"
      @open="getData"
      v-dialogDrag
    >
      <el-form
        ref="loginFormRef"
        :rules="loginRules"
        :model="editAddForm"
        label-width="80px"
        @closed="editDialogClosed"
      >
        <el-form-item label="姓名" prop="name">
          <el-input v-model="editAddForm.name"></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="gender">
          <el-select v-model="editAddForm.gender" placeholder="请选择" style="width:100%;">
            <el-option label="男" value="男"></el-option>
            <el-option label="女" value="女"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="职称" prop="title">
          <el-select
            v-model="editAddForm.title"
            multiple
            clearable
            placeholder="请选择"
            style="width:100%;"
          >
            <el-option
              v-for="item in eleNameList"
              :key="item.id"
              :label="item.name"
              :value="item.name"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="医院科室" prop="office">
          <el-input v-model="addEditValue" @click.native="deptAdd"></el-input>
        </el-form-item>
        <el-form-item label="科室类型" prop="officeLable">
          <el-select v-model="editAddForm.officeLable" style="width:100%;">
            <el-option
              v-for="item in DictDeptList"
              :key="item.id"
              :label="item.name"
              :value="item.dictValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="擅长方向" prop="speciality">
          <div
            v-for="(item,index) in tagList"
            :key="index"
            style="position: relative;padding:1px 5px;background:#409EFF;color:#fff;border-radius:5px;float:left;margin:5px"
          >
            <span>{{item.specialityValue}}</span>
            <i
              class="el-icon-error"
              style="color:orange;font-size: 20px;position: absolute;right: -5px;top: -9px;"
              @click="removeTags(index)"
            ></i>
          </div>

          <div
            style="width: 50px;height: 50px;border: #606266 dashed 1px;text-align: center;float:left;margin-left:10px"
            @click="addCheckTags()"
          >
            <i
              class="el-icon-plus"
              style="font-size: 25px;margin-top: 50%;transform: translateY(-50%);"
            ></i>
          </div>
        </el-form-item>
        <el-form-item label="帐号类型" prop="accountType">
          <el-select v-model="editAddForm.accountType" style="width:100%">
            <el-option label="医生帐号" value="0"></el-option>
            <el-option label="科室帐号" value="1"></el-option>
            <el-option label="部门帐号" value="2"></el-option>
            <el-option label="医院帐号" value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="editAddForm.phone"></el-input>
        </el-form-item>
        <el-form-item label="登录名" prop="userName">
          <el-input v-model="editAddForm.userName"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password" v-if="infoTitle == '新增医生信息'" v-show="true">
          <el-input v-model="editAddForm.password"></el-input>
        </el-form-item>
        <el-form-item label="简介" prop="introduction">
          <el-input
            type="textarea"
            :autosize="{ minRows: 5, maxRows: 10}"
            v-model="editAddForm.introduction"
          ></el-input>
        </el-form-item>
        <el-form-item label="照片" prop="photoUrl">
          <el-upload
            class="avatar-uploader"
            :action="this.UPLOAD_IMG"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :on-progress="uploadVideoProcess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="editAddForm.photoUrl" :src="editAddForm.photoUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
          <el-progress
            v-if="videoFlag == true"
            :percentage="percentageFile"
            style="margin-top:20px;"
          ></el-progress>
        </el-form-item>
        <el-form-item label="状态" prop="status" v-if="infoTitle == '修改信息'" v-show="true">
          <el-select v-model="editAddForm.status" placeholder="请选择">
            <el-option label="启用" :value="'1'"></el-option>
            <el-option label="禁用" :value="'0'"></el-option>
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
    <!-- 擅长方向tags选择弹框 -->
    <el-dialog title="选择标签" :visible.sync="tagDialogVisible" width="40%" v-dialogDrag>
      <el-form
        ref="addTagFormRef"
        :rules="addTagRules"
        :model="addtagForm"
        label-width="80px"
        @closed="tagDialogClosed"
      >
        <el-form-item label="添加标签" prop="specialityValue">
          <el-input v-model="addtagForm.specialityValue"></el-input>
        </el-form-item>
        <el-form-item label="添加颜色" prop="specialityColor">
          <el-select v-model="addtagForm.specialityColor">
            <el-option label="黄色" value="#FFF500"></el-option>
            <el-option label="绿色" value="#5B972F"></el-option>
            <el-option label="红色" value="#E80000"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="tagDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addtagEnter">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import EleTable from "../commonModule/table";
export default {
  components: { EleTable },
  data() {
    var checkMobile = (rule, value, cb) => {
      const regMoblie = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;
      if (regMoblie.test(value)) {
        return cb();
      }
      return cb(new Error("请输入合法的手机号"));
    };
    return {
      input: "",
      tableHeaderBig: [
        { prop: "name", label: "姓名" },
        { prop: "gender", label: "性别" },
        { prop: "title", label: "职称" },
        { prop: "hospital", label: "医院" },
        { prop: "office", label: "科室" },
        { prop: "phone", label: "手机号" },
        { prop: "officeLableValue", label: "科室类型" },
        { prop: "officeLableValue", label: "擅长方向" },
        { prop: "userName", label: "登录名" },
        { prop: "introduction", label: "简介" }
      ],
      userList: [],
      // 获取用户列表的参数对象
      pageSize: 10,
      pageNum: 1,
      total: 0,
      currentRow: null,
      editDialogVisible: false,
      infoTitle: "",
      editId: null,
      // 修改
      editAddForm: {
        name: "",
        gender: "",
        title: "",
        dcDept: "",
        phone: null,
        userName: "",
        password: "",
        officeLable: "",
        introduction: "",
        status: "",
        accountType: "",
        photoUrl: ""
      },
      eleNameList: [],
      addDeptForm: {},
      imageUrl: "",
      tranMidName: "",
      videoFlag: false,
      percentageFile: 0,
      addDialogVisible: false,
      addDeptDialogVisible: false,
      idArr: [],
      defaultProps: {
        label: "deptName",
        children: "child"
      },
      addEditValue: "",
      showEditId: null,
      cloneEditId: null,
      DictDeptList: [],
      RoleList: [],
      tagList: [],
      hosMenuList: [],
      loginRules: {
        userName: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 10, message: "长度在 3 到 10 个字符", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 5, max: 16, message: "长度在 6 到 16 个字符", trigger: "blur" }
        ],
        phone: [
          { required: true, message: "手机号不能为空", trigger: "blur" },
          { validator: checkMobile, trigger: "blur" }
        ]
      },
      addTagRules: {
        specialityValue: [
          { required: true, message: "请输入用户名", trigger: "blur" }
        ],
        specialityColor: [
          { required: true, message: "请输入密码", trigger: "blur" }
        ]
      },
      tagDialogVisible: false,
      addtagForm: {
        specialityValue: "",
        specialityColor: ""
      }
    };
  },
  created() {
    this.getUserList();
  },

  methods: {
    // 弹框打开加载下拉数据
    getData() {
      this.getDictionaryEleList();
      this.getDictDeptList();
      this.getHosMenuList();
    },
    // 获取用户列表
    async getUserList() {
      const { data: res } = await this.$http.post("doctor/getDoctorList", {
        pageSize: this.pageSize,
        pageNum: this.pageNum
      });
      if (res.code != 200) return this.$message.error("数获取失败");
      this.userList = res.rows;
      this.total = res.total;
      var specialityArr = res.rows;
      specialityArr.forEach(item => {
        item.speciality = eval(item.speciality);
      });
      console.log(specialityArr);
    },
    // 数据字典职称列表
    async getDictionaryEleList() {
      const { data: res } = await this.$http.post("dict/getPreviewData", {
        dictValue: "YSZC"
      });
      console.log(res);
      this.eleNameList = res.data;
    },
    // // 获取部门列表
    async getHosMenuList() {
      const { data: res } = await this.$http.post("dept/list", {});
      this.hosMenuList = res.data;
      console.log(res);

      this.idArr.push(res.data[0].id);
    },
    // 数据字典科室类型列表
    async getDictDeptList() {
      const { data: res } = await this.$http.post("dict/getPreviewData", {
        dictValue: "officeLable"
      });
      console.log(res);
      this.DictDeptList = res.data;
    },
    // 修改
    showEditdialog(info) {
      console.log(info);
      this.tagList = info.speciality;
      this.idArr.push(info.id);
      this.addEditValue = `${info.hospital} / ${info.office}`;
      this.infoTitle = "修改信息";
      this.editDialogVisible = true;
      this.editAddForm = JSON.parse(JSON.stringify(info));
      this.editId = info.id;
      this.editAddForm.title = info.title.split(",");
    },
    editDialogClosed() {
      this.$refs.loginFormRef.resetFields();
    },
    // 添加用户
    addUsers() {
      console.log(this.addtagForm);
      this.infoTitle = "新增医生信息";
      this.editDialogVisible = true;
      this.editAddForm = {};
      this.addtagForm = {};
      this.tagList = [];
      this.addEditValue = "";
    },
    editPageEnter() {
      console.log(this.tagList);

      let httpUrl = "";
      let parm = {};
      if (this.infoTitle == "修改信息") {
        httpUrl = "doctor/updateDoctor";
        parm = {
          id: this.editId,
          name: this.editAddForm.name,
          userName: this.editAddForm.userName,
          gender: this.editAddForm.gender,
          title: this.editAddForm.title.join(","),
          phone: this.editAddForm.phone,
          dcDept: this.editAddForm.dcDept,
          introduction: this.editAddForm.introduction,
          status: this.editAddForm.status,
          photoUrl: this.editAddForm.photoUrl,
          officeLable: this.editAddForm.officeLable,
          accountType: this.editAddForm.accountType,
          speciality: JSON.stringify(this.tagList)
        };
      } else {
        httpUrl = "doctor/saveDoctor";
        parm = {
          name: this.editAddForm.name,
          userName: this.editAddForm.userName,
          password: this.$md5(this.editAddForm.password),
          gender: this.editAddForm.gender,
          title: this.editAddForm.title.join(","),
          phone: this.editAddForm.phone,
          dcDept: this.editAddForm.dcDept,
          introduction: this.editAddForm.introduction,
          status: this.editAddForm.status,
          photoUrl: this.editAddForm.photoUrl,
          officeLable: this.editAddForm.officeLable,
          accountType: this.editAddForm.accountType,
          speciality: JSON.stringify(this.tagList)
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
      const { data: res } = await this.$http.post("doctor/delDoctor", {
        id: info.id
      });
      if (res.code != 200) return this.$message.error("删除失败");
      this.$message.success("删除成功");
      this.getUserList();
    },
    // 部门新增
    deptAdd(info) {
      this.addDeptDialogVisible = true;
    },
    addDeptEnter() {
      this.addEditValue = this.tranMidName;
      this.addDeptDialogVisible = false;
    },
    handleNodeAddClick(val) {
      this.editAddForm.dcDept = val.code;
      this.tranMidName = val.deptName;
    },
    addDeptDialogClosed() {},
    // 搜索
    systemSearch() {
      this.getUserList();
    },
    // 点击添加tag弹框
    addCheckTags() {
      this.addtagForm = {};
      this.tagDialogVisible = true;
    },
    // 移除tags
    removeTags(index) {
      this.tagList.splice(index, 1);
    },
    addtagEnter() {
      this.tagList.push(this.addtagForm);
      console.log(this.tagList);

      this.tagDialogVisible = false;
    },
    tagDialogClosed() {},
    // 上传照片
    handleAvatarSuccess(res, file) {
      if (res.code != 200) return this.$message.error("上传失败");
      this.percentageFile = 0;
      this.videoFlag = false;
      this.editAddForm.photoUrl = res.data;
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
    // 状态码数字转中文
    ifendcase(val) {
      if (val.status == "1") {
        return "启用";
      } else {
        return "禁用";
      }
    },
    ifendcaseApp(val) {
      if (val.appStatus == "1") {
        return "已激活";
      } else {
        return "未激活";
      }
    },
    // 分页
    handleSizeChange(newSize) {
      this.pageSize = newSize;
      this.getUserList();
    },
    handleCurrentChangev(newPage) {
      this.pageNum = newPage;
      this.getUserList();
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
.el-tag + .el-tag {
  margin-left: 10px;
}

.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>
