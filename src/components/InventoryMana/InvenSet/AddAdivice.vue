<template>
  <div class="CONNECT">
    <el-card>
      <ul>
        <li>
          <h3>分数表达式</h3>
          <el-input v-model="score" style="margin:10px 0 20px"></el-input>
        </li>
        <li>
          <h3>评语</h3>
          <!-- 富文本编辑器 -->
          <quill-editor
            class="editor"
            ref="myTextEditor"
            v-model="commentInfo"
            :options="quillOption"
            style="margin:10px 0 20px;height:40%;"
          ></quill-editor>
        </li>
        <li>
          <h3 class="adviceditor">建议</h3>
          <vue-ueditor-wrap v-model="adviceInfo" :config="myConfig"></vue-ueditor-wrap>
        </li>
      </ul>
      <!-- 完成编辑按钮 -->
      <el-button @click.prevent.stop="HandleClickOver" type="primary" size="medium " class="endEdit">完成编辑</el-button>
    </el-card>
  </div>
</template>
<script>
import quillConfig from "../../../assets/js/quill-config";
import "../../../../public/UEditor/themes/default/css/ueditor.css";
import "../../../../public/UEditor/themes/default/css/ueditor.min.css";
import VueUeditorWrap from "vue-ueditor-wrap";
export default {
  components: {
    VueUeditorWrap
  },
  data() {
    return {
      sheetUuid: "",
      score: "",
      commentInfo: "",
      adviceInfo: "",
      quillOption: quillConfig,
      myConfig: {
        // 编辑器不自动被内容撑高
        autoHeightEnabled: true,
        // 初始容器高度
        initialFrameHeight: 240,
        // 初始容器宽度
        initialFrameWidth: "100%",
        // 上传文件接口（这个地址是我为了方便各位体验文件上传功能搭建的临时接口，请勿在生产环境使用！！！）
        // serverUrl: this.UPLOAD_IMG,
        // UEditor 资源文件的存放路径，如果你使用的是 vue-cli 生成的项目，通常不需要设置该选项，vue-ueditor-wrap 会自动处理常见的情况，如果需要特殊配置，参考下方的常见问题2
        UEDITOR_HOME_URL: "/UEditor/"
      }
    };
  },
  created() {
    this.sheetUuid = window.localStorage.getItem("sheetUuid").uuid;
  },
  methods: {
    // 确认添加
    async HandleClickOver() {
      console.log(
        this.adviceInfo
      );
      
      if (
        this.score.trim() == "" ||
        this.commentInfo.trim() == "" ||
        this.adviceInfo.trim() == ""
      ) {
        return this.$message.error("请输入有效内容");
      } else {
        const { data: res } = await this.$http.post(
          this.$ajax + "sheet/addAdviceComment",
          {
            sheetUuid: this.sheetUuid,
            comment: this.commentInfo,
            advice: this.adviceInfo,
            scoreCron: this.score
          }
        );
        if (res.code != 200) return this.$message.error("添加失败");
        this.$message.success("添加成功");
        this.$router.push("InvenSet");
      }
    }
  }
};
</script>

<style lang='less' scoped>
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
.adviceditor {
  margin-bottom: 10px;
}
.CONNECT .el-button--primary {
  color: #fff;
  background-color: #ffab1a;
  border-color: #ffab1a;
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
</style>