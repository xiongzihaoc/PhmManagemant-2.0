<template>
  <div>
    <div class="set_box">
      <div class="set_box_left">
        <ul>
          <li
            v-for="(item,index) in list"
            @click="changSemester(item,index)"
            :key="index"
            :class="{blue:i===index}"
          >
            <span>{{item.name}}</span>
          </li>
        </ul>
      </div>
      <div class="set_box_right">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      list: [
        { name: "基础设置", path: "/basicsSet" },
        { name: "因子设置", path: "/divisor" }
      ],
      i: null
    };
  },
  methods: {
    // 侧边导航动态绑定class
    changSemester(item, index) {
      this.i = index;
      this.$router.push(this.list[index].path);
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