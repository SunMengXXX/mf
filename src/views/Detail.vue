
<template>
  <div class="detail">
    <Header title="账单详情" />
    <div class="card">
      <div class="type"></div>
      <div class="amount expense">-{{ detail.billCost }}</div>
      <div class="info">
        <div class="time">
          <span>账单时间</span>
          <span>{{ detail.bill_Time }}</span>
        </div>
        <div class="time">
          <span>账单类型</span>
          <span>
            <ul>
              <li v-for="item in detail.bill_CostType" :key="item">
                {{ item }}
              </li>
            </ul>
          </span>
        </div>
        <div class="time">
          <span>记录时间</span>
          <span>{{ detail.billCreateTime }}</span>
        </div>
        <div class="time">
          <span>更改时间</span>
          <span>{{ detail.billUpdateTime }}</span>
        </div>
        <div class="remark">
          <span>备注</span>
          <span>{{ detail.billMarks || "-" }}</span>
        </div>
        <div class="photo">
          <span>图片</span>
          <van-image
            class="avater"
            :src="detail.billPhoto"
            width="150"
            height="150"
            v-if="detail.billPhoto != ''"
            ><template v-slot:loading>
              <van-loading type="spinner" size="20" /> </template
          ></van-image>
        </div>
      </div>
      <div class="operation van-hairline--top">
        <span class="van-hairline--right" @click="deleteDetail"
          ><van-icon name="delete" />删除</span
        >
        <span @click="openModal"><van-icon name="edit" />编辑</span>
      </div>
      <!-- 编辑 -->
      <ExpenseAdd
        v-if="detail.billID"
        ref="expenseAddRef"
        :detail="detail"
        @refresh="getDetail"
      />
    </div>
  </div>
</template>

<script>
import { onMounted, reactive, ref, toRefs } from "vue";
import { useRoute, useRouter } from "vue-router";
import Header from "../components/PageComponents/Header.vue";
import ExpenseAdd from "../components/BillComponents/ExpenseAdd.vue";
import { typeMap } from "../utils";
import axios from "../utils/axios";
import { Toast, Dialog } from "vant";
export default {
  name: "Detail",
  components: {
    Header,
    ExpenseAdd,
  },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const {
      id,
      cost,
      createtime,
      updatetime,
      photo,
      marks,
      cost_type,
      billtime,
    } = route.query;

    const expenseAddRef = ref(null);
    const state = reactive({
      // typeMap,
      // detail: {}
      detail: {
        billID: "",
        billCost: "",
        billCreateTime: "",
        billUpdateTime: "",
        billPhoto: "",
        billMarks: "",
        bill_CostType: [],
        bill_Time: "",
      },
    });

    onMounted(async () => {
      getDetail();
    });
    // 获取账单详情方法
    const getDetail = async () => {
      state.detail.billID = id;
      state.detail.billCost = cost;
      state.detail.billCreateTime = createtime;
      state.detail.billUpdateTime = updatetime;
      // state.detail.billPhoto = photo;
      state.detail.billMarks = marks;
      state.detail.bill_CostType = cost_type;
      state.detail.bill_Time = billtime;
      console.log(state.detail.billPhoto);
      getPhoto();
    };
    const getPhoto = async () => {
      var billid = parseInt(state.detail.billID);
      console.log("params photo" + state.photo);
      const data = await axios.get(
        `/HNBC/bill/single/${billid}`
      );

      if (data.state == "200") {

        state.detail.billPhoto = data.data.photo;
        // console.log(state);
        console.log("state.detail.billPhoto" + state.detail.billPhoto);
      }
    };
    // 打开编辑弹窗方法
    const openModal = () => {
      expenseAddRef.value.toggle();
    };

    // 删除方法
    const deleteDetail = () => {
      Dialog.confirm({
        title: "删除",
        message: "确认删除账单？",
      })
        .then(async () => {
          const { data } = await axios.delete(
            `/HNBC/bill/delete/${state.detail.billID}`
          );
          Toast.success("删除成功");
          router.back();
        })
        .catch(() => {
          Toast.fail("删除失败");
        });
    };

    return {
      ...toRefs(state),
      expenseAddRef,
      openModal,
      getDetail,
      deleteDetail,
      getPhoto,
    };
  },
};
</script>

<style lang='less' scoped>
@import url("../config/custom.less");
.detail {
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #f5f5f5;
  padding: 12px 24px 0 24px;
}
.card {
  border-radius: 12px;
  background-color: #fff;
  padding: 0 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  .type {
    padding: 24px 0 12px 0;
    span:nth-of-type(1) {
      display: inline-block;
      width: 22px;
      height: 22px;
      color: #fff;
      border-radius: 50%;
      text-align: center;
      line-height: 20px;
      margin-right: 8px;
    }
    .expense {
      background-color: @primary;
    }
    .income {
      background-color: @text-warning;
    }
  }
  .amount {
    font-size: 24px;
    font-weight: 600;
    margin-bottom: 24px;
  }
  .info {
    width: 100%;
    font-size: 14px;
    text-align: left;
    .time {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      margin-bottom: 12px;
      span:nth-of-type(1) {
        flex: 3;
        color: @color-text-caption;
      }
      span:nth-of-type(2) {
        flex: 9;
      }
    }
    .remark {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      margin-bottom: 12px;
      span:nth-of-type(1) {
        flex: 3;
        color: @color-text-caption;
      }
      span:nth-of-type(2) {
        flex: 9;
        color: @color-text-base;
      }
    }
  }
  .photo {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    margin-bottom: 12px;
    margin-right: 2.26667rem;
    span:nth-of-type(1) {
      flex: 6;
      color: @color-text-caption;
    }
    span:nth-of-type(2) {
      flex: 6;
      color: @color-text-base;
    }
  }
  .operation {
    width: 100%;
    height: 50px;
    display: flex;
    align-items: center;
    font-size: 16px;
    .van-icon {
      margin-right: 4px;
    }
    span {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
      flex: 1;
    }
    span:nth-of-type(1) {
      color: red;
    }
  }
}
</style>