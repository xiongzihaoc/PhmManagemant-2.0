<template>
  <div class="CONNECT">
    <el-card>
      <ul>
        <li>
          <h3>分数表达式</h3>
          <el-input v-model="infoForm.scoreCron" style="margin:10px 0 20px"></el-input>
        </li>
        <li>
          <h3>评语</h3>
          <!-- 富文本编辑器 -->
          <quill-editor
            class="editor"
            ref="myTextEditor"
            v-model="infoForm.comment"
            :options="editorOption"
            style="margin:10px 0 20px"
          ></quill-editor>
        </li>
        <li class="adviceditor">
          <h3>建议</h3>
          <!-- 富文本编辑器 -->
          <quill-editor
            class="editor"
            ref="myTextEditor"
            v-model="infoForm.advice"
            :options="editorOption"
            style="margin:10px 0 20px;height:40%;"
          ></quill-editor>
        </li>
      </ul>
      <!-- 完成编辑按钮 -->
      <el-button
        @click.prevent.stop="HandleClickOver"
        type="primary"
        class="endEdit"
        size="medium "
      >完成编辑</el-button>
    </el-card>
  </div>
</template>
<script>
import {quillConfig } from '../../../assets/js/quill-config'
export default {
  data() {
    return {
      infoForm: {},
      sheetUuid: "",
      editorOption: quillConfig
    };
  },
  created() {
    this.infoForm = JSON.parse(this.$route.query.info);
    console.log(this.infoForm);
  },
  methods: {
    // 确认添加
    async HandleClickOver() {
        console.log(this.infoForm.comment);
        
    //   if (
    //     this.infoForm.scoreCron.trim() == "" ||
    //     this.infoForm.advice.trim() == "" ||
    //     this.infoForm.comment.trim() == ""
    //   ) {
    //     return this.$message.error("请输入有效内容");
    //   } else {
    //     const { data: res } = await this.$http.post(
    //       this.$ajax + "sheet/updateAdviceComment",
    //       {
    //         id: this.infoForm.id,
    //         comment: this.infoForm.comment,
    //         advice: this.infoForm.advice,
    //         scoreCron: this.infoForm.scoreCron
    //       }
    //     );
    //     if (res.code != 200) return this.$message.error("修改失败");
    //     this.$message.success("修改成功");
    //     this.$router.push("InvenSet");
    //   }
    }
  },
  mounted(){
      quillConfig.initButton();
  },
};
</script>
<style lang='less'>
ul {
  list-style: none;
}
/* 完成编辑按钮改变颜色 */
.endEdit {
  display: block;
  margin: 0 auto;
  margin-top: 10px;
  width: 50%;
  background-color: #ffab1a;
}

.CONNECT .el-button--primary {
  color: #fff;
  background-color: #ffab1a;
  border-color: #ffab1a;
}
.adviceditor .ql-editor {
  height: 420px;
}
/* 汉化 */
.ql-toolbar.ql-snow {
  background-color: #f0f0ee;
}
.ql-snow .ql-tooltip {
  z-index: 999;
}
.ql-snow .ql-tooltip[data-mode="link"]::before {
  content: "请输入链接地址:";
}
.ql-snow .ql-tooltip.ql-editing a.ql-action::after {
  border-right: 0px;
  content: "保存";
  padding-right: 0px;
}

.ql-snow .ql-tooltip[data-mode="video"]::before {
  content: "请输入视频地址:";
}

.ql-snow .ql-picker.ql-size .ql-picker-label::before,
.ql-snow .ql-picker.ql-size .ql-picker-item::before {
  content: "14px";
}
.ql-toolbar.ql-snow .ql-picker.ql-expanded .ql-picker-options {
  z-index: 999;
}
.ql-snow .ql-picker.ql-size .ql-picker-label[data-value="small"]::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value="small"]::before {
  content: "10px";
}
.ql-snow .ql-picker.ql-size .ql-picker-label[data-value="large"]::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value="large"]::before {
  content: "18px";
}
.ql-snow .ql-picker.ql-size .ql-picker-label[data-value="huge"]::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value="huge"]::before {
  content: "32px";
}

.ql-snow .ql-picker.ql-header .ql-picker-label::before,
.ql-snow .ql-picker.ql-header .ql-picker-item::before {
  content: "文本";
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="1"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="1"]::before {
  content: "标题1";
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="2"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="2"]::before {
  content: "标题2";
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="3"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="3"]::before {
  content: "标题3";
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="4"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="4"]::before {
  content: "标题4";
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="5"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="5"]::before {
  content: "标题5";
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="6"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="6"]::before {
  content: "标题6";
}

.ql-snow .ql-picker.ql-font .ql-picker-label::before,
.ql-snow .ql-picker.ql-font .ql-picker-item::before {
  content: "标准字体";
}
.ql-snow .ql-picker.ql-font .ql-picker-label[data-value="serif"]::before,
.ql-snow .ql-picker.ql-font .ql-picker-item[data-value="serif"]::before {
  content: "衬线字体";
}
.ql-snow .ql-picker.ql-font .ql-picker-label[data-value="monospace"]::before,
.ql-snow .ql-picker.ql-font .ql-picker-item[data-value="monospace"]::before {
  content: "等宽字体";
}
</style>