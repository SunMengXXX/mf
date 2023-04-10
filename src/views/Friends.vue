<template>
  <div class="content-wrap">
    <div>
      <!-- 上方导航栏 -->
      <van-nav-bar
        :title="newFriendsPage ? '好友申请' : '好友列表'"
        @click-left="back"
        left-text="返回"
        left-arrow
      >
        <template #right>
          <van-icon name="add-o" dot size="0.5rem" @click="newfriend" />
        </template>
      </van-nav-bar>
    </div>
    <!-- 好友申请 -->
    <div v-if="newFriendsPage">
      <van-button icon="plus" type="primary" block @click="addFriend"
        >添加好友</van-button
      >
      <van-dialog
        :show="showDialog"
        :before-close="beforeClose"
        title="添加好友"
        show-cancel-button
      >
        <van-cell-group inset>
          <van-field
            v-model="newFriendNickName"
            name="对方昵称"
            label="对方昵称"
            placeholder="请务必正确填写"
            :rules="[{ required: true, message: '请输入好友昵称' }]"
          />
          <van-field
            v-model="newFriendNotes"
            rows="2"
            autosize
            type="textarea"
            maxlength="20"
            placeholder="请输入申请信息"
            show-word-limit
          />
        </van-cell-group>
      </van-dialog>
      <van-divider
        :style="{ color: 'grey', borderColor: 'grey', padding: '0 16px' }"
        >以下为您收到的好友申请</van-divider
      >
      <van-list>
        <span class="tips">（向左滑动可选择操作）</span>
        <NewFriendRequest
          v-for="item in friendReq"
          :key="item"
          :info="item"
        ></NewFriendRequest>
      </van-list>
    </div>

    <!-- 好友列表 -->
    <van-pull-refresh
      v-if="!newFriendsPage"
      v-model="refreshing"
      @refresh="onRefresh"
    >
      <van-list
        :loading="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
      >
        <FriendSetting
          v-for="item in list"
          :key="item"
          :friendInfo="item"
          @refresh="onRefresh"
        ></FriendSetting>
      </van-list>
    </van-pull-refresh>
  </div>
</template>
  
  <script>
import { onMounted, reactive, ref, toRefs, watch, toRaw } from "vue";
import { useRouter } from "vue-router";
import { Toast } from "vant";
import axios from "../utils/axios";
import router from "../router/index";
import FriendSetting from "../components/FriendSetting.vue";
import { checkFriendRequest } from "../tools/checkfriendrequest";
import NewFriendRequest from "../components/NewFriendRequest.vue";
import { type } from "os";
export default {
  name: "Friends",
  components: {
    FriendSetting,
    NewFriendRequest,
  },
  setup() {
    const router = useRouter();
    const state = reactive({
      // 好友列表
      page: 0, // 当前页
      list: [],
      refreshing: false,
      loading: false,
      finished: false,
      gottenPages: 0,

      // 好友申请
      newFriendsPage: false,
      newFriendNickName: "",
      newFriendNotes: "",
      showDialog: false,
      show: false,
      newMark: "",
      //newFriends: [],
    });

    // 检查好友请求 有的话显示小红点
    const friendReq = ref([]);
    const dot = ref(false);
    const changDotState = () => {
      checkFriendRequest();
      friendReq.value = JSON.parse(localStorage.getItem("friendReq"));
      dot.value = friendReq.value.length === 0 ? false : true;
    };
    // 显示小红点
    onMounted(() => {
      changDotState();
      /* getFriendReq(); */
    });

    // 获取好友请求
    /* const getFriendReq = async () => {
      const { data } = await axios.get("/HNBC/friend/getrequest");
      const arr = Object.entries(data);
      for (let i = 0; i < arr.length; i++) {
        state.newFriends.push({
          nickname: arr[i][0],
          info: arr[i][1],
        });
      }
    }; */

    //阻止关闭弹框
    const beforeClose = async (action) => {
      if (action === "confirm") {
        if (state.newFriendNickName.trim() !== "") {
          const data = await axios.post("/HNBC/friend/request", {
            requestnickname: state.newFriendNickName.trim(),
            notes: state.newFriendNotes.trim(),
          });
          Toast.success(data.msg);
          state.newFriendNickName = "";
          state.newFriendNotes = "";
          state.showDialog = false;
          return true;
        } else {
          Toast.fail("无效昵称");
          state.newFriendNickName = "";
          return false;
        }
      } else {
        state.newFriendNickName = "";
        state.newFriendNotes = "";
        state.showDialog = false;
        return true;
      }
    };
    // 添加新好友
    const addFriend = () => {
      state.showDialog = true;
    };

    //查看好友申请页面
    const newfriend = () => {
      state.newFriendsPage = !state.newFriendsPage;
      if (!state.newFriendsPage) {
        onRefresh();
      }
      Toast({
        message: state.newFriendsPage ? "好友申请" : "好友列表",
        position: "bottom",
        duration: 1000,
      });
      changDotState()
    };

    // 获取好友列表
    const getFriendList = async () => {
      // data格式：friendid,friendname,marks,onlinetime
      state.loading = true;
      try {
        const { data } = await axios.get(`/HNBC/friend/get/${state.page}`);
        setTimeout(
          () => {
            state.loading = false;
            if (data === null || data.length === 0 || data.length < 10) {
              state.finished = true;
            } else {
              state.gottenPages++;
            }
            state.list = state.list.concat(data);
          },
          state.page === 1 ? 500 : 1000
        );
      } catch (e) {
        state.finished = true;
      }
    };

    const onLoad = () => {
      if (state.refreshing || state.page === 0) {
        state.list = [];
        state.refreshing = false;
      }
      state.page++;
      if (state.gottenPages + 1 === state.page) {
        getFriendList();
      }
    };

    const onRefresh = () => {
      // 清空列表数据
      state.finished = false;
      // 页数重制
      state.page = 0;
      state.gottenPages = 0;
      // 重新加载数据
      // 将 loading 设置为 true，表示处于加载状态
      state.refreshing = true;
      state.loading = true;
      onLoad();
    };

    // 返回方法
    const back = () => {
      router.back();
    };

    watch(friendReq, (newVal) => {
      //changDotState();
    });
    return {
      ...toRefs(state),
      onLoad,
      onRefresh,
      newfriend,
      back,

      addFriend,
      friendReq,
      dot,
      changDotState,
      beforeClose,
      /* getFriendReq, */
    };
  },
};
</script>
  
  <style lang="less">
@import url("../config/custom.less");
.account {
  min-height: 100%;
  background-color: #f5f5f5;

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
.content-wrap {
  height: calc(~"(100% -0%)");
  overflow: hidden;
  overflow-y: scroll;
  background-color: #f5f5f5;
  padding: 10px;
  // padding-bottom: 50px;
}
.tips{
  font-size: 0.2rem;
  margin-bottom: 0.1rem;
}
</style>