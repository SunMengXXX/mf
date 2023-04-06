<template>
  <div class="auth">
    <Header :title="type == 'login' ? '登录' : '注册'" />
    <img class="logo" src="//s.yezgea02.com/1606836859539/onpeice.png" alt="" />
    <van-form class="form-wrap" @submit="onSubmit" v-if="type == 'login'">
      <div class="form">
        <van-field
          clearable
          v-model="userName"
          name="userName"
          label="账号"
          placeholder="请输入账号"
          :rules="loginRules.userName"
        />
        <van-field
          clearable
          v-model="userPwd"
          type="password"
          name="userPwd"
          label="密码"
          placeholder="请输入密码"
          :rules="loginRules.userPwd"
        />
      </div>
      <div style="margin: 16px 0">
        <van-button round block type="primary" native-type="submit">
          登录
        </van-button>
        <p @click="chanegType('register')" class="change-btn">
          没有账号，前往注册
        </p>
      </div>
    </van-form>
    <van-form class="form-wrap" @submit="onSubmit" v-if="type == 'register'">
      <div class="form">
        <van-field
          clearable
          v-model="userName"
          name="userName"
          label="账号"
          placeholder="请输入账号"
          :rules="[{ required: true, message: '请填写账号' }]"
        />
        <van-field
          clearable
          v-model="userPwd"
          type="password"
          name="userPwd"
          label="密码"
          placeholder="请输入密码"
          :rules="registerRules.userPwd"
        />
        <van-field
          v-model="usercaptcha"
          center
          clearable
          label="验证码"
          placeholder="输入验证码"
          :rules="registerRules.usercaptcha"
          class="CAPTCHA"
        >
          <template #button>
            <van-button
              size="small"
              type="primary"
              @click="sendCAPTCHA"
              :disabled="disabledController"
              >发送验证码</van-button
            >
          </template>
        </van-field>
      </div>
      <div style="margin: 16px 0">
        <van-button
          round
          block
          :loading="loading"
          type="primary"
          native-type="submit"
        >
          注册
        </van-button>
        <p @click="chanegType('login')" class="change-btn">登录已有账号</p>
      </div>
    </van-form>
  </div>
</template>

<script>
import { reactive, toRefs, ref, onMounted } from "vue";
import Header from "../components/Header.vue";
import axios from "../utils/axios";
import { Toast } from "vant";
import router from "../router";
import loginRules from "../rules/loginRules";
import registerRules from "../rules/registerRules";
function checkCAPTCHA(state, disabledController) {
  //验证码发送
  const sendCAPTCHA = (target) => {
    if (state.userName) {
      getCAPTCHA(target);
    } else {
      Toast({
        message: "手机号或邮箱不能为空！",
        position: "bottom",
      });
    }
  };
  //从后端获取验证码
  const getCAPTCHA = async (target) => {
    try {
      const user = {
        phone: state.userName.includes("@") ? null : state.userName,
        email: state.userName.includes("@") ? state.userName : null,
      };
      const data = await axios.post("/captcha", user);
      //console.log(data);
      if (data.state === "200") {
        Toast.success(data.msg);
        disabledController.value = true;
        timeLock(target, disabledController);
      }
    } catch (e) {}
  };
  return {
    sendCAPTCHA,
    getCAPTCHA,
  };
}
//定时器
function timeLock(target, disabledController) {
  let timer = new Date(new Date().getTime() + 61 * 1000);
  let lock = setInterval(() => {
    const time = ((timer - new Date().getTime()) / 1000).toFixed(0);
    target.target.innerHTML = "(" + time + "s)";
    if (time < 1) {
      clearInterval(lock);
      disabledController.value = false;
      target.target.innerHTML = "发送验证码";
    }
  }, 1000);
  return lock;
}

export default {
  name: "Login",
  components: {
    //VueImgVerify,
    Header,
  },
  setup() {
    const state = reactive({
      userName: "",
      userPwd: "",
      type: "login", // 登录注册模式切换参数
      usercaptcha: "",
      loading: false,
    });
    const disabledController = ref(false);

    // 提交登录 or 注册表单
    const onSubmit = async (values) => {
      try {
        if (state.type == "login") {
          const { data } = await axios.post("/user/login", {
            phone: state.userName.includes("@") ? null : state.userName,
            email: state.userName.includes("@") ? state.userName : null,
            pass: state.userPwd,
          });
          localStorage.setItem("token", data.data);
          router.replace("/");
        } else {
          state.loading = true;
          const data = await axios.post("/user/register", {
            phone: state.userName.includes("@") ? null : state.userName,
            email: state.userName.includes("@") ? state.userName : null,
            pass: state.userPwd,
            usercaptcha: state.usercaptcha,
          });
          console.log(data);
          if (data.data) {
            Toast.success(data.msg+'\n即将自动跳转至主页');
            localStorage.setItem("token", data.data);
            state.type = "login";
            setTimeout(() => {
              router.replace("/");
            }, 2000);
          } else {
            Toast.fail(data.msg);
            localStorage.setItem("token", null);
            state.usercaptcha = "";
          }
          state.loading = false;
        }
      } catch (error) {
        //console.log(111);
        state.loading = false;
      }
    };

    // 切换登录和注册两种模式
    const chanegType = (type) => {
      state.type = type;
    };

    return {
      ...toRefs(state),
      ...checkCAPTCHA(state, disabledController),
      disabledController,
      onSubmit,
      chanegType,
      loginRules,
      registerRules,
    };
  },
};
</script>

<style lang='less' scoped>
@import url("../config/custom.less");
.auth {
  height: calc(~"(100% - 46px)");
  padding: 30px 20px 0 20px;
  background: @primary-bg;
  .logo {
    width: 150px;
    display: block;
    margin: 0 auto;
    margin-bottom: 30px;
  }
  .form-wrap {
    .form {
      border-radius: 10px;
      overflow: hidden;
      .van-cell:first-child {
        padding-top: 20px;
      }
      .van-cell:last-child {
        padding-bottom: 20px;
      }
    }
  }
  .change-btn {
    text-align: center;
    margin: 10px 0;
    color: @link-color;
    font-size: 14px;
  }
}
.CAPTCHA {
  min-height: 52px;
}
.CAPTCHA .van-button {
  width: 80px;
  margin-top: 1px;
}
</style>