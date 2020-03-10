<template>
  <div class="CONTENT" style="position: relative;">
    <el-card class="main_left">
      <p class="queschoose">题型选择</p>
      <div>
        <el-button
          class="chooseType"
          size="mini"
          type="info"
          plain
          style="border:none"
          icon="el-icon-s-opportunity"
          @click.prevent.stop="changetype"
        >单选</el-button>
        <el-button
          class="chooseType"
          size="mini"
          type="info"
          plain
          style="border:none;"
          icon="el-icon-s-help"
          @click.prevent.stop="changetype"
        >评分</el-button>
        <el-button
          class="chooseType"
          size="mini"
          type="info"
          plain
          style="border:none;"
          icon="el-icon-finished"
          @click.prevent.stop="changetype"
        >多选</el-button>
        <el-button
          class="chooseType"
          size="mini"
          type="info"
          plain
          style="border:none;"
          icon="el-icon-tickets"
          @click.prevent.stop="changetype"
        >文本</el-button>
      </div>
    </el-card>
    <el-card class="main_right">
      <h3 style="text-align: center;margin-bottom:40px;">量表标题</h3>
      <div class="list_box">
        <vuedraggable v-model="single">
          <transition-group tag="p">
            <ul v-for="(item,index) in single" :key="index">
              <li>
                <p
                  style="margin:25px 0 0 40px;font-weight:700;font-size:16px;"
                  @click.prevent.stop="getOneInfo(index)"
                >{{item.title}}</p>
                <div class="info-change-list" @click.prevent.stop="getOneInfo(index)">
                  <div class="listiconshow" v-for="(list,index) in item.changelist" :key="index">
                    <div v-if="item.type==1">
                      <el-radio :label="1">{{list.value}}</el-radio>
                    </div>
                    <div class="listlabel" v-else-if="item.type==2">
                      <el-checkbox>{{list.value}}</el-checkbox>
                    </div>
                    <div v-else-if="item.type==3">
                      <el-input
                        type="textarea"
                        :rows="2"
                        placeholder="请输入内容"
                        style="width:400px;"
                        v-model="list.value"
                      ></el-input>
                    </div>
                    <div v-if="item.type==4">
                      <el-radio :label="2" style="margin-right:10px;">{{list.value}}</el-radio>
                      <span style="color:orange;font-size:14px;">( 分值：{{list.score}} )</span>
                    </div>
                  </div>
                </div>
                <div class="bgDv" v-show="item.openOrCls">
                  <div class="posImg"></div>
                  <el-input
                    type="textarea"
                    :rows="2"
                    class="conTitle"
                    v-model="item.title"
                    style="width: 95%;"
                  ></el-input>
                  <div style="margin-bottom:10px;width:95%;">
                    <el-select
                      size="mini"
                      v-model="item.value"
                      placeholder="请选择"
                      style="width:20%;"
                    >
                      <el-option
                        v-for="asItem in options"
                        :key="asItem.value"
                        :label="asItem.label"
                        :value="asItem.value"
                      ></el-option>
                    </el-select>
                    <span style="font-size:14px;color:#6A6A6A;margin-left:80px;">必答</span>
                    <span style="font-size:14px;color:#6A6A6A;margin-left:80px;">
                      <a href="###" style="color: #666666;text-decoration: underline;">填写提示</a>
                    </span>
                  </div>
                  <div
                    style="margin-bottom:10px;width:95%;height:30px;background:#e8e8e8;font-size:14px;line-height:30px;"
                  >
                    <span style="margin-left:20px;">选项文字</span>
                    <span style="margin-left:288px;">图片</span>
                    <span style="margin-left:40px;">说明</span>
                    <span style="margin-left:40px;" v-if="item.type == 4" v-show="true">分数</span>
                    <span v-if="item.type == 4" style="margin-left:80px;">上移下移</span>
                    <span v-else style="margin-left:80px;">上移下移</span>
                  </div>
                  <div v-for="(subItem,i) in item.changelist" :key="i">
                    <el-input
                      size="mini"
                      class="conContent"
                      v-model="subItem.value"
                      style="width:220px;display:inline-block;"
                    ></el-input>
                    <span style="margin-left:5px;" class="quesPosAdd"></span>
                    <span
                      style="margin-left:3px;"
                      class="quesPosDel"
                      @click.prevent.stop="quesPosDel(index,i)"
                    ></span>
                    <span
                      style="margin-left:100px;"
                      class="quesImg"
                      @click.prevent.stop="handleClickImg(subItem)"
                    ></span>
                    <span style="margin-left:51px;" class="quesInstr"></span>
                    <el-input
                      v-if="item.type == 4"
                      v-show="true"
                      size="mini"
                      v-model="subItem.score"
                      style="width:40px;display:inline-block;margin-left:34px;padding:5px;text-align:center;"
                    ></el-input>
                    <span v-if="item.type == 4" style="margin-left:75px;" class="quesPosTop"></span>
                    <span v-else style="margin-left:90px;" class="quesPosTop"></span>
                    <span style="margin-left:7px;" class="quesPosBottom"></span>
                  </div>

                  <el-button
                    @click.prevent.stop="HandleClickAddList(item.changelist)"
                    size="mini"
                    style="border:none;background:#f5f5f5;color:#0095ff!important;margin-bottom:5px;"
                    icon="el-icon-circle-plus-outline"
                  >添加选项</el-button>
                  <div
                    style="border:1px dashed #ccc;margin-bottom:10px;width:95%;background:#e8e8e8;font-size:14px;height:40px;line-height:42px;"
                  >
                    <span style="margin-left:20px;">逻辑设置：</span>
                    <span style="margin-left:40px;">
                      <a href="###" style="color: #666666;text-decoration: underline;">题目关联</a>
                    </span>
                    <span style="margin-left:40px;">
                      <a href="###" style="color: #666666;text-decoration: underline;">跳题逻辑</a>
                    </span>
                    <span style="margin-left:40px;">
                      <a href="###" style="color: #666666;text-decoration: underline;">选项关联</a>
                    </span>
                  </div>
                  <el-button
                    @click.prevent.stop="HandleClickOver(index)"
                    type="warning"
                    style="display:block;margin-top:10px;width:95%"
                    size="small"
                  >完成编辑</el-button>
                </div>
              </li>
            </ul>
          </transition-group>
        </vuedraggable>
      </div>
    </el-card>
    <!-- 添加图片和添加说明的弹框 -->
    <el-dialog title="添加图片" :visible.sync="editDialogVisible" width="40%" v-dialogDrag>
      <el-form
        ref="loginFormRef"
        :model="editAddForm"
        label-width="80px"
        @closed="editDialogClosed"
      >
        <el-form-item label="医院科室" prop="office">
          <el-input v-model="editAddForm.addEditValue"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editPageEnter">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import vuedraggable from "vuedraggable";
