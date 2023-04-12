<template>
  <div class="item">
    <span>状态:{{ details.ledgerState || "未开始   " }}</span>
    <span>创建日期:{{ details.createTime || "1970-01-01 00:00:00" }}</span>
    <van-cell-group inset>
      <div class="header-title"></div>
      <van-cell
        :title="details.ledgerName || '账本默认名称'"
        :value="details.isShared === 'YES' ? '共享' : '个人'"
        :label="details.marks || '备注'"
        is-link
        @click="getLedger"
      />
    </van-cell-group>
    <div class="avatar-icon">
      <van-image
        width="1rem"
        height="1rem"
        round
        fit="cover"
        src="https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg"
        @click="modifySharers"
      />
      <van-icon
        name="add-o"
        size="1rem"
        v-if="details.isShared === 'YES'"
        @click="modifySharers"
      />
    </div>
    <div class="function-tabber">
      <span @click="setting"
        ><van-icon name="setting-o" size="0.3rem" /> 设置</span
      >
      <span><van-icon name="bill-o" size="0.3rem" /> 报表</span>
      <span><van-icon name="balance-o" size="0.3rem" /> 总预算</span>
      <span><van-icon name="after-sale" size="0.3rem" /> 总支出</span>
    </div>
    <AddLedger ref="ModifyRef" :detail="details" v-bind="$attrs"></AddLedger>
    <AddSharers
      class="add"
      :detail="details"
      ref="AddSharersRef"
      v-bind="$attrs"
    ></AddSharers>
  </div>
</template>

<script>
import { computed, onMounted, reactive, toRefs, watch } from "vue";
import { useRouter } from "vue-router";
import { ref } from "vue";
import { showToast, Toast } from "vant";
import AddLedger from "./AddLedger.vue";
import AddSharers from "./AddSharers.vue";
import axios from "../../utils/axios";
export default {
  name: "LedgerItem",
  props: {
    ledgers: {
      type: Object,
      default: {},
    },
    refresh: Function,
  },
  components: {
    AddLedger,
    AddSharers,
  },
  setup(props) {
    const router = useRouter();
    const state = reactive({
      details: {
        // 从外部获取的
        ledgerID: "",
        isOwner: "",
        isShared: "",
        // 通过axios获取的
        ledgerName: "",
        createTime: "",
        marks: "",
        sharers: "",
        totalDays: "",
        budget: "",
        totalExpense: "",
        ledgerState: "",
      },
      //modify: ref(true),
    });
    // 修改账本数据
    const ModifyRef = ref(null);
    // 修改账本成员
    const AddSharersRef = ref(null);

    // 从props获取账单ID
    state.details.ledgerID = props.ledgers.ledgerid;
    state.details.isShared = props.ledgers.isshared;
    state.details.isOwner = props.ledgers.isowner;
    // 通过账单ID查询详细数据
    const getLedger = async () => {
      const { data } = await axios.get(
        `/HNBC/ledger/single/${state.details.ledgerID}`
      );
      state.details.ledgerName = data.ledgername;
      state.details.createTime = data.createtime;
      state.details.marks = data.marks;
      state.details.sharers = data.sharers;
      state.details.totalDays = data.totaldays;
      state.details.ledgerState = data.state;
    };

    const modifySharers = () => {
      AddSharersRef.value.toggle();
      props.reRefreshdisabled = true;
    };

    const setting = () => {
      addLedger();
    };
    const addLedger = () => {
      ModifyRef.value.toggle();
    };
    onMounted(() => {
      getLedger();
      //onRefresh = props.refresh;
    });
    watch(props, (newVal) => {
      console.log(newVal)
    });
    return {
      ...toRefs(state),
      setting,
      getLedger,
      ModifyRef,
      modifySharers,
      AddSharersRef,
    };
  },
};
</script>
<style lang='less'>
@import url("../../config/custom.less");
.item {
  margin-top: 10px;
  margin-bottom: 10px;
  box-shadow: 0px 0px 4px 0px rgb(213, 210, 210);
  .avatar-icon {
    background-color: #fff;
  }
  .function-tabber {
    background-color: #fff;
    border-top: 1px solid @primary-bg;
  }
}
</style>