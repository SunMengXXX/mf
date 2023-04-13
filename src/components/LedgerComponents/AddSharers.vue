<template>
  <van-popup
    class="add"
    :show="show"
    position="bottom"
    lock-scroll
    overlay-style="overlay"
    round
    @touchmove.stop
    @close="beforeClose"
  >
    <div class="add-wrap">
      <header class="header" title="共享成员">
        <span class="close" @click="show = false"
          ><van-icon name="cross"
        /></span>
      </header>
      <div v-if="!isShared">
        <van-divider
          :style="{ color: 'grey', borderColor: 'grey', padding: '0 16px' }"
          >该账本无法添加更多成员了</van-divider
        >
      </div>
      <div v-if="isShared">
        <span class="tips" v-if="isOwner === 1">（向左滑动可选择操作）</span>
        <van-list>
          <van-swipe-cell class="cellbox" v-for="item in list" :key="item">
            <van-cell :title="item" value="已共享" />
            <template v-if="isOwner === 1" #right>
              <van-button
                square
                type="danger"
                text="删除"
                @click="handle('delete', item)"
              />
            </template>
          </van-swipe-cell>
        </van-list>
        <div>
          <van-divider
            v-if="isOwner === 1"
            :style="{ color: 'grey', borderColor: 'grey', padding: '0 16px' }"
            >添加更多账本成员</van-divider
          >
          <van-divider
            v-if="isOwner === 0"
            :style="{ color: 'grey', borderColor: 'grey', padding: '0 16px' }"
            >只有创建者可以添加成员</van-divider
          >
          <van-list @load="onload" :finished="finished">
            <van-swipe-cell
              class="cellbox"
              v-for="item in unsharedList"
              :key="item"
            >
              <van-cell :title="item" value="未共享" />
              <template #right>
                <van-button
                  square
                  type="success"
                  text="添加"
                  @click="handle('add', item)"
                />
              </template>
            </van-swipe-cell>
          </van-list>
        </div>
      </div>
    </div>
  </van-popup>
</template>

<script>
import { reactive, toRefs, watch, ref, onMounted, computed } from "vue";
import dayjs from "dayjs";
import axios from "../../utils/axios";
import { Toast } from "vant";
export default {
  props: {
    refresh: Function,
    detail: {
      type: Object,
      default: null,
    },
  },
  setup(props, ctx) {
    const id = ref("-1"); //账本ID
    const list = ref([]); //账本用户列表
    const state = reactive({
      isOwner: 0,
      isShared: false,
      show: false, // 显示隐藏添加账单弹窗
      page: 0,
      finished: false,
      friendsList: [],
    });
    const beforeClose = () => {
      ctx.emit("refresh");
    };

    // 显示或者隐藏popup
    const toggle = () => {
      state.show = !state.show;
    };
    // 计算未分享的好友列表
    const unsharedList = computed(() => {
      const arr = [];
      for (let i = 0; i < state.friendsList.length; i++) {
        const judge = false;
        for (let j = 0; j < list.value.length; j++) {
          if (state.friendsList[i].friendname === list.value[j]) {
            judge = true;
            break;
          }
        }
        if (judge === false) {
          arr.push(state.friendsList[i].friendname);
        } else continue;
      }
      return arr;
    });
    const handle = async (option, item) => {
      if (state.isOwner === 1) {
        if (option === "add") {
          const data = await axios.put("/HNBC/ledger/addsharer", {
            ledgerid: id.value,
            nickname: item,
          });
          Toast.success(data.msg);
        } else {
          const data = await axios.put("/HNBC/ledger/deletesharer", {
            ledgerid: id.value,
            nickname: item,
          });
          if (data.state === "404") {
            Toast.fail(data.msg);
          } else {
            Toast.success(data.msg);
          }
        }
        onRefresh();
      } else {
        Toast.fail("只有创建者可以修改共享成员");
      }
    };
    // 获取好友列表
    const onRefresh = () => {
      list.value = [];
      state.friendsList = [];
      state.finished = false;
      state.page = 0;
      state.isOwner = 0;
      onload();
    };

    //加载时调用
    const onload = () => {
      getSharedList();
      if (state.isOwner === 1) {
        getFriendList();
      }
    };

    const getFriendList = async () => {
      while (!state.finished) {
        try {
          state.page++;
          const { data } = await axios.get(`/HNBC/friend/get/${state.page}`);
          if (data.length === 0 || data.length < 10 || data === null) {
            state.finished = true;
          }
          state.friendsList = state.friendsList.concat(data);
        } catch (e) {
          state.finished = true;
        }
      }
    };
    const getSharedList = async () => {
      if (id.value !== "-1") {
        const { data } = await axios.get(`/HNBC/ledger/single/${id.value}`);
        list.value = data.sharers;
      }
    };
    //开启深度监视
    watch(props, (newVal) => {
      id.value = newVal.detail.ledgerID;
      //list.value = newVal.detail.sharers;
      state.isShared = newVal.detail.isShared === "YES" ? true : false;
      state.isOwner = newVal.detail.isOwner;
    });
    watch(unsharedList, (newVal) => {
    });
    watch(state.friendsList, (newVal) => {});
    return {
      ...toRefs(state),
      toggle,

      list,
      handle,
      getFriendList,
      onload,
      unsharedList,
      beforeClose,
      getSharedList,
      onRefresh,
    };
  },
};
</script>

