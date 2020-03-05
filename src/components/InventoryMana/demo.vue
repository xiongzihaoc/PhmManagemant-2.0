<template>
  <div>
    <div class="add-icon" @click.prevent.stop="getInfo"  v-for="(item,index) of single" :key="index">
      <h3>测试</h3>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      single:[],
    };
  },
  methods: {
    getInfo(e){
      console.log(e.target.innerText);
      
    },
  }
};
</script>
<style lang='less'>
.add-icon {
  width: 100%;
  height: 200px;
  background-color: pink;
}
</style>