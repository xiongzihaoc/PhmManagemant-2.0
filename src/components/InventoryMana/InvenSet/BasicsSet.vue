<template>
  <div style="padding:30px;overflow:hidden;">
    <el-form ref="loginFormRef" :model="editAddForm" label-width="90px">
      <el-form-item label="建议类型" prop="adviceType">
        <el-select v-model="editAddForm.adviceType" placeholder="请选择" style="width:20%;">
          <el-option label="普通式" value="0"></el-option>
          <el-option label="参与整合式" value="1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="计分方式">
        <el-select v-model="choose" placeholder="请选择" style="width:20%;">
          <el-option
            v-for="asItem in options"
            :key="asItem.value"
            :label="asItem.label"
            :value="asItem.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="自定义" prop="sumCron" v-if="this.choose == '自定义'" v-show="true">
        <el-input v-model="editAddForm.sumCron"></el-input>
      </el-form-item>
      <el-form-item label="指导语" prop="instruction">
        <el-input v-model="editAddForm.instruction"></el-input>
      </el-form-item>
      <el-form-item label="预警表达式" prop="warnCorn">
        <el-input v-model="editAddForm.warnCorn"></el-input>
      </el-form-item>
      <el-form-item label="备注" prop="memo">
        <el-input v-model="editAddForm.memo"></el-input>
      </el-form-item>
    </el-form>
    <el-button type="primary" @click.prevent.stop="editPageEnter" class="saveBtn">保 存</el-button>
  </div>
</template>
<script>
export default {
  data() {
    return {
      choose: "",
      editAddForm: {
        sumCron: "",
        instruction: "",
        warnCorn: "",
        adviceType: "",
        memo: ""
      },
      editDialogVisible: false,
      options: [
        {
          value: "sum",
          lable: "总分"
        },
        {
          value: "avg",
          lable: "平均"
        },
        {
          value: "自定义",
          lable: "自定义"
        }
      ]
    };
  },
  created() {
    this.sheetUuid = JSON.parse(window.localStorage.getItem("sheetUuid")).uuid;
    this.editAddForm = JSON.parse(window.localStorage.getItem("sheetUuid"));
  },
  methods: {
    async editPageEnter() {
      if (this.choose != "自定义") {
        const { data: res } = await this.$http.post(
          this.$ajax + "sheet/update",
          {
            uuid: this.sheetUuid,
            sumCron: this.choose,
            instruction: this.editAddForm.instruction,
            warnCorn: this.editAddForm.warnCorn,
            adviceType: this.editAddForm.adviceType,
            memo: this.editAddForm.memo
          }
        );
        if (res.code != 200) return this.$message.error("保存失败");
        this.$message.success("保存成功");
        this.$router.push("sheet/list");
      } else {
        const { data: res } = await this.$http.post(
          this.$ajax + "sheet/update",
          {
            uuid: this.sheetUuid,
            sumCron: this.editAddForm.sumCron,
            instruction: this.editAddForm.instruction,
            warnCorn: this.editAddForm.warnCorn,
            adviceType: this.editAddForm.adviceType,
            memo: this.editAddForm.memo
          }
        );
        if (res.code != 200) return this.$message.error("保存失败");
        this.$message.success("保存成功");
        this.$router.push("sheet/list");
      }
    }
  }
};
</script>
<style lang='less'>
.saveBtn {
  float: right;
  margin-right: 30px;
}
</style>