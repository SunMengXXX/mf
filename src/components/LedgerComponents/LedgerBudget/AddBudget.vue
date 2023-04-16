<template>
  <van-popup
    ref="container"
    :show="show"
    position="bottom"
    round
    @touchmove.stop
  >
    <div class="add-wrap">
      <header class="header">
        <span class="close" @click="close"><van-icon name="cross" /></span>
        <van-button
          class="add-btn"
          type="primary"
          size="small"
          @click="setBudget"
          >确定</van-button
        >
      </header>

      <van-field
        v-model.number="newBudget"
        label="预算金额（元）"
        placeholder=""
      />

      <div v-if="ledgerbudgetid === -1 || !startSetting">
        <van-field
          v-model="timeValue"
          is-link
          readonly
          label="开始时间"
          placeholder="请选择预算开始时间"
          @click="pickerShow = true"
        />
        <van-popup
          :show="pickerShow"
          position="bottom"
          :style="{ height: '40%' }"
        >
          <van-datetime-picker
            v-model="currentDate"
            type="date"
            :min-date="minDate"
            @change="changeFn()"
            @confirm="confirmFn()"
            @cancel="cancelFn()"
          />
        </van-popup>
      </div>
      <van-button
        type="danger"
        v-if="isOngoing"
        class="delete"
        block
        @click="deleteBudget"
        >删除</van-button
      >
    </div>
  </van-popup>
</template>

<script>
import { reactive, toRefs, ref, watch, onMounted, inject } from "vue";
import dayjs from "dayjs";
import axios from "../../../utils/axios";
import { Toast } from "vant";
function timeFormat(time) {
  // 时间格式化 2019-09-08
  let year = time.getFullYear();
  let month = time.getMonth() + 1;
  let day = time.getDate();
  return year + "年" + month + "月" + day + "日";
}
export default {
  props: {
    starttime: {
      type: String,
      default: "未设置",
    },
    budgetid: {
      type: Number,
      default: -1,
    },
    ledgerbudgetid: {
      type: Number,
      default: -1,
    },
    update: Function,
  },
  setup(props) {
    const currentTime = new Date();
    const state = reactive({
      ledgerid: -1,
      ledgerbudgetid: -1,
      show: false, // 显示隐藏添加账单弹窗
      budget: 0,
      newBudget: 0,
      state: "",
      startSetting: false,
    });
    const date = reactive({
      msg: "",
      currentDate: new Date(),
      changeDate: new Date(),
      minDate: new Date(
        currentTime.getFullYear(),
        currentTime.getMonth(),
        currentTime.getDate()
      ),
      chosenDate: null,
      pickerShow: false, // 用来显示弹出层
      timeValue: "",
    });
    const container = ref(null);
    const isOngoing = ref(false);

    date.changeDate = date.minDate;
    date.currentDate = date.minDate;
    date.chosenDate = date.currentDate;
    date.timeValue = timeFormat(date.currentDate);
    const getLedgerBudget = inject("getLedgerBudget");

    const toggle = () => {
      state.show = !state.show;
      if (state.show) {
        document.body.style.overflow = "hidden"; // 弹层显示时
        document.body.style.position = "relative";
      } else {
        document.body.style.overflow = "auto"; // 弹层不显示时
        document.body.style.position = null;
      }
    };

    //删除预算
    const deleteBudget = async () => {
      const data = await axios.delete(
        `/HNBC/ledgerbudget/delete/${state.ledgerbudgetid}`
      );
      if (data.state === "200") {
        Toast.success(data.msg);
        getLedgerBudget();
      } else {
        Toast.fail(data.msg);
      }
    };
    //设置预算
    const setBudget = async () => {
      if (state.ledgerbudgetid > 0) {
        const data = await axios.put("/HNBC/ledgerbudget/update", {
          amount: state.newBudget,
          ledgerbudgetid: state.ledgerbudgetid,
          starttime: dayjs(date.changeDate).format("YYYY-MM-DD HH:mm:ss"),
        });
        Toast.success(data.msg);
      } else {
        const data = await axios.post("/HNBC/ledgerbudget/add", {
          ledgerid: state.ledgerid,
          amount: state.newBudget,
          starttime: dayjs(date.changeDate).format("YYYY-MM-DD HH:mm:ss"),
        });
        Toast.success(data.msg);
      }
      getLedgerBudget();
      state.show = false;
    };
    const close = () => {
      state.show = false;
      state.newBudget = state.budget;
      date.currentDate = date.minDate;
      date.chosenDate = date.currentDate;
      date.timeValue = timeFormat(date.currentDate);
    };

    const changeFn = () => {
      // 值变化是触发
      date.changeDate = date.currentDate; // Tue Sep 08 2020 00:00:00 GMT+0800 (中国标准时间)
    };
    const confirmFn = () => {
      // 确定按钮
      setTimeout(() => {
        date.pickerShow = false;
        date.timeValue = timeFormat(date.currentDate);
        date.chosenDate = date.currentDate;
      }, 100);
    };
    const cancelFn = () => {
      date.pickerShow = false;
      date.currentDate = date.chosenDate;
    };

    onMounted(() => {
      state.ledgerid = inject('ledgerid')
      if (state.ledgerbudgetid !== -1) {
        getBudget();
      }
    });
    const getBudget = async () => {
      const { data } = await axios.get(
        `/HNBC/ledgerbudget/single/${state.ledgerbudgetid}`
      );
      console.log(props);
      const start = new Date(data.starttime);
      date.minDate = new Date(
        start.getFullYear(),
        start.getMonth(),
        start.getDate()
      );
      date.currentDate = start;
      date.timeValue = timeFormat(start);

      state.budget = data.amount;
      state.newBudget = data.amount;
      state.state = data.state;
      //console.log(state);
      if (state.state !== "进行中") {
        isOngoing.value = true;
      }
    };
    watch(props, (newVal) => {
      state.ledgerbudgetid = newVal.ledgerbudgetid;
      state.startSetting = newVal.starttime === "未设置" ? false : true;
      //console.log(newVal);
      getBudget();
    });
    return {
      ...toRefs(state),
      ...toRefs(date),
      toggle,
      getBudget,
      currentTime,
      changeFn,
      confirmFn,
      cancelFn,
      timeFormat,
      close,
      setBudget,
      getLedgerBudget,
      container,
      isOngoing,
      deleteBudget,
    };
  },
};
</script>

