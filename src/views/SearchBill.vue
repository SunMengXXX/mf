<template>
  <div class="auth">
    <Header title="账单搜索" />
    <van-form v-if="showSearchItem == false">
      <div class="item1">
        <span class="item1_lable">选择账本</span>

        <select
          v-model="isSelected"
          class="chosen-select"
          data-placeholder="请选择账本"
        >
          <option
            v-for="(item, index) in objArr"
            :key="index"
            :value="item.ledgerid"
          >
            {{ item.ledgername }}
          </option>
        </select>
      </div>

      <van-field name="radio" label="收/支">
        <template #input>
          <van-radio-group v-model="checked" direction="horizontal">
            <van-radio name="expense">支出</van-radio>
            <van-radio name="income">收入</van-radio>
          </van-radio-group>
        </template>
      </van-field>
      <div class="item1">
        <span class="item1_lable"> 金额区间 </span>
        <van-field v-model="valuemin" class="amount" />
        -
        <van-field v-model="valuemax" class="amount" />
      </div>
      <div v-if="checked == 'expense'" class="item1">
        <span class="item1_lable"> 种类 </span>
        <van-checkbox-group v-model="checkedgroupExpense" ref="checkboxGroup">
          <van-checkbox name="食品和饮料">食品和饮料</van-checkbox>
          <van-checkbox name="服装和个人用品">服装和个人用品</van-checkbox>
          <van-checkbox name="住房和家居">住房和家居</van-checkbox>
          <van-checkbox name="交通和通讯">交通和通讯</van-checkbox>
          <van-checkbox name="娱乐和文化">娱乐和文化</van-checkbox>
          <van-checkbox name="医疗保健">医疗保健</van-checkbox>
          <van-checkbox name="教育和培训">教育和培训</van-checkbox>
          <van-checkbox name="日常用品">日常用品</van-checkbox>
          <van-checkbox name="金融和投资">金融和投资</van-checkbox>
          <van-checkbox name="其他支出">其他支出</van-checkbox>
        </van-checkbox-group>
      </div>
      <div v-if="checked == 'income'" class="item1">
        <span class="item1_lable"> 种类 </span>
        <van-checkbox-group v-model="checkedgroupIncome" ref="checkboxGroup">
          <van-checkbox name="工资收入">工资收入</van-checkbox>
          <van-checkbox name="业务收入">业务收入</van-checkbox>
          <van-checkbox name="投资收入">投资收入</van-checkbox>
          <van-checkbox name="房产租金">房产租金</van-checkbox>
          <van-checkbox name="兼职收入">兼职收入</van-checkbox>
          <van-checkbox name="社交收入">社交收入</van-checkbox>
          <van-checkbox name="奖金收入">奖金收入</van-checkbox>
          <van-checkbox name="其他收入">其他收入</van-checkbox>
        </van-checkbox-group>
      </div>
      <van-cell-group>
        <van-field
          v-model="startTime"
          is-link
          clearable
          label="开始时间"
          input-align="center"
          @focus="start"
          readonly
          @click="showStart = true"
          :model-value="showStartT"
        />
        <van-field
          v-model="endTime"
          is-link
          clearable
          label="结束时间"
          input-align="center"
          @focus="end"
          readonly
          @click="showEnd = true"
          :model-value="showEndT"
        />
      </van-cell-group>
      <van-button round block type="primary" @click="onSearch">
        提交
      </van-button>
    </van-form>

    <div class="content-wrap" v-if="showSearchItem == true">
      <van-pull-refresh
        v-model="refreshing"
        @refresh="onRefresh"
        v-if="checked == 'expense'"
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
        v-if="checked == 'income'"
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

    <!-- 开始时间控件 -->
    <van-popup
      :show="showStart"
      position="bottom"
      round
      :style="{ height: '46%' }"
    >
      <van-datetime-picker
        v-model="startDate"
        type="second"
        title="选择开始时间"
        @confirm="choseStartDay"
        @cancel="showStart = false"
      />
    </van-popup>
    <!-- 结束时间控件 -->
    <van-popup
      :show="showEnd"
      position="bottom"
      round
      :style="{ height: '46%' }"
    >
      <van-datetime-picker
        v-model="endDate"
        type="second"
        title="选择结束时间"
        @confirm="choseEndDay"
        @cancel="showEnd = false"
      />
    </van-popup>
    <!-- <van-button type="primary" @click="Check">查询</van-button> -->
  </div>
</template>

<script>
import { reactive, toRefs, ref, onMounted } from "vue";
import Header from "../components/PageComponents/Header.vue";
import ExpenseItem from "../components/BillComponents/ExpenseItem.vue";
import IncomeItem from "../components/IncomeComponents/IncomeItem.vue";
import axios from "../utils/axios";
import { Toast } from "vant";
import router from "../router";
import { showToast } from "vant";
import dayjs from "dayjs";

