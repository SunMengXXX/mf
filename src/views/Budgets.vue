<template>
  <div class="content-wrap">
    <div>
      <!-- 上方导航栏 -->
      <van-nav-bar
        title="预算列表"
        @click-left="back"
        left-text="返回"
        left-arrow
      >
        <template #right>
          <van-icon name="add-o" size="0.5rem" @click="addBudget" />
        </template>
      </van-nav-bar>
    </div>
    <!-- 预算列表 -->
    <van-tree-select
      v-model:main-active-index="activeIndex"
      height="90%"
      :items="items"
      class="treeselect"
    >
      <template #content>
        <!-- 进行中的预算 -->
        <van-list v-if="activeIndex === 0">
          <BudgetItem
            v-for="item in ongoing"
            :budget="item"
            :key="item"
          ></BudgetItem>
        </van-list>

        <!-- 未开始的预算 -->
        <van-list v-if="activeIndex === 1">
          <BudgetItem
            v-for="item in unstarted"
            :budget="item"
            :key="item"
          ></BudgetItem>
        </van-list>

        <!-- 已完成的预算 -->
        <van-list v-if="activeIndex === 2">
          <van-cell v-for="item in finished" :budget="item" :key="item" />
        </van-list>
      </template>
    </van-tree-select>
    <AddBudget ref="addBudgetRef" @update="getUserBudget"></AddBudget>
  </div>
</template>
  
  <script>
import { onMounted, reactive, ref, toRefs, watch, toRaw, provide } from "vue";
import { useRouter } from "vue-router";
import { Toast } from "vant";
import axios from "../utils/axios";
import router from "../router/index";
import AddBudget from "../components/BudgetComponents/AddBudget.vue";
import BudgetItem from "../components/BudgetComponents/BudgetItem.vue";
export default {
  name: "Budgets",
  components: {
    BudgetItem,
    AddBudget,
  },
  setup() {
    const router = useRouter();
    const state = reactive({
      ongoing: [],
      unstarted: [],
      finished: [],
      activeIndex: 0,
      items: [{ text: "进行中" }, { text: "未开始" }, { text: "已结束" }],
    });
    const addBudgetRef = ref(null);
    //获取用户总预算
    const getUserBudget = async () => {
      state.ongoing = [];
      state.unstarted = [];
      state.finished = [];
      const { data } = await axios.get("/HNBC/userbudget/all");
      for (let i = 0; i < data.length; i++) {
        if (data[i].state === "进行中") {
          state.ongoing.push(data[i]);
        } else if (data[i].state === "未开始") {
          state.unstarted.push(data[i]);
        } else {
          state.finished.push(data[i]);
        }
      }
    };
    onMounted(() => {
      getUserBudget();
    });
    const addBudget = () => {
      addBudgetRef.value.toggle();
    };

    // 返回方法
    const back = () => {
      router.back();
    };
    provide('getUserBudget',getUserBudget)
    return {
      ...toRefs(state),
      back,
      getUserBudget,
      addBudget,
      addBudgetRef,
    };
  },
};
</script>
<style lang="less">
@import url("../config/custom.less");
.account {
  min-height: 100%;
  background-color: #f5f5f5;

  .modal-pass {
    .van-dialog__header {
      padding: 10px 0;
    }
    .van-dialog__content {
      .van-cell-group {
        padding: 20px;
      }
    }
  }
}
.content-wrap {
  height: calc(~"(100% -0%)");
  overflow: hidden;
  overflow-y: scroll;
  background-color: #f5f5f5;
  padding: 10px;
  // padding-bottom: 50px;
}
.tips {
  font-size: 0.2rem;
  margin-bottom: 0.1rem;
}
</style>