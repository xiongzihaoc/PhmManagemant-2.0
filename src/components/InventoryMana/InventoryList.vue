<template>
  <div style="height:100%">
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
          <el-button type="primary" @click="addUsers">新增量表信息</el-button>
        </el-col>
      </el-row>
      <!-- 表格 -->
      <el-table
        tooltip-effect="dark"
        stripe
        ref="singleTable"
        :data="userList"
        highlight-current-row
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
          prop="name"
          label="量表名称"
          show-overflow-tooltip
        ></el-table-column>

        <el-table-column align="center" prop="type" label="量表类型">
          <template slot-scope="scope">
            <span v-if="scope.row.type === '1'">{{ "心理类" }}</span>
            <span v-else>{{ "疾病类" }}</span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="officeTypeName"
          label="科室类型"
        ></el-table-column>
        <el-table-column
          align="center"
          prop="price"
          label="量表价格(元)"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          align="center"
          prop="state"
          label="状态"
          :formatter="ifendcase"
        >
          <template slot-scope="scope">
            <span
              style="color:#13ce66;font-weight:700;"
              v-if="scope.row.state === '1'"
              >{{ ifendcase(scope.row) }}</span
            >
            <span v-else style="color:#E6A23C;font-weight:700;">{{
              ifendcase(scope.row)
            }}</span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="createBy"
          label="创建人"
        ></el-table-column>
        <el-table-column
          align="center"
          prop="createTime"
          label="创建时间"
          width="160"
        >
          <template slot-scope="scope">
            <div>{{ timesChangeDate(scope.row.createTime) }}</div>
          </template>
        </el-table-column>

        <el-table-column align="center" prop="operate" label="操作" width="300">
          <template slot-scope="scope">
            <!-- 修改按钮 -->
            <el-button
              size="mini"
              @click="showEditdialog(scope.row)"
              type="primary"
              icon="el-icon-edit"
              >编辑</el-button
            >
            <!-- 修改按钮 -->
            <el-button
              size="mini"
              @click="cloneDialog(scope.row)"
              type="warning"
              icon="el-icon-document-copy"
              >克隆</el-button
            >
            <el-dropdown style="margin-left:10px;">
              <el-button type="primary" size="mini">
                量表设计
                <i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item @click.native="addDictionarybtn(scope.row)"
                  >题目列表</el-dropdown-item
                >
                <el-dropdown-item @click.native="invenSet(scope.row)"
                  >量表设置</el-dropdown-item
                >
                <el-dropdown-item @click.native="invenAnalyze(scope.row)"
                  >量表分析</el-dropdown-item
                >
              </el-dropdown-menu>
            </el-dropdown>
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
      width="40%"
      v-dialogDrag
    >
      <el-form
        ref="loginFormRef"
        :model="editAddForm"
        label-width="80px"
        @closed="editDialogClosed"
      >
        <el-form-item label="量表名称" prop="name">
          <el-input v-model="editAddForm.name" style="width:100%;"></el-input>
        </el-form-item>
        <el-form-item label="量表类型" prop="type">
          <el-select
            v-model="editAddForm.type"
            clearable
            placeholder="请选择"
            style="width:100%"
          >
            <el-option
              v-for="item in sheetTypeList"
              :key="item.id"
              :label="item.name"
              :value="item.dictValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="科室类型" prop="officeType">
          <el-select
            v-model="editAddForm.officeType"
            clearable
            placeholder="请选择"
            style="width:100%"
          >
            <el-option
              v-for="item in eleNameList"
              :key="item.id"
              :label="item.name"
              :value="item.dictValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="量表价格" prop="price">
          <el-input v-model="editAddForm.price" style="width:100%"></el-input>
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
      editDialogVisible: false,
      infoTitle: "",
      editId: null,
      // 修改
      editAddForm: {
        name: "",
        type: "",
        price: "",
        state: "",
        officeType: ""
      },
      eleNameList: [],
      sheetTypeList: [],
      addDialogVisible: false,
      defaultProps: {
        label: "deptName",
        children: "child"
      },
      addEditValue: "",
      RoleList: [],
      hosMenuList: [],
      editUuid: ""
    };
  },
  created() {
    this.getScaleList();
    this.getDictionaryEleList();
    this.getSheetTypeList();
  },

  methods: {
    // 获取量表列表
    async getScaleList() {
      const { data: res } = await this.$http.post(this.$ajax + "sheet/list", {
        pageSize: this.pageSize,
        pageNum: this.pageNum,
        name: this.input
      });
      // console.log(res);

      if (res.code != 200) return this.$message.error("数获取失败");
      this.userList = res.rows;
      console.log(this.userList);
      
      this.total = res.total;
    },
    // 数据字典科室列表
    async getDictionaryEleList() {
      const { data: res } = await this.$http.post("dict/getPreviewData", {
        dictValue: "officeLable"
      });
      console.log(res);
      this.eleNameList = res.data;
    },
    // 数据字典量表类型列表
    async getSheetTypeList() {
      const { data: res } = await this.$http.post("dict/getPreviewData", {
        dictValue: "SHEET_TYPE"
      });
      console.log(res);
      
      this.sheetTypeList = res.data;
    },
    // 跳转到题目列表
    addDictionarybtn(info) {
      window.localStorage.setItem("sheetUuid", JSON.stringify(info));
      this.$router.push({
        path: "/addsheet"
      });
    },
    // 跳转到量表设置
    invenSet(info) {
      window.localStorage.setItem("sheetUuid", JSON.stringify(info));
      this.$router.push({
        path: "/InvenSet"
      });
    },
    // 跳转到量表分析
    invenAnalyze(info) {
      window.localStorage.setItem("sheetUuid", JSON.stringify(info));
      this.$router.push({
        path: "/InvenAnalyze"
      });
    },
    // 修改
    showEditdialog(info) {
      this.editUuid = info.uuid;
      this.editAddForm = JSON.parse(JSON.stringify(info));
      this.infoTitle = "修改信息";
      this.editDialogVisible = true;
      this.showEditId = info.id;
    },
    editDialogClosed() {
      this.$refs.editFormRef.resetFields();
    },
    // 添加用户
    addUsers() {
      this.infoTitle = "新增量表";
      this.editDialogVisible = true;
      this.editAddForm = {};
      this.addEditValue = "";
    },
    editPageEnter() {
      let httpUrl = "";
      let parm = {};
      if (this.infoTitle == "修改信息") {
        httpUrl = "sheet/update";
        parm = {
          uuid: this.editUuid,
          name: this.editAddForm.name,
          type: this.editAddForm.type,
          price: this.editAddForm.price,
          state: this.editAddForm.state,
          officeType: this.editAddForm.officeType
        };
      } else if (this.infoTitle == "新增量表") {
        httpUrl = "sheet/add";
        parm = {
          name: this.editAddForm.name,
          type: this.editAddForm.type,
          price: this.editAddForm.price,
          state: this.editAddForm.state,
          officeType: this.editAddForm.officeType
        };
      } else {
        httpUrl = "sheet/copy";
        parm = {
          uuid: this.cloneEditId,
          name: this.editAddForm.name,
          type: this.editAddForm.type,
          price: this.editAddForm.price,
          state: this.editAddForm.state,
          officeType: this.editAddForm.officeType
        };
      }
      this.$refs.loginFormRef.validate(async valid => {
        if (!valid) return;
        const { data: res } = await this.$http.post(this.$ajax + httpUrl, parm);
        if (res.code != 200) return this.$message.error(res.msg);
        this.$message.success(res.msg);
        this.getScaleList();
        this.editDialogVisible = false;
      });
    },
    // 复用克隆此量表
    cloneDialog(info) {
      console.log(info);

      this.editAddForm = JSON.parse(JSON.stringify(info));
      this.infoTitle = "克隆量表";
      this.editDialogVisible = true;
      this.cloneEditId = info.uuid;
    },
    // 搜索
    systemSearch() {
      this.getScaleList();
    },
    // 状态码数字转中文
    ifendcase(val) {
      if (val.state == "1") {
        return "有效";
      } else {
        return "无效";
      }
    },
    // 分页
    handleSizeChange(newSize) {
      this.pageSize = newSize;
      this.getScaleList();
    },
    handleCurrentChangev(newPage) {
      this.pageNum = newPage;
      this.getScaleList();
    },
    // 转换时间格式
    timesChangeDate(times) {
      var date = new Date(times);
      var y = date.getFullYear();
      var mon = date.getMonth() + 1;
      var d = date.getDate();
      var h = date.getHours();
      var m = date.getMinutes();
      var s = date.getSeconds();
      if (mon < 10) {
        mon = "0" + mon;
      }
      if (d < 10) {
        d = "0" + d;
      }
      if (h < 10) {
        h = "0" + h;
      }
      if (m < 10) {
        m = "0" + m;
      }
      if (s < 10) {
        s = "0" + s;
      }
      return `${y}-${mon}-${d} ${h}:${m}:${s}`;
    }
  }
};
</script>
<style scoped>
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
</style>
