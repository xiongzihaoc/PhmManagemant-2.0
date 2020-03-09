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
          <li @click.stop="getOneInfo(index)">
            <p style="margin:25px 0 0 40px;font-weight:700;font-size:16px;">{{item.title}}</p>
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
            </div>
            <div class="bgDv" v-show="item.openOrCls">
              <div class="posImg"></div>
              <el-input
                type="textarea"
                :rows="2"
                class="conTitle"
                v-model="item.title"
                style="width: 95%;"
              ></el-input>
              <div style="margin-bottom:10px;width:95%;">
                <el-select size="mini" v-model="item.value" placeholder="请选择" style="width:20%;">
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
                <span style="font-size:14px;color:#ccc;margin-left:80px;">必答</span>
                <span style="font-size:14px;color:#ccc;margin-left:80px;">填写提示</span>
              </div>
              <div
                style="margin-bottom:10px;width:95%;background:#e8e8e8;font-size:14px;line-height:28px;"
              >
                <span style="margin-left:20px;">选项文字</span>
                <span style="margin-left:320px;">图片</span>
                <span style="margin-left:40px;">说明</span>
                <span style="margin-left:40px;">允许填空</span>
                <span style="margin-left:40px;">默认</span>
                <span style="margin-left:40px;">上移下移</span>
              </div>
              <el-input
                size="mini"
                class="conContent"
                v-for="(subItem,index) of item.changelist"
                :key="index"
                v-model="subItem.value"
                style="width:300px;"
              ></el-input>
              <el-button
                @click="HandleClickAddList(item.changelist)"
                size="mini"
                style="border:none;background:#f5f5f5;color:#0095ff!important;"
                icon="el-icon-circle-plus-outline"
              >添加选项</el-button>
              <el-button
                @click="HandleClickOver()"
                type="warning"
                style="display:block;margin-top:10px;width:95%"
                size="small"
              >完成编辑</el-button>
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
      checked: "",
      selValue: "",
      options: [
        {
          value: "1",
          label: "单选题"
        },
        {
          value: "2",
          label: "多选题"
        },
        {
          value: "3",
          label: "文本题"
        }
      ]
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
        openOrCls: false,
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
        openOrCls: false,
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
    getOneInfo(index) {
      console.log(this.single[index]);
      this.editObj = this.single[index];
      this.single[index].openOrCls = true;
      // if (this.single[index].openOrCls == true) {
      //   this.single[index].openOrCls = false;
      // } else {

      // }
    },
    HandleClickOver() {}
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
  box-sizing: border-box;
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
}
.list_box li:hover {
  background-color: #fafafa;
}
.list_box li .tips {
  position: absolute;
  top: 5px;
  right: 5px;
}
.listiconshow {
  padding-top: 10px;
}
.listiconshow:last-child {
  padding-bottom: 30px;
}
.info-change-list {
  margin-left: 60px;
}
.el-checkbox__input.is-checked .el-checkbox__inner,
.el-checkbox__input.is-indeterminate .el-checkbox__inner {
  background-color: #afdd22 !important;
  border-color: #afdd22 !important;
}
.bgDv {
  position: relative;
  border-top: 1px solid #e0e0e0;
  padding: 20px;
  width: 100%;
  background-color: #f5f5f5;
}
.conTitle {
  display: block;
  margin-bottom: 10px;
}
.conContent {
  display: block;
  margin-bottom: 10px;
}
.posImg {
  position: absolute;
  top: -12px;
  left: 94px;
  width: 24px;
  height: 12px;
  background-image: url("../../assets/images/icoall.png");
  background-position: 0px -60px;
}
</style>