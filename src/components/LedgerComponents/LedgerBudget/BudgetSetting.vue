<template>
  <van-popup :show="show" position="bottom" round @touchmove.stop>
    <div>
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
      <div class="treeselect">
        <van-tree-select
          v-model:main-active-index="activeIndex"
          height="90%"
          :items="items"
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
      </div>
      <AddBudget ref="addBudgetRef" @update="getLedgerBudget"></AddBudget>
    </div>
  </van-popup>
</template>
  
  <script>
import { reactive, toRefs, ref, watch, provide, onMounted, inject } from "vue";
import axios from "../../../utils/axios";
import AddBudget from "./AddBudget.vue";
import BudgetItem from "./BudgetItem.vue";
export default {
  name: "BudgetSetting",
  // props: {
  //   ledgerid: {
  //     type: Number,
  //     default: -1,
  //   },
  // },
  components: {
    AddBudget,
    BudgetItem,
  },
  setup() {
    const state = reactive({
      ledgerid: -1,
      show: false,
      ongoing: [],
      unstarted: [],
      finished: [],
      activeIndex: 0,
      items: [{ text: "进行中" }, { text: "未开始" }, { text: "已结束" }],
    });
    const addBudgetRef = ref(null);
    state.ledgerid = inject("ledgerid");
    const addBudget = () => {
      addBudgetRef.value.toggle();
    };

    const toggle = () => {
      state.show = !state.show;
    };
    const back = () => {
      state.show = false;
    };
    //获取用户总预算
    const getLedgerBudget = async () => {
      state.ongoing = [];
      state.unstarted = [];
      state.finished = [];
      if (state.ledgerid !== -1) {
        const { data } = await axios.get(
          `/HNBC/ledgerbudget/all/${state.ledgerid}`
        );
        for (let i = 0; i < data.length; i++) {
          if (data[i].state === "进行中") {
            state.ongoing.push(data[i]);
          } else if (data[i].state === "未开始") {
            state.unstarted.push(data[i]);
          } else {
            state.finished.push(data[i]);
          }
        }
      }
    };
    onMounted(() => {
      getLedgerBudget();
    });
    provide("getLedgerBudget", getLedgerBudget);
    // watch(props, (newVal) => {
    //   state.ledgerid = newVal.ledgerid;
    //   console.log(newVal);
    // });
    return {
      ...toRefs(state),
      back,
      addBudget,
      toggle,
      addBudgetRef,
      getLedgerBudget,
    };
  },
};
</script>
<style lang="less" scoped>
@import url("../../../config/custom.less");
.treeselect {
  height: 10rem;
}
</style>