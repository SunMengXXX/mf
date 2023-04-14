<template>
  <van-popup :show="showExpense" position="bottom" round>
    <div class="add-wrap">
      <header class="header">
        <span class="close" @click="showExpense = false"
          ><van-icon name="cross"
        /></span>
        <van-button class="add-btn" type="primary" size="small" @click="addBill"
          >账单录入</van-button
        >
      </header>
      <div class="filter">
        <div class="type">
          <span
            @click="recognition = !recognition"
            :class="{ expense: true, active: recognition == false }"
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
      <div class="ManualInput" v-if="!recognition">
        <div class="money">
          <span class="sufix">支出¥</span>
          <span class="amount animation">{{ amount }}</span>
        </div>

        <div class="type-warp">
          <div class="type-body">
            <div class="type-item" @click="ChangeType1">
              <span
                :class="{
                  'iconfont-wrap': true,
                  expense: true,
                  active: active1,
                }"
              >
                <i class="iconfont" :class="typeMap[1].icon" />
              </span>
              <span>食品和饮料</span>
            </div>
            <div class="type-item" @click="ChangeType2">
              <span
                :class="{
                  'iconfont-wrap': true,
                  expense: true,
                  active: active2,
                }"
              >
                <i class="iconfont" :class="typeMap[2].icon" />
              </span>
              <span>服装和个人用品</span>
            </div>
            <div class="type-item" @click="ChangeType3">
              <span
                :class="{
                  'iconfont-wrap': true,
                  expense: true,
                  active: active3,
                }"
              >
                <i class="iconfont" :class="typeMap[3].icon" />
              </span>
              <span>住房和家居</span>
            </div>
            <div class="type-item" @click="ChangeType4">
              <span
                :class="{
                  'iconfont-wrap': true,
                  expense: true,
                  active: active4,
                }"
              >
                <i class="iconfont" :class="typeMap[4].icon" />
              </span>
              <span>交通和通讯</span>
            </div>
            <div class="type-item" @click="ChangeType5">
              <span
                :class="{
                  'iconfont-wrap': true,
                  expense: true,
                  active: active5,
                }"
              >
                <i class="iconfont" :class="typeMap[5].icon" />
              </span>
              <span>娱乐和文化</span>
            </div>
            <div class="type-item" @click="ChangeType6">
              <span
                :class="{
                  'iconfont-wrap': true,
                  expense: true,
                  active: active6,
                }"
              >
                <i class="iconfont" :class="typeMap[6].icon" />
              </span>
              <span>医疗保健</span>
            </div>
            <div class="type-item" @click="ChangeType7">
              <span
                :class="{
                  'iconfont-wrap': true,
                  expense: true,
                  active: active7,
                }"
              >
                <i class="iconfont" :class="typeMap[7].icon" />
              </span>
              <span>教育和培训</span>
            </div>
            <div class="type-item" @click="ChangeType8">
              <span
                :class="{
                  'iconfont-wrap': true,
                  expense: true,
                  active: active8,
                }"
              >
                <i class="iconfont" :class="typeMap[8].icon" />
              </span>
              <span>日常用品</span>
            </div>
            <div class="type-item" @click="ChangeType9">
              <span
                :class="{
                  'iconfont-wrap': true,
                  expense: true,
                  active: active9,
                }"
              >
                <i class="iconfont" :class="typeMap[9].icon" />
              </span>
              <span>金融和投资</span>
            </div>
            <div class="type-item" @click="ChangeType10">
              <span
                :class="{
                  'iconfont-wrap': true,
                  expense: true,
                  active: active10,
                }"
              >
                <i class="iconfont" :class="typeMap[10].icon" />
              </span>
              <span>其他支出</span>
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
      <div class="ImageInput" v-if="recognition">
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
          <van-cell title="消费时间" :value="dateBill" />
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
    const id = props.detail && props.detail.billID; // 外部传进来的账单详情 id
    const avatar = ref();
    const remarkVisible = ref(false);
    const state = reactive({
      active1:
        id && props.detail.bill_CostType.indexOf("食品和饮料") >= 0
          ? true
          : false,
      active2:
        id && props.detail.bill_CostType.indexOf("服装和个人用品") >= 0
          ? true
          : false,
      active3:
        id && props.detail.bill_CostType.indexOf("住房和家居") >= 0
          ? true
          : false,
      active4:
        id && props.detail.bill_CostType.indexOf("交通和通讯") >= 0
          ? true
          : false,
      active5:
        id && props.detail.bill_CostType.indexOf("娱乐和文化") >= 0
          ? true
          : false,
      active6:
        id && props.detail.bill_CostType.indexOf("医疗保健") >= 0
          ? true
          : false,
      active7:
        id && props.detail.bill_CostType.indexOf("教育和培训") >= 0
          ? true
          : false,
      active8:
        id && props.detail.bill_CostType.indexOf("日常用品") >= 0
          ? true
          : false,
      active9:
        id && props.detail.bill_CostType.indexOf("金融和投资") >= 0
          ? true
          : false,
      active10:
        id && props.detail.bill_CostType.indexOf("其他支出") >= 0
          ? true
          : false,
      showExpense: false, // 显示隐藏添加账单弹窗
      amount: id ? props.detail.billCost : "", // 账单价格
      typeMap: typeMap, // 类型key-value键值对
      currentType: id ? props.detail.bill_CostType : [], // 当前选择的类型对象
      showDay: false, // 选择日期显示/隐藏
      date: id
        ? dayjs(props.detail.bill_Time).format("YYYY-MM-DD HH:mm:ss")
        : new Date(), // 展示日期
      dateBill: id
        ? props.detail.bill_Time
        : dayjs().format("YYYY-MM-DD HH:mm:ss"), // 传送的日期
      remark: id ? props.detail.billMarks : "",
      photo: id ? props.detail.billPhoto : "",
      recognition: false,
    });

    onMounted(async () => {
      console.log(state.date);
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
      state.showExpense = !state.showExpense;
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
      state.dateBill = dayjs(value).format("YYYY-MM-DD HH:mm:ss");
      console.log(state.dateBill);
      state.showDay = false;
    };

    const photo_identification = async () => {
      axios.defaults.headers.get["Content-Type"] = "multipart/form-data";
      /* console.log(axios.defaults.headers); */
      const processingphoto = JSON.stringify(avatar.value[0].content);
      console.log(processingphoto);
      const formdata = new FormData();
      formdata.append("icon", processingphoto);
      const data = await axios.get("/HNBC/bill/recognition", formdata);
      console.log(data);
      axios.defaults.headers.get["Content-Type"] = "application/json";
      if (data.state === "200") {
        state.amount = data.data.cost;
        state.dateBill = data.data.billtime;
        state.remark = data.data.marks;
        state.currentType= data.data.cost_type;
        Toast.success("图片识别成功");
      }
    };

    const addBill = async () => {
      if (!state.amount) {
        Toast.fail("请输入具体金额");
        return;
      }
    if (state.currentType=="") {
        Toast.fail("请选择账单类别");
        return;
      }
      if (id) {
        const params = {
          billid: id,
          cost: Number(state.amount).toFixed(2),
          billtime: state.dateBill,
          photo: state.photo,
          marks: state.remark,
          cost_type: state.currentType,
        };
        console.log(params);
        // 如果有 id 需要调用详情更新接口
        const result = await axios.put("/HNBC/bill/update", params);
        state.amount = "";
        state.currentType = [];
        state.showExpense = false;
        state.date = new Date();
        state.remark = "";
        Toast.success("账单修改成功");
        ctx.emit("refresh");
      } else {
        const params = {
          ledgerid: localStorage.getItem("LedgerId"),
          cost: Number(state.amount).toFixed(2),
          billtime: state.dateBill,
          photo: state.photo,
          marks: state.remark,
          cost_type: state.currentType,
        };
        const result = await axios.post("/HNBC/bill/add", params);
        state.amount = "";
        state.currentType = [];
        state.showExpense = false;
        state.date = new Date();
        state.remark = "";
        Toast.success("账单添加成功");
        ctx.emit("refresh");
      }
    };
    const ChangeType1 = () => {
      if (state.active1 == false) {
        state.active1 = true;
        state.currentType.push("食品和饮料");
        console.log(state.currentType);
      } else {
        state.active1 = false;
        state.currentType.splice(state.currentType.indexOf("食品和饮料"), 1);
        console.log(state.currentType);
      }
    };
    const ChangeType2 = () => {
      if (state.active2 == false) {
        state.active2 = true;
        state.currentType.push("服装和个人用品");
        console.log(state.currentType);
      } else {
        state.active2 = false;
        state.currentType.splice(
          state.currentType.indexOf("服装和个人用品"),
          1
        );
        console.log(state.currentType);
      }
    };
    const ChangeType3 = () => {
      if (state.active3 == false) {
        state.active3 = true;
        state.currentType.push("住房和家居");
        console.log(state.currentType);
      } else {
        state.active3 = false;
        state.currentType.splice(state.currentType.indexOf("住房和家居"), 1); //数组删除指定项
        console.log(state.currentType);
      }
    };
    const ChangeType4 = () => {
      if (state.active4 == false) {
        state.active4 = true;
        state.currentType.push("交通和通讯");
        console.log(state.currentType);
      } else {
        state.active4 = false;
        state.currentType.splice(state.currentType.indexOf("交通和通讯"), 1); //数组删除指定项
        console.log(state.currentType);
      }
    };
    const ChangeType5 = () => {
      if (state.active5 == false) {
        state.active5 = true;
        state.currentType.push("娱乐和文化");
        console.log(state.currentType);
      } else {
        state.active5 = false;
        state.currentType.splice(state.currentType.indexOf("娱乐和文化"), 1); //数组删除指定项
        console.log(state.currentType);
      }
    };
    const ChangeType6 = () => {
      if (state.active6 == false) {
        state.active6 = true;
        state.currentType.push("医疗保健");
        console.log(state.currentType);
      } else {
        state.active6 = false;
        state.currentType.splice(state.currentType.indexOf("医疗保健"), 1); //数组删除指定项
        console.log(state.currentType);
      }
    };
    const ChangeType7 = () => {
      if (state.active7 == false) {
        state.active7 = true;
        state.currentType.push("教育和培训");
        console.log(state.currentType);
      } else {
        state.active7 = false;
        state.currentType.splice(state.currentType.indexOf("教育和培训"), 1); //数组删除指定项
        console.log(state.currentType);
      }
    };
    const ChangeType8 = () => {
      if (state.active8 == false) {
        state.active8 = true;
        state.currentType.push("日常用品");
        console.log(state.currentType);
      } else {
        state.active8 = false;
        state.currentType.splice(state.currentType.indexOf("日常用品"), 1); //数组删除指定项
        console.log(state.currentType);
      }
    };
    const ChangeType9 = () => {
      if (state.active9 == false) {
        state.active9 = true;
        state.currentType.push("金融和投资");
        console.log(state.currentType);
      } else {
        state.active9 = false;
        state.currentType.splice(state.currentType.indexOf("金融和投资"), 1); //数组删除指定项
        console.log(state.currentType);
      }
    };
    const ChangeType10 = () => {
      if (state.active10 == false) {
        state.active10 = true;
        state.currentType.push("其他支出");
        console.log(state.currentType);
      } else {
        state.active10 = false;
        state.currentType.splice(state.currentType.indexOf("其他支出"), 1); //数组删除指定项
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
      addBill,
      remarkVisible,
      cancel,
      confirm,
      ChangeType1,
      ChangeType2,
      ChangeType3,
      ChangeType4,
      ChangeType5,
      ChangeType6,
      ChangeType7,
      ChangeType8,
      ChangeType9,
      ChangeType10,
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