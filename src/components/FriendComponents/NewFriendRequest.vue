<template>
  <van-swipe-cell class="cellbox" v-if="show">
    <van-cell :border="false" :title="friendName" :value="notes" />
    <template #right>
      <van-button square type="success" text="同意" @click="handle('accept')" />
      <van-button square type="danger" text="拒绝" @click="handle('reject')" />
    </template>
  </van-swipe-cell>
</template>
<script>
import { toRefs, ref, reactive, onMounted, watch } from "vue";
import { Toast } from "vant";
import axios from "../../utils/axios";
import { checkFriendRequest } from "../../tools/checkfriendrequest";
export default {
  name: "NewFriendRequest",
  props: {
    info: {
      type: Object,
      default: {},
    },
  },
  setup(props) {
    const state = reactive({
      friendName: "",
      notes: "",
      show: true,
    });

    const handle = async (option) => {
      const friend = `{"${state.friendName}":"${option}"}`;
      const data = await axios.post("/HNBC/friend/handlerequest",friend);
      Toast.success(data.msg)
      setTimeout(()=>{
        state.show = false;
      },800)
      checkFriendRequest()
    };

    onMounted(() => {
      state.friendName = props.info.nickname;
      state.notes = props.info.info;
      console.log(props);
    });
    watch(props, (newVal) => {
      /* state.friendName = newVal.info.nickname;
      state.notes = newVal.info.info;
      console.log(state) */
    });
    return {
      ...toRefs(state),
      handle
    };
  },
};
</script>
<style lang="less">
@import url("../../config/custom.less");
.cellbox {
  margin-top: 0.1rem;
}
</style>