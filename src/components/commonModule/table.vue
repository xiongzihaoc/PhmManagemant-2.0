<template>
  <div
    class="w-table"
    :class="{'w-table_moving': dragState.dragging}"
    ref="wTable">
    <el-table
      :data="data"
      @row-click="rowClick"
      @row-dblclick="rowDblClick"
      @select="rowSelect"
      @select-all="selectAll"
                highlight-current-row
      :header-cell-style="{ background:'#f5f5f5' }"
      :border="option.border"
      :max-height="option.maxHeight"
      :style="{ width: parseInt(option.width)+'px' }"
      :cell-class-name="cellClassName" 
      :header-cell-class-name="headerCellClassName"
      :row-class-name="tableRowClassName"
      
    >
      <slot name="fixed" ></slot>
      <el-table-column  v-for="(col, index) in tableHeader" :key="index"
        align="center"
        :prop="col.prop"
        :label="col.label"
        :width="col.width"
        :min-width="col.minWidth"
        :type="col.type"
        :header-align="col.headerAlign"
        :column-key="index.toString()"
        :render-header="renderHeader"
        show-overflow-tooltip
      >
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
// import { deepClone } from '@/api/common'
export default {
  props: {
    data: {
      default: function () {
        return []
      },
      type: Array
    },
    header: {
      default: function () {
        return []
      },
      type: Array
    },
    option: {
      default: function () {
        return {}
      },
      type: Object
    },
    storage: {
      default: function () {
        return ''
      },
      type: String
    },
    showSelect: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      tableHeader: [],
      dragState: {
        start: -9, // 起始元素的 index
        end: -9, // 移动鼠标时所覆盖的元素 index
        dragging: false, // 是否正在拖动
        direction: undefined // 拖动方向
      }
    }
  },
  watch:{
    header(val){
      this.tableHeader = val
    }
  },
  beforeMount() {
    this.tableHeader = this.header
  },
  mounted() {
    // 固定列表顺序
    let tableHeader = JSON.parse(window.localStorage.getItem(this.storage))
    // this.print(window.localStorage.getItem(this.storage))
    function insertionSort(arr) {
      var len = arr.length;
      var preIndex, current;
      for (var i = 1; i < len; i++) {
        preIndex = i - 1;
        current = arr[i];
        while(preIndex >= 0 && parseInt(arr[preIndex].i) > parseInt(current.i)) {
          arr[preIndex+1] = arr[preIndex];
          preIndex--;
        }
        arr[preIndex+1] = current;
      }
      return arr;
    }
    // const tableHeaderCopy = insertionSort(tableHeader ? deepClone(tableHeader) : [])
    // const thisTableHeaderCopy = insertionSort(deepClone(this.tableHeader))
    // if (tableHeader && JSON.stringify(tableHeaderCopy) == JSON.stringify(thisTableHeaderCopy)) {
    //   this.tableHeader = tableHeader
    // } else {
    //   this.tableHeader = this.header
    //   window.localStorage.setItem(this.storage, JSON.stringify(this.header))
    // }
    this.$nextTick(() => {
      const virtuals = document.getElementsByClassName('virtual')
      for (let i = 0; i < virtuals.length; i++) {
        virtuals[i].style.height = this.$refs.wTable.clientHeight + 'px'
      }
    })
  },
  methods: {
    tableRowClassName({row}) {
      if (row.profitAmount && row.profitAmount < 0) {
        return 'warning-row';
      } else {
        return ''
      }
    },
    renderHeader (createElement, {column}) {
      return createElement(
        'div', {
          'class': ['thead-cell'],
          on: {
            mousedown: ($event) => { this.handleMouseDown($event, column) },
            mousemove: ($event) => { this.handleMouseMove($event, column) }
          }
        }, [
          // 添加 <a> 用于显示表头 label
          createElement('a', column.label),
          // 添加一个空标签用于显示拖动动画
          createElement('span', {
            'class': ['virtual']
          })
        ])
    },
    // 按下鼠标开始拖动
    handleMouseDown (e, column) {
      this.dragState.dragging = true
      this.dragState.start = parseInt(column.columnKey)
      // 给拖动时的虚拟容器添加宽高
      let table = document.getElementsByClassName('w-table')[0]
      let virtual = document.getElementsByClassName('virtual')
      for (let item of virtual) {
        item.style.height = table.clientHeight - 1 + 'px'
        item.style.width = item.parentElement.parentElement.clientWidth + 'px'
      }
      document.addEventListener('mouseup', this.handleMouseUp, { passive: false });
    },
    // 鼠标放开结束拖动
    handleMouseUp () {
      this.dragColumn(this.dragState)
      // 初始化拖动状态
      this.dragState = {
        start: -9,
        end: -9,
        dragging: false,
        direction: undefined
      }
      document.removeEventListener('mouseup', this.handleMouseUp);
    },
    // 拖动中
    handleMouseMove (e, column) {
      if (this.dragState.dragging) {
        let index = parseInt(column.columnKey) // 记录起始列
        if (index - this.dragState.start !== 0) {
          this.dragState.direction = index - this.dragState.start < 0 ? 'left' : 'right' // 判断拖动方向
          this.dragState.end = parseInt(column.columnKey)
        } else {
          this.dragState.direction = undefined
        }
      } else {
        return false
      }
    },
    // 拖动易位
    dragColumn ({start, end, direction}) {
      let tempData = []
      let left = direction === 'left'
      let min = left ? end : start - 1
      let max = left ? start + 1 : end
      if (!direction) {
        return
      }
      for (let i = 0; i < this.tableHeader.length; i++) {
        if (i === end) {
          tempData.push(this.tableHeader[start])
        } else if (i > min && i < max) {
          tempData.push(this.tableHeader[ left ? i - 1 : i + 1 ])
        } else {
          tempData.push(this.tableHeader[i])
        }
      }
      this.tableHeader = tempData
      this.change(this.tableHeader)
    },
    headerCellClassName (col) {
      let active = col.columnIndex - 1 === this.dragState.end ? `darg_active_${this.dragState.direction}` : ''
      let start = col.columnIndex - 1 === this.dragState.start ? `darg_start` : ''
      return `${active} ${start}`
    },
    cellClassName (col) {
      return (col.columnIndex - 1 === this.dragState.start ? `darg_start` : '')
    },
    rowClick(row) {
      this.$emit('row-click', row)
    },
    rowDblClick(row) {
      this.$emit('row-dblclick', row)
    },
    rowSelect(selection, row) {
      this.$emit('select', selection, row)
    },
    selectAll(selection) {
      this.$emit('select-all', selection)
    },
    change(arr) {
      window.localStorage.setItem(this.storage, JSON.stringify(arr))
    }
  }
}
</script>

