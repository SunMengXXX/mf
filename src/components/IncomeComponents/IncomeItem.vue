<template>
  <van-cell-group class="item">
    <div class="header-date">
      <span>日期:{{ details.income_Time || "1970-01-01 00:00:00" }}</span>
    </div>
    <van-cell
      :title="details.income_EarningType || '消费'"
      :value="'+' + details.earning"
      :label="details.incomeMarks || '备注'"
      is-link
      @click="goToDetail"
    />
  </van-cell-group>
</template>

<script>
import { computed, onMounted, reactive, toRefs } from "vue";
import { useRouter } from "vue-router";
export default {
  name: "IncomeItem",
  props: {
    incomes: {
      type: Object,
      default: {},
    },
  },
  setup(props) {
    const router = useRouter();
    const state = reactive({
      details: {
        incomeID: "",
        earning: "",
        incomeCreateTime: "",
        incomeUpdateTime: "",
        incomePhoto: "",
        incomeMarks: "",
        income_EarningType: [],
        income_Time: "",
      },
    });
    state.details.incomeID = props.incomes.incomeid;
    state.details.earning = props.incomes.earning;
    state.details.incomeCreateTime = props.incomes.createtime;
    state.details.incomeUpdateTime = props.incomes.updatetime;
    state.details.incomePhoto = props.incomes.photo;
    state.details.incomeMarks = props.incomes.marks;
    Object.entries(props.incomes.earning_type).forEach((item, index) => {
      state.details.income_EarningType.push(item[1]);
    });
    state.details.income_Time = props.incomes.incometime;
    onMounted(() => {

    }); 

    const goToDetail = (item) => {
      console.log(props.incomes.incomeid);
      console.log(state.details.income_EarningType);
      router.push({
        path: "/incomedetail",
        query: {
          id: props.incomes.incomeid,
          earning: props.incomes.earning,
          createtime: props.incomes.createtime,
          updatetime: props.incomes.updatetime,
          photo: props.incomes.photo,
          marks: props.incomes.marks,
          earning_type: props.incomes.earning_type,
          incometime: props.incomes.incometime,
        },
      });
    };

    return {
      ...toRefs(state),
      goToDetail,
    };
  },
};
</script>

<style lang='less' scoped>
@import url("../../config/custom.less");
.item {
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.1);
  margin-bottom: 10px;
  .header-date {
    height: 0.6rem;

    display: flex;
    background-color: #f9f9f9;
    align-items: center;
    justify-content: space-between;
    padding: 0 10px;
    div {
      color: @color-text-base;
    }
    .money {
      span {
        margin-left: 20px;
        b {
          color: @color-text-caption;
          font-weight: normal;
          background-color: #f5f5f5;
          padding: 3px;
          margin-right: 2px;
        }
      }
    }
  }
}
</style>
