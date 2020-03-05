<template>
  <div class="add-con">
    <div class="add-info-warrper" v-for="(item,index) of single" :key="index">
      <div class="add-title-wrapper">
        QT:
        <input class="info-title" type="text" v-model="item.title" />
      </div>
      <div class="info-icon-show">
        <div class="info-icon">
          <div
            class="iconfont add-info-icon"
            title="上移"
            @click="UpChangeSingleList(item.id)"
          >&#xe632;</div>
          <div
            class="iconfont add-info-icon"
            title="下移"
            @click="DownChangeSingleList(item.id)"
          >&#xe600;</div>
          <div
            class="iconfont add-info-icon"
            title="复用"
            @click="CopyChangeSingleList(item.id)"
          >&#xe60e;</div>
          <div
            class="iconfont add-info-icon"
            title="删除"
            @click="RemoveChangeSingleList(item.id)"
          >&#xe8d0;</div>
        </div>
      </div>
      <div class="info-change-list">
        <div class="listiconshow" v-for="(list,index) of item.changelist" :key="index">
          <label for="list.inid" v-if="item.type==1">
            <input
              type="radio"
              id="list.inid"
              name="change-one"
              :value="list.value"
              @click="HandleRadio"
            />
            <input v-model="list.value" type="text" class="change-list" />
            <span
              class="iconfont listicon"
              @click.prevent.stop="HandleClickUp(index,item.changelist)"
            >&#xe60a;</span>
            <span
              class="iconfont listicon"
              @click.prevent.stop="HandleClickDown(index,item.changelist)"
            >&#xe602;</span>
            <span
              class="iconfont listicon"
              @click.prevent.stop="HandleClickRemoveList(index,item.changelist)"
            >&#xe60b;</span>
          </label>
          <label for="list.inid" class="listlabel" v-else-if="item.type==2">
            <input
              type="checkbox"
              id="list.inid"
              name="change-one"
              :value="list.value"
              @click="HandleRadio"
            />
            <input v-model="list.value" type="text" class="change-list" />
            <span
              class="iconfont listicon"
              @click.prevent.stop="HandleClickUp(index,item.changelist)"
            >&#xe60a;</span>
            <span
              class="iconfont listicon"
              @click.prevent.stop="HandleClickDown(index,item.changelist)"
            >&#xe602;</span>
            <span
              class="iconfont listicon"
              @click.prevent.stop="HandleClickRemoveList(index,item.changelist)"
            >&#xe60b;</span>
          </label>
          <div v-else-if="item.type==3">
            <textarea class="textarea" placeholder="请在此填写内容" v-model="list.textareavalue"></textarea>
            <label class="required">
              <input @click="HandleChecked" type="checkbox" v-model="list.necessary" />
              <span>是否必填</span>
            </label>
          </div>
        </div>
        <div class="add-changelist-button" @click="HandleClickAddList(item.changelist)">
          <span class="iconfont">&#xe631;</span>
          添加选项
        </div>
      </div>
    </div>
    <div class="select-wrapper">
      <div class="add-explain">添加问题:</div>
      <div class="select-button" @click="changetype">
        <span class="iconfont">&#xe607;</span>
        单选题
      </div>
      <div class="select-button" @click="changetype">
        <span class="iconfont">&#xe607;</span>
        多选题
      </div>
      <div class="select-button" @click="changetype">
        <span class="iconfont">&#xe607;</span>
        文本题
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "CreateAdd",
  data() {
    return {
      //创建选题
      single: [
        // {
        //     id:'1',
        //     title:'题目1',
        //     type:'1',
        //     changelist:[
        //         {inid:'1',value:'选项1',check:false},
        //         {inid:'2',value:'选项2',check:false}
        //     ],
        // },
        // {
        //     id:'2',
        //     title:'题目2',
        //     type:'2',
        //     changelist:[
        //         {inid:'1',value:'选项1',check:false},
        //         {inid:'2',value:'选项2',check:false}
        //     ],
        // },
        // {
        //     id:'3',
        //     title:'题目2',
        //     type:'3',
        //     changelist:[
        //         {textareavalue:'',necessary:[],textprompt:false},
        //     ],
        // }
      ],
      singleid: 1,
      singletitle: "题目",
      listtype: "",
      timer: null,
      infolistid: 2,
      infolistval: "选项",
      checked: ""
    };
  },
  methods: {
    HandleRadio(e) {
      window.console.log(e.target.value);
    },
    //指定type类型
    changetype(e) {
      console.log(e);
      
      if (e.target.innerText.indexOf("单") > -1) {
        this.listtype = 1;
        this.CreateChangeSingleList();
      } else if (e.target.innerText.indexOf("多") > -1) {
        this.listtype = 2;
        this.CreateChangeSingleList();
      } else {
        this.listtype = 3;
        this.CreateChangeTextareaList();
      }
    },
    //整理排序
    sorted() {
      if (this.single.length <= 0) {
        this.singleid = "1";
      } else if (!(this.single.length == this.singleid)) {
        this.singleid = this.single.length + 1;
      }
    },
    //创建一个新单/多选题
    CreateChangeSingleList() {
      this.sorted();
      let changelist = [
        { inid: "1", value: "选项1", check: false },
        { inid: "2", value: "选项2", check: false }
      ];
      this.single.push({
        id: this.singleid++,
        title: this.singletitle + (this.singleid - 1),
        type: this.listtype,
        changelist: changelist
      });
    },
    //判断文本题是否必填
    HandleChecked(e) {
      if (e.target.checked) {
        this.checked = "必填";
      }
    },
    //创建一个新文本选题
    CreateChangeTextareaList() {
      this.sorted();
      let changelist = [
        { textareavalue: "", necessary: this.checked, textprompt: false }
      ];
      this.single.push({
        id: this.singleid++,
        title: this.singletitle + (this.singleid - 1),
        type: this.listtype,
        changelist: changelist
      });
    },
    //删除指定选题
    RemoveChangeSingleList(id) {
      this.single.splice(id, 1);
    },
    //指定某个选题选项上移
    UpChangeSingleList(id) {
      if (id == 0) {
        return false;
      } else {
        this.single.splice(id - 1, 0, this.single[id]);
        this.single.splice(id + 1, 1);
      }
    },
    //指定某个选题选项下移
    DownChangeSingleList(id) {
      if (id >= 10 || id == this.single.length - 1) {
        return false;
      } else {
        this.single.splice(id + 2, 0, this.single[id]);
        this.single.splice(id, 1);
      }
    },
    //复用某个选题
    CopyChangeSingleList(id) {
      let index = this.single[id];
      index = Object.assign({}, index); //不这样写会无限循环，即便如此id还是重复了
      this.single.splice(id + 1, 0, index);
    },
    //创建内部选项
    HandleClickAddList(list) {
      if (!(list.length == this.infolistid)) {
        this.infolistid = list.length;
      }
      if (list.length < 10) {
        list.push({
          id: this.infolistid++,
          value: this.infolistval + this.infolistid
        });
      } else {
        this.$message.error('最多只能创建10个选项')
      }
    },
    //删除指定内部选项
    HandleClickRemoveList(index, list) {
      list.splice(index, 1);
    },
    //内部选项上移
    HandleClickUp(index, list) {
      if (index == 0) {
        return false;
      } else {
        list.splice(index - 1, 0, list[index]);
        list.splice(index + 1, 1);
      }
    },
    //内部选项下移
    HandleClickDown(index, list) {
      if (index >= 10 || index == list.length - 1) {
        return false;
      } else {
        list.splice(index + 2, 0, list[index]);
        list.splice(index, 1);
      }
    }
  },
  watch: {
    //侦听single数组
    single: {
      handler() {
        if (this.timer) {
          //提升性能
          clearTimeout(this.timer);
        }
        this.timer = setTimeout(() => {
          this.single.forEach((val, index) => {
            val.id = index;
          });
          let single = "single" + this.$route.params.id;
          localStorage.setItem(single, JSON.stringify(this.single));
        }, 100);
      },
      // 开启深度监听
      deep: true,
      immediate: true
    }
  },
  mounted() {
    //页面加载或刷新时把存在本地的数据赋予
    let id = "single" + this.$route.params.id;
    this.single = JSON.parse(localStorage.getItem(id)) || [];
  }
};
</script>

