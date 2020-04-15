<template>
  <div>
    <el-card>
      <el-row :gutter="20">
        <el-col :span="7">
          <el-input placeholder="请输入内容" v-model="input" @keyup.13.native="dicSearch" clearable>
            <el-button slot="append" icon="el-icon-search" @click="dicSearch"></el-button>
          </el-input>
        </el-col>
        <!-- 添加按钮 -->
        <el-col :span="4">
          <el-button type="primary" @click="addDictionary">新增字典</el-button>
        </el-col>
      </el-row>
      <!-- 调用公用表格组件 -->
      <EleTable :data="menuList" :header="tableHeaderBig" row-key="id">
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
              v-if="scope.row.isEnable=== '1'"
            >{{ ifendcase(scope.row) }}</span>
            <span v-else style="color:#ff4949;font-weight:700;">{{ ifendcase(scope.row) }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" slot="fixed" fixed="right" label="操作" width="260">
          <template slot-scope="scope">
            <!-- 修改按钮 -->
            <el-button
              size="mini"
              @click="showEditdialog(scope.row)"
              type="primary"
              icon="el-icon-edit"
            >编辑</el-button>
            <!-- 跳转按钮 -->
            <el-button
              size="mini"
              @click="jumpDictionarybtn(scope.row)"
              type="success"
              icon="el-icon-s-unfold"
            >详情</el-button>
            <!-- 删除按钮 -->
            <el-button
              size="mini"
              @click="deleteBtn(scope.row)"
              type="danger"
              icon="el-icon-delete"
            >删除</el-button>
          </template>
        </el-table-column>
      </EleTable>
      <!-- 调用公用封装弹框组件 -->
      <EleDialog
        title="'111'"
        @closeDialog="alldetailsDialog = false"
        :visible.sync="alldetailsDialog"
        :showTit="false"
        :width="'760px'"
      ></EleDialog>
    </el-card>
  </div>
</template>
<script>
import EleTable from "../commonModule/table";
import EleDialog from "../commonModule/dialog";
export default {
  components: { EleTable, EleDialog },
  data() {
    return {
      menuList: [],
      tableHeaderBig: [
        { prop: "name", label: "名称" },
        { prop: "dictValue", label: "键值" },
        { prop: "remark", label: "备注" },
        { prop: "dictSort", label: "排序号" }
      ],
      input: "",
      alldetailsDialog:false
    };
  },
  created() {
    this.getDictionaryList();
  },
  methods: {
    async getDictionaryList() {
      const { data: res } = await this.$http.post("dict/list", {
        parentId: 1
      });

      this.menuList = res.data;
    },
    showEditdialog() {
      this.alldetailsDialog = true;
    },
    jumpDictionarybtn() {},
    deleteBtn() {},
    addDictionary() {
      this.DialogVisible = true;
    },
    dicSearch() {},
    // 状态判断
    ifendcase(val) {
      if (val.isEnable == "1") {
        return "启用";
      } else {
        return "禁用";
      }
    }
  }
};
</script>
<style lang='less' scoped>
</style>