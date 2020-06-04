<template>
  <div>
    <div class="sheet_box" v-show="searchCheck">
      <div class="sheet_box_left">
        <!-- 搜索框 -->
        <div class="search_box">
          <el-input placeholder="量表搜索" v-model="input" @input="systemSearch" clearable></el-input>
          <p class="scaleList">问卷列表</p>
        </div>
        <!-- 搜索内容主题 -->
        <div class="search-content">
          <ul>
            <li
              v-for="(item,index) in sheetList"
              :key="index"
              @click="searchContent(item)"
              :class="{blue:i===index}"
            >
              <i class="sheetIcon"></i>
              <span class="sheetName">{{item.name}}</span>
            </li>
          </ul>
        </div>
      </div>
      <div class="sheet_box_right">
        <div class="sheetTitle">
          <span class="chooseQues">请选择题目</span>
          <el-checkbox
            v-model="checkAll"
            class="checkAll"
            :indeterminate="isIndeterminate"
            @change="handleCheckAllChange"
          >全选</el-checkbox>
        </div>
        <div
          class="sheetContent"
          v-if="this.sheetQuesList.length >= 1"
          v-loading="fullscreenLoading"
        >
          <ul>
            <li v-for="item in sheetQuesList" :key="item.id">
              <p v-html="item.quesMedia"></p>
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
                <el-checkbox-group class="checkGroup" v-model="checkList" @change="chooseItem">
                  <el-checkbox class="posCheck" :label="item">
                    <i style="color:#F7F9FC"></i>
                  </el-checkbox>
                </el-checkbox-group>
              </div>
            </li>
          </ul>
        </div>
        <div class="sheetContent Nodata" v-else>
          <span style="font-size:20px;color:#ccc">暂无数据</span>
        </div>
      </div>
    </div>
    <!-- 查看已选题目区域 -->
    <div class="sheet_box_select" v-show="lookCheck">
      <div class="sheetTitle">
        <span class="chooseQues">已选题目</span>
      </div>
      <div class="sheetContent_select">
        <ul>
          <li v-for="item in this.checkList" :key="item.id">
            <p v-html="item.quesMedia"></p>
            <!-- 循环生成选项 -->
            <div class="listiconshow" v-for="list in item.option" :key="list.id">
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
            <div
              class="posCheckInner_select el-icon-delete"
              @click.prevent.stop="delChoose(item,index)"
            ></div>
          </li>
        </ul>
      </div>
    </div>
    <div class="sheet_footer">
      <span class="selected">
        已选
        <i>{{this.checkList.length}}</i> 题
      </span>
      <span class="selectedQues">
        <a href="###" @click.prevent.stop="Viewselected" v-show="tosele">查看已选题目</a>
      </span>
      <el-button
        type="info"
        size="mini"
        class="enterBack"
        @click.prevent.stop="Backselected"
        v-show="back"
      >返回继续选题</el-button>
      <el-button type="primary" size="mini" class="enterBack" @click.prevent.stop="enterCheked">确定</el-button>
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
      fullscreenLoading: false,
      isIndeterminate: true,
      checkAll: false,
      checkList: [],
      searchCheck: true,
      lookCheck: false,
      back: false,
      tosele: true,
      i:0,
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
      console.log(res);
    },
    // 搜索按钮
    systemSearch() {
      this.getScaleList();
    },
    // 获取点击量表的题目列表
    async searchContent(info) {
      console.log(info);
      
      this.fullscreenLoading = true;
      const { data: res } = await this.$http.post(
        this.$ajax + "sheetQues/list",
        {
          sheetUuid: info.uuid
        }
      );
      this.sheetQuesList = res.rows;
      this.fullscreenLoading = false;
      console.log(res);
    },
    // 选择题目进行添加
    async enterCheked() {
      var arr = this.checkList;
      var Arr = [];
      var question = {};
      this.checkList.forEach(item => {
        question = {
          quesMedia: item.quesMedia,
          option: item.option,
          quesType: item.quesType,
          sheetUuid: this.sheetUuid
        };
        Arr.push(question);
      });
      const { data: res } = await this.$http.post(
        this.$ajax + "sheetQues/batchAdd",
        {
          questions: Arr
        }
      );
      if (res.code != 200) return this.$message.error("添加失败");
      question = {};
      Arr = [];
      this.checkList = [];
      this.$emit("openOrCls");
    },
    // 全选
    handleCheckAllChange(val) {
      this.checkList = val ? this.sheetQuesList : [];
      this.isIndeterminate = false;
    },
    chooseItem(val) {
      let checkedCount = val.length;
      this.checkAll = checkedCount === this.checkList.length;
      this.isIndeterminate =
        checkedCount > 0 && checkedCount < this.checkList.length;
    },
    // 查看已选题目
    Viewselected() {
      if (this.checkList.length < 1)
        return this.$message.error("请至少选择一题");
      this.lookCheck = true;
      this.searchCheck = false;
      this.back = true;
      this.tosele = false;
    },
    // 返回继续选题
    Backselected() {
      this.lookCheck = false;
      this.searchCheck = true;
      this.back = false;
      this.tosele = true;
    },
    // 删除已选
    delChoose(info, index) {
      this.checkList.splice(index, 1);
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
  min-width: 250px;
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
  float: left;
  width: 20px;
  height: 20px;
  margin: 0 10px;
  background: url("../../../assets/images/blueIcon.png") no-repeat;
  background-size: 100%;
}
.sheetName {
  float: left;
  width: 210px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
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
.sheet_box_select {
  padding-top: 30px;
  box-sizing: border-box;
  width: 80%;
  margin: 0 auto;
}
.sheetContent_select {
  height: 460px;
  overflow: hidden;
  overflow: auto;
}
.sheetContent_select li {
  position: relative;

  box-sizing: border-box;
  padding: 20px 40px 20px 20px;
  font-size: 14px;
  margin-bottom: 20px;
  background-color: #f7f9fc;
}
.posCheckInner_select {
  position: absolute;
  right: 20px;
  top: 18px;
  font-size: 20px;
  color: #ccc;
  cursor: pointer;
}
.posCheckInner_select:hover {
  color: red;
}
.checkGroup {
  position: absolute;
  right: 20px;
  top: 18px;
}
.Nodata {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>