<template>
  <div style="padding:30px;overflow:hidden;">
    <el-form ref="loginFormRef" :model="editAddForm" label-width="90px">
      <el-form-item label="计分方式" prop="facName">
        <el-select v-model="editAddForm.facName" placeholder="请选择" style="width:20%;">
          <el-option
            v-for="asItem in options"
            :key="asItem.value"
            :label="asItem.label"
            :value="asItem.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="指导语" prop="facQues">
        <el-input v-model="editAddForm.facQues"></el-input>
      </el-form-item>
      <el-form-item label="最小预警值" prop="bfacCalc">
        <el-input v-model="editAddForm.bfacCalc"></el-input>
      </el-form-item>
      <el-form-item label="最大预警值" prop="facCalc">
        <el-input v-model="editAddForm.facCalc"></el-input>
      </el-form-item>
    </el-form>
    <el-button type="primary" @click="editPageEnter" class="saveBtn">保 存</el-button>
  </div>
</template>
<script>
export default {
  data() {
    return {
      editAddForm: {
        facName: "",
        facQues: "",
        bfacCalc: "",
        facCalc: ""
      },
      editDialogVisible: false,
      options: [
        {
          value: "总分",
          lable: "总分"
        },
        {
          value: "平均",
          lable: "平均"
        },
        {
          value: "自定义",
          lable: "自定义"
        }
      ]
    };
  },
  methods: {
    editPageEnter() {}
  }
};
</script>
<style lang='less'>
.saveBtn {
  float: right;
  margin-right: 30px;
}
</style>