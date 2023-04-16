<template>
  <div class="home">
    <div>
      <van-nav-bar title="账本">
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
    
      <div class="sort" v-if="!search" style="height:30px">
        <div>
          <span @click="changeType('createtime')" class="type"
            ><van-icon name="fire-o" />时间</span
          >
          <span @click="changeType('heat')" class="type"
            ><van-icon name="clock-o" />热度</span
          >
        </div>
      </div>
    </div>
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
</template>
  
  <script>
import { onMounted, reactive, ref, toRefs } from "vue";
import LedgerItem from "../components/LedgerComponents/LedgerItem.vue";
import AddLedger from "../components/LedgerComponents/AddLedger.vue";
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
        const { data } = await axios.post("/HNBC/select/ledgerbyname", {
          ledgername: searchVal.value,
        });
        if (data) {
          state.list = state.list.concat(data);
        } else {
          Toast.fail("无法查询到有关账本");
        }
      }
    };
    const onCancel = () => {
      searchVal.value = "";
      search.value = false;
      onRefresh();
    };

    const getBillList = async (uri) => {
      const { data } = await axios.get(uri);
      if (state.refreshing) {
        state.list = [];
        setTimeout(() => {
          state.refreshing = false;
        }, 0);
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
.type{
  margin-right: 10px;
  padding-block: 5px;
  margin-top:10px;
  font-size: 15px;
}
.span1{
  margin-top:10px;
}
.home {
  height: 100%;
  display: flex;
  flex-direction: column;
  padding-top: 0rem;
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