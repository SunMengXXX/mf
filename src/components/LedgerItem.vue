<template>
  <div class="carditem">
    <span>状态:{{ ledgerState || "未开始   " }}</span>
    <span>创建日期:{{ creatTime || "1970-01-01 00:00:00" }}</span>
    <van-cell-group inset>
      <div class="header-title"></div>
      <van-cell
        :title="ledgerName || '账本默认名称'"
        :value="isShared==='YES' ? '共享':'个人' "
        :label="marks || '备注'"
        is-link
        url="https://github.com"
      />
    </van-cell-group>
    <div class="avatar-icon">
      <van-image
        width="1rem"
        height="1rem"
        round
        fit="cover"
        src="https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg"
      />
      <van-icon name="add-o" size="1rem" />
    </div>
    <div class="function-tabber">
      <span><van-icon name="setting-o" size="0.3rem" @click="pri" /> 设置</span>
      <span><van-icon name="bill-o" size="0.3rem" /> 报表</span>
      <span><van-icon name="balance-o" size="0.3rem" /> 总预算</span>
      <span><van-icon name="after-sale" size="0.3rem" /> 总支出</span>
    </div>
  </div>
</template>

<script>
import { computed, onMounted, reactive, toRefs } from "vue";
import { useRouter } from "vue-router";
import { ref } from "vue";
import { showToast } from "vant";
export default {
  name: "LedgerItem",
  props: {
    ledgers: {
      type: Object,
      default: {},
    },
  },
  setup(props) {
    const router = useRouter();
    const state = reactive({
      ledgerid: "",
      ledgerName: "",
      creatTime: "",
      marks: "",
      isOwner: "",
      isShared: "",
      sharers: "",
      totalDays: "",
      budget: "",
      totalExpense: "",
      ledgerState: "",
    });
    const pri = () => {
      console.log(props.ledgers);
    };
    state.creatTime = props.ledgers.createtime;
    state.ledgerName = props.ledgers.ledgername;
    state.creatTime = props.ledgers.createtime;
    state.totalDays = props.ledgers.totaldays;
    state.ledgerState = props.ledgers.state;
    state.marks = props.ledgers.marks;
    state.ledgerState = props.ledgers.state;
    state.isShared = props.ledgers.isshared;

    const getDetail = async () => {
      const { data } = await axios.get("/ledger/getbill");
      if (state.refreshing) {
        state.list = [];
        state.refreshing = false;
      }
      state.loading = false;
      state.list = data;
      console.log(state.list);
    };
    return {
      ...toRefs(state),
      pri,
    };
  },
};
</script>
<style lang='less'>
@import url("../config/custom.less");
.carditem {
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