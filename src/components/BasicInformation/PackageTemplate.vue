<template>
  <div class="Boxheight">
    <!-- 卡片视图 -->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="7">
          <el-input
            placeholder="请输入内容"
            v-model="input"
            @keyup.13.native="dicSearch"
            clearable
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="dicSearch"
            ></el-button>
          </el-input>
        </el-col>
        <!-- 添加按钮 -->
        <el-col :span="4">
          <el-button type="primary" @click="addDictionary"
            >新增套餐模板</el-button
          >
        </el-col>
      </el-row>
      <!-- 公用表格组件 -->
      <EleTable :data="menuList" :header="tableHeaderBig" row-key="id">
        <el-table-column
          align="center"
          slot="fixed"
          fixed="right"
          prop="status"
          label="状态"
          :formatter="ifendcase"
        >
          <template slot-scope="scope">
            <span
              style="color:#13ce66;font-weight:700;"
              v-if="scope.row.status === '1'"
              >{{ ifendcase(scope.row) }}</span
            >
            <span v-else style="color:#ff4949;font-weight:700;">{{
              ifendcase(scope.row)
            }}</span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          slot="fixed"
          fixed="right"
          label="操作"
          width="180"
        >
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
              @click="removeById(scope.row)"
              type="danger"
              icon="el-icon-delete"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </EleTable>
    </el-card>
    <!-- 修改添加提示框 -->
    <el-dialog
      :title="dialogTitle"
      :visible.sync="DialogVisible"
      width="40%"
      @closed="AddEditDialogClosed"
      @open="AddEditDialogOpend"
      v-dialogDrag
    >
      <el-form ref="addFormRef" :model="addEditForm" label-width="80px">
        <el-form-item label="套餐名称" prop="name">
          <el-input v-model="addEditForm.name"></el-input>
        </el-form-item>
        <el-form-item label="套餐类别" prop="type">
          <el-input v-model="addEditForm.type"></el-input>
        </el-form-item>
        <el-form-item label="选择科室" prop="officeCode">
          <el-cascader
            v-model="addEditForm.officeCode"
            :options="eleNameList"
            :show-all-levels="false"
            @change="handleChange"
            :props="optionProps"
            ref="CascaderRef"
            style="width:100%"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="量表选择" prop="sheets">
          <el-select
            multiple
            v-model="addEditForm.sheets"
            placeholder="请选择"
            style="width:100%"
          >
            <el-option
              v-for="item in userList"
              :key="item.uuid"
              :label="item.name"
              :value="item.uuid"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="价格">
          <el-input v-model="addEditForm.price"></el-input>
        </el-form-item>
        <el-form-item label="套餐描述">
          <el-input v-model="addEditForm.describes"></el-input>
        </el-form-item>
        <el-form-item
          label="状态"
          prop="status"
          v-if="this.dialogTitle == '修改信息'"
          v-show="true"
        >
          <el-select v-model="addEditForm.status" placeholder="请选择">
            <el-option label="启用" :value="'1'"></el-option>
            <el-option label="禁用" :value="'0'"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="DialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addEditEnter">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import EleTable from "../commonModule/table";
