<template>
  <div class="item">
    <van-cell
      :title="'总预算：' + all + '元'"
      :value="'剩余：' + remain + '元'"
      is-link
      @click="getDetail"
    />
    <sapn class="start">开始时间：{{ startTime }} </sapn>
    <!-- <template #right-icon>
        <van-icon name="ellipsis"></van-icon>
      </template>
    </van-cell> -->
  </div>
</template>

<script>
import { computed, onMounted, reactive, toRefs, watch } from "vue";
import { useRouter } from "vue-router";
import { ref } from "vue";
import { Toast } from "vant";
import axios from "../../utils/axios";
import { filter } from "minimatch";
export default {
  name: "LedgerItem",
  props: {
    budget: {
      type: Object,
      default: {},
    },
  },
  setup(props) {
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
    const getDetail = () => {};
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
    filter();
    return {
      ...toRefs(state),
      getDetail,
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