<template>
  <div>
    <van-nav-bar title="账本" class="">
      <template #left>
        <van-icon name="search" size="0.6rem" @click="search = !search" />
      </template>
    </van-nav-bar>
    <van-search
      left-icon=""
      autofocus
      v-model="value"
      v-if="search"
      show-action
      placeholder="请输入需要搜索的账本名称关键词"
      @search="onSearch"
      @cancel="onCancel"
    />
    <van-button
      v-if="!search"
      icon="plus"
      type="primary"
      block
      @click="addLedger"
      >新建账本</van-button
    >
    <div class="sort" v-if="!search">
      <div class="type">
        <span @click="sort('createtime')"><van-icon name="fire-o" />时间</span>
        <span @click="sort('heat')"><van-icon name="clock-o" />热度</span>   
      </div>
    </div>
    <div class="home">
      <div class="content-wrap">
        <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
          <van-list
            :loading="loading"
            :finished="finished"
            finished-text="没有更多了"
            @load="onLoad"
          >
            <LedgerItem v-for="item in list" :ledgers="item" :key="item" />
          </van-list>
        </van-pull-refresh>
      </div>
      <AddLedger ref="AddLedgerRef" @refresh="onRefresh" />
    </div>
  </div>
</template>
  
  <script>
import { reactive, ref, toRefs } from "vue";
import LedgerItem from "../components/LedgerItem.vue";
import AddLedger from "../components/AddLedger.vue";
import axios from "../utils/axios";
import dayjs from "dayjs";
export default {
  components: {
    LedgerItem,
    AddLedger,
  },
  setup() {
    // 搜索
    const value = ref("");
    const onSearch = (val) => showRes(val);
    const onCancel = () => (search.value = false);
    // 搜索v-if条件
    const search = ref(false);

    const AddLedgerRef = ref(null);
    const state = reactive({
      page: 1,
      totalPage: 0,
      list: [],
      loading: false,
      finished: false,
      refreshing: false,
      currentSelect: {},
      currentTime: dayjs().format("YYYY-MM"),
    });

    

    const getBillList = async (uri) => {
      const { data } = await axios.get(uri);
      if (state.refreshing) {
        state.list = [];
        state.refreshing = false;
      }
      state.loading = false;
      state.list = data;
      state.totalPage += data.length;
      if (state.page >= state.totalPage) state.finished = true;
    };

    const sort = (type= "createtime") => {
      if (type === "createtime") {
        getBillList("/HNBC/ledger/allbytime");
      } else {
        getBillList("/HNBC/ledger/allbynums");
      }
    };

    const onLoad = () => {
      if (!state.refreshing && state.page < state.totalPage) {
        state.page = state.page + 1;
      }
      sort();
    };

    const onRefresh = () => {
      // 清空列表数据
      state.finished = false;
      // 页数重制
      state.page = 1;
      // 重新加载数据
      // 将 loading 设置为 true，表示处于加载状态
      state.refreshing = true;
      state.loading = true;
      onLoad();
    };
    // 添加账单弹窗开关
    const addLedger = () => {
      AddLedgerRef.value.toggle();
    };
    return {
      ...toRefs(state),
      AddLedgerRef,
      onLoad,
      onRefresh,
      addLedger,
      sort,

      value,
      onSearch,
      onCancel,
      search,
    };
  },
};
</script>
  
  <style lang='less' scoped>
@import url("../config/custom.less");

.home {
  height: 100%;
  display: flex;
  flex-direction: column;

  .header {
    position: fixed;
    top: 0;
    left: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 100%;
    background-color: @primary;
    color: #fff;
    font-size: 14px;
    z-index: 100;
    .type-wrap {
      background-color: #50ca84;
      display: inline-block;
      padding: 6px;
      border-radius: 4px;
      position: relative;
      align-self: baseline;
      .title {
        margin-right: 22px;
      }
      .title::after {
        content: "";
        position: absolute;
        top: 12px;
        bottom: 11px;
        right: 32px;
        width: 1px;
        background-color: #e9e9e9;
      }
    }
    .data-wrap {
      margin-top: 10px;
      font-size: 13px;
      .time {
        margin-right: 12px;
        .sort-down {
          font-size: 12px;
        }
      }
      .expense {
        margin-right: 10px;
      }
    }
  }
  .content-wrap {
    height: calc(~"(100% - 50px)");
    overflow: hidden;
    overflow-y: scroll;
    background-color: #f5f5f5;
    padding: 10px;
    // padding-bottom: 50px;
  }
  .add {
    position: fixed;
    bottom: 100px;
    right: 30px;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    border: 1px solid #e9e9e9;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 20px;
    background-color: #fff;
    box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.2);
    color: @primary;
  }
}
</style>