export default {
  components: { EleTable },
  data() {
    return {
      input: "",
      tableHeaderBig: [
        { label: "序号", type: "index", width: 60 },
        { prop: "name", label: "套餐名称" },
        { prop: "officeName", label: "科室名称" },
        { prop: "type", label: "套餐类别" },
        { prop: "price", label: "价格" },
        { prop: "sheetNames", label: "套餐量表" },
        { prop: "describes", label: "套餐描述" }
      ],
      menuList: [],
      eleNameList: [],
      userList: [],
      optionProps: {
        value: "code",
        label: "deptName",
        children: "child"
      },
      addEditForm: {
        name: "",
        type: "",
        price: "",
        describes: "",
        status: "",
        sheets: "",
        officeCode: 100
      },
      selfId: null,
      DialogVisible: false,
      dialogTitle: "",
      goBack: "",
      labelTitle: "",
      uuid: "",
      codeSta: ""
    };
  },
  created() {
    this.getDictionaryList();
  },
  methods: {
    async getDictionaryList() {
      const { data: res } = await this.$http.post(
        this.$ajax + "office_package/list1",
        {
          name: this.input
        }
      );
      this.menuList = res.rows;
    },
    // 获取量表列表
    async getScaleList() {
      const { data: res } = await this.$http.post(this.$ajax + "sheet/list", {
        name: this.input
      });
      if (res.code != 200) return this.$message.error("数据获取失败");
      this.userList = res.rows;
    },
    // 获取科室列表
    async getDictionaryEleList() {
      const { data: res } = await this.$http.post("dept/list", {});
      this.eleNameList = res.data;
    },
    // 确定修改或添加
    addEditEnter() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return this.$message.error("失败");
        let httpUrl = "";
        let parm = {};
        if (this.dialogTitle == "修改信息") {
          httpUrl = "office_package/update";
          parm = {
            id: this.selfId,
            name: this.addEditForm.name,
            officeCode: this.addEditForm.officeCode,
            type: this.addEditForm.type,
            price: this.addEditForm.price,
            sheets: this.addEditForm.sheets.toString(),
            describes: this.addEditForm.describes,
            uuid: this.uuid,
            status: this.addEditForm.status
          };
        } else {
          httpUrl = "office_package/insert";
          parm = {
            name: this.addEditForm.name,
            officeCode: this.addEditForm.officeCode,
            type: this.addEditForm.type,
            price: this.addEditForm.price,
            sheets: this.addEditForm.sheets.toString(),
            describes: this.addEditForm.describes,
            uuid: this.uuid,
            status: this.addEditForm.status
          };
        }
        const { data: res } = await this.$http.post(this.$ajax + httpUrl, parm);
        if (res.code != 200) return this.$message.error(res.msg);
        this.$message.success("操作成功");
        this.getDictionaryList();
        this.DialogVisible = false;
      });
    },
    // 弹框open触发函数
    AddEditDialogOpend() {
      this.getScaleList();
      this.getDictionaryEleList();
    },
    // 修改
    showEditdialog(info) {
      console.log(info);
      this.selfId = info.id;
      this.uuid = info.uuid;
      this.dialogTitle = "修改信息";
      this.addEditForm = JSON.parse(JSON.stringify(info));
      this.addEditForm.sheets = info.sheets.split(",");
      this.DialogVisible = true;
    },
    // 添加按钮
    addDictionary() {
      this.dialogTitle = "新增套餐模板";
      this.addEditForm = {};
      this.DialogVisible = true;
    },
    handleChange(val) {
      console.log(this.$Cascader);
      


      if (val.length <= 1) {
        this.addEditForm.officeCode = val.toString();
      } else if (val.length > 1) {
        this.addEditForm.officeCode = val.pop();
      }
    },
    // 重置
    AddEditDialogClosed() {
      this.$refs.addFormRef.resetFields();
    },
    // 搜索
    dicSearch() {
      this.getDictionaryList();
    },
    // 删除
    async removeById(info) {
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
      const { data: res } = await this.$http.post("office_package/remove", {
        id: info.id
      });
      if (res.code == 200) {
        this.$message.success("删除成功");
        this.getDictionaryList();
      } else {
        this.$message.error("删除失败");
        return;
      }
    },
    handleChoose(val) {
      console.log(val);
      // this.addEditForm.sheets = val;
    },
    // 跳转下一级
    jumpDictionarybtn(info) {
      this.$router.push({
        path: "/JumpDictionaryNext",
        query: { id: info.id }
      });
    },
    // 状态判断
    ifendcase(val) {
      if (val.status == "1") {
        return "启用";
      } else {
        return "禁用";
      }
    }
  }
};
</script>
<style lang="less"></style>
