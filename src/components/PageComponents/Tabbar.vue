<template>
  <van-tabbar v-model="active">
    <van-tabbar-item name="/ledger" icon="balance-pay" @click="link('/ledger')"
      >账本</van-tabbar-item
    >
    <van-tabbar-item name="/home" icon="notes-o" @click="link('/home')"
      >明细</van-tabbar-item
    >
    <van-tabbar-item
      name="/user"
      :dot="dot"
      icon="user-o"
      @click="link('/user')"
      >我的</van-tabbar-item
    >
  </van-tabbar>
</template>
<script>
import { onMounted, ref, watch, onbeforeunload, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import { checkFriendRequest } from "../../tools/checkfriendrequest";
import axios from "../../utils/axios";
export default {
  name: "Tabbar",
  props: {
    msg: String,
  },
  setup() {
    const router = useRouter();
    const active = ref("/home");
/*     const gap_time = ref(0);
    const beforeUnload_time = ref(0); */

    const link = (path) => {
      router.replace({ path });
      checkFriendRequest();
      friendReq.value = localStorage.getItem("friendReq");
      if (friendReq.value) {
        dot.value = JSON.parse(friendReq.value).length === 0 ? false : true;
      } else {
        dot.value = false;
      }
    };

    // 检查好友请求 有的话显示小红点
    const friendReq = ref([]);
    const dot = ref(false);

/*     // 关闭窗口之前执行
    const beforeunloadHandler = () => {
      beforeUnload_time = new Date().getTime();
    };
    const unloadHandler = () => {
      gap_time = new Date().getTime() - beforeUnload_time;
      //判断是窗口关闭还是刷新 毫秒数判断 网上大部分写的是5
      if (gap_time <= 5) {
        //localStorage.setItem("ledgerShowId", null);
        localStorage.clear();
      } else {
      }
    }; */

    onMounted(() => {
      axios.defaults.headers["authorization"] = `${
        localStorage.getItem("token") || null
      }`;
      active.value = router.currentRoute.value.path;
      checkFriendRequest();
      friendReq.value = localStorage.getItem("friendReq");
      if (friendReq.value) {
        dot.value = JSON.parse(friendReq.value).length === 0 ? false : true;
      } else {
        dot.value = false;
      }
/*       // 监听浏览器关闭
      window.addEventListener("beforeunload", () => beforeunloadHandler());
      window.addEventListener("unload", () => unloadHandler()); */
    });
    router.afterEach(() => {
      active.value = router.currentRoute.value.path;
    });

    /* onUnmounted(() => {
      // 移除监听
      window.removeEventListener("beforeunload", () => beforeunloadHandler());
      window.removeEventListener("unload", () => unloadHandler());
      localStorage.clear()
    }); */
    watch(friendReq, (newVal) => {
      //console.log(JSON.parse(newVal));
    });
    return {
      active,
      link,
      friendReq,
      dot,
      /* beforeunloadHandler,
      unloadHandler,
      gap_time,
      beforeUnload_time, */
    };
  },
};
</script>

<style lang="less">
@import url("../../config/custom.less");
.van-tabbar-item--active {
  color: @primary!important;
}
</style>