<style lang="less" scoped>
@import url("../../../config/custom.less");
.add-wrap {
  padding-top: 12px;
  min-height: 10rem;
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
    padding-left: 0.42667rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 0.37333rem;
    color: #646566;
    .type {
      span {
        display: inline-block;
        background: #f5f5f5;
        color: @color-text-caption;
        padding: 4px 12px;
        font-size: 0.37333rem;
        border-radius: 24px;
        border: 1px solid #f5f5f5;
      }
      .self {
        margin-right: 6px;
        &.active {
          background-color: #eafbf6;
          border-color: @primary;
          color: @primary;
        }
      }
      .shared {
        &.active {
          background-color: #fbf8f0;
          border-color: @text-warning;
          color: @text-warning;
        }
      }
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
        .self {
          &.active {
            background-color: @primary;
            .iconfont {
              color: #fff;
            }
          }
        }
        .shared {
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
  .marks {
    padding-bottom: 12px;
    padding-top: 0.2rem;
    padding-left: 0.42667rem;
    font-size: 0.3rem;
    color: #4b67e2;
  }
  .van-number-keyboard {
    position: unset;
  }
  .van-dialog__confirm {
    color: @primary;
  }
}
.state {
  .van-cell {
    font-size: 0.2rem;
    padding-left: 1rem;
  }
  .statetitle {
    font-size: 0.37333rem;
    color: #646566;
    padding-left: 0.42667rem;
    display: flex; /*实现垂直居中*/
    align-items: center; /*实现水平居中*/
  }
}
.delete {
  margin-top: 1rem;
}
</style>