<template>
  <div>
    <div class="set_box">
      <div class="set_box_left">
        <ul>
          <li @click="jumpBasicsSet">
            <span>基础设置</span>
          </li>
          <li @click="jumpInvenSet">
            <span>因子设置</span>
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
    return {};
  },
  methods: {
    jumpBasicsSet() {
      this.$router.push({ path: "/basicsSet" });
    },
    jumpInvenSet() {
      this.$router.push({ path: "/divisor" });
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
  color: #000;
}
.set_box_right {
  float: right;
  width: 700px;
  height: 700px;
  border: 1px solid #ccc;
}
</style>