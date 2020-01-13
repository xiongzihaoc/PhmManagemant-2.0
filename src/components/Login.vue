<template>
  <div class="login-container">
    <el-form
      ref="loginFormRef"
      :model="loginForm"
      :rules="loginRules"
      class="login-form"
      auto-complete="on"
      label-position="left"
    >
      <div class="title-container">
        <h3 class="title">卓亚科技</h3>
      </div>

      <el-form-item prop="loginName">
        <el-input
          ref="username"
          v-model="loginForm.loginName"
          placeholder="用户名"
          name="username"
          type="text"
          prefix-icon="el-icon-user-solid"
          tabindex="1"
          auto-complete="on"
        />
      </el-form-item>
      <el-form-item prop="userPassword">
        <el-input
          :key="passwordType"
          ref="password"
          v-model="loginForm.userPassword"
          :type="passwordType"
          placeholder="密码"
          name="password"
          tabindex="2"
          prefix-icon="el-icon-lock"
          auto-complete="on"
          @keyup.13.native="handleLogin"
        />
      </el-form-item>

      <el-button
        :loading="loading"
        class="loginBtn"
        type="primary"
        :disabled="isDisabled"
        style="width:100%;margin-bottom:30px;"
        @click.native.prevent="handleLogin"
      >登 录</el-button>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "Login",
  data() {
    return {
      loginForm: {
        loginName: "",
        userPassword: ""
      },
      loginRules: {
        loginName: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 10, message: "长度在 3 到 10 个字符", trigger: "blur" }
        ],
        userPassword: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 5, max: 16, message: "长度在 5 到 16 个字符", trigger: "blur" }
        ]
      },
      loading: false,
      passwordType: "password",
      redirect: undefined,
      isDisabled: false
    };
  },
  methods: {
    handleLogin() {
      this.isDisable = true;
      setTimeout(() => {
        this.isDisable = false; //点击一次时隔两秒后才能再次点击
      }, 3000);
      this.$refs.loginFormRef.validate(async valid => {
        if (!valid) return;
        const { data: res } = await this.$http.post("user/login", {
          loginName: this.loginForm.loginName,
          password: this.$md5(this.loginForm.userPassword)
        });
        if (res.code != 200) return this.$message.error("用户名或者密码错误");
        // token 存入 sessionstorage
        window.sessionStorage.setItem("token", res.data.token);
        // 跳转
        window.localStorage.setItem("loginName", this.loginForm.loginName);
        this.$router.push({
          path: "/home"
        });
      });
    }
  }
};
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
$bg: #283443;
$light_gray: #fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>
$bg: #2d3035;
$dark_gray: #889aa4;
$light_gray: #eee;

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .login-form {
    position: relative;
    width: 400px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }
  .el-input {
    width: 90%;
    padding-left: 20px;
  }
  .el-input__icon {
    margin-top: 10px;
  }
  .el-form-item {
    border-radius: 40px 40px 40px 40px;
  }
  .el-button {
    height: 45px;
    border-radius: 40px 40px 40px 40px;
  }
}
.loginBtn {
  background-color: #afdd22;
  border: none;
}
.v-enter,
.v-leave-to {
  opacity: 0;
  transform: translateX(80px);
}
进入和离开的动画时间段 .v-enter-active,
.v-leave-active {
  transition: all 0.5s ease;
}
</style>
