<template>
  <div class="account">
    <Header title="账户安全" />
    <van-cell title="密码修改" @click="visible = true" is-link />
    <van-button class="close" type="primary" size="large" @click="close"
      >注销账户</van-button
    >
    <van-dialog
      class="modal-pass"
      :show="visible"
      :before-close="beforeClose"
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
  </div>
</template>

<script>
import { reactive, toRefs } from "vue";
import { useRouter } from "vue-router";
import { Dialog, Toast } from "vant";
import Header from "../components/Header.vue";
import axios from "../utils/axios";
import { validate } from "json-schema";
/* import { showConfirmDialog } from "vant"; */
export default {
  name: "Account",
  components: {
    Header,
  },
  setup() {
    const router = useRouter();
    const state = reactive({
      visible: false,
      oldPass: "",
      newPass: "",
      newPass2: "",
    });
    // 异步关闭弹框
    const beforeClose = async (action) => {
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
          state.visible = false;
          return true;
        }
      } else {
        state.oldPass = "";
        state.newPass = "";
        state.newPass2 = "";
        state.visible = false;
        return true;
      }
    };
    // 修改密码
    const handleOk = async () => {};

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
      beforeClose,
      close,
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
}
</style>