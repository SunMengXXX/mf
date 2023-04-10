<template>
  <div class="user">
    <div class="head">
      <van-image class="avatar" round fit="cover" :src="user.avatar"
        ><template v-slot:loading>
          <van-loading type="spinner" size="20" /> </template
      ></van-image>
      <div class="info">
        <span class="name">{{ user.nickName || "" }}</span>
        <span class="slogen">性别：{{ user.sex || "" }}</span>
      </div>
    </div>
    <Circle :all="allBudget" :remain="remainBudget" ></Circle>
    <van-grid class="grid" direction="horizontal" :column-num="2">
      <van-grid-item icon="bill-o" text="账本" />
      <van-grid-item icon="friends-o" dot text="好友" @click="friendsList" />
    </van-grid>
    <div class="content">
      <van-cell icon="user-circle-o" to="/info" title="修改信息" is-link />
      <van-cell icon="setting-o" to="/account" title="账户安全" is-link />
      <van-cell icon="smile-o" to="/about" title="关于我们" is-link />
    </div>
    <van-button class="logout" type="primary" size="large" @click="logout"
      >退出登录</van-button
    >
  </div>
</template>

<script>
import { onMounted, ref, reactive, toRefs } from "vue";
import axios from "../utils/axios";
import router from "../router/index";
import { Toast } from "vant";
import Circle from "../components/Circle.vue";
export default {
  name: "User",
  components: {
    Circle,
  },
  setup() {
    const state = reactive({
      user: {
        avatar: "",
        userID: null,
        nickName: "",
        registerTime: "",
        sex: "",
        ledgerCount: null,
        ledgerDay: null,
      }, // 用户信息
    });
    const allBudget = ref(0)
    const remainBudget = ref(0)

    onMounted(async () => {
      getUserInfo();
      getUserBudget();
    });

    // 获取用户信息
    const getUserInfo = async () => {
      const { data } = await axios.get("/HNBC/user/getuserinfo");
      state.user.userID = data.userid;
      state.user.nickName = data.nickname;
      state.user.registerTime = data.create_time;
      state.user.sex = data.sex;
      state.user.ledgerCount = data.ledgercout;
      state.user.ledgerDay = data.ledgerday;
      state.user.avatar = data.icon;
      localStorage.setItem("user", JSON.stringify(data));
    };

    //获取用户总预算
    const getUserBudget = async () => {
      const { data } = await axios.get("/HNBC/userbudget/all");
      length = data.length;
      let all = 0;
      let remain = 0;
      for (let i = 0; i < length; i++) {
        all += data[i].amount;
        remain += data[i].residual;
      }
      allBudget.value = all;
      remainBudget.value = remain;
    };

    const friendsList = () =>{
      router.push({ path: "/friends" })
    }
    // 退出登录
    const logout = async () => {
      const data = await axios.get("/HNBC/user/logout");
      Toast.success({
        message: data.msg + "\n即将跳转至登录页面",
        duration: 1000,
      });
      localStorage.clear;
      setTimeout(() => {
        router.push({ path: "/login" });
      }, 1500);
    };

    return {
      ...toRefs(state),
      logout,
      allBudget,
      remainBudget,
      friendsList
    };
  },
};
</script>

<style lang='less' scoped>
@import url("../config/custom.less");
.user {
  min-height: 100%;
  background-color: #f5f5f5;
  padding: 12px;
  .head {
    display: flex;
    background: linear-gradient(315deg, #7fcea4 0%, #39be77 100%);
    padding: 12px;
    border-radius: 4px;
    margin-bottom: 12px;
    .avatar {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 50px;
      height: 50px;
      border: 3px solid #fff;
      margin-right: 10px;
    }
    .info {
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      text-align: center;
      .name {
        font-size: 0.5rem;
        color: #fff;
        font-weight: 500;
      }
      .slogen {
        color: #fff;
        background: rgba(0, 0, 0, 0.1);
        width: fit-content;
        padding: 0 0.3rem;
        border-radius: 0.2rem;
        font-size: 0.2rem;
      }
    }
  }
  .logout {
    display: block;
    margin: 0 auto;
    width: 90%;
    margin-top: 20px;
    background-color: @primary;
    border-color: @primary;
  }
  .van-grid {
    margin-bottom: 5px;
  }
}
</style>

<style lang="less">
.rate {
  .van-dialog__content {
    text-align: center;
    padding: 20px 0;
  }
}
</style>