<style lang="less">
@import url("../../config/custom.less");
.add-wrap {
  padding-top: 12px;
  min-height: 20rem;
  .header {
    display: flex;
    justify-content: space-between;
    padding: 0 24px;
    .van-icon-cross {
      font-size: 20px;
      color: @color-text-secondary;
    }
    .close {
      display: flex;
      align-items: center;
    }
    .add-btn {
      padding: 0 12px;
      background-color: @primary;
      border-color: @primary;
    }
  }
  .filter {
    padding: 12px 24px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .type {
      span {
        display: inline-block;
        background: #f5f5f5;
        color: @color-text-caption;
        padding: 4px 12px;
        font-size: 12px;
        border-radius: 24px;
        border: 1px solid #f5f5f5;
      }
      .expense {
        margin-right: 6px;
        &.active {
          background-color: #eafbf6;
          border-color: @primary;
          color: @primary;
        }
      }
      .income {
        &.active {
          background-color: #fbf8f0;
          border-color: @text-warning;
          color: @text-warning;
        }
      }
    }
    .time {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 4px 12px;
      background-color: #f0f0f0;
      border-radius: 20px;
      color: @color-text-base;
      .sort-down {
        font-size: 12px;
        margin-left: 5px;
      }
    }
  }
  .money {
    padding-bottom: 12px;
    border-bottom: 1px solid #e9e9e9;
    margin: 0 24px;
    .sufix {
      font-size: 36px;
      font-weight: bold;
      vertical-align: top;
    }
    .amount {
      font-size: 40px;
      padding-left: 10px;
    }
  }
  .animation::after {
    content: "";
    display: inline-block;
    margin-left: 5px;
    width: 2px;
    height: 28px;
    animation: blink 1s infinite steps(1, start);
  }
  @keyframes blink {
    0% {
      background-color: white;
    }
    50% {
      background-color: @color-text-secondary;
    }
    100% {
      background-color: white;
    }
  }
  .type-warp {
    display: flex;
    overflow-x: auto;
    margin: 0 24px;
    margin-bottom: 20px;
    * {
      touch-action: pan-x;
    }
    .type-body {
      display: flex;
      white-space: nowrap;
      .type-item {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding: 16px 12px 10px 12px;
        .iconfont-wrap {
          display: flex;
          justify-content: center;
          align-items: center;
          background-color: #f5f5f5;
          border-radius: 50%;
          width: 30px;
          height: 30px;
          margin-bottom: 5px;
          .iconfont {
            color: @color-text-caption;
            font-size: 20px;
          }
        }
        .expense {
          &.active {
            background-color: @primary;
            .iconfont {
              color: #fff;
            }
          }
        }
        .income {
          &.active {
            background-color: @text-warning;
            .iconfont {
              color: #fff;
            }
          }
        }
      }
    }
  }
  .remark {
    padding: 0 24px;
    padding-bottom: 12px;
    color: #4b67e2;
  }
  .van-number-keyboard {
    position: unset;
  }
  .van-dialog__confirm {
    color: @primary;
  }
}
.overlay {
  background-color: rgba(0, 0, 0, 0.5);
}
</style>