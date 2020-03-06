<template>
  <div class="CONTENT" style="position: relative;">
    <el-card class="main_left">
      <p class="queschoose">题型选择</p>
      <el-button
        class="chooseType"
        size="mini"
        type="info"
        plain
        style="border:none"
        icon="el-icon-s-opportunity"
        @click="changetype"
      >单选</el-button>
      <el-button
        class="chooseType"
        size="mini"
        type="info"
        plain
        style="border:none;"
        icon="el-icon-finished"
        @click="changetype"
      >多选</el-button>
      <el-button
        class="chooseType"
        size="mini"
        type="info"
        plain
        style="border:none;"
        icon="el-icon-tickets"
        @click="changetype"
      >文本</el-button>
    </el-card>
    <el-card class="main_right">
      <h3 style="text-align: center;margin-bottom:40px;">量表标题</h3>
      <!-- <div> -->
      <!-- <draggable> -->
      <div class="list_box">
        <ul v-for="(item,index) of single" :key="index">
          <li @click="getOneInfo">
            <p style="margin-bottom:10px">{{item.title}}</p>
            <div class="info-change-list">
              <div class="listiconshow" v-for="(list,index) of item.changelist" :key="index">
                <div v-if="item.type==1">
                  <el-radio :label="1">{{list.value}}</el-radio>
                </div>
                <div class="listlabel" v-else-if="item.type==2">
                  <el-checkbox>{{list.value}}</el-checkbox>
                </div>
                <div v-else-if="item.type==3">
                  <el-input
                    type="textarea"
                    :rows="2"
                    placeholder="请输入内容"
                    style="width:400px;"
                    v-model="list.textareavalue"
                  ></el-input>
                </div>
              </div>
              <div class="bgDv">
                <!-- <el-input b-></el-input> -->
                <el-button @click="HandleClickAddList(item.changelist)">添加选项</el-button>
              </div>
            </div>
          </li>
        </ul>
      </div>
      <!-- </draggable> -->
      <!-- </div> -->
    </el-card>
  </div>
</template>
<script>
import draggable from "vuedraggable";
export default {
  components: { draggable },
  data() {
    return {
      radio: "1",
      checkedCities: [],
      textarea: "",
      single: [],
      listtype: "",
      singleid: 1,
      singletitle: "题目",
      listtype: "",
      timer: null,
      infolistid: 2,
      infolistval: "选项",
      checked: ""
    };
  },
  methods: {
    HandleRadio(e) {
      window.console.log(e);
      console.log(111);
    },
    sorted() {
      if (this.single.length <= 0) {
        this.singleid = "1";
      } else if (!(this.single.length == this.singleid)) {
        this.singleid = this.single.length + 1;
      }
    },
    changetype(e) {
      if (e.target.innerText.indexOf("单") > -1) {
        this.listtype = 1;
        this.CreateChangeSingleList();
      } else if (e.target.innerText.indexOf("多") > -1) {
        this.listtype = 2;
        this.CreateChangeSingleList();
      } else {
        this.listtype = 3;
        this.CreateChangeTextareaList();
      }
    },
    //创建一个新单/多选题
    CreateChangeSingleList() {
      this.sorted();
      let changelist = [
        { inid: "1", value: "选项1", check: false },
        { inid: "2", value: "选项2", check: false }
      ];
      this.single.push({
        id: this.singleid++,
        title: this.singletitle + (this.singleid - 1),
        type: this.listtype,
        changelist: changelist
      });
    },
    CreateChangeTextareaList() {
      this.sorted();
      let changelist = [
        { textareavalue: "", necessary: this.checked, textprompt: false }
      ];
      this.single.push({
        id: this.singleid++,
        title: this.singletitle + (this.singleid - 1),
        type: this.listtype,
        changelist: changelist
      });
    },
    //创建内部选项
    HandleClickAddList(list) {
      if (!(list.length == this.infolistid)) {
        this.infolistid = list.length;
      }
      if (list.length < 30) {
        list.push({
          id: this.infolistid++,
          value: this.infolistval + this.infolistid
        });
      } else {
        this.$message.error("最多只能创建30个选项哦");
      }
    },
    getOneInfo(e) {
      console.log(e);
    }
  }
};
</script>
<style lang='less'>
* {
  margin: 0;
  padding: 0;
}
ul {
  list-style: none;
}
.main_left {
  position: fixed;
  z-index: 100;
  left: 25%;
  top: 112px;
  width: 10%;
  height: 850px;
  padding: 20px;
}
.main_right {
  overflow: auto;
  position: fixed;
  z-index: 100;
  left: 37.5%;
  top: 112px;
  padding-top: 20px;
  height: 850px;
  width: 50%;
}
.queschoose {
  text-align: center;
  font-weight: 700;
  font-size: 14px;
  padding: 4px 0;
  margin-bottom: 10px;
  border-radius: 10px;
  background-color: #f5f5f5;
}
.chooseType {
  text-align: center;
  display: inline-block;
  margin: 0 20px 10px 0;
  overflow: hidden;
}
.CONTENT .el-button + .el-button {
  margin-left: 0px;
}
.CONTENT .el-card__body {
  padding: 0;
}
.list_box li {
  position: relative;
  box-sizing: border-box;
  width: 100%;
  border-top: 1px solid #e0e0e0;
  padding: 20px 0 20px 50px;
}
.list_box li:hover {
  background-color: #fafafa;
}
.list_box li .tips {
  position: absolute;
  top: 5px;
  right: 5px;
}
.liInfo {
  width: 100%;
  height: 50px;
  background-color: pink;
}
.info-change-list {
  margin-left: 25px;
}
.listiconshow {
  margin-bottom: 10px;
}

.el-checkbox__input.is-checked .el-checkbox__inner,
.el-checkbox__input.is-indeterminate .el-checkbox__inner {
  background-color: #afdd22 !important;
  border-color: #afdd22 !important;
}
.bgDv {
  width: 100%;
  height: 50px;
  background: pink;
}
</style>