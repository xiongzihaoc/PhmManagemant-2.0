<template>
  <!-- 容器 -->
  <el-container>
    <!-- 侧边栏 -->
    <el-aside :width="isCollapse?'64px':'200px'">
      <!-- 侧边栏菜单区域 -->
      <div class="logoDiv">
        <img
          :width="iswidth?'30px':'50px'"
          :height="isheight?'30px':'50px'"
          class="logoImg"
          src="../assets/images/logo.png"
          @click="JumpIndex"
        />
      </div>
      <el-menu
        background-color="#304156"
        text-color="#BFCBD9"
        active-text-color="#42B983"
        :unique-opened="true"
        :collapse="isCollapse"
        :collapse-transition="false"
        router
        :default-active="$route.path"
      >
        <!-- 一级菜单 -->
        <el-submenu :index="item.id + ''" v-for="item in menuList" :key="item.id">
          <template slot="title">
            <i :class="item.icon" height="24px"></i>
            <span>{{item.menuName}}</span>
          </template>
          <!-- 二级菜单 -->
          <el-menu-item
            :index="'/' + subItem.url"
            v-for="subItem in item.child"
            :key="subItem.id"
            @click="saveNavState('/' + subItem.url)"
          >
            <template slot="title">
              <i class="el-icon-menu"></i>
              <span>{{subItem.menuName}}</span>
            </template>
          </el-menu-item>
        </el-submenu>
      </el-menu>
    </el-aside>
    <el-container>
      <!-- 头部区域 -->
      <el-header class="top">
        <div class="header_left">
          <i
            @click="toggleCollapse()"
            :class="isClass?'el-icon-s-unfold':'el-icon-s-fold'"
            id="toggle"
          ></i>
        </div>
        <div class="header_right">
          <el-dropdown @command="handleCommand">
            <span class="el-dropdown-link aaa">
              <img class="logoutImg" src="../assets/images/header.gif" alt />
              <span class="loginName">{{loginName}}</span>
              <i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>修改密码</el-dropdown-item>
              <el-dropdown-item @click.native="logout()">退出</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </el-header>
      <!-- 标签页 -->
      <div class="topTags">
        <el-tabs
          v-model="activeIndex"
          type="card"
          closable
          @tab-click="tabClick"
          v-if="options.length"
          @tab-remove="tabRemove"
        >
          <el-tab-pane
            :key="item.route"
            v-for="item in options"
            :label="item.name"
            :name="item.route"
          ></el-tab-pane>
        </el-tabs>
      </div>
      <!-- 主体内容区域 -->
      <el-main>
        <router-view></router-view>
      </el-main>
      <!-- <el-footer>
       Copyright © 2019 zhuoya All rights reserved
      </el-footer>-->
    </el-container>
  </el-container>
</template>
<script>
import { get } from "http";
export default {
  data() {
    return {
      menuList: [],
      isCollapse: false,
      activePath: "",
      loginName: "",
      isClass: false,
      iswidth: false,
      isheight: false
    };
  },
  created() {
    this.getMenuList();
    this.activePath = window.sessionStorage.getItem("activePath");
    this.loginName = window.localStorage.getItem("loginName");
  },
  methods: {
    // 退出
    async logout() {
      const { data: res } = await this.$http.post("user/userSignOut.do", {});
      if (res.code != 200) return this.$message.error("退出失败");
      window.sessionStorage.clear();
      this.$router.push("/login");
    },
    // 获取菜单栏数据
    async getMenuList() {
      const { data: res } = await this.$http.post("menu/getMenuList.do", {});
      if (res.code != 200) return this.$message.error(res.msg);
      this.menuList = res.data;
    },
    // 是否折叠展架侧边栏
    toggleCollapse() {
      this.isClass = !this.isClass;
      this.isCollapse = !this.isCollapse;
      this.iswidth = !this.iswidth;
      this.isheight = !this.isheight;
    },
    // 点击logo跳转首页
    JumpIndex() {
      this.$router.push({ path: "/index" });
    },
    // 保持连接的激活状态
    saveNavState(activePath) {
      window.sessionStorage.setItem("activePath", activePath);
    },
    handleCommand(command) {},
    // tab切换时，动态的切换路由
    // tab切换时，动态的切换路由
    tabClick(tab) {
      let path = this.activeIndex;
      this.$router.replace({ path: path });
    },
    tabRemove(targetName) {
      // 首页不可删除
      if (targetName == "/") {
        return;
      }
      this.$store.commit("delete_tabs", targetName);
      if (this.activeIndex === targetName) {
        // 设置当前激活的路由
        if (this.options && this.options.length >= 1) {
          this.$store.commit(
            "set_active_index",
            this.options[this.options.length - 1].route
          );
          this.$router.replace({ path: this.activeIndex });
        } else {
          this.$router.replace({ path: "/" });
        }
      }
    }
  },
  computed: {
    options() {
      return this.$store.state.options;
    },
    activeIndex: {
      get() {
        return this.$store.state.activeIndex;
      },
      set(val) {
        this.$store.commit("set_active_index", val);
      }
    }
  },
  watch: {
    $route(to) {
      let flag = false;
      for (let option of this.options) {
        if (option.route === to.path) {
          flag = true;
          this.$store.commit("set_active_index", to.path);
          break;
        }
      }
      if (!flag) {
        this.$store.commit("add_tabs", { route: to.path, name: to.name });
        this.$store.commit("set_active_index", to.path);
      }
    }
  }
};
</script>
<style lang='less' scoped>
.el-container {
  height: 100%;
}
.el-aside {
  background: #304156;
}
.el-header {
  height: 55px !important;
  overflow: hidden;
}
.header_left {
  float: left;
  margin-top: 20px;
}
.header_left:hover {
  cursor: pointer;
}
.header_right {
  overflow: hidden;
  float: right;
  height: 50px;
}
.el-icon-arrow-down {
  font-size: 12px;
  color: #2c3e50;
}
.el-menu {
  border-right: none;
  transition: 0s linear;
}
#toggle {
  float: left;
}
.el-main {
  background-color: #f5f5f5;
}
#index {
  float: left;
  margin-left: 10px;
}
.logoImg {
  float: left;
  border-radius: 10%;
  padding-left: 16px;
  margin-left: 50%;
  transform: translate(-50%);
}
.logoImg:hover {
  cursor: pointer;
}
.logoDiv {
  overflow: hidden;
  width: 100%;
  height: 50px;
  text-align: center;
  font-size: 30px;
  padding-top: 10px;
  color: #409eff;
  font-weight: 700;
}
.el-dropdown {
  float: right;
  margin-top: 7px;
}
.aaa {
  display: inline-block;
  cursor: pointer;

  color: #2c3e50;
}
.logoutImg {
  display: inline-block;
  cursor: pointer;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 5px;
  vertical-align: middle;
}
.el-footer {
  background-color: #fff;
  box-shadow: 4px 4px 4px 4px rgba(0, 21, 41, 0.08);
  text-align: center;
  padding-top: 20px;
}
.el-menu-item {
  border-left: 2px solid #42B983;
}
.topTags {
  height: 20px !important;
  width: 100%;
  background-color: #f5f5f5;
}

</style>