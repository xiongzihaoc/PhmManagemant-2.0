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
      >单选</el-button>
      <el-button
        class="chooseType"
        size="mini"
        type="info"
        plain
        style="border:none;"
        icon="el-icon-finished"
      >多选</el-button>
      <el-button
        class="chooseType"
        size="mini"
        type="info"
        plain
        style="border:none;"
        icon="el-icon-tickets"
      >文本</el-button>
    </el-card>
    <el-card class="main_right">
      <h3 style="text-align: center;margin-bottom:40px;">量表标题</h3>
      <!-- <div> -->
      <!-- <draggable> -->
      <div class="list_box">
        <ul v-for="(val,index) of listdata" :key="index">
          <li @click="enter(index)" @mouseenter="mouseenter()" :class="{'active':selected==index}">
            <p>{{val.title}}</p>
          </li>
          <div class="liInfo" v-show="index==selected"></div>
          <div class="tips" v-show="index==selected">
            <span @click="edit(index)">编辑</span>
            <span @click="del(index)">删除</span>
          </div>
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
      selected: null,
      listdata: [
        { title: "标题1" },
        { title: "标题2" },
        { title: "标题3" },
        { title: "标题4" },
        { title: "标题5" },
        { title: "标题6" },
        { title: "标题7" },
        { title: "标题8" },
        { title: "标题9" },
        { title: "标题10" }
      ]
    };
  },
  methods: {
    enter(index) {
      this.selected = index;
    },
    mouseenter() {
      this.selected = index;
    },
    out() {
      //鼠标移出
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
  width: 100%;
  border-top: 1px solid #e0e0e0;
  padding: 50px;
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
</style>