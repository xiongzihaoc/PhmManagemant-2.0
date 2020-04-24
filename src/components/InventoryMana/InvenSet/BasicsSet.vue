<template>
  <div style="padding:30px;overflow:hidden;">
    <el-form ref="loginFormRef" :model="editAddForm" label-width="90px">
      <el-form-item label="建议类型" prop="adviceType">
        <el-select v-model="editAddForm.adviceType" placeholder="请选择" style="width:100%">
          <el-option label="普通式" value="0"></el-option>
          <el-option label="参与整合式" value="1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="计分方式" prop="sumCorn" style="width:50%">
        <el-input v-model="editAddForm.sumCorn"></el-input>
      </el-form-item>
      <el-form-item label="指导语" prop="instruction" style="width:50%">
        <el-input v-model="editAddForm.instruction"></el-input>
      </el-form-item>
      <el-form-item label="预警表达式" prop="warnCorn" style="width:50%">
        <el-input v-model="editAddForm.warnCorn"></el-input>
      </el-form-item>
      <el-form-item label="备注" prop="memo" style="width:50%">
        <el-input v-model="editAddForm.memo"></el-input>
      </el-form-item>
      <el-form-item style="width:50%;text-align: center;">
        <el-button type="primary" @click.prevent.stop="editPageEnter" class="saveBtn">保存信息</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  data() {
    return {
      editAddForm: {
        sumCorn: "",
        instruction: "",
        warnCorn: "",
        adviceType: "",
        memo: ""
      },
      editDialogVisible: false
    };
  },
  created() {
    
    
    this.sheetUuid = JSON.parse(window.localStorage.getItem("sheetUuid")).uuid;
    this.editAddForm = JSON.parse(window.localStorage.getItem("sheetUuid"));
    console.log(this.editAddForm);
  },
  methods: {
    async editPageEnter() {
      const { data: res } = await this.$http.post(this.$ajax + "sheet/update", {
        uuid: this.sheetUuid,
        sumCorn: this.editAddForm.sumCorn,
        instruction: this.editAddForm.instruction,
        warnCorn: this.editAddForm.warnCorn,
        adviceType: this.editAddForm.adviceType,
        memo: this.editAddForm.memo
      });
      if (res.code != 200) return this.$message.error("保存失败");
      this.$message.success("保存成功");
      this.$router.push("sheet/list");
    }
  }
};
</script>
<style scoped>
.el-form-item {
  margin-left: 50%;
  transform: translate(-50%);
}
</style>
