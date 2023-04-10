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
      <van-list
        :loading="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
      >
        <van-cell v-for="item in list" :key="item" :title="item" />
      </van-list>
    </div>
  </van-popup>
</template>

<script>
import { reactive, toRefs, onMounted, watch, ref } from "vue";
import dayjs from "dayjs";
import { typeMap } from "../utils";
import axios from "../utils/axios";
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
    const loading = ref(false);
    const finished = ref(false);
    const state = reactive({
      show: false, // 显示隐藏添加账单弹窗
    });
    // 显示或者隐藏popup
    const toggle = () => {
      state.show = !state.show;
    };

    const addBill = async () => {
      if (!state.amount) {
        Toast.fail("请输入具体金额");
        return;
      }
      const params = {
        amount: Number(state.amount).toFixed(2),
        type_id: state.currentType.id,
        type_name: state.currentType.name,
        date: dayjs(state.date).unix() * 1000,
        pay_type: state.payType == "expense" ? 1 : 2,
        remark: state.remark || "",
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
        state.amount = "";
        state.payType = "expense";
        state.currentType = state.expense[0];
        state.show = false;
        state.date = new Date();
        state.remark = "";
        Toast.success("添加成功");
        ctx.emit("refresh");
      }
    };

    const onLoad = () => {
      // 异步更新数据
      // setTimeout 仅做示例，真实场景中一般为 ajax 请求
    };
    watch(props, (newVal) => {
      id.value = newVal.detail.ledgerID;
      list.value = newVal.detail.sharers;
    });
    return {
      ...toRefs(state),
      toggle,
      addBill,

      list,
      onLoad,
      loading,
      finished,
    };
  },
};
</script>

<style lang="less" scoped>
@import url("../config/custom.less");
.add-wrap {
  padding-top: 12px;
  height: 20rem;
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
</style>