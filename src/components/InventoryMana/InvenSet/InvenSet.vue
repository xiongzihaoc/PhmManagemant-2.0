<template>
  <div>
    <div class="set_box">
      <div class="set_box_left">
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
      </div>
      <div class="set_box_right">
        <component :is="currentView"></component>
      </div>
    </div>
  </div>
</template>
<script>
import basicsSet from "./BasicsSet";
import divisor from "./DivisorSet";
export default {
  components: { basicsSet, divisor },
  data() {
    return {
      list: [
        { name: "基础设置", view: "basicsSet" },
        { name: "因子设置", view: "divisor" }
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
<style lang='less'>
ul {
  list-style: none;
}
.set_box {
  overflow: hidden;
  width: 1000px;
  height: 870px;
  margin: 0 auto;
}
.set_box_left {
  float: left;
  box-sizing: border-box;
  width: 260px;
  height: 460px;
  border: 1px solid #ccc;
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
  float: right;
  width: 700px;
  background-color: #fff;
}
.blue {
  color: #fe7300 !important;
}
</style>