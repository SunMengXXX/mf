<template>
<div class="home">
  <div>
    <div class="block"></div>
    <van-nav-bar
      class="header1"
      @click-left="back"
      title="首页"
    >
    </van-nav-bar>
  </div>

    <div class="blueBlock0">
      <Swipe class="my-swipe" indicator-color="white">
        <Swipe-item>
          <van-row justify="space-between">
            <van-col
              span="8"
              @click="changeType('expense')"
              :class="{ active: type == 'expense' }"
            >
              <van-col justify="center">
                <van-row span="6" style="font-size: 1rem">{{
                  TotalExpense
                }}</van-row>
                <van-row span="6" style="font-size: 0.4rem">账本支出</van-row>
              </van-col>
            </van-col>
            <van-col
              span="8"
              @click="changeType('income')"
              :class="{ active: type == 'income' }"
            >
              <van-col justify="center">
                <van-row span="6" style="font-size: 1rem">{{
                  TotalIncome
                }}</van-row>
                <van-row span="6" style="font-size: 0.4rem">账本收入</van-row>
              </van-col>
            </van-col>
          </van-row>
        </Swipe-item>
        <Swipe-item style="line-height: 2.1rem">
          <van-row>
            <van-col span="16" style="font-size: 0.7rem">搜索账单</van-col>
            <van-col span="8" style="font-size: 0.6rem">
              <van-icon class="active" name="search" @click="Search" />
            </van-col>
          </van-row>
        </Swipe-item>
        <Swipe-item style="line-height: 2.1rem">
          <van-row>
            <van-col span="16" style="font-size: 0.7rem">我的图表</van-col>
            <van-col span="8" style="font-size: 0.6rem">
              <van-icon class="active" name="search" @click="chartToggle" />
            </van-col>
          </van-row>
        </Swipe-item>
      </Swipe>
    </div>
    <span> </span>
    <div class="content-wrap">
      <van-pull-refresh
        v-model="refreshing"
        @refresh="onRefresh"
        v-if="type == 'expense'"
      >
        <van-list
          :loading="loading"
          :finished="finished"
          finished-text="没有更多了"
          @load="onLoad"
        >
          <ExpenseItem v-for="item in list" :bill="item" :key="item" />
        </van-list>
      </van-pull-refresh>

      <van-pull-refresh
        v-model="incomeRefreshing"
        @refresh="incomeOnRefresh"
        v-if="type == 'income'"
      >
        <van-list
          :loading="incomeLoading"
          :finished="incomeFinished"
          finished-text="没有更多了"
          @load="incomeOnLoad"
        >
          <IncomeItem v-for="item in incomeList" :incomes="item" :key="item" />
        </van-list>
      </van-pull-refresh>
    </div>
    <div class="add" @click="addExpenseToggle" v-if="type == 'expense'">
      <van-icon name="records" />
    </div>
    <div
      class="add"
      @click="addIncomeToggle"
      style="color: #ecbe25"
      v-if="type == 'income'"
    >
      <van-icon name="records" />
    </div>
    <ExpenseAdd ref="popExpenseAddRef" @refresh="onRefresh" />
    <IncomeAdd ref="popIncomeAddRef" @refresh="incomeOnRefresh" />
  </div>
</template>

<script>
import { reactive, ref, toRefs, onMounted } from "vue";
import { Search, Swipe, SwipeItem } from "vant";
import { DropdownMenu, DropdownItem } from "vant";

