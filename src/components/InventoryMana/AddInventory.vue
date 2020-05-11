<template>
  <div class="CONTENT">
    <el-card class="main_left">
      <p class="queschoose">题型选择</p>
      <div class="changeBtn">
        <li style="display:flex;justify-content: center;">
          <el-button
            class="chooseType"
            size="mini"
            type="info"
            plain
            icon="el-icon-s-opportunity"
            @click.prevent.stop="changetype"
            style="margin-right:10px"
          >单选</el-button>
          <el-button
            class="chooseType"
            size="mini"
            type="info"
            plain
            icon="el-icon-s-help"
            @click.prevent.stop="changetype"
          >评分</el-button>
        </li>
        <li style="display:flex;justify-content: center;">
          <el-button
            class="chooseType"
            size="mini"
            type="info"
            plain
            icon="el-icon-finished"
            @click.prevent.stop="changetype"
            style="margin-right:10px"
          >多选</el-button>
          <el-button
            class="chooseType"
            size="mini"
            type="info"
            plain
            icon="el-icon-tickets"
            @click.prevent.stop="changetype"
          >文本</el-button>
        </li>
        <li style="display:flex;justify-content: center;">
          <span style="font-size:14px;color:#909399">
            题目数:
            <a
              href="###"
              style="font-size:14px;color:#1ea0fa;margin-left:5px;text-decoration:none;"
            >{{quesName}}</a>
          </span>
        </li>
      </div>
    </el-card>
    <el-card class="main_right">
      <!-- 量表名称 -->
      <h3>{{inveName}}</h3>
      <div class="list_box">
        <!-- 拖拽模块 -->
        <vuedraggable v-model="single">
          <transition-group>
            <!-- 循环生成各项题目 -->
            <ul v-for="(item,index) in single" :key="item.id">
              <li>
                <p
                  class="quesTitle"
                  @click.prevent.stop="getOneInfo(item,index)"
                  v-html="item.quesMedia"
                ></p>
                <!-- 题目说明 -->
                <p class="quesTips">{{item.quesTips}}</p>
                <!-- 编辑删除按钮 -->
                <div class="editDel">
                  <el-button
                    plain
                    size="mini"
                    class="editBtn"
                    icon="el-icon-edit"
                    @click.prevent.stop="editBtn(item,index)"
                  >编辑</el-button>
                  <el-button
                    plain
                    size="mini"
                    class="delBtn"
                    icon="el-icon-delete"
                    @click.prevent.stop="delBtn(item,index)"
                  >删除</el-button>
                </div>
                <div class="info-change-list" @click.prevent.stop="getOneInfo(item,index)">
                  <!-- 循环生成选项 -->
                  <div class="listiconshow" v-for="(list,index) in item.option" :key="index">
                    <!-- 判断type类型 -->
                    <!-- 单选题 -->
                    <div v-if="item.quesType==1">
                      <el-radio :label="1">{{list.optContent}}</el-radio>
                      <span v-if="list.optMedia==''"></span>
                      <span v-else>
                        <img class="chooseImages" :src="list.optMedia" />
                      </span>
                      <span style="display:none">{{list.advId }}</span>
                    </div>
                    <!-- 多选题 -->
                    <div class="listlabel" v-else-if="item.quesType==2">
                      <el-checkbox>{{list.optContent}}</el-checkbox>
                      <span v-if="list.optMedia==''"></span>
                      <span v-else>
                        <img class="chooseImages" :src="list.optMedia" />
                      </span>
                      <span style="display:none">{{list.advId }}</span>
                    </div>
                    <!-- 文本题 -->
                    <div v-else-if="item.quesType==3">
                      <span v-if="list.optMedia==''"></span>
                      <span v-else>
                        <img class="chooseImages" :src="list.optMedia" />
                      </span>
                      <span style="display:none">{{list.advId }}</span>
                    </div>
                    <!-- 分数题 -->
                    <div v-if="item.quesType==4">
                      <el-radio :label="2" style="margin-right:10px;">{{list.optContent}}</el-radio>
                      <span class="listOptscore">( 分值：{{list.optScore}} )</span>
                      <span v-if="list.optMedia==''"></span>
                      <span v-else>
                        <img class="chooseImages" :src="list.optMedia" />
                      </span>
                      <span style="display:none">{{list.advId }}</span>
                    </div>
                  </div>
                </div>
                <!-- 编辑框 -->
                <div class="bgDv" v-show="item.open">
                  <!-- 编辑框的三角 -->
                  <div class="posImg"></div>
                  <!-- 富文本编辑器 -->
                  <quill-editor
                    class="editor"
                    ref="myTextEditor"
                    v-model="item.quesMedia"
                    :options="editorOption"
                  ></quill-editor>
                  <!-- 选择题目类型 -->
                  <div class="selectOpt">
                    <el-select
                      size="mini"
                      v-model="item.quesType"
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
                    <!-- 必答 -->
                    <el-checkbox
                      class="mustChecked"
                      v-model="item.quesIsAnswer"
                      true-label="1"
                      false-label="0"
                    >必答</el-checkbox>
                    <!-- 填写提示 -->
                    <span class="writeTips">
                      <a href="###" @click.prevent.stop="handleClickInstr(index)">填写提示</a>
                    </span>
                  </div>
                  <div v-if="item.quesType != 3" v-show="true">
                    <!-- 选项文字 图片 说明 分数 上移下移 -->
                    <div class="selImgTips">
                      <span style="margin-left:20px;">选项文字</span>
                      <span style="margin-left:230px;">图片</span>
                      <span style="margin-left:40px;">说明</span>
                      <span style="margin-left:40px;" v-if="item.quesType == 4" v-show="true">分数</span>
                      <span v-if="item.quesType == 4" style="margin-left:100px;">建议</span>
                      <span v-else style="margin-left:80px;">建议</span>
                      <span v-if="item.quesType == 4" style="margin-left:120px;">上移下移</span>
                      <span v-else style="margin-left:160px;">上移下移</span>
                    </div>
                    <div v-for="(subItem,i) in item.option" :key="i" style="display:flex">
                      <!-- 题目输入框 -->
                      <el-input
                        v-if="item.quesType == 3"
                        size="mini"
                        class="conContent"
                        v-model="subItem.optContent"
                        style
                        v-show="false"
                      ></el-input>
                      <el-input
                        v-else
                        size="mini"
                        class="conContent"
                        v-model="subItem.optContent"
                        style
                      ></el-input>
                      <!--  + - 添加题目删除题目 -->
                      <span
                        style="margin:4px 0 0 5px;"
                        class="quesPosAdd"
                        @click.prevent.stop="quesPosAdd(item.option,index,i)"
                      ></span>
                      <span
                        style="margin: 4px 0 0 3px;"
                        class="quesPosDel"
                        @click.prevent.stop="quesPosDel(index,i)"
                      ></span>
                      <!-- 选项图片上传 -->
                      <el-upload
                        class="avatar-uploader quesImg"
                        :action="SHEET_IMG"
                        :show-file-list="false"
                        :on-success="handleAvatarSuccess"
                        :on-progress="uploadVideoProcess"
                        :before-upload="beforeAvatarUpload"
                        :on-change="(file, fileList) => {handleChange(file, fileList, index,i)}"
                      >
                        <img v-if="subItem.optMedia" :src="subItem.optMedia" class="avatar" />
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                      </el-upload>
                      <!-- 选项说明 -->
                      <span style="margin-left:51px;" class="quesInstr"></span>
                      <!-- 分数 -->
                      <el-input
                        v-if="item.quesType == 4"
                        v-show="true"
                        size="mini"
                        v-model="subItem.optScore"
                        class="inpOptScore"
                      ></el-input>
                      <!-- 建议 -->
                      <el-input
                        size="mini"
                        class="conContent"
                        v-model="subItem.advId "
                        @focus="chooseAdvice(index,i)"
                        style="margin-left:30px;"
                      ></el-input>
                      <!-- 上移下移箭头 -->
                      <span
                        v-if="item.quesType == 4"
                        style="margin-left:50px;"
                        class="quesPosTop"
                        @click.prevent.stop="quesPosTop(subItem,index,i)"
                      ></span>
                      <span
                        v-else
                        style="margin-left:93px;"
                        class="quesPosTop"
                        @click.prevent.stop="quesPosTop(subItem,index,i)"
                      ></span>
                      <span
                        style="margin-left:7px;"
                        class="quesPosBottom"
                        @click.prevent.stop="quesPosBottom(index,i)"
                      ></span>
                    </div>
                    <!-- 添加选项按钮 -->
                    <el-button
                      @click.prevent.stop="HandleClickAddList(item.option,index)"
                      size="mini"
                      class="addOption"
                      icon="el-icon-circle-plus-outline"
                    >添加选项</el-button>
                  </div>
                  <!-- 逻辑设置： -->
                  <div class="logicSetting">
                    <span style="margin-left:20px;">逻辑设置：</span>
                    <span style="margin-left:40px;">
                      <a href="###">题目关联</a>
                    </span>
                    <span style="margin-left:40px;">
                      <a href="###">跳题逻辑</a>
                    </span>
                    <span style="margin-left:40px;">
                      <a href="###">选项关联</a>
                    </span>
                  </div>
                  <!-- 完成编辑按钮 -->
                  <el-button
                    @click.prevent.stop="HandleClickOver(index)"
                    type="primary"
                    class="endEdit"
                    size="medium "
                  >完成编辑</el-button>
                </div>
              </li>
            </ul>
          </transition-group>
        </vuedraggable>
        <div class="batchAdd">
          <el-button type="info" plain @click.prevent.stop="batchAddQues()">批量添加题目</el-button>
        </div>
      </div>
    </el-card>
    <!-- 添加题目说明的弹框 -->
    <el-dialog title="题目说明" :visible.sync="editDialogVisible" width="40%" v-dialogDrag>
      <el-form
        ref="loginFormRef"
        :model="editAddForm"
        label-width="80px"
        @closed="editDialogClosed"
      >
        <el-form-item label="题目说明" prop="instrValue">
          <el-input v-model="editAddForm.instrValue"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editPageEnter">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 批量增加题目的弹框 -->
    <div class="batchAddDialog">
      <el-dialog :visible.sync="batchAddDialogVisible" width="45%" v-dialogDrag>
        <ul>
          <li
            class="batchAddCon"
            v-for="(item,index) in bankList"
            :key="index"
            @click="batchAddCon(index,item.view)"
            :class="{batchAddCla:Cla===index}"
          >{{item.name}}</li>
        </ul>
        <span slot="footer" class="dialog-footer">
          <keep-alive>
            <component
              :is="currentView"
              :sheetUuid="sheetUuid"
              v-on:openOrCls="clsbatchDia($event)"
            ></component>
          </keep-alive>
        </span>
      </el-dialog>
    </div>
    <!-- 添加建议弹框 -->
    <div class="addAdvice">
      <el-dialog
        title="选择建议"
        :visible.sync="chooseDialogVisible"
        width="60%"
        v-dialogDrag
        @closed="chooseDialogClosed"
      >
        <el-row :gutter="20">
          <el-col :span="7">
            <el-input placeholder="请输入关键词或内容" v-model="inputAdvice" @input="systemSearch" clearable></el-input>
          </el-col>
        </el-row>
        <!-- 调用公用表格组件 -->
        <EleTable :data="adviceList" :header="tableHeaderBig" @row-click="handleCurrentChoose">
          <el-table-column align="center" slot="fixed" fixed="left" label="选中" width="50">
            <template slot-scope="scope">
              <el-radio :label="scope.row.id" v-model="radioId"></el-radio>
            </template>
          </el-table-column>
        </EleTable>
        <!-- 分页 -->
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChangev"
          :current-page="pageNum"
          :page-sizes="[10, 20,50]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
        <span slot="footer" class="dialog-footer">
          <el-button @click="chooseDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="chooseEnter">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import vuedraggable from "vuedraggable";
