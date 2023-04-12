<template>
  <div class="account">
    <Header title="账户安全" />
    <van-cell title="密码修改" @click="passVisible = true" is-link />
    <van-cell title="邮箱绑定" @click="emailVisible = true" is-link />
    <van-cell title="手机绑定" @click="phoneVisible = true" is-link />
    <van-button class="close" type="primary" size="large" @click="close"
      >注销账户</van-button
    >
    <!-- 密码修改 -->
    <van-dialog
      class="modal-pass"
      :show="passVisible"
      :before-close="passBeforeClose"
      title="修改密码"
      show-cancel-button
    >
      <van-cell-group>
        <van-field
          v-model="oldPass"
          label="原密码"
          clearable
          placeholder="请输入原密码"
        />
        <van-field
          v-model="newPass"
          label="新密码"
          clearable
          placeholder="请输入新密码"
        />
        <van-field
          v-model="newPass2"
          label="确认密码"
          clearable
          placeholder="再次输入确认"
        />
      </van-cell-group>
    </van-dialog>
    <!-- 邮箱绑定 -->
    <van-dialog
      class="modal-pass"
      :show="emailVisible"
      :before-close="emailBeforeClose"
      title="绑定邮箱"
      show-cancel-button
    >
      <van-cell-group>
        <van-field
          v-model="newEmail"
          label="新邮箱"
          clearable
          placeholder="请输入要绑定的邮箱"
          :rules="registerRules.userEmail"
          class="cellBox"
        />
        <van-field
          v-model="captcha"
          center
          clearable
          label="验证码"
          placeholder="输入验证码"
          :rules="registerRules.usercaptcha"
          class="cellBox"
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
      </van-cell-group>
    </van-dialog>
    <!-- 手机号绑定 -->
    <van-dialog
      class="modal-pass"
      :show="phoneVisible"
      :before-close="phoneBeforeClose"
      title="绑定手机号"
      show-cancel-button
    >
      <van-cell-group>
        <van-field
          v-model="newPhone"
          label="新手机号"
          clearable
          placeholder="请输入要绑定的手机号"
          class="cellBox"
        />
        <van-field
          v-model="captcha"
          center
          clearable
          label="验证码"
          placeholder="输入验证码"
          :rules="registerRules.usercaptcha"
          class="cellBox"
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
      </van-cell-group>
    </van-dialog>
  </div>
</template>

