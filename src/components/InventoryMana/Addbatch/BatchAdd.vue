<template>
  <div>
    <div class="title">
      <p>1. 题目与题目之间需空一行，题目可以不加题号，题干中间不得换行</p>
      <p>2. 题干与选项，及各选项之间需回车换行，选项不得以数字开头（会被识别为题干）</p>
      <p>3. 题目无选项直接空一行，会默认识别为文本型题目</p>
      <el-button type="info" plain class="titleBtn" size="small" @click="clearTxt">清空文本框</el-button>
    </div>
    <el-input class="content" type="textarea" :rows="25" v-model="content"></el-input>
    <el-button class="enterBtn" type="primary" @click.prevent.stop="enterBtn()">确定保存</el-button>
  </div>
</template>
<script>
export default {
  // 接收父组件传来的量表Uuid
  props: { sheetUuid: String },
  data() {
    return {
      content: "",
      Uuid: this.sheetUuid
    };
  },
  methods: {
    async enterBtn() {
      if (this.content == "") {
        return this.$message.error("请输入内容");
      } else {
        let obj = [];
        var quesArrs = this.content.split("\n\n");
        for (var i = 0; i < quesArrs.length; i++) {
          var ques = quesArrs[i].split("\n");
          var question = {};
          var quesContent = ques[0];
          var quesType = 1;
          if (quesContent.indexOf("多选") > -1) {
            quesType = 2;
          } else if (quesContent.indexOf("评分") > -1) {
            quesType = 4;
          }
          var sheetUuid = this.Uuid;
          var option = [];
          for (var j = 0; j < ques.length; j++) {
            if (j != 0) {
              var temp_option = { optContent: ques[j], optScore: j };
              option.push(temp_option);
            }
          }
          question = {
            quesContent: quesContent,
            option: option,
            quesType: quesType,
            sheetUuid: sheetUuid
          };
          obj.push(question);
        }

        // 批量增加
        const { data: res } = await this.$http.post(
          this.$ajax + "sheetQues/batchAdd",
          {
            questions: obj
          }
        );
      }
    },
    clearTxt() {
      this.content = "";
    }
  }
};
</script>
<style lang='less'>
.title {
  position: relative;
  font-size: 12px;
  padding: 10px 0;
}
.title p {
  margin-bottom: 10px;
}
.content {
  font-size: 10px;
  font-weight: bold;
}
.enterBtn {
  display: block;
  margin: 0 auto;
  margin-top: 20px;
  margin-bottom: 20px;
}
.el-dialog__footer .el-button--primary {
  background-color: #409eff !important;
  border-color: #409eff !important;
}
.titleBtn {
  position: absolute;
  bottom: 10px;
  right: 10px;
}
.el-icon-close:before {
  color: #ccc;
}
</style>