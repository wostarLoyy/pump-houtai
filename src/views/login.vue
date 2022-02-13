<template>
  <div class="login">
    <!-- 账号密码登录 -->
    <el-form ref="loginForm" v-show="!loginByPhone" :model="loginForm" :rules="loginRules" class="login-form">
      <h3 class="title">系统登录</h3>
      <el-form-item prop="username">
        <el-input
          v-model="loginForm.username"
          type="text"
          auto-complete="off"
          placeholder="账号"
        >
          <svg-icon slot="prefix" icon-class="user" class="el-input__icon input-icon" />
        </el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input
          v-model="loginForm.password"
          type="password"
          auto-complete="off"
          placeholder="密码"
          @keyup.enter.native="handleLogin"
        >
          <svg-icon slot="prefix" icon-class="password" class="el-input__icon input-icon" />
        </el-input>
      </el-form-item>
      <el-form-item prop="code" v-if="captchaOnOff">
        <el-input
          v-model="loginForm.code"
          auto-complete="off"
          placeholder="验证码"
          style="width: 63%"
          @keyup.enter.native="handleLogin"
        >
          <svg-icon slot="prefix" icon-class="validCode" class="el-input__icon input-icon" />
        </el-input>
        <div class="login-code">
          <img :src="codeUrl" @click="getCode" class="login-code-img"/>
        </div>
      </el-form-item>
      <!-- <el-checkbox v-model="loginForm.rememberMe" style="margin:0px 0px 25px 0px;">记住密码</el-checkbox> -->
      <el-form-item style="width:100%;">
        <el-button
          :loading="loading"
          size="medium"
          type="primary"
          style="width:100%;"
          :disabled="!captchaOnOff"
          @click.native.prevent="handleLogin"
        >
          <span v-if="!loading">登 录</span>
          <span v-else>登 录 中...</span>
        </el-button>
        <div class="login-form-flexBox" v-if="register">
          <el-button type="text" @click="toggleLogin">短信验证登录</el-button>
          <!-- <router-link class="link-type" :to="'/register'">立即注册</router-link> -->
        </div>
      </el-form-item>
    </el-form>
    <!-- 手机号登录 -->
    <el-form ref="phoneLoginForm" v-show="loginByPhone" :model="phoneLoginForm" :rules="loginRules" class="login-form">
       <h3 class="title">系统登录</h3>
       <el-form-item prop="phoneNumber">
        <el-input
          v-model="phoneLoginForm.phoneNumber"
          type="text"
          auto-complete="off"
          placeholder="手机号"
        >
          <svg-icon slot="prefix" icon-class="phone" class="el-input__icon input-icon" />
        </el-input>
      </el-form-item>
      <el-form-item prop="numberCode" v-if="captchaOnOff">
        <el-input
          v-model="phoneLoginForm.numberCode"
          auto-complete="off"
          placeholder="验证码"
          style="width: 63%"
          @keyup.enter.native="handleLogin"
        >
          <svg-icon slot="prefix" icon-class="validCode" class="el-input__icon input-icon" />
        </el-input>
        <div class="login-code">
          <img :src="codeUrl" @click="getCode" class="login-code-img"/>
        </div>
      </el-form-item>
      <el-form-item prop="phoneCode">
        <el-input
          v-model="phoneLoginForm.phoneCode"
          auto-complete="off"
          placeholder="手机验证码"
          style="width: 63%"
        >
          <!-- <svg-icon slot="prefix" icon-class="validCode" class="el-input__icon input-icon" /> -->
        </el-input>
        <div class="login-code">
          <el-button v-show="!reTry" type="primary" :disabled="!phoneLoginForm.numberCode" @click.native="getPhoneCode">发送验证码</el-button>
          <el-button v-show="reTry" disabled  >{{ second }}秒后重试</el-button>
        </div>
      </el-form-item>
       <el-form-item style="width:100%;">
        <el-button
          :loading="loading"
          size="medium"
          type="primary"
          style="width:100%;"
          :disabled="!captchaOnOff"
          @click.native.prevent="handleLogin"
        >
          <span v-if="!loading">登 录</span>
          <span v-else>登 录 中...</span>
        </el-button>
        <div class="login-form-flexBox" v-if="register">
          <el-button type="text" class="changeType" @click="toggleLogin">账号登录</el-button>
          <!-- <router-link class="link-type" :to="'/register'">立即注册</router-link> -->
        </div>
      </el-form-item>
    </el-form>
    <!--  底部  -->
    <div class="el-login-footer">
      <span>Copyright © 20xx-20xx xxxxxxxxxxxxxxxxx.</span>
    </div>
  </div>
</template>

<script>
import { getCodeImg, postPhoneCode } from "@/api/login";
import Cookies from "js-cookie";
import { encrypt, decrypt } from '@/utils/jsencrypt'