<script>
import { onMounted, ref, reactive, toRefs } from "vue";
import { useRouter } from "vue-router";
import { Dialog, Toast } from "vant";
import Header from "../components/PageComponents/Header.vue";
import axios from "../utils/axios";
import registerRules from "../rules/registerRules";
function checkCAPTCHA(state, disabledController) {
  //验证码发送
  const sendCAPTCHA = (target) => {
    if (
      state.newEmail === null ||
      state.newEmail === "" ||
      state.newEmail.trim() === ""
    ) {
      Toast({
        message: "邮箱不能为空！",
        position: "bottom",
      });
    } else if (
      state.newPhone === null ||
      state.newPhone === "" ||
      state.newPhone.trim() === ""
    ) {
      Toast({
        message: "手机号不能为空！",
        position: "bottom",
      });
    } else {
    }
    if (
      state.userName.includes("@") &&
      !/^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/.test(
        state.userName
      )
    ) {
      Toast({
        message: "邮箱格式错误，请重新输入！",
        position: "bottom",
      });
    } else if (
      !state.userName.includes("@") &&
      !/^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/.test(
        state.userName
      )
    ) {
      Toast({
        message: "手机号格式错误，请重新输入！",
        position: "bottom",
      });
    } else {
      getCAPTCHA(target);
    }
  };
  //从后端获取验证码
  const getCAPTCHA = async (target) => {
    try {
      if (state.userName.includes("@")) {
        const data = await axios.post("/HNBC/user/emailcaptcha", {
          email: state.userName,
        });
        if (data.state === "200") {
          Toast.success(data.msg);
          disabledController.value = true;
          timeLock(target, disabledController);
        }
      } else {
        const data = await axios.post("/HNBC/user/phonecaptcha", {
          phone: state.userName,
        });
        if (data.state === "200") {
          Toast.success(data.msg);
          disabledController.value = true;
          timeLock(target, disabledController);
        }
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
  name: "Account",
  components: {
    Header,
  },
  setup() {
    const router = useRouter();
    const state = reactive({
      // 密码修改
      passVisible: false,
      oldPass: "",
      newPass: "",
      newPass2: "",

      // 邮箱修改
      emailVisible: false,
      email: "",
      newEmail: "",

      // 手机号修改
      phoneVisible: false,
      phone: "",
      newPhone: "",

      // 验证码
      captcha: "",
    });
    const disabledController = ref(false);
    // 邮箱绑定异步关闭弹框
    const emailBeforeClose = async (action) => {
      if (action === "confirm") {
        if (state.newPass != state.newPass2) {
          Toast.fail("密码不一致");
          return false;
        } else if (state.newPass === state.oldPass) {
          Toast.fail("新密码不能与原密码相同");
          return false;
        } else if (
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[~!@&%#_])[a-zA-Z0-9~!@&%#_]{8,16}$/.test(
            state.newPass
          ) === false
        ) {
          Toast.fail("密码必须包含大小写、数字、特殊字符，且在8到16位");
          return false;
        } else {
          const data = await axios.put("/HNBC/user/updatepassword", {
            originalpassword: state.oldPass,
            newpassword: state.newPass,
          });
          Toast.success(data.msg);
          state.oldPass = "";
          state.newPass = "";
          state.newPass2 = "";
          state.passVisible = false;
          return true;
        }
      } else {
        state.oldPass = "";
        state.newPass = "";
        state.newPass2 = "";
        state.passVisible = false;
        return true;
      }
    };
    // 手机绑定异步关闭弹框
    const phoneBeforeClose = async (action) => {
      if (action === "confirm") {
        if (state.newPass != state.newPass2) {
          Toast.fail("密码不一致");
          return false;
        } else if (state.newPass === state.oldPass) {
          Toast.fail("新密码不能与原密码相同");
          return false;
        } else if (
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[~!@&%#_])[a-zA-Z0-9~!@&%#_]{8,16}$/.test(
            state.newPass
          ) === false
        ) {
          Toast.fail("密码必须包含大小写、数字、特殊字符，且在8到16位");
          return false;
        } else {
          const data = await axios.put("/HNBC/user/updatepassword", {
            originalpassword: state.oldPass,
            newpassword: state.newPass,
          });
          Toast.success(data.msg);
          state.oldPass = "";
          state.newPass = "";
          state.newPass2 = "";
          state.passVisible = false;
          return true;
        }
      } else {
        state.oldPass = "";
        state.newPass = "";
        state.newPass2 = "";
        state.passVisible = false;
        return true;
      }
    };
    // 修改密码异步关闭弹框
    const passBeforeClose = async (action) => {
      if (action === "confirm") {
        if (state.newPass != state.newPass2) {
          Toast.fail("密码不一致");
          return false;
        } else if (state.newPass === state.oldPass) {
          Toast.fail("新密码不能与原密码相同");
          return false;
        } else if (
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[~!@&%#_])[a-zA-Z0-9~!@&%#_]{8,16}$/.test(
            state.newPass
          ) === false
        ) {
          Toast.fail("密码必须包含大小写、数字、特殊字符，且在8到16位");
          return false;
        } else {
          const data = await axios.put("/HNBC/user/updatepassword", {
            originalpassword: state.oldPass,
            newpassword: state.newPass,
          });
          Toast.success(data.msg);
          state.oldPass = "";
          state.newPass = "";
          state.newPass2 = "";
          state.passVisible = false;
          return true;
        }
      } else {
        state.oldPass = "";
        state.newPass = "";
        state.newPass2 = "";
        state.passVisible = false;
        return true;
      }
    };
    //获取手机号和邮箱
    const getPhoneAndEmail = async () => {
      const { data } = await axios.get("/HNBC/user/getemailandphone");
      state.email = data.email;
      state.phone = data.phone;
      state.newEmail = data.email;
      state.newPhone = data.phone;
    };
    onMounted(() => {
      getPhoneAndEmail();
    });
    // 注销账户
    const close = () => {
      Dialog.confirm({
        title: "危险操作",
        message: "请您确认是否要注销账户\n(该操作不可逆)",
      })
        .then(async () => {
          // 确认
          const data = await axios.delete("/HNBC/user/deleteuser");
          Toast.success({
            message: data.msg + "\n即将跳转至登录页面",
            duration: 1000,
          });
          localStorage.clear();
          setTimeout(() => {
            router.push({ path: "/login" });
          }, 1500);
        })
        .catch(() => {
          // 取消
        });
    };

    return {
      ...toRefs(state),
      ...checkCAPTCHA(state, disabledController),
      disabledController,
      passBeforeClose,
      phoneBeforeClose,
      emailBeforeClose,
      close,
      getPhoneAndEmail,
      registerRules,
    };
  },
};
</script>

<style lang="less">
@import url("../config/custom.less");
.account {
  min-height: 100%;
  background-color: #f5f5f5;

  .close {
    display: block;
    margin: 0 auto;
    width: 90%;
    margin-top: 20px;
    background-color: @danger;
    border-color: @danger;
  }
  .modal-pass {
    .van-dialog__header {
      padding: 10px 0;
    }
    .van-dialog__content {
      .van-cell-group {
        padding: 20px;
      }
    }
  }
  .cellBox {
    .van-cell__title {
      width: 2rem;
    }
  }
}
</style>