export default {
  name: "SearchBill",
  components: {
    ExpenseItem,
    IncomeItem,
    Header,
  },
  setup() {
    const state = reactive({
      showStart: false,
      showEnd: false,
      startDate: new Date(),
      endDate: new Date(),
      showStartT: "",
      showEndT: "",
      ledgerid: "",
      starttime: "",
      endtime: "",
      minamount: "",
      maxamount: "",
      cost_type: [],
      ledgerName: [],
      objArr: [],
      isSelected: "",
      showSearchItem: false,

      list: [],
      incomeList: [],
    });
    onMounted(async () => {
      getLedgerName();
    });

    const checked = ref("expense");
    const checkedgroupExpense = ref([]);
    const checkedgroupIncome = ref([]);
    const checkboxGroup = ref(null);
    const valuemin = ref("");
    const valuemax = ref("");

    const checkAll = () => {
      checkboxGroup.value.toggleAll(true);
    };
    const toggleAll = () => {
      checkboxGroup.value.toggleAll();
    };
    const getLedgerName = async () => {
      const result = await axios.get("/HNBC/ledger/allbynums");
      state.objArr = result.data;
      console.log(state.objArr);
    };
    // 选择日期
    const onSearch = async () => {
      state.ledgerid = state.isSelected;
      state.maxamount = state.isSelected;
      state.minamount = state.isSelected;
      if (state.ledgerid == "") {
        Toast.fail("请选择账本");
        return;
      }
      if (state.minamount == "" || state.maxamount == "") {
        Toast.fail("请输入金额区间");
        return;
      }
      if (state.showStartT == "" || state.showEndT == "") {
        Toast.fail("请选择时间范围");
        return;
      }
      //支出
      if (checked.value == "expense") {
        const params = {
          ledgerid: state.isSelected,
          starttime: dayjs(state.startDate).format("YYYY-MM-DD HH:mm:ss"),
          endtime: dayjs(state.endDate).format("YYYY-MM-DD HH:mm:ss"),
          minamount: valuemin.value,
          maxamount: valuemax.value,
          cost_type: Object.values(checkedgroupExpense),
        };
        console.log(params);
        const data = await axios.post(
          "/HNBC/bill/selectbyconditionbyupdatetime",
          params
        );
        console.log(data);
        if (data.state == "200") {
          state.list = data.data;
          state.isSelected = "";
          state.startDate = new Date();
          state.endDate = new Date();
          state.valuemin = "";
          state.valuemax = "";
          Toast.success(data.msg);
          state.showSearchItem = true;
        } else {
          Toast.fail(data.msg);
        }
      }
      //搜索收入
      else {
        const params = {
          ledgerid: state.isSelected,
          starttime: dayjs(state.startDate).format("YYYY-MM-DD HH:mm:ss"),
          endtime: dayjs(state.endDate).format("YYYY-MM-DD HH:mm:ss"),
          minamount: valuemin.value,
          maxamount: valuemax.value,
          earning_type: Object.values(checkedgroupIncome),
        };
        console.log(params);
        const data = await axios.post(
          "/HNBC/income/selectbyconditionbyupdatetime",
          params
        );
        console.log(data);
        if (data.state == "200") {
          state.incomeList = data.data;
          state.isSelected = "";
          state.startDate = new Date();
          state.endDate = new Date();
          state.valuemin = "";
          state.valuemax = "";
          Toast.success(data.msg);
          state.showSearchItem = true;
        } else {
          Toast.fail(data.msg);
        }
      }
    };

    const choseStartDay = (value) => {
      state.startDate = value;
      state.starttime = dayjs(value).format("YYYY-MM-DD HH:mm:ss");
      state.showStartT = dayjs(value).format("YYYY-MM-DD HH:mm");
      console.log(state.starttime);
      state.showStart = false;
    };
    const choseEndDay = (value) => {
      state.endDate = value;
      state.endtime = dayjs(value).format("YYYY-MM-DD HH:mm:ss");
      state.showEndT = dayjs(value).format("YYYY-MM-DD HH:mm");
      console.log(state.endtime);
      state.showEnd = false;
    };

    return {
      ...toRefs(state),
      checked,
      checkedgroupExpense,
      checkedgroupIncome,
      checkAll,
      toggleAll,
      checkboxGroup,
      valuemin,
      valuemax,
      choseStartDay,
      choseEndDay,
      getLedgerName,
      // Check,
      onSearch,
    };
  },
};
</script>

<style lang='less' scoped>
@import url("../config/custom.less");
.van-checkbox {
  height: 0.7rem;
}
.chosen-select {
  width: 6.25rem;
  border-radius: 4px;
  border-color: #1989fa;
  border-width: 2px;
}
.amount {
  display: block;
  box-sizing: border-box;
  width: 100%;
  min-width: 0;
  margin: 5px;
  padding: 0;
  color: #323233;
  line-height: inherit;
  text-align: left;
  background-color: #cccccc;
  border: 0;
  resize: none;
}
.item1 {
  position: relative;
  display: -webkit-box;
  display: -webkit-flex;
  display: flex;
  box-sizing: border-box;
  width: 100%;
  padding: 0.26667rem 0.42667rem;
  overflow: hidden;
  color: #323233;
  font-size: 0.37333rem;
  line-height: 0.64rem;
  background-color: #fff;
  .item1_lable {
    -webkit-box-flex: 0;
    -webkit-flex: none;
    flex: none;
    box-sizing: border-box;
    width: 6.2em;
    margin-right: 0.32rem;
    color: #646566;

    text-align: left;
    word-wrap: break-word;
  }
}
.auth {
  height: calc(~"(100% - 46px)");
  padding: 30px 20px 0 20px;
  background: white;
  .logo {
    width: 150px;
    display: block;
    margin: 0 auto;
    margin-bottom: 30px;
  }
  .form-wrap {
    .form {
      border-radius: 10px;
      overflow: hidden;
      .van-cell:first-child {
        padding-top: 20px;
      }
      .van-cell:last-child {
        padding-bottom: 20px;
      }
    }
  }
  .change-btn {
    text-align: center;
    margin: 10px 0;
    color: @link-color;
    font-size: 14px;
  }
}
.CAPTCHA {
  min-height: 52px;
}
.CAPTCHA .van-button {
  width: 80px;
  margin-top: 1px;
}
</style>