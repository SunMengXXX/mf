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
          <!-- <span :class="{ expense: true, active: true }">手动输入</span> -->
          <span :class="{ income: true, active: true }">图片识别</span>
        </div>

        <div @click="showDay = true" class="time">
          {{ $filters.transDay(date) }}
          <i class="iconfont sort-down" />
        </div>
      </div>
      <div class="InputFunction">
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
              <span>食品饮料</span>
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
              <span>服装日化</span>
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
              <span>住房家居</span>
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
              <span>交通通讯</span>
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
              <span>娱乐文化</span>
            </div>
          </div>
        </div>
        <div class="type-warp">
          <div class="type-body">
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
              <span>教育培训</span>
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
              <span>金融投资</span>
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
        <van-cell-group inset>
          <van-field
            v-model="remark"
            rows="2"
            autosize
            label="留言"
            type="textarea"
            maxlength="1000"
            placeholder="请输入留言"
            show-word-limit
          />
        </van-cell-group>
        <van-field name="uploader" label="上传票据">
          <template #input>
            <van-uploader
              v-model="photoRe"
              :before-read="beforeRead"
              :max-count="1"
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
        <!-- 数字键盘 -->
        <van-number-keyboard
          :show="true"
          extra-key="."
          @delete="remove"
          @input="inputChange"
        />

      </div>
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
      <van-popup v-model:show="showCenter" round :style="{ padding: '64px' }" >
        <van-loading type="spinner" color="#1989fa" />
      </van-popup>
    </div>
  </van-popup>
</template>

