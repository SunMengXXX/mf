<template>
  <div class="home">
    <div class="header">
      <div class="data-wrap">
        <span>默认账本</span>
      </div>
    </div>
    <div class="blueBlock0">
      <Swipe class="my-swipe" indicator-color="white">
        <Swipe-item>
          <van-row justify="space-between">
            <van-col span="8" @click="changeType('expense')" 
            :class="{ active: type == 'expense'}"
            >
              <van-col justify="center">
                <van-row span="6" style="font-size: 1rem">{{
                  TotalExpense
                }}</van-row>
                <van-row span="6" style="font-size: 0.4rem">我的支出</van-row>
              </van-col>
            </van-col>
            <van-col span="8" @click="changeType('income')"
              :class="{ active: type == 'income'}"
            >
              <van-col justify="center">
                <van-row span="6" style="font-size: 1rem">{{
                  TotalIncome
                }}</van-row>
                <van-row span="6" style="font-size: 0.4rem">我的收入</van-row>
              </van-col>
            </van-col>
          </van-row>
        </Swipe-item>
        <Swipe-item>2</Swipe-item>
        <Swipe-item>3</Swipe-item>
      </Swipe>
    </div>
    <span>
      <DropdownMenu>
        <DropdownItem v-model="value1" :options="option1" />
        <DropdownItem v-model="value2" :options="option2" />
      </DropdownMenu>
    </span>
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

    <div class="add" @click="addIncomeToggle" style="color: #ecbe25" v-if="type == 'income'">
      <van-icon name="records" />
    </div>

    <!-- <PopType ref="popRef" @select="select" />
    <PopMonth ref="popMonthRef" @select="selectMonth" /> -->
    <ExpenseAdd ref="popExpenseAddRef" @refresh="onRefresh" />
    <IncomeAdd ref="popIncomeAddRef" @refresh="onRefresh" />
  </div>
</template>

<script>
import { reactive, ref, toRefs, onMounted } from "vue";
import { Swipe, SwipeItem } from "vant";
import { DropdownMenu, DropdownItem } from "vant";
import ExpenseItem from "../components/BillComponents/ExpenseItem.vue";
import IncomeAdd from "../components/IncomeComponents/IncomeAdd.vue"
import IncomeItem from "../components/IncomeComponents/IncomeItem.vue";
import ExpenseAdd from "../components/BillComponents/ExpenseAdd.vue";
import axios from "../utils/axios";
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
  },
  setup() {
    const popExpenseAddRef = ref(null);
    const popIncomeAddRef =ref(null);
    const value1 = ref(0);
    const value2 = ref("a");
    const option1 = [
      { text: "全部商品", value: 0 },
      { text: "新款商品", value: 1 },
      { text: "活动商品", value: 2 },
    ];
    const option2 = [
      { text: "默认排序", value: "a" },
      { text: "好评排序", value: "b" },
      { text: "销量排序", value: "c" },
    ];
    const state = reactive({
      defaultledgerId: 1,
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
      getIncomeList();
    });

    const getBillList = async () => {
      let ret = await axios.get(`/HNBC/user/getdefaultledger`);
      state.defaultledgerId = ret.data;
      localStorage.setItem('LedgerId',ret.data);
      const { data } = await axios.get(`/HNBC/bill/selectall/${ret.data}`);
      if (state.refreshing) {
        state.list = [];
        state.refreshing = false;
      }
      state.loading = false;
      state.list = state.list.concat(data);
      state.list.sort(sortExpense);

      state.TotalExpense = countTotal(state.list, "cost").toFixed(2);

      state.totalPage += 1;
      if (state.page >= state.totalPage) state.finished = true;
    };

    const getIncomeList = async () => {
      let ret = await axios.get(`/HNBC/user/getdefaultledger`);
      state.defaultledgerId = ret.data;
      const { data } = await axios.get(`/HNBC/income/selectall/${ret.data}`);
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
    // 类型弹窗开关
    // const toggle = () => {
    //   popRef.value.toggle()
    // }
    // 筛选类型
    // const select = (item) => {
    //   state.currentSelect = item
    //   onRefresh()
    // }
    // 月份弹窗开关
    // const monthToggle = () => {
    //   popMonthRef.value.toggle()
    // }
    // 筛选月份
    // const selectMonth = (item) => {
    //   state.currentTime = item
    //   onRefresh()
    // }
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
    const changeType = (type) => {
      state.type = type;
    };
    //根据id值 从小到大排序
    function sortExpense(a, b) {
      return Date.parse(a.billtime) - Date.parse(b.billtime);
    }
    function sortIncome(a, b) {
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
      // toggle,
      // monthToggle,
      addExpenseToggle,
      addIncomeToggle,
      onLoad,
      incomeOnLoad,
      onRefresh,
      incomeOnRefresh,
      // select,
      // selectMonth
      changeType,
      value1,
      value2,
      option1,
      option2,
    };
  },
};
</script>

<style lang='less' scoped>
@import url("../config/custom.less");
.active{
  font-weight:bold;
  text-shadow: 3px 5px 5px #FF0000;
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