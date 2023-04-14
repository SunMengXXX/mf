<template>
  <div class="detail">
    <Header title="收入详情" />
    <div class="card">
      <div class="type"></div>
      <div class="amount income">+{{ detail.incomeEarning }}</div>
      <div class="info">
        <div class="time">
          <span>收入时间</span>
          <span>{{ detail.income_Time }}</span>
        </div>
        <div class="time">
          <span>收入类型</span>
          <span>{{ detail.income_EarningType.join("、") }}</span>
        </div>
        <div class="time">
          <span>记录时间</span>
          <span>{{ detail.incomeCreateTime }}</span>
        </div>
        <div class="time">
          <span>更改时间</span>
          <span>{{ detail.incomeUpdateTime }}</span>
        </div>
        <div class="remark">
          <span>备注</span>
          <span>{{ detail.incomeMarks || "-" }}</span>
        </div>
        <div class="photo">
          <span>图片</span>
          <van-image
            class="avatar"
            :src="detail.incomePhoto"
            width="150"
            height="150"
            v-if="detail.incomePhoto != ''"
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
      <IncomeAdd
        v-if="detail.incomeID"
        ref="incomeAddRef"
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
import IncomeAdd from "../components/IncomeComponents/IncomeAdd.vue";
import { typeMap } from "../utils";
import axios from "../utils/axios";
import { Toast, Dialog } from "vant";
export default {
  name: "Detail",
  components: {
    Header,
    IncomeAdd,
  },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const {
      id,
      earning,
      createtime,
      updatetime,
      photo,
      marks,
      earning_type,
      incometime,
    } = route.query;

    const incomeAddRef = ref(null);
    const state = reactive({
      // typeMap,
      // detail: {}
      detail: {
        incomeID: "",
        incomeEarning: "",
        incomeCreateTime: "",
        incomeUpdateTime: "",
        incomePhoto: "",
        incomeMarks: "",
        income_EarningType: [],
        income_Time: "",
      },
    });

    onMounted(async () => {
      getDetail();
    });
    // 获取账单详情方法
    const getDetail = async () => {
      state.detail.incomeID = id;
      state.detail.incomeEarning = earning;
      state.detail.incomeCreateTime = createtime;
      state.detail.incomeUpdateTime = updatetime;
      state.detail.incomePhoto = photo;
      state.detail.incomeMarks = marks;
      state.detail.income_EarningType = earning_type;
      state.detail.income_Time = incometime;
    };
    // 打开编辑弹窗方法
    const openModal = () => {
      incomeAddRef.value.toggle();     
    };

    // 删除方法
    const deleteDetail = () => {
      Dialog.confirm({
        title: "删除",
        message: "确认删除该收入？",
      })
        .then(async () => {
          const { data } = await axios.delete(
            `/HNBC/income/delete/${state.detail.incomeID}`
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
      incomeAddRef,
      openModal,
      getDetail,
      deleteDetail,
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