<script>
import { reactive, toRefs, onMounted, ref, watch, toRaw, qs } from "vue";
import dayjs from "dayjs";
import { typeMap } from "../../utils";
import axios from "../../utils/axios";
import { Toast } from "vant";
import {
  base64ToFile,
  convertBase64UrlToBlob,
  compressImage,
} from "../../tools/compressImage";
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
    const photoRe = ref([]);
    const state = reactive({
      active1: false,
      active2: false,
      active3: false,
      active4: false,
      active5: false,
      active6: false,
      active7: false,
      active8: false,
      active9: false,
      active10: false,
      showExpense: false, // 显示隐藏添加账单弹窗
      amount: id ? props.detail.billCost : "", // 账单价格
      typeMap: typeMap, // 类型key-value键值对
      currentType: [],
      showDay: false, // 选择日期显示/隐藏
      date: id
        ? dayjs(props.detail.bill_Time).format("YYYY-MM-DD HH:mm:ss")
        : new Date(), // 展示日期
      dateBill: id
        ? props.detail.bill_Time
        : dayjs().format("YYYY-MM-DD HH:mm:ss"), // 传送的日期
      remark: id ? props.detail.billMarks : "",
      photo: id ? props.detail.billPhoto : "",
      showCenter:false,
    });

    onMounted(async () => {});

    const toggle = () => {
      state.showExpense = !state.showExpense;
    };

    //图片过大
    function onOversize() {
      Toast.fail("文件太大");
    }
    //校验图片格式
    const beforeRead = (photoRe) => {
      let fileType = "";
      if (photoRe instanceof Array && photoRe.length) {
        for (let i = 0; i < photoRe.length; i++) {
          fileType = photoRe[i].type.substr(0, photoRe[i].type.indexOf("/"));
          if (fileType !== "image") {
            Toast("格式错误");
            return false;
          }
        }
      } else {
        fileType = photoRe.type.substr(0, photoRe.type.indexOf("/"));
        if (fileType !== "image") {
          Toast("格式错误");
          return false;
        }
      }
      return true;
    };

    //删除图片
    const deleteFile = (photoRe) => {
      photoRe = "";
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
      state.showDay = false;
    };

    const photo_identification = async () => {
      var compressedImg = "";
      if (photoRe.value) {
        state.showCenter=true;
        compressedImg = photoRe.value[0].file.content;
        const file = photoRe.value[0].file;
        compressedImg = file.content;
        let url =
          window.webkitURL.createObjectURL(file) ||
          window.URL.createObjectURL(file);
        compressImage(url, {
          width: 1200, // 压缩后图片的宽
          quality: 0.8, // 压缩后图片的清晰度，取值0-1，不传默认为0.7，值越小，所绘制出的图像越模糊
        }).then((result) => {
          compressedImg = result; // result即为压缩后的结果
        });
      }
      else{
        Toast.fail("请先选择照片");
      }
      setTimeout(async () => {
        const data = await axios.post("/HNBC/bill/recognition", {
          processingphoto: compressedImg,
        });       
        if (data.state == "200") {
          state.showCenter=false;
          const base64 = data.data.photo;
          if (base64) {
            const file = base64ToFile(base64, "photoRe_modified");
            let url =
              window.webkitURL.createObjectURL(file) ||
              window.URL.createObjectURL(file);
            photoRe.value.push({
              content: base64,
              file: file,
              name: photoRe,
              status: "done",
              message: "上传中",
              isImage: true,
              url,
            });
          }
          state.amount = data.data.cost;
          state.dateBill = data.data.billtime;
          state.photo = data.data.photo;
          console.log("photo"+state.photo);
          state.remark = data.data.marks;
          var virtualt = data.data.cost_type;
          var typelist = [
            "食品和饮料",
            "服装和个人用品",
            "住房和家居",
            "交通和通讯",
            "娱乐和文化",
            "医疗保健",
            "教育和培训",
            "日常用品",
            "金融和投资",
            "其他支出",
          ];
          var tempidx = 10;
          for (var i = 0; i < typelist.length; i += 1) {
            if (virtualt == typelist[i]) {
              tempidx = i + 1;
              break;
            }
          }
          if (tempidx == 1) {
            ChangeType1();
          } else if (tempidx == 2) {
            ChangeType2();
          } else if (tempidx == 3) {
            ChangeType3();
          } else if (tempidx == 4) {
            ChangeType4();
          } else if (tempidx == 5) {
            ChangeType5();
          } else if (tempidx == 6) {
            ChangeType6();
          } else if (tempidx == 7) {
            ChangeType7();
          } else if (tempidx == 8) {
            ChangeType8();
          } else if (tempidx == 9) {
            ChangeType9();
          } else if (tempidx == 10) {
            ChangeType10();
          }
        } else {
          Toast.fail(data.msg);
        }
      }, 200);
    };

    const addBill = async () => {
      if (!state.amount) {
        Toast.fail("请输入具体金额");
        return;
      }
      if (state.currentType == "") {
        Toast.fail("请选择账单类别");
        return;
      }
      if (id) {
        const params = {
          billid: parseInt(id),
          cost: parseFloat(state.amount),
          billtime: state.dateBill,
          photo: state.photo,
          marks: state.remark,
          cost_type: state.currentType,
        };
        // 如果有 id 需要调用详情更新接口
        const data = await axios.put("/HNBC/bill/update", params);
        if (data.state == "200") {
          Toast.success(data.msg);
          state.amount = "";
          state.currentType = [];
          state.showExpense = false;
          state.date = new Date();
          state.remark = "";
          state.active1 = false;
          state.active2 = false;
          state.active3 = false;
          state.active4 = false;
          state.active5 = false;
          state.active6 = false;
          state.active7 = false;
          state.active8 = false;
          state.active9 = false;
          state.active10 = false;
          ctx.emit("refresh");
        } else {
          Toast.fail(data.msg);
        }
      } else {
        const params = {
          ledgerid: parseInt(localStorage.getItem("LedgerId")),
          cost: parseFloat(state.amount),
          billtime: dayjs(state.dateBill).format("YYYY-MM-DD HH:mm:ss"),
          photo: state.photo ? state.photo : null,
          marks: state.remark,
          cost_type: state.currentType,
        };
        console.log("params photo"+state.photo);
        const data = await axios.post("/HNBC/bill/add", JSON.stringify(params));
        if (data.state == "200") {
          console.log("params photo"+state.photo);
          Toast.success(data.msg);
          state.amount = "";
          state.currentType = [];
          state.showExpense = false;
          state.date = new Date();
          state.remark = "";
          state.active1 = false;
          state.active2 = false;
          state.active3 = false;
          state.active4 = false;
          state.active5 = false;
          state.active6 = false;
          state.active7 = false;
          state.active8 = false;
          state.active9 = false;
          state.active10 = false;
          ctx.emit("refresh");
        } else {
          Toast.fail(data.msg);
        }
      }
    };
    const ChangeType1 = () => {
      if (state.active1 == false) {
        state.active1 = true;
        state.currentType.push("食品和饮料");
      } else {
        state.active1 = false;
        state.currentType.splice(state.currentType.indexOf("食品和饮料"), 1);
      }
    };
    const ChangeType2 = () => {
      if (state.active2 == false) {
        state.active2 = true;
        state.currentType.push("服装和个人用品");
      } else {
        state.active2 = false;
        state.currentType.splice(
          state.currentType.indexOf("服装和个人用品"),
          1
        );
      }
    };
    const ChangeType3 = () => {
      if (state.active3 == false) {
        state.active3 = true;
        state.currentType.push("住房和家居");
      } else {
        state.active3 = false;
        state.currentType.splice(state.currentType.indexOf("住房和家居"), 1); //数组删除指定项
      }
    };
    const ChangeType4 = () => {
      if (state.active4 == false) {
        state.active4 = true;
        state.currentType.push("交通和通讯");
      } else {
        state.active4 = false;
        state.currentType.splice(state.currentType.indexOf("交通和通讯"), 1); //数组删除指定项
      }
    };
    const ChangeType5 = () => {
      if (state.active5 == false) {
        state.active5 = true;
        state.currentType.push("娱乐和文化");
      } else {
        state.active5 = false;
        state.currentType.splice(state.currentType.indexOf("娱乐和文化"), 1); //数组删除指定项
      }
    };
    const ChangeType6 = () => {
      if (state.active6 == false) {
        state.active6 = true;
        state.currentType.push("医疗保健");
      } else {
        state.active6 = false;
        state.currentType.splice(state.currentType.indexOf("医疗保健"), 1); //数组删除指定项
      }
    };
    const ChangeType7 = () => {
      if (state.active7 == false) {
        state.active7 = true;
        state.currentType.push("教育和培训");
      } else {
        state.active7 = false;
        state.currentType.splice(state.currentType.indexOf("教育和培训"), 1); //数组删除指定项
      }
    };
    const ChangeType8 = () => {
      if (state.active8 == false) {
        state.active8 = true;
        state.currentType.push("日常用品");
      } else {
        state.active8 = false;
        state.currentType.splice(state.currentType.indexOf("日常用品"), 1); //数组删除指定项
      }
    };
    const ChangeType9 = () => {
      if (state.active9 == false) {
        state.active9 = true;
        state.currentType.push("金融和投资");
      } else {
        state.active9 = false;
        state.currentType.splice(state.currentType.indexOf("金融和投资"), 1); //数组删除指定项
      }
    };
    const ChangeType10 = () => {
      if (state.active10 == false) {
        state.active10 = true;
        state.currentType.push("其他支出");
      } else {
        state.active10 = false;
        state.currentType.splice(state.currentType.indexOf("其他支出"), 1); //数组删除指定项
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
      photoRe,
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