<style lang="scss">
.el-table .warning-row {
  color: red;
}
.w-table {
  .el-table__row {
    td {
      cursor: pointer;
      &:nth-of-type(1),
      &:nth-last-of-type(1) {
        cursor: default;
      }
    }
  }
  // .el-table {
  //   // border: 1px solid #dddddd;
  // }
  .el-table .darg_start {
   background-color: #f3f3f3; 
  }
  .el-table th {
    padding: 0;
    box-sizing: border-box;
    position: relative;
    overflow: visible!important;
    a {
      display: block;
      width: 100%;
    }
    .virtual{
      position: absolute;
      box-sizing: border-box;
      width: 100%;
      margin-left: -10px;
    }
    &.darg_active_left {
      .virtual {
        // background-color: red;
        border-left: 2px dotted #666;
        z-index: 99;
      }
    }
    &.darg_active_right {
      .virtual {
        // background-color: blue;
        border-right: 2px dotted #666;
        z-index: 99;
      }
    }
  }
  // .cell {
  //   // overflow: visible;
  // }
  .thead-cell {
    padding: 0;
    display: inline-flex;
    flex-direction: column;
    align-items: left;
    cursor: pointer;
    overflow: initial;
    &:before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
    }
  }
  &.w-table_moving {
    .el-table th .thead-cell{
      cursor: move !important;
    }
    .is-leaf {
      cursor: not-allowed;
    }
  }
}
</style>