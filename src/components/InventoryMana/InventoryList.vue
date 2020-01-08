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
          <el-button type="primary" @click="addUsers">新增量表信息</el-button>
        </el-col>
      </el-row>
      <!-- 表格 -->
      <el-table
        tooltip-effect="dark"
        stripe
        ref="singleTable"
        :data="userList"
        :header-cell-style="{background:'#f5f5f5'}"
        style="width: 100%"
      >
        <el-table-column align="center" type="selection" width="60"></el-table-column>
        <el-table-column align="center" type="index" label="序号" width="60"></el-table-column>
        <el-table-column align="center" prop="name" label="量表名称"></el-table-column>
        <el-table-column align="center" prop="type" label="量表类型"></el-table-column>
        <el-table-column align="center" prop="price" label="量表价格(元)" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" prop="state" label="状态" :formatter="ifendcase">
          <template slot-scope="scope">
            <span style="color:#13ce66" v-if="scope.row.state=== '1'">{{ ifendcase(scope.row) }}</span>
            <span v-else style="color:#E6A23C">{{ ifendcase(scope.row) }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="createBy" label="创建人"></el-table-column>
        <el-table-column align="center" prop="updateBy" label="修改人"></el-table-column>
        <el-table-column align="center" prop="createTime" label="创建时间" width="160">
          <template slot-scope="scope">
            <div>{{timesChangeDate(scope.row.createTime)}}</div>
          </template>
        </el-table-column>

        <el-table-column align="center" prop="operate" label="操作" width="100">
          <template slot-scope="scope">
            <!-- 修改按钮 -->
            <el-button
              size="mini"
              @click="showEditdialog(scope.row)"
              type="primary"
              icon="el-icon-edit"
            >编辑</el-button>
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
        <el-form-item label="量表名称" prop="name">
          <el-input v-model="editAddForm.name"></el-input>
        </el-form-item>
        <el-form-item label="量表类型" prop="type">
          <el-input v-model="editAddForm.type"></el-input>
        </el-form-item>
        <el-form-item label="量表价格" prop="price">
          <el-input v-model="editAddForm.price"></el-input>
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
    var checkMobile = (rule, value, cb) => {
      const regMoblie = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;
      if (regMoblie.test(value)) {
        return cb();
      }
      return cb(new Error("请输入合法的手机号"));
    };
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
        price: ""
      },
      eleNameList: [],
      addDialogVisible: false,
      defaultProps: {
        label: "deptName",
        children: "child"
      },
      addEditValue: "",
      RoleList: [],
      hosMenuList: []
    };
  },
  created() {
    this.getScaleList();
  },

  methods: {
    // 获取量表列表
    async getScaleList() {
      const { data: res } = await this.$http.post(this.$ajax + "sheet/list", {
        pageSize: this.pageSize,
        pageNum: this.pageNum
      });
      if (res.code != 200) return this.$message.error("数获取失败");
      this.userList = res.rows;
      this.total = res.total;
    },
    // 修改
    showEditdialog(info) {
      this.infoTitle = "修改信息";
      this.editDialogVisible = true;
    },
    editDialogClosed() {
      this.$refs.editFormRef.resetFields();
    },
    // 添加用户
    addUsers() {
      this.infoTitle = "新增医生信息";
      this.editDialogVisible = true;
      this.editAddForm = {};
      this.addEditValue = "";
    },
    editPageEnter() {
      let httpUrl = "";
      let parm = {};
      if (this.infoTitle == "修改信息") {
        httpUrl = "doctor/updateDoctor";
        parm = {
          id: this.editId
        };
      } else {
        httpUrl = "sheet/add";
        parm = {
          name: this.editAddForm.name,
          type: this.editAddForm.type,
          price: this.editAddForm.price
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
      this.getScaleList();
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
</style>