import BatchAdd from "./Addbatch/BatchAdd";
import BankAdd from "./Addbatch/BankAdd";
import EleTable from "../commonModule/table";
export default {
  name: "editor",
  components: { vuedraggable, BatchAdd, BankAdd, EleTable },
  data() {
    return {
      checkedCities: [],
      textarea: "",
      single: [],
      listtype: "",
      singleid: 1,
      singletitle: "题目",
      infolistid: 2,
      score: 5,
      infolistval: "选项",
      checked: "",
      sheetUuid: "",
      inveName: "",
      instrIndex: null,
      num1: null,
      num2: null,
      options: [
        {
          value: "1",
          label: "单选"
        },
        {
          value: "2",
          label: "多选"
        },

        {
          value: "4",
          label: "评分"
        },
        {
          value: "3",
          label: "文本"
        }
      ],
      Cla: 0,
      currentView: "BatchAdd",
      bankList: [
        {
          name: "批量添加",
          view: "BatchAdd"
        },
        {
          name: "题库添加",
          view: "BankAdd"
        }
      ],
      i: null,
      photoUrl: "",
      editAddForm: {
        instrValue: ""
      },
      quesName: null,
      editDialogVisible: false,
      batchAddDialogVisible: false,
      ImgDialogVisible: false,
      editorOption: {
        modules: {
          toolbar: [
            ["bold", "italic", "underline", "strike"], // 加粗 斜体 下划线 删除线
            // ["blockquote", "code-block"], // 引用  代码块
            // [{ header: 1 }, { header: 2 }], // 1、2 级标题
            // [{ list: "ordered" }, { list: "bullet" }], // 有序、无序列表
            // [{ script: "sub" }, { script: "super" }], // 上标/下标
            // [{ indent: "-1" }, { indent: "+1" }], // 缩进
            // [{'direction': 'rtl'}],                         // 文本方向
            [{ size: ["small", false, "large", "huge"] }], // 字体大小
            // [{ header: [1, 2, 3, 4, 5, 6, false] }], // 标题
            [{ color: [] }, { background: [] }], // 字体颜色、字体背景颜色
            // [{ font: [] }], // 字体种类
            [{ align: [] }], // 对齐方式
            ["clean"], // 清除文本格式
            ["link", "image", "video"] // 链接、图片、视频
          ] //工具菜单栏配置
        },
        readyOnly: false, //是否只读
        theme: "snow", //主题 snow/bubble
        syntax: true //语法检测
      },
      chooseDialogVisible: false,
      tableHeaderBig: [],
      tableHeaderBig: [
        { prop: "advKind", label: "建议库" },
        { prop: "advFlag", label: "标签名称" },
        // { prop: "advValue", label: "赋值" },
        // { prop: "advSelectNum", label: "筛选序号" },
        { prop: "advKeyWord", label: "关键词" },
        { prop: "advContent", label: "建议内容" }
      ],
      inputAdvice: "",
      chooseAddForm: {},
      adviceList: [],
      pageSize: 10,
      pageNum: 1,
      total: 0,
      radioId: "",
      advNum1: "",
      advNum2: ""
    };
  },
  created() {
    this.sheetUuid = JSON.parse(window.localStorage.getItem("sheetUuid")).uuid;
    this.inveName = JSON.parse(window.localStorage.getItem("sheetUuid")).name;
    this.sheetQuesList();
    this.getScaleList();
  },

  methods: {
    // 获取量表题目列表
    async sheetQuesList() {
      const { data: res } = await this.$http.post(
        this.$ajax + "sheetQues/list",
        {
          sheetUuid: this.sheetUuid
        }
      );
      this.single = res.rows;
      this.quesName = res.rows.length;
    },
    // 获取建议列表
    async getScaleList() {
      const { data: res } = await this.$http.post(
        this.$ajax + "sheetAdv/list",
        {
          pageSize: this.pageSize,
          pageNum: this.pageNum,
          advKeyWord: this.inputAdvice
        }
      );
      if (res.code != 200) return this.$message.error("数获取失败");
      this.adviceList = res.rows;
      this.total = res.total;
    },
    // 排序
    sorted() {
      if (this.single.length <= 0) {
        this.singleid = "1";
      } else if (!(this.single.length == this.singleid)) {
        this.singleid = this.single.length + 1;
      }
    },
    changetype(e) {
      if (e.target.innerText.indexOf("单") > -1) {
        this.listtype = "1";
        this.CreateChangeSingleList();
      } else if (e.target.innerText.indexOf("多") > -1) {
        this.listtype = "2";
        this.CreateChangeSingleList();
      } else if (e.target.innerText.indexOf("文本") > -1) {
        this.listtype = "3";
        this.CreateChangeTextareaList();
      } else {
        this.listtype = "4";
        this.CreateChangeSingleList();
      }
    },
    //创建一个新单/多选题
    CreateChangeSingleList() {
      this.sorted();
      let changelist = [
        {
          inid: "1",
          optContent: "选项1",
          optOrder: 1,
          optScore: "1",
          optMedia: "",
          advId: "",
          check: false
        },
        {
          inid: "2",
          optContent: "选项2",
          optOrder: 2,
          optScore: "2",
          optMedia: "",
          advId: "",
          check: false
        },
        {
          inid: "3",
          optOrder: 3,
          optContent: "选项3",
          optScore: "3",
          optMedia: "",
          advId: "",
          check: false
        },
        {
          inid: "4",
          optOrder: 4,
          optContent: "选项4",
          optScore: "4",
          optMedia: "",
          advId: "",
          check: false
        }
      ];
      this.single.push({
        open: false,
        quesIsAnswer: 1,
        id: this.singleid++,
        quesMedia: this.singletitle + (this.singleid - 1),
        quesType: this.listtype,
        option: changelist
      });
    },
    // 创建文本题
    CreateChangeTextareaList() {
      this.sorted();
      let changelist = [
        {
          textareavalue: "",
          necessary: this.checked,
          optMedia: "",
          textprompt: false
        }
      ];
      this.single.push({
        open: false,
        quesIsAnswer: 1,
        id: this.singleid++,
        quesMedia: this.singletitle + (this.singleid - 1),
        quesType: this.listtype,
        option: changelist
      });
    },
    //创建内部选项
    HandleClickAddList(list, index) {
      if (!(list.length == this.infolistid)) {
        this.infolistid = list.length;
      }
      if (list.length < 10) {
        list.push({
          score: this.score++,
          optMedia: "",
          id: this.infolistid++,
          optContent: this.infolistval + this.infolistid
        });
      } else {
        this.$message.error("最多只能创建10个选项哦");
      }
    },
    // 显示隐藏编辑框
    getOneInfo(item, index) {
      console.log(item);
      
      this.$set(this.single[index], "open", !this.single[index].open);
    },
    // 删除题目
    async delBtn(info, index) {
      const { data: res } = await this.$http.post(
        this.$ajax + "sheetQues/remove",
        {
          quesUuid: info.quesUuid
        }
      );
      if (res.code != 200) return this.$message.error("删除失败");
      this.single.splice(index, 1);
      this.sheetQuesList();
    },
    // 编辑题目
    editBtn(item, index) {
      this.$set(this.single[index], "open", !this.single[index].open);
    },
    // 删除选项
    quesPosDel(index, i) {
      if (this.single[index].option.length <= 2) {
        return this.$message.error("请至少保留2个选项");
      } else {
        this.single[index].option.splice(i, 1);
      }
    },
    // 插入选项
    quesPosAdd(list, index, i) {
      let obj = {
        optScore: this.score++,
        advId: "",
        optMedia: "",
        id: this.infolistid++,
        optContent: this.infolistval + this.infolistid
      };
      list.push(obj);
    },
    // 调整选项位置
    quesPosTop(item, index, i) {
      console.log(item);

      var upArr = this.single[index].option;

      if (i != 0) {
        upArr[i].optOrder = upArr[i].optOrder - 1;
        upArr[i - 1].optOrder = upArr[i - 1].optOrder + 1;
        upArr[i] = upArr.splice(i - 1, 1, upArr[i])[0];
      } else {
        return;
      }
    },
    quesPosBottom(index, i) {
      var downArr = this.single[index].option;
      if (i + 1 != downArr.length) {
        downArr[i].optOrder += 1;
        downArr[i + 1].optOrder -= 1;
        downArr[i] = downArr.splice(i + 1, 1, downArr[i])[0];
      } else {
        return;
      }
    },
    // 完成编辑按钮
    async HandleClickOver(index) {
      // 当前项li
      var info = this.single[index];
      // html代码片段转纯文本
      var txt = info.quesMedia
        .replace(/<(style|script|iframe)[^>]*?>[\s\S]+?<\/\1\s*>/gi, "")
        .replace(/<[^>]+?>/g, "")
        .replace(/\s+/g, " ")
        .replace(/ /g, " ")
        .replace(/>/g, " ");
      var str = txt.replace(/&nbsp;/gi, "");
      var list = info.option;
      console.log(list);

      var Arr = [];
      for (var i = 0; i < list.length; i++) {
        var optObj = {
          optContent: list[i].optContent,
          optScore: list[i].optScore,
          optOrder: list[i].optOrder,
          optMedia: list[i].optMedia,
          advId: list[i].advId
        };
        Arr.push(optObj);
        
      }
      // 新增编辑题目接口
      const { data: res } = await this.$http.post(
        this.$ajax + "sheetQues/add",
        {
          sheetUuid: this.sheetUuid,
          quesUuid: info.quesUuid,
          quesTips: info.quesTips,
          quesIsAnswer: info.quesIsAnswer,
          quesType: info.quesType,
          quesContent: str,
          quesMedia: info.quesMedia,
          advId: info.advId,
          option: Arr
        }
      );
      console.log(res);
      
      if (res.code != 200) return this.$message.error("操作失败");
      this.$message.success("操作成功");
      info.open = false;
      this.sheetQuesList();
    },
    // 添加图片
    handleClickImg(info) {
      this.ImgDialogVisible = true;
    },
    // 添加题目说明
    handleClickInstr(index) {
      // 获取当前li的索引赋值给instrIndex
      this.instrIndex = index;
      this.editDialogVisible = true;
    },
    // 添加题目说明确定
    editPageEnter() {
      this.single[this.instrIndex].quesTips = this.editAddForm.instrValue;
      this.editDialogVisible = false;
    },
    // 添加题目dialog关闭
    editDialogClosed() {
      this.$refs.loginFormRef.resetFields();
    },
    // 批量增加题目
    batchAddQues() {
      this.batchAddDialogVisible = true;
    },
    batchAddCon(index, v) {
      this.Cla = index;
      this.currentView = v;
    },
    // 子组件绑定的方法关闭dialog
    clsbatchDia() {
      this.batchAddDialogVisible = false;
      this.sheetQuesList();
      window.location.reload(true);
    },
    // 添加建议
    chooseAdvice(index, i) {
      this.advNum1 = index;
      this.advNum2 = i;
      this.chooseDialogVisible = true;
    },
    chooseEnter() {
      this.single[this.advNum1].option[this.advNum2].advId = this.radioId;
      this.chooseDialogVisible = false;
    },
    chooseDialogClosed() {},
    handleCurrentChoose(val) {
      this.radioId = val.id;
    },
    // 搜索建议
    systemSearch() {
      this.getScaleList();
    },
    // 分页
    handleSizeChange(newSize) {
      this.pageSize = newSize;
    },
    handleCurrentChangev(newPage) {
      this.pageNum = newPage;
      this.getScaleList();
    },
    // 上传照片
    handleChange(file, fileList, index, i) {
      this.num1 = index;
      this.num2 = i;
    },
    handleAvatarSuccess(res, file) {
      if (res.code != 200) return this.$message.error("上传失败");
      this.single[this.num1].option[this.num2].optMedia = res.data;
    },
    uploadVideoProcess(event, file, fileList) {},
    beforeAvatarUpload(file) {
      console.log(file);

      const isJPG = file.type === "image/jpeg";
      const isGIF = file.type === "image/gif";
      const isPNG = file.type === "image/png";
      const isBMP = file.type === "image/bmp";
      const isLt10M = file.size / 1024 / 1024 < 10;
      if (!isJPG && !isGIF && !isPNG && !isBMP) {
        this.$message.error("上传图片必须是JPG/GIF/PNG/BMP 格式!");
      }
      if (!isLt10M) {
        this.$message.error("上传图片大小不能超过 10MB!");
      }
      return (isJPG || isBMP || isGIF || isPNG) && isLt10M;
    }
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
.CONTENT {
  position: relative;
  width: 1000px;
  height: 500px;
  margin: 0 auto;
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
.CONTENT h3 {
  text-align: center;
  margin-bottom: 40px;
}
.quesTips {
  margin: 10px 0 0 80px;
  font-size: 12px;
  color: #999;
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
  border: none;
}
.changeBtn .el-button + .el-button {
  margin-left: 0px;
}
.CONTENT .el-card__body {
  padding: 0;
}
.list_box li {
  position: relative;
  box-sizing: border-box;
  width: 100%;
  padding-right: 20px;
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
.editDel {
  position: absolute;
  right: 70px;
  bottom: 5px;
  display: none;
}
.list_box li:hover .editDel {
  display: block;
}
.listOptscore {
  color: orange;
  font-size: 14px;
}
.delBtn.is-plain:focus,
.delBtn.is-plain:hover {
  background: #fff;
  border-color: #ff6060;
  color: #ff6060;
}
.editDel .el-button + .el-button {
  margin-left: 5px;
}
.delBtn,
.editBtn {
  border-radius: none !important;
}
.editBtn.is-plain:focus,
.editBtn.is-plain:hover {
  background: #fff;
  border-color: #1ea0fa;
  color: #1ea0fa;
}
.quesTitle {
  margin: 25px 0 0 40px;
  font-weight: 700;
  font-size: 16px;
}
.quesTitle img {
  width: 80px;
  height: 80px;
}

.ql-editor img {
  width: 80px;
  height: 80px;
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

.chooseImages {
  width: 20px;
  height: 20px;
  margin-left: 20px;
  vertical-align: middle;
}
.bgDv {
  width: 100%;
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
  width: 160px;
  margin-bottom: 10px;
  display: inline-block;
}
.selectOpt {
  margin-bottom: 10px;
  width: 95%;
}
.writeTips {
  font-size: 14px;
  color: #6a6a6a;
  margin-left: 80px;
}
.writeTips a {
  color: #666666;
  text-decoration: underline;
}
.selImgTips {
  display: flex;
  margin-bottom: 10px;
  width: 95%;
  background: #e8e8e8;
  font-size: 14px;
  line-height: 30px;
}
.inpOptScore {
  width: 40px;
  display: inline-block;
  margin-left: 34px;
  padding: 0 5px;
  text-align: center;
}
.addOption {
  border: none;
  background: #f5f5f5;
  color: #0095ff !important;
  margin-bottom: 5px;
}
.logicSetting {
  border: 1px dashed #ccc;
  margin-bottom: 10px;
  width: 95%;
  background: #e8e8e8;
  font-size: 14px;
  height: 40px;
  line-height: 42px;
}
.logicSetting a {
  color: #666666;
  text-decoration: underline;
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
  height: 20px;
  width: 20px;
  vertical-align: middle;
  display: inline-block;
}
.quesInstr {
  cursor: pointer;
  background-position: -91px -220px;
  height: 20px;
  width: 20px;
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
.el-select .el-input.is-focus .el-input__inner {
  border: 1px solid #cdcdcd;
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
.CONTENT {
  padding: 0px 20px 10px;
}
.mustChecked {
  font-size: 14px;
  color: #6a6a6a;
  margin-left: 80px;
}
/* 完成编辑按钮改变颜色 */
.endEdit {
  display: block;
  margin-top: 10px;
  width: 95%;
  background-color: #ffab1a;
}
.bgDv .el-button--primary {
  color: #fff;
  background-color: #ffab1a;
  border-color: #ffab1a;
}
/* 必答样式部分修改 */
.bgDv .el-checkbox__label {
  padding-left: 0px;
}
.bgDv .el-checkbox__input.is-checked + .el-checkbox__label {
  color: #6a6a6a;
}
.bgDv .el-checkbox__input.is-checked .el-checkbox__inner,
.el-checkbox__input.is-indeterminate .el-checkbox__inner {
  background-color: #409eff !important;
  border-color: #409eff !important;
}
/* 批量增加题目按钮 */
.batchAdd {
  width: 100%;
  height: 150px;
  padding-top: 30px;
}
.batchAdd .el-button {
  margin-left: 50%;
  transform: translate(-50%);
}
/* 批量增加题目弹框 */
.batchAddDialog .el-dialog__header {
  padding: 0 !important;
  height: 0;
}
.batchAddDialog .el-dialog__body {
  margin-bottom: 4px !important;
}
.batchAddDialog .el-dialog__footer {
  padding: 0 !important;
  text-align: left;
  border-top: 1px solid #e8e8e8;
}
.batchAddCon {
  float: left;
  margin-right: 50px;
  padding-bottom: 10px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 700;
  color: #ccc;
}
.batchAddCla {
  border-bottom: 3px solid #409eff;
  color: #000;
}
.CONTENT .avatar-uploader {
  margin-left: 100px;
}
.CONTENT .avatar-uploader .el-upload {
  border: 1px solid #d9d9d9;
  background-color: #f7f8f9;
  cursor: pointer;
  position: relative;
}

.CONTENT .avatar-uploader-icon {
  font-size: 12;
  color: #8c939d;
  width: 20px;
  height: 20px;
  line-height: 20px;
  text-align: center;
}
.CONTENT .avatar {
  width: 20px;
  height: 20px;
  display: block;
}
.editor {
  line-height: normal !important;
  width: 95%;
  margin-bottom: 15px;
}
.addAdvice .el-radio__label {
  display: none;
}
.ql-toolbar.ql-snow {
  background-color: #f0f0ee;
}
.ql-snow .ql-tooltip {
  z-index: 999;
}
.ql-snow .ql-tooltip[data-mode="link"]::before {
  content: "请输入链接地址:";
}
.ql-snow .ql-tooltip.ql-editing a.ql-action::after {
  border-right: 0px;
  content: "保存";
  padding-right: 0px;
}

.ql-snow .ql-tooltip[data-mode="video"]::before {
  content: "请输入视频地址:";
}

.ql-snow .ql-picker.ql-size .ql-picker-label::before,
.ql-snow .ql-picker.ql-size .ql-picker-item::before {
  content: "14px";
}
.ql-toolbar.ql-snow .ql-picker.ql-expanded .ql-picker-options {
  z-index: 999;
}
.ql-snow .ql-picker.ql-size .ql-picker-label[data-value="small"]::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value="small"]::before {
  content: "10px";
}
.ql-snow .ql-picker.ql-size .ql-picker-label[data-value="large"]::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value="large"]::before {
  content: "18px";
}
.ql-snow .ql-picker.ql-size .ql-picker-label[data-value="huge"]::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value="huge"]::before {
  content: "32px";
}

.ql-snow .ql-picker.ql-header .ql-picker-label::before,
.ql-snow .ql-picker.ql-header .ql-picker-item::before {
  content: "文本";
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="1"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="1"]::before {
  content: "标题1";
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="2"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="2"]::before {
  content: "标题2";
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="3"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="3"]::before {
  content: "标题3";
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="4"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="4"]::before {
  content: "标题4";
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="5"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="5"]::before {
  content: "标题5";
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="6"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="6"]::before {
  content: "标题6";
}

.ql-snow .ql-picker.ql-font .ql-picker-label::before,
.ql-snow .ql-picker.ql-font .ql-picker-item::before {
  content: "标准字体";
}
.ql-snow .ql-picker.ql-font .ql-picker-label[data-value="serif"]::before,
.ql-snow .ql-picker.ql-font .ql-picker-item[data-value="serif"]::before {
  content: "衬线字体";
}
.ql-snow .ql-picker.ql-font .ql-picker-label[data-value="monospace"]::before,
.ql-snow .ql-picker.ql-font .ql-picker-item[data-value="monospace"]::before {
  content: "等宽字体";
}
</style>