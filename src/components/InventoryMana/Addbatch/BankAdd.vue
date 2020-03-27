<template>
  <div>
    <div class="sheet_box">
      <div class="sheet_box_left">
        <!-- 搜索框 -->
        <div class="search_box">
          <el-input placeholder="量表搜索" v-model="input" @keyup.13.native="systemSearch" clearable>
            <el-button slot="append" icon="el-icon-search" @click="systemSearch"></el-button>
          </el-input>
          <p class="scaleList">问卷列表</p>
        </div>
        <!-- 搜索内容主题 -->
        <div class="search-content">
          <ul>
            <li v-for="(item,index) in sheetList" :key="index" @click="searchContent(item)">
              <i class="sheetIcon"></i>
              <span class="sheetName">{{item.name}}</span>
            </li>
          </ul>
        </div>
      </div>
      <div class="sheet_box_right">
        <div class="sheetTitle">
          <span class="chooseQues">请选择题目</span>
          <el-checkbox v-model="checkAll" class="checkAll" :indeterminate="isIndeterminate">全选</el-checkbox>
        </div>
        <div class="sheetContent">
          <ul>
            <li v-for="(item,index) in sheetQuesList" :key="index">
              <p>{{item.quesContent}}</p>
              <!-- 循环生成选项 -->
              <div class="listiconshow" v-for="(list,i) in item.option" :key="i">
                <!-- 判断type类型 -->
                <div v-if="item.quesType==1">
                  <el-radio :label="1">{{list.optContent}}</el-radio>
                </div>
                <div class="listlabel" v-else-if="item.quesType==2">
                  <el-checkbox>{{list.optContent}}</el-checkbox>
                </div>
                <div v-else-if="item.quesType==3">
                  <el-input
                    type="textarea"
                    :rows="2"
                    placeholder="请输入内容"
                    style="width:400px;"
                    v-model="list.optContent"
                  ></el-input>
                </div>
                <div v-if="item.quesType==4">
                  <el-radio :label="2" style="margin-right:10px;">{{list.optContent}}</el-radio>
                  <span style="color:orange;font-size:14px;">( 分值：{{list.optScore}} )</span>
                </div>
              </div>
              <div class="posCheckInner">
                <el-checkbox v-model="item.index" class="posCheck" @change="chooseItem(item,index)"></el-checkbox>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="sheet_footer">
      <span class="selected">
        已选
        <i>0</i> 题
      </span>
      <span class="selectedQues">
        <a href="###">查看已选题目</a>
      </span>
      <el-button type="primary" size="mini" class="enterBack" @click="enterCheked">确定</el-button>
    </div>
  </div>
</template>
<script>
export default {
  // 接收父组件传来的量表Uuid
  props: { sheetUuid: String },
  data() {
    return {
      input: "",
      sheetList: [],
      sheetQuesList: [],
      radio: [],
      isIndeterminate: true,
      checkAll: false,
      question: {},
      checkedCities: [],
      Array: []
    };
  },
  created() {
    this.getScaleList();
  },
  methods: {
    // 获取量表列表
    async getScaleList() {
      const { data: res } = await this.$http.post(this.$ajax + "sheet/list", {
        name: this.input
      });
      if (res.code != 200) return this.$message.error("数获取失败");
      this.sheetList = res.rows;
    },
    // 搜索按钮
    systemSearch() {
      this.getScaleList();
    },
    // 获取点击量表的题目列表
    async searchContent(info) {
      // this.sheetUuid = info.uuid;
      const { data: res } = await this.$http.post(
        this.$ajax + "sheetQues/list",
        {
          sheetUuid: info.uuid
        }
      );
      this.sheetQuesList = res.rows;
    },
    chooseItem(info, index) {
      console.log(info.index);

      if (info.index) {
        var question = {};
        var options = [];
        var repe_option = info.option;
        for (var i = 0; i < repe_option.length; i++) {
          var temp_option = {
            optContent: repe_option[i].optContent,
            optScore: repe_option[i].optScore
          };
          options.push(temp_option);
        }
        question = {
          quesMedia: info.quesContent,
          option: options,
          quesType: info.quesType,
          sheetUuid: this.sheetUuid
        };
        this.Array.push(question);
      }
    },
    async enterCheked() {
      const { data: res } = await this.$http.post(
        this.$ajax + "sheetQues/batchAdd",
        {
          questions: this.Array
        }
      );
      this.$emit("openOrCls");
    }
  }
};
</script>
<style lang='less'>
.sheet_box {
  width: 100%;
  height: 530px;
  overflow: hidden;
}
.sheet_box_left {
  float: left;
  width: 39%;
  height: 500px;
  padding-left: 10px;
  box-sizing: border-box;
  border-right: 1px solid #e8e8e8;
}
.sheet_box_right {
  float: left;
  width: 60%;
  box-sizing: border-box;
  padding: 15px 0 0 20px;
  height: 500px;
}
.sheet_footer {
  overflow: hidden;
  width: 100%;
  height: 110px;
  border-top: 1px solid #e8e8e8;
  padding: 40px 30px;
  box-sizing: border-box;
}
.search_box {
  margin: 15px 20px 0 0;
  margin-left: 18px;
}
.scaleList {
  font-size: 12px;
  color: #c0c5ce;
  line-height: 30px;
}
.search-content {
  height: 416px;
  overflow: hidden;
  overflow: auto;
}
.search-content li {
  overflow: hidden;
  padding: 11px 0 10px 8px;
}
.search-content li:hover {
  background-color: #409eff;
  color: #fff;
  cursor: pointer;
}
.search-content li:hover .sheetIcon {
  background: url("../../../assets/images/fffIcon.png") no-repeat;
  background-size: 100%;
}
.sheetIcon {
  width: 20px;
  height: 20px;
  float: left;
  margin: 0 10px;
  background: url("../../../assets/images/blueIcon.png") no-repeat;
  background-size: 100%;
}
.sheetName {
  float: left;
  font-size: 14px;
}
.selected {
  font-size: 14px;
}
.selected i {
  font-style: normal;
  color: #1ea0fa;
}
.selectedQues a {
  margin-left: 15px;
  font-size: 14px;
  color: #808080;
}
.enterBack {
  float: right;
  margin-left: 20px;
  padding: 10px 30px;
}
.sheetTitle {
  height: 40px;
  padding-right: 20px;
  box-sizing: border-box;
}
.chooseQues {
  float: left;
  font-size: 14px;
  font-weight: 700;
}
.checkAll {
  float: right;
}
.sheetContent {
  height: 445px;
  overflow: hidden;
  overflow: auto;
}

.sheetContent li {
  position: relative;
  box-sizing: border-box;
  width: 470px;
  padding: 20px 40px 20px 20px;
  font-size: 14px;
  margin-bottom: 20px;
  background-color: #f7f9fc;
}
.sheet_box .listiconshow .el-radio,
.sheet_box .listiconshow .el-checkbox {
  color: #999;
}
.posCheck {
  position: absolute;
  top: 18px;
  right: 20px;
}
</style>