import IncomeAdd from "../components/IncomeComponents/IncomeAdd.vue";
import ExpenseItem from "../components/BillComponents/ExpenseItem.vue";
import IncomeItem from "../components/IncomeComponents/IncomeItem.vue";
import ExpenseAdd from "../components/BillComponents/ExpenseAdd.vue";
import Header from "../components/PageComponents/Header.vue";
import SearchBill from "../views/SearchBill.vue";
import axios from "../utils/axios";
import router from "../router";
import dayjs from "dayjs";
export default {
  components: {
    ExpenseItem,
    Swipe,
    SwipeItem,
    IncomeItem,
    DropdownMenu,
    DropdownItem,
    ExpenseAdd,
    IncomeAdd,
    SearchBill,
    Header,
  },
  setup() {
    const popExpenseAddRef = ref(null);
    const popIncomeAddRef = ref(null);
    const popChartRef = ref(null);
    const state = reactive({
      defaultledgerId: -1,
      page: 1,
      incomePage: 1,

      totalPage: 0,
      incomeTotalPage: 0,

      list: [],
      incomeList: [],

      loading: false,
      incomeLoading: false,

      finished: false,
      incomeFinished: false,

      refreshing: false,
      incomeRefreshing: false,

      currentTime: dayjs().format("YYYY-MM"),
      type: "expense", // 模式切换参数

      TotalExpense: 0,
      TotalIncome: 0,
    });

    onMounted(async () => {
      axios.defaults.headers["authorization"] = `${
        localStorage.getItem("token") || null
      }`;
      router.isReady().then(() => {
        if (router.currentRoute.value.query.id) {
          state.defaultledgerId = router.currentRoute.value.query.id;
          localStorage.setItem("LedgerId", state.defaultledgerId);
        }
        // getIncomeList();
      });
    });

    const chartToggle = () => {
      router.push({ path: "/data" });
    };

    const getBillList = async () => {
      if (state.defaultledgerId === -1) {
        let ret = await axios.get(`/HNBC/userinfo/getdefaultledger`);
        state.defaultledgerId = ret.data;
        localStorage.setItem("LedgerId", ret.data);
      }

      const { data } = await axios.get(
        `/HNBC/bill/selectall/${state.defaultledgerId}`
      );
      if (state.refreshing) {
        state.list = [];
        state.refreshing = false;
      }
      state.loading = false;
      state.list = state.list.concat(data);
      console.log("state.list" + state.list);
      state.list.sort(sortExpense);

      state.TotalExpense = countTotal(state.list, "cost").toFixed(2);

      state.totalPage += 1;
      if (state.page >= state.totalPage) state.finished = true;
    };

    const getIncomeList = async () => {
      if (state.defaultledgerId === -1) {
        let ret = await axios.get(`/HNBC/userinfo/getdefaultledger`);
        state.defaultledgerId = ret.data;
        localStorage.setItem("LedgerId", ret.data);
      }
      const { data } = await axios.get(
        `/HNBC/income/selectall/${state.defaultledgerId}`
      );
      if (state.incomeRefreshing) {
        state.incomeList = [];
        state.incomeRefreshing = false;
      }
      state.incomeLoading = false;
      state.incomeList = state.incomeList.concat(data);
      state.incomeList.sort(sortIncome);
      state.TotalIncome = countTotal(state.incomeList, "earning").toFixed(2);

      state.incomeTotalPage += 1;
      if (state.incomePage >= state.incomeTotalPage)
        state.incomeFinished = true;
    };

    const onLoad = () => {
      if (!state.refreshing && state.page < state.totalPage) {
        state.page = state.page + 1;
      }
      getBillList();
    };
    const incomeOnLoad = () => {
      if (!state.incomeFinished && state.incomePage < state.incomeTotalPage) {
        state.incomePage = state.incomePage + 1;
      }
      getIncomeList();
    };

    const onRefresh = () => {
      // 清空列表数据
      state.finished = false;
      // 页数重制
      state.page = 1;
      state.totalPage = 0;
      // 重新加载数据
      // 将 loading 设置为 true，表示处于加载状态
      state.refreshing = true;
      state.loading = true;
      onLoad();
    };
    const incomeOnRefresh = () => {
      // 清空列表数据
      state.incomeFinished = false;
      // 页数重制
      state.incomePage = 1;
      state.incomeTotalPage = 0;
      // 重新加载数据
      // 将 loading 设置为 true，表示处于加载状态
      state.incomeRefreshing = true;
      state.incomeLoading = true;
      incomeOnLoad();
    };

    // 添加账单弹窗开关
    const addExpenseToggle = () => {
      console.log("popExpenseAddRef", popExpenseAddRef);
      popExpenseAddRef.value.toggle();
    };
    // 添加收入弹窗开关
    const addIncomeToggle = () => {
      console.log("popIncomeAddRef", popIncomeAddRef);
      popIncomeAddRef.value.toggle();
    };
    const Search = () => {
      router.push({ path: "/searchbill" });
      console.log("1");
    };
    const changeType = (type) => {
      state.type = type;
    };
    //根据id值 从小到大排序
    function sortExpense(b, a) {
      return Date.parse(a.billtime) - Date.parse(b.billtime);
    }
    function sortIncome(b, a) {
      return Date.parse(a.incometime) - Date.parse(b.incometime);
    }
    //计算对象数组中某个属性合计
    function countTotal(arr, keyName) {
      let $total = 0;
      $total = arr.reduce(function (total, currentValue, currentIndex, arr) {
        return currentValue[keyName] ? total + currentValue[keyName] : total;
      }, 0);
      return $total;
    }

    return {
      // show,
      // showPopup,
      ...toRefs(state),
      // popRef,
      // popMonthRef,
      popExpenseAddRef,
      popIncomeAddRef,
      popChartRef,
      // toggle,
      // monthToggle,
      chartToggle,
      addExpenseToggle,
      addIncomeToggle,

      onLoad,
      incomeOnLoad,
      onRefresh,
      incomeOnRefresh,
      // select,
      // selectMonth
      changeType,
      Search,
    };
  },
};
</script>

<style lang='less' scoped>
@import url("../config/custom.less");
.block {
  width: 100%;
  height: 46px;
}
.header1 {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  .more {
    font-size: 20px;
  }
}
.active {
  font-weight: bold;
  text-shadow: 3px 5px 5px #ff0000;
}
.home {
  height: 100%;
  display: flex;
  flex-direction: column;
  padding-top: 0rem;
  .header {
    top: 0;
    left: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 100%;
    height: 1.625rem;
    background-color: white;
    color: black;
    font-size: 20px;
    padding: 20px 20px;
    z-index: 100;
    .data-wrap {
      margin-top: 10px;
      font-size: 13px;
    }
  }
  .blueBlock0 {
    color: white;
    // height: 2.3rem;
    margin: 0.3125rem;
    border-radius: 0.3125rem;
    // padding: 0.1875rem;
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
  .my-swipe .van-swipe-item {
    padding: 0.3rem;
    color: #fff;
    line-height: 1.1rem;
    text-align: center;
    border-radius: 0.3125rem;
    background: linear-gradient(315deg, #29dcf2 0%, #0d9cde 100%);
  }
}
</style>