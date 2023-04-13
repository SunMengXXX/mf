<template>
  <div class="item">
    <van-cell
      :title="'总预算：' + all + '元'"
      :value="'剩余：' + remain + '元'"
      is-link
      @click="getDetail"
    />
    <sapn class="start">开始时间：{{ startTime.substring(0, 10) }} </sapn>
    <AddBudget
      ref="addBudgetRef"
      :budgetid="userbudgetid"
      @update="refresh"
    ></AddBudget>
  </div>
</template>

<script>
import { ref, onMounted, reactive, toRefs, watch } from "vue";
import { useRouter } from "vue-router";
import { Toast } from "vant";
import axios from "../../utils/axios";
import { filter } from "minimatch";
import AddBudget from "./AddBudget.vue";
export default {
  name: "LedgerItem",
  props: {
    budget: {
      type: Object,
      default: {},
    },
    update: Function,
  },
  components: {
    AddBudget,
  },
  setup(props, ctx) {
    const router = useRouter();
    const state = reactive({
      // 从外部获取的有关数据
      all: 0,
      remain: 0,
      createTime: "",
      startTime: "",
      updateTime: "",
      state: "",
      userbudgetid: -1,
      userid: -1,
    });
    const addBudgetRef = ref(null);
    const getDetail = () => {
      addBudgetRef.value.toggle();
    };
    const refresh = () => {
      ctx.emit("update");
    };
    onMounted(() => {
      state.all = props.budget.amount;
      state.createTime = props.budget.createtime;
      state.remain = props.budget.residual;
      state.startTime = props.budget.starttime;
      state.state = props.budget.state;
      state.updateTime = props.budget.updatetime;
      state.userbudgetid = props.budget.userbudgetid;
      state.userid = props.budget.userid;
    });
    watch(props, (newVal) => {
      //console.log(newVal);
    });

    return {
      ...toRefs(state),
      getDetail,
      addBudgetRef,
      refresh,
    };
  },
};
</script>
<style lang='less'>
@import url("../../config/custom.less");
.item {
  margin-top: 0px;
  margin-bottom: 5px;
  box-shadow: 0px 0px 2px 0px rgb(213, 210, 210);
  span {
    font-size: 0.25rem;
  }
  .avatar-icon {
    background-color: #fff;
  }
  .function-tabber {
    background-color: #fff;
    border-top: 1px solid @primary-bg;
  }
}
.start {
  font-size: 0.1rem;
  padding-left: 0.4rem;
}
.van-sidebar {
  flex: 0.5;
}
</style>