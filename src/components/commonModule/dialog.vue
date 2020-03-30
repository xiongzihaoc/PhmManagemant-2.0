<template>
  <div class="dialog">
    <!-- 弹框 -->
    <!-- :title="textMap"弹框 -->
    <el-dialog
      v-dialogDrag
      :visible.sync="dialogFormVisible"
      :before-close="handleCloseBindWarnStandard"
    >
      <slot name="title"></slot>
      <slot></slot>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleCancel">Cancel</el-button>
        <el-button type="primary" @click="handleConfirm">Confirm</el-button>
      </div>
    </el-dialog>
    <!-- 提示语 -->
  </div>
</template>
<script>
export default {
  props: {
    dialogFormVisible: {
      type: Boolean,
      default: false
    }
    // textMap: {
    //   type: Object,
    //   default: () => {}
    // }
  },
  data() {
    return {
      // dialogStatus: ""
    };
  },
  watch: {},
  methods: {
    // 点击弹框下的取消
    handleCancel() {
      this.$emit("getCancel");
    },
    // 点击弹框下的确定
    handleConfirm() {
      this.$emit("getConfirm");
    },
    //关闭弹窗，不可以删这个方法。不用这个方法点击遮罩层关闭会报错
    handleCloseBindWarnStandard() {
      this.$emit("closeBindWarnStandard");
    }
  }
};
</script>
<style lang='less' scoped>
</style>