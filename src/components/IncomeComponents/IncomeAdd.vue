<template>
  <van-popup :show="showIncome" position="bottom" round>
    <div class="add-wrap">
      <header class="header">
        <span class="close" @click="showIncome = false"
          ><van-icon name="cross"
        /></span>
        <van-button
          class="add-btn"
          type="primary"
          size="small"
          @click="addIncome"
          >收入录入</van-button
        >
      </header>
      <div class="filter">
        <div class="type">
          <span
            @click="recognition = !recognition"
            :class="{ income: true, active: recognition == false }"
            >手动输入</span
          >
          <span
            @click="recognition = !recognition"
            :class="{ income: true, active: recognition == true }"
            >图片识别</span
          >
        </div>

        <div @click="showDay = true" class="time">
          {{ $filters.transDay(date) }}
          <i class="iconfont sort-down" />
        </div>
      </div>

      <div class="IncomeInput" v-if="!recognition">
        <div class="money">
          <span class="sufix">收入¥</span>
          <span class="amount animation">{{ amount }}</span>
        </div>
        <div class="type-warp">
          <div class="type-body">
            <div class="type-item" @click="ChangeType11">
              <span
                :class="{
                  'iconfont-wrap': true,
                  income: true,
                  active: active11,
                }"
              >
                <i class="iconfont" :class="typeMap[11].icon" />
              </span>
              <span>工资收入</span>
            </div>
            <div class="type-item" @click="ChangeType12">
              <span
                :class="{
                  'iconfont-wrap': true,
                  income: true,
                  active: active12,
                }"
              >
                <i class="iconfont" :class="typeMap[12].icon" />
              </span>
              <span>业务收入</span>
            </div>
            <div class="type-item" @click="ChangeType13">
              <span
                :class="{
                  'iconfont-wrap': true,
                  income: true,
                  active: active13,
                }"
              >
                <i class="iconfont" :class="typeMap[13].icon" />
              </span>
              <span>投资收益</span>
            </div>
            <div class="type-item" @click="ChangeType14">
              <span
                :class="{
                  'iconfont-wrap': true,
                  income: true,
                  active: active14,
                }"
              >
                <i class="iconfont" :class="typeMap[14].icon" />
              </span>
              <span>房产租金</span>
            </div>
            <div class="type-item" @click="ChangeType15">
              <span
                :class="{
                  'iconfont-wrap': true,
                  income: true,
                  active: active15,
                }"
              >
                <i class="iconfont" :class="typeMap[15].icon" />
              </span>
              <span>兼职收入</span>
            </div>
            <div class="type-item" @click="ChangeType16">
              <span
                :class="{
                  'iconfont-wrap': true,
                  income: true,
                  active: active16,
                }"
              >
                <i class="iconfont" :class="typeMap[16].icon" />
              </span>
              <span>社交收入</span>
            </div>
            <div class="type-item" @click="ChangeType17">
              <span
                :class="{
                  'iconfont-wrap': true,
                  income: true,
                  active: active17,
                }"
              >
                <i class="iconfont" :class="typeMap[17].icon" />
              </span>
              <span>奖金收入</span>
            </div>
            <div class="type-item" @click="ChangeType18">
              <span
                :class="{
                  'iconfont-wrap': true,
                  income: true,
                  active: active18,
                }"
              >
                <i class="iconfont" :class="typeMap[18].icon" />
              </span>
              <span>其他收入</span>
            </div>
          </div>
        </div>
        <!-- 有备注 -->
        <div class="remark" v-if="remark" @click="remarkVisible = true">
          {{ remark }}
        </div>
        <!-- 无备注 -->

        <div class="remark" v-else @click="remarkVisible = true">添加备注</div>
        <!-- 数字键盘 -->
        <van-number-keyboard
          :show="true"
          extra-key="."
          @delete="remove"
          @input="inputChange"
        />
      </div>
      <div class="PhotoInput" v-if="recognition">
        <van-field name="uploader" label="上传票据">
          <template #input>
            <van-uploader
              v-model="avatar"
              :before-read="beforeRead"
              :max-count="1"
              :max-size="2 * 1024 * 1024"
              @oversize="onOversize"
              @delete="deleteFile"
              capture="camera"
              accept="image/*"
            />
            <van-button
              class="btn-1"
              type="primary"
              size="small"
              @click="photo_identification"
              >智能识别</van-button
            >
          </template>
        </van-field>
        <van-cell-group>
          <van-cell title="金额" :value="amount" />
          <van-cell title="类型" :value="currentType" />
          <van-cell title="收入时间" :value="dateIncome" />
          <van-cell title="备注" :value="remark" />
        </van-cell-group>
      </div>
      <van-dialog
        :show="remarkVisible"
        title="备注"
        :show-cancel-button="true"
        :overlay="true"
        :close-on-click-overlay="true"
        @cancel="cancel"
        @confirm="confirm"
      >
        <van-field
          v-model="remark"
          rows="2"
          autosize
          type="textarea"
          maxlength="20"
          placeholder="请输入备注"
          show-word-limit
        />
      </van-dialog>

      <van-popup
        :show="showDay"
        position="bottom"
        round
        :style="{ height: '46%' }"
      >
        <van-datetime-picker
          v-model="date"
          type="datetime"
          title="选择时间"
          @confirm="choseDay"
          @cancel="showDay = false"
        />
      </van-popup>
    </div>
  </van-popup>