export default {
  name: "Login",
  data() {
    return {
      codeUrl: "",
      uuid: '',
      reTry: false,
      timer: '',
      second: 0,
      loginForm: {
        username: "15226907990",
        password: "123456",
        rememberMe: false,
        code: null,
      },
      phoneLoginForm: {
        phoneNumber: '15226907990',
        numberCode: null,
        phoneCode: null,
      },
      loginRules: {
        username: [
          { required: true, trigger: "blur", message: "请输入您的账号" }
        ],
        password: [
          { required: true, trigger: "blur", message: "请输入您的密码" }
        ],
        code: [{ required: true, trigger: "blur", message: "请输入验证码" }],
        phoneNumber: [
          {  required: true, trigger: 'blur', message: '请输入手机号' }
        ],
        phoneCode: [
          { required: true, trigger: "blur", message: "请输入短信验证码" }
        ],
        numberCode: [
          { required: true, trigger: "blur", message: "请输入验证码" }
        ]
        
      },
      loading: false,
      // 验证码开关
      captchaOnOff: false,
      // 注册开关
      register: true,
      // 账号密码/手机号 登录
      loginByPhone: false,
      redirect: undefined
    };
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect;
      },
      immediate: true
    }
  },
  created() {
    this.getCode()
    // this.getCookie();
  },
  beforeDestroy() {
    clearInterval(this.timer)
  },
  methods: {
    toggleLogin() {
      this.loginByPhone = !this.loginByPhone
      this.loginForm.code = null
      this.phoneLoginForm.code = null
      this.uuid = null
      this.getCode()
    },
    // 获取图片验证码
    getCode() {
      getCodeImg().then(res => {
        if (res.code === 200) {
          this.captchaOnOff = true
          this.codeUrl = "data:image/gif;base64," + res.data.img
          this.uuid = res.data.uuid
        } else {
          this.captchaOnOff = false
          this.codeUrl = null
          this.uuid = null
        }
        // this.captchaOnOff = res.captchaOnOff === undefined ? true : res.captchaOnOff;
        // if (this.captchaOnOff) {
        //   this.codeUrl = "data:image/gif;base64," + res.img;
        //   this.loginForm.uuid = res.uuid;
        // }
      });
    },
    // 手机验证码获取
    getPhoneCode() {
      const list = {
        phonenumber: this.phoneLoginForm.phoneNumber,
        code: this.phoneLoginForm.numberCode,
        uuid: this.uuid
      }
      this.second = 60
      this.reTry = true
      this.timer = setInterval(this.countDown, 1000)
      postPhoneCode(list).then(res => {
        this.uuid = res.data.uuid
      }).catch(() => {
        if (this.captchaOnOff) {
          this.getCode();
        }
      })
    },
    countDown() {
      if(this.second > 0) {
        this.second -= 1
      } else {
        this.reTry = false
        clearInterval(this.timer)
      }
    },
    // 暂时不用
    // getCookie() {
    //   const username = Cookies.get("username");
    //   const password = Cookies.get("password");
    //   const rememberMe = Cookies.get('rememberMe')
    //   this.loginForm = {
    //     username: username === undefined ? this.loginForm.username : username,
    //     password: password === undefined ? this.loginForm.password : decrypt(password),
    //     rememberMe: rememberMe === undefined ? false : Boolean(rememberMe)
    //   };
    // },

    // 登录
    handleLogin() {
      // loginByPhone false 账号密码  loginByPhone true 手机登录
      if (this.loginByPhone) {
        // 手机登录
        this.$refs.phoneLoginForm.validate(valid => {
          if (valid) {
            this.loading = true;
            const list = {
              phonenumber: this.phoneLoginForm.phoneNumber,
              code: this.phoneLoginForm.phoneCode,
              uuid: this.uuid
            }
            this.$store.dispatch("LoginByPhone", list).then(() => {
              this.$router.push({ path: this.redirect || "/" }).catch(()=>{});
            }).catch(() => {
              this.loading = false;
              if (this.captchaOnOff) {
                this.getCode();
              }
            });
          }
        });
      } else {
        // 账号密码登录
        this.$refs.loginForm.validate(valid => {
          if (valid) {
            this.loading = true;
            const list = {
              phonenumber: this.loginForm.username,
              password: this.$md5(this.loginForm.password),
              code: this.loginForm.code,
              uuid: this.uuid,
            }
            this.$store.dispatch("Login", list).then((res) => {
              this.$router.push({ path: this.redirect || "/" }).catch(()=>{});
            }).catch(() => {
              this.loading = false;
              if (this.captchaOnOff) {
                this.getCode();
              }
            });
          }
        });
      }
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss">
.login {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  background-image: url("../assets/images/login-background.jpg");
  background-size: cover;
}
.title {
  margin: 0px auto 30px auto;
  text-align: center;
  color: #707070;
}

.login-form {
  border-radius: 6px;
  background: #ffffff;
  width: 400px;
  padding: 25px 25px 5px 25px;
  .el-input {
    height: 38px;
    input {
      height: 38px;
    }
  }
  .input-icon {
    height: 39px;
    width: 14px;
    margin-left: 2px;
  }
  .changeType {
    margin-right: 10px;
  }
  &-flexBox {
    display: flex;
    justify-content: space-between;
  }
}
.login-tip {
  font-size: 13px;
  text-align: center;
  color: #bfbfbf;
}
.login-code {
  width: 33%;
  height: 38px;
  float: right;
  img {
    cursor: pointer;
    vertical-align: middle;
  }
}
.el-login-footer {
  height: 40px;
  line-height: 40px;
  position: fixed;
  bottom: 0;
  width: 100%;
  text-align: center;
  color: #fff;
  font-family: Arial;
  font-size: 12px;
  letter-spacing: 1px;
}
.login-code-img {
  height: 38px;
}
</style>
