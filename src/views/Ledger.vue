<template>
  <div>
    <van-nav-bar title="账本" class="">
      <template #left>
        <van-icon name="search" size="0.6rem" @click="changeState" />
      </template>
    </van-nav-bar>
    <van-search
      left-icon=""
      autofocus
      v-model="searchVal"
      v-if="search"
      show-action
      placeholder="请输入账本名称并按下回车"
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
        <span @click="changeType('createtime')"
          ><van-icon name="fire-o" />时间</span
        >
        <span @click="changeType('heat')"><van-icon name="clock-o" />热度</span>
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
            <LedgerItem
              v-for="item in list"
              :ledgers="item"
              :key="item"
              @refresh="sort"
            />
          </van-list>
        </van-pull-refresh>
      </div>
      <AddLedger calss="add" ref="AddLedgerRef" @refresh="onRefresh" />
    </div>
  </div>
</template>
  
  <script>
import { onMounted, reactive, ref, toRefs } from "vue";
import LedgerItem from "../components/LedgerItem.vue";
import AddLedger from "../components/AddLedger.vue";
import axios from "../utils/axios";
import dayjs from "dayjs";
import { Toast } from "vant";
export default {
  components: {
    LedgerItem,
    AddLedger,
  },
  setup() {
    const state = reactive({
      list: [],
      loading: false,
      finished: false,
      refreshing: false,
      currentSelect: {},
      currentTime: dayjs().format("YYYY-MM"),
      sortType: "createtime",
    });
    // 搜索
    const searchVal = ref("");
    // 搜索v-if条件
    const search = ref(false);
    const AddLedgerRef = ref(null);

    const changeState = () => {
      search.value = !search.value;
      if (!search.value) {
        onCancel();
      }
    };
    const onSearch = async () => {
      if (
        searchVal.value === null ||
        searchVal.value === "" ||
        searchVal.value.trim() === ""
      ) {
        Toast.fail("输入信息为空");
      } else {
        state.list = [];
        const { data } = await axios.get("/HNBC/select/ledgerbyname", {
          ledgername: searchVal.value,
        });
        if (data) {
          state.list = state.list.concat(data);
          console.log(state.list);
        }else{
          Toast.fail('无法查询到有关账本')
        }
      }
    };
    const onCancel = () => {
      searchVal.value = "";
      search.value = false;
      onRefresh()
    };

    const getBillList = async (uri) => {
      const { data } = await axios.get(uri);
      if (state.refreshing) {
        state.list = [];
        setTimeout(() => {
          state.refreshing = false;
        }, 200);
      }
      state.loading = true;
      state.list = data;

      state.loading = false;
      state.finished = true;
    };

    const sort = () => {
      if (state.sortType === "createtime") {
        getBillList("/HNBC/ledger/allbytime");
      } else {
        getBillList("/HNBC/ledger/allbynums");
      }
    };

    const onLoad = () => {
      sort();
    };

    const onRefresh = () => {
      // 清空列表数据
      state.finished = false;
      // 重新加载数据
      // 将 loading 设置为 true，表示处于加载状态
      state.refreshing = true;
      state.loading = true;
      //console.log("refresh被调用");
      onLoad();
    };
    const changeType = (type) => {
      if (type === state.sortType) {
        return;
      }
      state.sortType = type;
      onRefresh();
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
      changeType,
      sort,

      searchVal,
      onSearch,
      onCancel,
      search,
      changeState,
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
}
.view {
  overflow: hidden;
}
</style>