</template>

<script>
import { reactive, toRefs, onMounted, ref, watch } from "vue";
import dayjs from "dayjs";
import { typeMap } from "../../utils";
import axios from "../../utils/axios";
import { Toast } from "vant";
export default {
  props: {
    refresh: Function,
    detail: {
      type: Object,
      default: {},
    },
  },
  components: {},
  setup(props, ctx) {
    const id = props.detail && props.detail.incomeID; // 外部传进来的账单详情 id
    const remarkVisible = ref(false);
    const avatar = ref();
    const state = reactive({
      showIncome: false, // 显示隐藏添加账单弹窗
      active11:
        id && props.detail.income_EarningType.indexOf("工资收入") >= 0
          ? true
          : false,
      active12:
        id && props.detail.income_EarningType.indexOf("业务收入") >= 0
          ? true
          : false,
      active13:
        id && props.detail.income_EarningType.indexOf("投资收益") >= 0
          ? true
          : false,
      active14:
        id && props.detail.income_EarningType.indexOf("房产租金") >= 0
          ? true
          : false,
      active15:
        id && props.detail.income_EarningType.indexOf("兼职收入") >= 0
          ? true
          : false,
      active16:
        id && props.detail.income_EarningType.indexOf("社交收入") >= 0
          ? true
          : false,
      active17:
        id && props.detail.income_EarningType.indexOf("奖金收入") >= 0
          ? true
          : false,
      active18:
        id && props.detail.income_EarningType.indexOf("其他收入") >= 0
          ? true
          : false,
      amount: id ? props.detail.incomeEarning : "", // 账单价格
      typeMap: typeMap, // 类型key-value键值对
      currentType: id ? props.detail.income_EarningType : [], // 当前选择的类型对象
      showDay: false, // 选择日期显示/隐藏
      date: id
        ? dayjs(props.detail.income_Time).format("YYYY-MM-DD HH:mm:ss")
        : new Date(), // 展示日期
      dateIncome: id
        ? props.detail.income_Time
        : dayjs().format("YYYY-MM-DD HH:mm:ss"), // 传送的日期
      remark: id ? props.detail.incomeMarks : "",
      photo: id ? props.detail.incomePhoto : "",
      recognition: false,
    });

    onMounted(async () => {

    });

    const cancel = () => {
      Toast.fail("取消修改");
      remarkVisible.value = false;
    };
    const confirm = () => {
      // Toast.fail("取消修改");
      remarkVisible.value = false;
      console.log(state.remark);
    };
    const toggle = () => {
      state.showIncome = !state.showIncome;
    };
        //图片过大
    function onOversize() {
      Toast.fail("文件太大");
    }
    //校验图片格式
    const beforeRead = (avatar) => {
      let fileType = "";
      if (avatar instanceof Array && avatar.length) {
        for (let i = 0; i < avatar.length; i++) {
          fileType = avatar[i].type.substr(0, avatar[i].type.indexOf("/"));
          if (fileType !== "image") {
            Toast("格式错误");
            return false;
          }
        }
      } else {
        fileType = avatar.type.substr(0, avatar.type.indexOf("/"));
        if (fileType !== "image") {
          Toast("格式错误");
          return false;
        }
      }
      return true;
    };

    //删除图片
    const deleteFile = (avatar) => {
      avatar = "";
      console.log(avatar);
    };

    // 监听数字输入框改变值
    const inputChange = (value) => {
      // 当输入的值为 '.' 且 已经存在 '.'，则不让其继续字符串相加。
      if (value == "." && state.amount.includes(".")) return;
      // 小数点后保留两位，当超过两位时，不让其字符串继续相加。
      if (
        value != "." &&
        state.amount.includes(".") &&
        state.amount &&
        state.amount.split(".")[1].length >= 2
      )
        return;
      state.amount += value;
    };

    // 删除输入框内容
    const remove = () => {
      state.amount = state.amount.slice(0, state.amount.length - 1);
    };

    // 选择日期
    const choseDay = (value) => {
      state.date = value;
      state.dateIncome = dayjs(value).format("YYYY-MM-DD HH:mm:ss");
      console.log(state.dateIncome);
      state.showDay = false;
    };

    const photo_identification = async () => {
      // axios.defaults.headers.get["Content-Type"] = "multipart/form-data";
      // /* console.log(axios.defaults.headers); */
      // const processingphoto = JSON.stringify(avatar.value[0].content);
      // console.log(processingphoto);
      // const formdata = new FormData();
      // formdata.append("icon", processingphoto);
      // const data = await axios.get("/HNBC/bill/recognition", formdata);
      // console.log(data);
      // axios.defaults.headers.get["Content-Type"] = "application/json";
      // if (data.state === "200") {
      //   state.amount = data.data.cost;
      //   state.dateIncome = data.data.billtime;
      //   state.remark = data.data.marks;
      //   state.currentType= data.data.cost_type;
      //   Toast.success("图片识别成功");
      // }
      console.log("识别功能未开启");
    };

    const addIncome = async () => {
      if (!state.amount) {
        Toast.fail("请输入具体金额");
        return;
      }
      if (state.currentType=="") {
        Toast.fail("请选择收入类别");
        return;
      }
      if (id) {
        const params = {
          incomeid: id,
          earning: Number(state.amount).toFixed(2),
          photo: state.photo,
          incometime: state.dateBill,
          marks: state.remark,
          earning_type: state.currentType,
        };
        console.log(params);
        // 如果有 id 需要调用详情更新接口
        const result = await axios.put("/HNBC/income/update", params);
        state.amount = "";
        state.currentType = [];
        state.showIncome = false;
        state.date = new Date();
        state.remark = "";
        Toast.success("收入修改成功");
        ctx.emit("refresh");
      } else {
        const params = {
          ledgerid: localStorage.getItem("LedgerId"),
          earning: Number(state.amount).toFixed(2),
          incometime: state.dateIncome,
          marks: state.remark,
          cost_type: state.currentType,
        };
        const result = await axios.post("/HNBC/income/add", params);
        state.amount = "";
        state.currentType = [];
        state.showIncome = false;
        state.date = new Date();
        state.remark = "";
        Toast.success("收入新增成功");
        ctx.emit("refresh");
      }
    };
    const ChangeType11 = () => {
      if (state.active11 == false) {
        state.active11 = true;
        state.currentType.push("工资收入");
        console.log(state.currentType);
      } else {
        state.active11 = false;
        state.currentType.splice(state.currentType.indexOf("工资收入"), 1);
        console.log(state.currentType);
      }
    };
    const ChangeType12 = () => {
      if (state.active12 == false) {
        state.active12 = true;
        state.currentType.push("业务收入");
        console.log(state.currentType);
      } else {
        state.active12 = false;
        state.currentType.splice(state.currentType.indexOf("业务收入"), 1);
        console.log(state.currentType);
      }
    };
    const ChangeType13 = () => {
      if (state.active13 == false) {
        state.active13 = true;
        state.currentType.push("投资收益");
        console.log(state.currentType);
      } else {
        state.active13 = false;
        state.currentType.splice(state.currentType.indexOf("投资收益"), 1); //数组删除指定项
        console.log(state.currentType);
      }
    };
    const ChangeType14 = () => {
      if (state.active14 == false) {
        state.active14 = true;
        state.currentType.push("房产租金");
        console.log(state.currentType);
      } else {
        state.active14 = false;
        state.currentType.splice(state.currentType.indexOf("房产租金"), 1); //数组删除指定项
        console.log(state.currentType);
      }
    };
    const ChangeType15 = () => {
      if (state.active15 == false) {
        state.active15 = true;
        state.currentType.push("兼职收入");
        console.log(state.currentType);
      } else {
        state.active15 = false;
        state.currentType.splice(state.currentType.indexOf("兼职收入"), 1); //数组删除指定项
        console.log(state.currentType);
      }
    };
    const ChangeType16 = () => {
      if (state.active16 == false) {
        state.active16 = true;
        state.currentType.push("社交收入");
        console.log(state.currentType);
      } else {
        state.active16 = false;
        state.currentType.splice(state.currentType.indexOf("社交收入"), 1); //数组删除指定项
        console.log(state.currentType);
      }
    };
    const ChangeType17 = () => {
      if (state.active17 == false) {
        state.active17 = true;
        state.currentType.push("奖金收入");
        console.log(state.currentType);
      } else {
        state.active17 = false;
        state.currentType.splice(state.currentType.indexOf("奖金收入"), 1); //数组删除指定项
        console.log(state.currentType);
      }
    };
    const ChangeType18 = () => {
      if (state.active18 == false) {
        state.active18 = true;
        state.currentType.push("其他收入");
        console.log(state.currentType);
      } else {
        state.active18 = false;
        state.currentType.splice(state.currentType.indexOf("其他收入"), 1); //数组删除指定项
        console.log(state.currentType);
      }
    };

    watch(state.amount, (newVal) => {});
    return {
      ...toRefs(state),
      toggle,
      inputChange,
      remove,
      choseDay,
      addIncome,
      remarkVisible,
      cancel,
      confirm,
      ChangeType11,
      ChangeType12,
      ChangeType13,
      ChangeType14,
      ChangeType15,
      ChangeType16,
      ChangeType17,
      ChangeType18,
      avatar,
      photo_identification,
      deleteFile,
      onOversize,
      beforeRead,
    };
  },
};
</script>

<style lang="less" scoped>
@import url("../../config/custom.less");
.add-wrap {
  padding-top: 12px;
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
        margin-right: 6px;
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
  .icon-wrapper {
    display: flex;
    width: 100%;
    justify-content: center;
    font-size: 18px;
  }

  .icon-wrapper .van-icon-success {
    line-height: 32px;
    color: var(--van-blue);
  }

  .icon-wrapper .van-icon-cross {
    line-height: 32px;
    color: var(--van-gray-5);
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
.btn-1 {
  background: rgb(6, 14, 131);
  background: linear-gradient(
    0deg,
    rgba(6, 14, 131, 1) 0%,
    rgba(12, 25, 180, 1) 100%
  );
  border: none;
}
.btn-1:hover {
  background: rgb(0, 3, 255);
  background: linear-gradient(
    0deg,
    rgba(0, 3, 255, 1) 0%,
    rgba(2, 126, 251, 1) 100%
  );
}
</style>