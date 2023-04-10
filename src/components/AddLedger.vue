<template>
  <van-popup
    :show="show"
    position="bottom"
    round
  >
    <div class="add-wrap">
      <header class="header">
        <span class="close" @click="show = false"
          ><van-icon name="cross"
        /></span>
        <van-button class="add-btn" type="primary" size="small" @click="addBill"
          >确定</van-button
        >
      </header>

      <van-field v-model="detail.ledgerName" label="账本名称" placeholder="" />

      <div class="filter">
        <span>账本类型</span>
        <div class="type">
          <span
            @click="changeType('self')"
            :class="{ self: true, active: detail.ledgerType === 'self' }"
            >个人</span
          >
          <span
            @click="changeType('shared')"
            :class="{ shared: true, active: detail.ledgerType === 'shared' }"
            >共享</span
          >
        </div>
      </div>
      <van-row
        class="state"
        v-if="detail.ledgerID !== '-1'"
        :align="center"
        :wrap="false"
      >
        <van-col span="5" class="statetitle">状态</van-col>
        <van-col offset="0" span="19">
          <van-radio-group v-model="checked">
            <van-cell-group inset>
              <van-cell title="进行中" clickable @click="checked = '1'">
                <template #right-icon>
                  <van-radio name="1" />
                </template>
              </van-cell>
              <van-cell title="已结束" clickable @click="checked = '2'">
                <template #right-icon>
                  <van-radio name="2" />
                </template>
              </van-cell>
            </van-cell-group>
          </van-radio-group>
        </van-col>
      </van-row>
      <!-- <div class="money">
        <span>当月预算</span>
        <span class="amount animation">{{ ledgerName }}</span>
      </div> -->
      <div class="marks" v-if="detail.marks" @click="marksVisible = true">
        <span v-if="detail.marks">修改备注:</span>{{ detail.marks }}
      </div>
      <div class="marks" v-else @click="marks">添加备注</div>
      <van-dialog
        :show="marksVisible"
        @confirm="setMark"
        @cancel="unsetMark"
        title="备注"
        show-cancel-button
      >
        <van-field
          v-model="newMark"
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
import { reactive, toRefs, ref, watch } from "vue";
import dayjs from "dayjs";

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
    const shared = ref(false);
    const self = ref(true);
    const checked = ref(1);
    const state = reactive({
      show: false, // 显示隐藏添加账单弹窗
      marksVisible: false,
      newMark: "",
      popupShow: false,
    });
    const detail = reactive({
      ledgerID: "-1", //账本id
      ledgerName: "", // 账单价格
      marks: "",
      ledgerType: "self",
    });

    const toggle = () => {
      state.show = !state.show;
    };

    // 切换个人还是共享
    const changeType = (type) => {
      detail.ledgerType = type;
    };

    const addBill = async () => {
      if (!detail.ledgerName) {
        Toast.fail("请输入账本名称");
        return;
      }
      if (detail.ledgerID === "-1") {
        // 如果有 id 需要调用详情更新接口
        const params = {
          ledgername: detail.ledgerName,
          marks: detail.marks,
          isshared: detail.ledgerType === "self" ? "NO" : "YES",
          sharers: [],
        };
        const result = await axios.post("/HNBC/ledger/addledger", params);
        state.show = false;
        detail.ledgerID = "-1";
        detail.ledgerName = "";
        detail.ledgerType = "self";
        detail.marks = "";
        state.newMark = "";
        Toast.success(result.msg);
        ctx.emit("refresh");

        
        //账本切换功能!!!

      } else {
        const params = {
          ledgerid: detail.ledgerID,
          ledgername: detail.ledgerName,
          marks: detail.marks,
          isshared: detail.ledgerType === "self" ? "NO" : "YES",
          sharers: [],
          state: checked.value === "1" ? "进行中" : "已结束",
        };
        const result = await axios.post("/HNBC/ledger/updateledger", params);

        Toast.success(result.msg);
        ctx.emit("refresh");
        
        //账本切换功能!!!

      }
    };
    const unsetMark = () => {
      state.newMark = detail.marks;
      state.marksVisible = false;
    };
    const setMark = () => {
      detail.marks = state.newMark;
      state.marksVisible = false;
    };
    const marks = () => {
      state.marksVisible = true;
    };

    watch(props, (newVal) => {
      detail.ledgerID = newVal.detail.ledgerID;
      detail.ledgerName = newVal.detail.ledgerName;
      detail.ledgerType = newVal.detail.isShared === "YES" ? "shared" : "self";
      detail.marks = newVal.detail.marks;
      state.newMark = detail.marks;
      checked.value = newVal.detail.ledgerState === "进行中" ? "1" : "2";
      shared.value = newVal.detail.isShared === "YES" ? true : false;
      self.value = newVal.detail.isShared === "YES" ? false : true;
    });

    return {
      ...toRefs(state),
      detail,
      toggle,
      changeType,
      addBill,
      shared,
      self,
      detail,
      marks,
      setMark,
      unsetMark,
      checked,
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
</style>