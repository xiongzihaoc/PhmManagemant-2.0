<template>
  <div>
    <div id="editor" class="editor"></div>
  </div>
</template>
<script>
import E from "wangeditor";
export default {
  name: "editor",
  data() {
    return {};
  },
  methods: {},
  mounted() {
    var editor = new E("#editor");
    editor.create();
  }
};
</script>
<style lang='less' scoped>
</style>