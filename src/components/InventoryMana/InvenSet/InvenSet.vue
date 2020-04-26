<template>
  <div>
    <div class="set_box">
      <el-card class="set_box_left animated bounceInLeft">
        <ul>
          <li
            v-for="(item,index) in list"
            @click="changSemester(index,item.view)"
            :key="index"
            :class="{blue:i===index}"
          >
            <span>{{item.name}}</span>
          </li>
        </ul>
      </el-card>
      <el-card class="set_box_right animated bounceInRight">
        <component :is="currentView"></component>
      </el-card>
    </div>
  </div>
</template>
<script>
import basicsSet from "./BasicsSet";
import divisor from "./DivisorSet";
import CommentsSuggestions from "./CommentsSuggestions";
export default {
  components: { basicsSet, divisor, CommentsSuggestions },
  data() {
    return {
      list: [
        { name: "基础设置", view: "basicsSet" },
        { name: "因子设置", view: "divisor" },
        { name: "评语建议", view: "CommentsSuggestions" }
      ],
      currentView: "basicsSet",
      i: 0
    };
  },
  methods: {
    // 侧边导航动态绑定class
    changSemester(index, v) {
      this.i = index;
      this.currentView = v;
    }
  }
};
</script>
<style lang='less' scoped>
ul {
  list-style: none;
}
.set_box {
  overflow: hidden;
}
.set_box_left {
  float: left;
  margin-left: 15%;
  box-sizing: border-box;
  width: 15%;
  height: 400px;
  border-radius: 5px;
  overflow: hidden;
  background-color: #fff;
}
.set_box_left li {
  cursor: pointer;
  padding: 10px 0 10px 30px;
  font-weight: 700;
  font-size: 14px;
  color: #999;
  border-bottom: 1px solid #ccc;
}
.set_box_left li:hover {
  color: #fff;
  background-color: #afdd22;
}
.set_box_right {
  float: left;
  margin-left: 2%;
  width: 50%;
  height: 800px;
  background-color: #fff;
}
.blue {
  color: #fe7300 !important;
}
</style>