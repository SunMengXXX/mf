<template>
  <van-cell-group class="item">
    <div class="header-date">
      <span>日期:{{ details.bill_Time|| "1970-01-01 00:00:00" }}</span>
      <!-- <span>最新修改日期:{{ details.billUpdateTime || "1970-01-01 00:00:00" }}</span> -->
    </div>
    <van-cell
        :title="details.bill_CostType.join('、') || '消费'"
        :value=" '-'+details.billCost"
        :label="details.billMarks.substring(0,5)|| '备注'"
        is-link
        @click="goToDetail"
    />
  </van-cell-group>
</template>

<script>
import { computed, reactive, toRefs } from "vue";
import { useRouter } from "vue-router";
export default {
  name: "CardItem",
  props: {
    bill: {
      type: Object,
      default: {},
    },
  },
  setup(props) {
    const router = useRouter();
    const state = reactive({
      details: {
        billID: "",
        billCost: "",
        billCreateTime: "",
        billUpdateTime: "",
        billPhoto: "",
        billMarks: "",
        bill_CostType: [],
        bill_Time:"",
      },
    });
    state.details.billID=props.bill.billid;
    state.details.billCost=props.bill.cost;
    state.details.billCreateTime=props.bill.createtime;
    state.details.billUpdateTime=props.bill.updatetime;
    state.details.billPhoto=props.bill.photo;
    state.details.billMarks=props.bill.marks;
    state.details.bill_CostType=props.bill.cost_type;
    state.details.bill_Time=props.bill.billtime;
    
    const goToDetail = () => {
      console.log(props.bill.billid);
      router.push({
        path: "/detail",
        query: {
          id: props.bill.billid,
          cost: props.bill.cost,
          createtime:props.bill.createtime,
          updatetime:props.bill.updatetime,
          photo:props.bill.photo,
          marks:props.bill.marks,
          cost_type:props.bill.cost_type,
          billtime:props.bill.billtime,
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
    height: 60px;
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
<style lang='less'>
@import url("../../config/custom.less");
.expense {
  .van-cell__value {
    color: @color-text-base!important;
  }
}
.income {
  .van-cell__value {
    color: @text-warning!important;
  }
}
</style>