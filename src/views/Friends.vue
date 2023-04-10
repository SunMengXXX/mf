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
      <van-search
        v-model="value"
        show-action
        label="地址"
        placeholder="请输入搜索关键词"
        @search="onSearch"
      >
        <template #action>
          <div @click="onClickButton">搜索</div>
        </template>
      </van-search>

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
import { onMounted, reactive, ref, toRefs } from "vue";
import { useRouter } from "vue-router";
import { Toast } from "vant";
import axios from "../utils/axios";
import router from "../router/index";
import FriendSetting from "../components/FriendSetting.vue";
export default {
  name: "Friends",
  components: {
    FriendSetting,
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
      Searchval: "",
      isSearch: false,
    });

    // 获取好友申请
    // 取消搜索
    const onCancel = () => {};

    // 搜索新好友
    const onSearch = () => {};

    //查看好友申请页面
    const newfriend = () => {
      state.newFriendsPage = !state.newFriendsPage;
      Toast({
        message: state.newFriendsPage ? "好友申请" : "好友列表",
        position: "bottom",
        duration: 1000,
      });
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

    return {
      ...toRefs(state),
      onLoad,
      onRefresh,
      newfriend,
      back,

      onSearch,
      onCancel,
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
</style>