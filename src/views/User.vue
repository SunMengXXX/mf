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
    <Circle :all="allBudget" :remain="remainBudget"></Circle>
    <van-grid class="grid" direction="horizontal" :column-num="2">
      <van-grid-item icon="bill-o" @click="budgetsList" text="预算" />
      <van-grid-item
        icon="friends-o"
        :dot="dot"
        text="好友"
        @click="friendsList"
      />
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
import Circle from "../components/UserInfoComponents/Circle.vue";
import { checkFriendRequest } from "../tools/checkfriendrequest";
import { off } from "process";
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
        age: "",
        ledgerCount: null,
        ledgerDay: null,
      }, // 用户信息
    });
    const allBudget = ref(0);
    const remainBudget = ref(0);

    // 检查好友请求 有的话显示小红点
    const friendReq = ref([]);
    const dot = ref(false);

    onMounted(async () => {
      getUserInfo();
      getUserBudget();
      checkFriendRequest();
      friendReq.value = localStorage.getItem("friendReq");
      if (friendReq.value) {
        dot.value = JSON.parse(friendReq.value).length === 0 ? false : true;
      } else {
        dot.value = false;
      }
    });

    // 获取用户信息
    const getUserInfo = async () => {
      const { data } = await axios.get("/HNBC/userinfo/getuserinfo");
      //console.log(axios.defaults);
      state.user.userID = data.userid;
      state.user.nickName = data.nickname;
      state.user.registerTime = data.create_time;
      state.user.sex = data.sex;
      state.user.age = data.age;
      state.user.ledgerCount = data.numrecord;
      state.user.ledgerDay = data.numactivateday;
      state.user.avatar = data.icon;
      localStorage.setItem("user", JSON.stringify(data));
      console.log(state.user.nickName, state.user.age, state.user.sex);
      if (!state.user.nickName || !state.user.age || !state.user.sex) {
        Toast.fail("请您尽快填写个人信息");
      }
    };

    //获取用户总预算
    const getUserBudget = async () => {
      const { data } = await axios.get("/HNBC/userbudget/all");
      for (let i = 0; i < data.length; i++) {
        if (data[i].state === "进行中") {
          allBudget.value = data[i].amount;
          remainBudget.value = data[i].residual;
        }
      }
    };

    // 获取预算列表
    const budgetsList = () => {
      router.push("/budgets");
    };
    // 获取好友列表
    const friendsList = () => {
      if (state.user.nickName && state.user.age && state.user.sex) {
        router.push("/friends");
      } else {
        Toast.fail("完成个人信息后方可使用");
      }
    };
    // 退出登录
    const logout = async () => {
      const data = await axios.get("/HNBC/userinfo/logout");
      Toast.success({
        message: data.msg + "\n即将跳转至登录页面",
        duration: 1000,
      });
      localStorage.clear();
      setTimeout(() => {
        router.push({ path: "/login" });
      }, 1500);
    };

    return {
      ...toRefs(state),
      logout,
      allBudget,
      remainBudget,
      friendsList,
      budgetsList,
      friendReq,
      dot,
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