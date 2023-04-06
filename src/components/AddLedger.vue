<template>
  <van-popup :show="show" position="bottom" round>
    <div class="add-wrap">
      <header class="header">
        <span class="close" @click="show = false"
          ><van-icon name="cross"
        /></span>
        <van-button class="add-btn" type="primary" size="small" @click="addBill"
          >确定</van-button
        >
      </header>

      <van-cell-group inset>
        <van-field v-model="ledgerName" label="账本名称" placeholder="" />
      </van-cell-group>
      <div class="filter">
        <span>账本类型</span>
        <div class="type">
          <span
            @click="changeType('expense')"
            :class="{ expense: true, active: accountType == 'expense' }"
            >个人</span
          >
          <span
            @click="changeType('income')"
            :class="{ income: true, active: accountType == 'income' }"
            >共享</span
          >
        </div>
      </div>
      <div class="money">
        <span>当月预算</span>
        <span class="amount animation">{{ ledgerName }}</span>
      </div>
      <div class="marks" v-if="marks" @click="marksVisible = true">
        {{ marks }}
      </div>
      <div class="marks" v-else @click="marksVisible = true">添加备注</div>
      <van-dialog :show="marksVisible" title="备注" show-cancel-button>
        <van-field
          v-model="marks"
          rows="2"
          autosize
          type="textarea"
          maxlength="10"
          placeholder="请输入备注"
          show-word-limit
        />
      </van-dialog>
    </div>
  </van-popup>
</template>

<script>
import { reactive, toRefs, onMounted, ref } from "vue";
import dayjs from "dayjs";
import axios from "../utils/axios";
import { Toast } from "vant";
export default {
  props: {
    refresh: Function,
    detail: {
      type: Object,
      default: {},
    },
  },
  setup(props, ctx) {
    const id = props.detail && props.detail.id; // 外部传进来的账单详情 id
    const marksVisible = ref(false);
    const state = reactive({
      show: false, // 显示隐藏添加账单弹窗
      ledgerName: id ? props.detail.ledgerName : "", // 账单价格
      accountType: id
        ? props.detail.pay_type == 1
          ? "expense"
          : "income"
        : "expense", // 支出或收入类型
      currentType: id
        ? {
            id: props.detail.type_id,
            name: props.detail.type_name,
          }
        : {}, // 当前选择的类型对象
      showDay: false, // 选择日期显示/隐藏
      date: id ? dayjs(Number(props.detail.date)).$d : new Date(), // 日期
      marks: id ? props.ledger.marks : "",
    });

    onMounted(async () => {
      const data = await axios.get("/ledger/list");
      state.expense = list.filter((i) => i.type == 1);
      state.income = list.filter((i) => i.type == 2);
      // 没有 id 的情况下，说明是新建账单。
      if (!id) {
        state.currentType = state.expense[0];
      }
    });

    const toggle = () => {
      state.show = !state.show;
    };

    // 删除输入框内容
    const remove = () => {
      state.ledgerName = state.ledgerName.slice(0, state.ledgerName.length - 1);
    };

    // 切换收入还是支出
    const changeType = (type) => {
      state.accountType = type;
    };

    const addBill = async () => {
      if (!state.ledgerName) {
        Toast.fail("请输入具体金额");
        return;
      }
      const params = {
        ledgerName: Number(state.ledgerName).toFixed(2),
        type_id: state.currentType.id,
        type_name: state.currentType.name,
        date: dayjs(state.date).unix() * 1000,
        pay_type: state.payType == "expense" ? 1 : 2,
      };
      if (id) {
        params.id = id;
        // 如果有 id 需要调用详情更新接口
        const result = await axios.post("/bill/update", params);
        state.show = false;
        Toast.success("修改成功");
        ctx.emit("refresh");
      } else {
        const result = await axios.post("/bill/add", params);
        state.ledgerName = "";
        state.payType = "expense";
        state.currentType = state.expense[0];
        state.show = false;
        state.date = new Date();
        Toast.success("添加成功");
        ctx.emit("refresh");
      }
    };

    return {
      ...toRefs(state),
      toggle,
      remove,
      changeType,
      addBill,
      marksVisible,
    };
  },
};
</script>

<style lang="less" scoped>
@import url("../config/custom.less");
.add-wrap {
  padding-top: 12px;
  height: 15rem;
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
  .marks {
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
</style>