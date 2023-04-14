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
import { onMounted, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { checkFriendRequest } from "../../tools/checkfriendrequest";
export default {
  name: "Tabbar",
  props: {
    msg: String,
  },
  setup() {
    const router = useRouter();
    const active = ref("/home");

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

    onMounted(() => {
      active.value = router.currentRoute.value.path;
      checkFriendRequest();
      friendReq.value = localStorage.getItem("friendReq");
      if (friendReq.value) {
        dot.value = JSON.parse(friendReq.value).length === 0 ? false : true;
      } else {
        dot.value = false;
      }
    });

    router.afterEach(() => {
      active.value = router.currentRoute.value.path;
    });

    watch(friendReq, (newVal) => {
      //console.log(JSON.parse(newVal));
    });
    return {
      active,
      link,
      friendReq,
      dot,
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
