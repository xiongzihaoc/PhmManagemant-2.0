<template>
  <div
    class="_dialog_wrapper"
    :style="{ zIndex }"
    @mousedown.self="closeDialogOnModal"
    @keyup.esc="closeDialogOnEsc"
    v-show="show">
    <div
      v-show="visible"
      class="_dialog"
      :class="showTit == false ? 'verticalCen' : ''"
      :style="{ 'width': width, 'min-width': minWidth, 'margin-top': top }">
      <div class="_dialog_header">
        <span v-show="showTit" class="_dialog_header_tit">{{ title }}</span>
        <span @mousedown="closeDialog" class="close_dialog"></span>
      </div>
      <div :class="showTit == false ? '' : '_dialog_body'">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      zIndex: 0,
      show: false
    }
  },
  props: {
    title: {
      type: String,
      required: true
    },
    visible: {
      type: Boolean,
      default: false
    },
    showTit: {
      type: Boolean,
      default: true
    },
    width: {
      type: String,
      default: '100px'
    },
    minWidth: {
      type: String,
      default: '400px'
    },
    top: {
      type: String,
      default: '8vh'
    },
    closeOnEsc: {
      type: Boolean,
      default: true
    },
    closeOnClickModal: {
      type: Boolean,
      default: true
    }
  },
  watch: {
    visible(val) {
      this.show = val
      !val && this.$el.scrollTo(0, 0)
    }
  },
  mounted() {
    // this.zIndex = zIndexRank()
    this.show = this.visible
    document.body.addEventListener('keydown', e => {
      if (this.closeOnEsc) {
        e.key === 'Escape' && this.$emit('closeDialog')
      }
    })
  },
  methods: {
    closeDialog() {
      this.$emit('closeDialog')
    },
    closeDialogOnEsc() {
      if (this.closeOnEsc) {
        this.$emit('closeDialog')
      }
    },
    closeDialogOnModal() {
      if (this.closeOnClickModal) {
        this.$emit('closeDialog')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@keyframes _toast_back_animate {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
@keyframes _toast_dialog_animate {
  0% {
    opacity: 0;
    transform: translate3d(0, 30%, 0);
  }
  100% {
    opacity: 1;
    transform: translate3d(0);
  }
}

._dialog_wrapper {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background: rgba(0, 0, 0, .3);
  overflow-y: auto;
  animation-duration: .22s;
  animation-fill-mode: both;
  animation-name: _toast_back_animate;
}
._dialog {
  margin: 8vh auto 50px;
  min-width: 400px;
  background: #fff;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.2);
  border-radius: 2px;
  animation-duration: .22s;
  animation-fill-mode: both;
  animation-name: _toast_dialog_animate;
  ._dialog_header {
    color: #333;
    line-height: 40px;
    border-bottom: 1px solid #eee;
    ._dialog_header_tit {
      margin-left: 10px;
    }
    .close_dialog {
      margin: 10px 10px;
      cursor: pointer;
      position: relative;
      float: right;
      width: 13px;
      height: 13px;
      &::after,
      &::before {
        content: '';
        width: 1px;
        height: 13px;
        background-color: #999;
        position: absolute;
        right: 6px;
      }
      &::after {
        transform: rotate(45deg);
      }
      &::before {
        transform: rotate(-45deg);
      }
    }
  }
  ._dialog_body {
    padding: 10px;
    // max-height: 750px;
    // overflow-y: auto;
  }
}
.verticalCen {
  position: relative;
  top: 50%;
  margin-top: -319px !important;
}
</style>