<style scoped>
.add-con {
  box-sizing: border-box;
  padding: 10px 0;
  border-top: 1px solid #e1e1e1;
  border-bottom: 1px solid #e1e1e1;
  overflow: hidden;
}
.add-explain {
  height: 20px;
  line-height: 20px;
  font-size: 1.2em;
  margin-right: 2em;
}
@media screen and (max-width: 500px) {
  .add-explain {
    display: none;
  }
}
.add-explain > span {
  vertical-align: middle;
  font-size: 1.2em;
}
.select-wrapper {
  background: #fff;
  text-align: center;
  display: flex;
  justify-content: center;
  padding: 10px 0;
  border: 1px solid rgba(109, 107, 107, 0.664);
}
.select-wrapper:hover {
  background: #e1e1e1;
}
.select-button {
  border: 1px solid black;
  border-radius: 5px;
  width: 8%;
  min-width: 70px;
  height: 20px;
  line-height: 20px;
  margin-right: 5px;
}
.select-button:hover {
  background: #31383e;
  color: #fff;
  cursor: pointer;
}
.add-info-warrper {
  padding: 10px;
  margin-bottom: 5px;
  min-width: 350px;
  min-height: 180px;
}
.add-con .add-info-warrper:hover {
  box-shadow: 1px 1px 2px 2px #eee;
}
.add-title-wrapper {
  font-size: 1.2em;
  margin-bottom: 5px;
}
.add-title-wrapper .info-title {
  box-sizing: border-box;
  width: 90%;
  height: 30px;
  padding: 3px 5px;
  color: rgb(151, 148, 148);
  border-radius: 3px;
}
.add-title-wrapper .info-title:hover {
  background: rgba(255, 68, 0, 0.158);
  border: 1px solid #31708f;
}
.info-icon-show {
  width: 2em;
  vertical-align: top;
  display: inline-block;
}
.info-icon {
  width: 2em;
  display: none;
  vertical-align: top;
}
.add-info-warrper:hover .info-icon {
  display: inline-block;
}
.add-info-icon {
  padding-bottom: 15px;
  width: 27px;
  font-size: 18px;
  cursor: pointer;
}
.add-info-icon:hover {
  color: #018fe5;
}
.add-info-warrper .info-change-list {
  display: inline-block;
  width: 85%;
}
.info-change-list .change-list {
  box-sizing: border-box;
  width: 90%;
  padding: 0 3px;
  border-radius: 3px;
  color: rgb(151, 148, 148);
  margin-bottom: 3px;
  height: 30px;
}
.info-change-list .change-list:hover {
  background: rgba(255, 68, 0, 0.158);
  border: 1px solid #31708f;
}
.info-change-list .add-changelist-button {
  padding: 15px 10px;
  font-size: 1.2em;
  color: rgb(151, 148, 148);
  cursor: pointer;
}
.add-changelist-button:hover {
  color: #a94442;
}
.listicon {
  color: #018fe5;
  display: none;
  vertical-align: middle;
  text-align: right;
  font-size: 1.3em;
  margin-left: 2px;
  cursor: pointer;
}
.listiconshow:hover .listicon {
  display: inline-block;
}
.textarea {
  border: 1px solid;
  width: 90%;
  height: 100px;
  border-radius: 3px;
}
.textarea:hover {
  background: rgba(255, 68, 0, 0.158);
}
.required {
  display: block;
}
</style>