export default {
  components: { vuedraggable },
  data() {
    return {
      radio: "1",
      checkedCities: [],
      textarea: "",
      single: [],
      listtype: "",
      singleid: 1,
      singletitle: "题目",
      listtype: "",
      timer: null,
      infolistid: 2,
      score: 3,
      infolistval: "选项",
      checked: "",
      selValue: "",
      options: [
        {
          value: "1",
          label: "单选题"
        },
        {
          value: "2",
          label: "多选题"
        },
        {
          value: "3",
          label: "文本题"
        }
      ],
      editAddForm: {
        addEditValue: ""
      },
      editDialogVisible: false
    };
  },
  methods: {
    HandleRadio(e) {
      window.console.log(e);
    },
    sorted() {
      if (this.single.length <= 0) {
        this.singleid = "1";
      } else if (!(this.single.length == this.singleid)) {
        this.singleid = this.single.length + 1;
      }
    },
    changetype(e) {
      if (e.target.innerText.indexOf("单") > -1) {
        this.listtype = 1;
        this.CreateChangeSingleList();
      } else if (e.target.innerText.indexOf("多") > -1) {
        this.listtype = 2;
        this.CreateChangeSingleList();
      } else if (e.target.innerText.indexOf("文本") > -1) {
        this.listtype = 3;
        this.CreateChangeTextareaList();
      } else {
        this.listtype = 4;
        this.CreateChangeSingleList();
      }
    },
    //创建一个新单/多选题
    CreateChangeSingleList() {
      this.sorted();
      let changelist = [
        { inid: "1", value: "选项1", score: "1", check: false },
        { inid: "2", value: "选项2", score: "2", check: false }
      ];
      this.single.push({
        openOrCls: false,
        id: this.singleid++,
        title: this.singletitle + (this.singleid - 1),
        type: this.listtype,
        changelist: changelist
      });
    },
    CreateChangeTextareaList() {
      this.sorted();
      let changelist = [
        { textareavalue: "", necessary: this.checked, textprompt: false }
      ];
      this.single.push({
        openOrCls: false,
        id: this.singleid++,
        title: this.singletitle + (this.singleid - 1),
        type: this.listtype,
        changelist: changelist
      });
    },
    //创建内部选项
    HandleClickAddList(list) {
      if (!(list.length == this.infolistid)) {
        this.infolistid = list.length;
      }
      if (list.length < 30) {
        list.push({
          score: this.score++,
          id: this.infolistid++,
          value: this.infolistval + this.infolistid
        });
      } else {
        this.$message.error("最多只能创建30个选项哦");
      }
    },
    getOneInfo(index) {
      this.single[index].openOrCls = !this.single[index].openOrCls;
    },
    // 删除选项
    quesPosDel(index, i) {
      if (this.single[index].changelist.length <= 1) {
        return this.$message.error("请至少保留一个选项");
      } else {
        this.single[index].changelist.splice(i, 1);
      }
    },
    HandleClickOver(index) {
      this.single[index].openOrCls = false;
    },
    // 添加图片
    handleClickImg(info) {
      this.editDialogVisible = true;
    },
    editPageEnter() {},
    editDialogClosed() {}
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
  box-sizing: border-box;
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
  display: block;
  margin-bottom: 10px;
}
.CONTENT .el-button + .el-button {
  margin-left: 0px;
}
.CONTENT .el-card__body {
  padding: 0;
}
.list_box li {
  position: relative;
  box-sizing: border-box;
  width: 100%;
  border-top: 1px solid #e0e0e0;
}
.list_box li:last-child {
  border-bottom: 1px solid #e0e0e0;
}
.list_box li:hover {
  background-color: #fafafa;
}
.list_box li .tips {
  position: absolute;
  top: 5px;
  right: 5px;
}
.listiconshow {
  padding-top: 10px;
}
.listiconshow:last-child {
  padding-bottom: 30px;
}
.info-change-list {
  cursor: move;
  margin-left: 60px;
}
.el-checkbox__input.is-checked .el-checkbox__inner,
.el-checkbox__input.is-indeterminate .el-checkbox__inner {
  background-color: #afdd22 !important;
  border-color: #afdd22 !important;
}
.bgDv {
  position: relative;
  border-top: 1px solid #e0e0e0;
  padding: 20px 0 20px 40px;
  background-color: #f5f5f5;
}
.conTitle {
  display: block;
  margin-bottom: 10px;
}
.conContent {
  display: block;
  margin-bottom: 10px;
}
.posImg {
  cursor: pointer;
  position: absolute;
  top: -12px;
  left: 94px;
  width: 24px;
  height: 12px;
  background-image: url("../../assets/images/icoall.png");
  background-position: 0px -60px;
}
.quesImg {
  cursor: pointer;
  background-position: -52px -221px;
  height: 18px;
  width: 20px;
  vertical-align: middle;
  background-image: url("../../assets/images/icoall.png");
  background-repeat: no-repeat;
  display: inline-block;
  overflow: hidden;
}
.quesInstr {
  cursor: pointer;
  background-position: -91px -220px;
  height: 20px;
  width: 18px;
  vertical-align: middle;
  background-image: url("../../assets/images/icoall.png");
  background-repeat: no-repeat;
  display: inline-block;
  overflow: hidden;
}
.quesPosTop {
  cursor: pointer;
  background-position: -120px -113px;
  width: 20px;
  height: 20px;
  vertical-align: middle;
  background-image: url("../../assets/images/icoall.png");
  background-repeat: no-repeat;
  display: inline-block;
  overflow: hidden;
}
.quesPosBottom {
  cursor: pointer;
  background-position: -96px -113px;
  width: 20px;
  height: 20px;
  vertical-align: middle;
  background-image: url("../../assets/images/icoall.png");
  background-repeat: no-repeat;
  display: inline-block;
  overflow: hidden;
}
.quesPosAdd {
  cursor: pointer;
  background-position: -49px -113px;
  width: 20px;
  height: 20px;
  vertical-align: middle;
  background-image: url("../../assets/images/icoall.png");
  background-repeat: no-repeat;
  display: inline-block;
  overflow: hidden;
}
.quesPosDel {
  cursor: pointer;
  background-position: -72px -113px;
  width: 20px;
  height: 20px;
  vertical-align: middle;
  background-image: url("../../assets/images/icoall.png");
  background-repeat: no-repeat;
  display: inline-block;
  overflow: hidden;
}
.CONTENT .el-input__inner {
  border: 1px solid #cdcdcd;
  border-radius: 0;
  outline: none;
}
.CONTENT .el-textarea__inner {
  border-radius: 0;
  border: 1px solid #cdcdcd;
  outline: none;
}
</style>