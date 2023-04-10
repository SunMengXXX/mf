<template>
  <van-cell :label="'昵称：' + friend.name" :title="friend.mark" icon="user-o">
    <!-- 使用 right-icon 插槽来自定义右侧图标 -->

    <van-icon
      name="closed-eye"
      :color="'grey'"
      v-if="friend.onLineTime === '离线'"
    />
    <van-icon
      name="smile-o"
      :color="'green'"
      v-if="friend.onLineTime === '在线'"
    />
    <span class="friendState">
      {{ friend.onLineTime }}
    </span>
    <template #right-icon>
      <van-icon name="ellipsis" class="ellipsis-icon" @click="setting" />
      <van-action-sheet
        :show="show"
        :actions="actions"
        @select="onSelect"
        :overlay-class="'overlay'"
      />
    </template>
    <van-dialog
      :show="marksVisible"
      :before-close="beforeClose"
      title="备注"
      show-cancel-button
    >
      <van-field
        v-model="newMark"
        rows="2"
        autosize
        type="textarea"
        maxlength="10"
        placeholder="请输入备注"
        show-word-limit
      />
    </van-dialog>
  </van-cell>
</template>
<script>
import { toRefs, ref, reactive, onMounted } from "vue";
import { Dialog, Toast } from "vant";
import axios from "axios";
export default {
  name: "FriendSetting",
  props: {
    friendInfo: {
      type: Object,
      default: {},
    },
    refresh: Function,
  },
  setup(props, ctx) {
    const state = reactive({
      friend: {
        id: 0,
        name: "",
        mark: "",
        onLineTime: "",
      },
      show: false,
      marksVisible: false,
      newMark: "",
    });
    const actions = [{ name: "修改备注" }, { name: "删除好友" }];

    //阻止关闭弹框
    const beforeClose = async (action) => {
      if (action === "confirm") {
        if (
          state.newMark !== state.friend.name &&
          state.newMark !== "" &&
          state.newMark !== state.friend.mark
        ) {
          const data = await axios.put("/HNBC/friend/updatemarks", {
            nickname: state.friend.name,
            marks: state.newMark,
          });
          Toast.success(data.msg);
          state.newMark = "";
          state.marksVisible = false;
          state.show = false;
          setTimeout(()=>{
            ctx.emit("refresh");
          },500)
          return true;
        } else {
          Toast.fail("无效更改");
          state.newMark = "";
          return false;
        }
      } else {
        state.newMark = "";
        state.marksVisible = false;
        state.show = false;
        return true;
      }
    };

    // 好友功能
    const onSelect = (item) => {
      if (item.name === "修改备注") {
        state.marksVisible = true;
      } else if (item.name === "删除好友") {
        Dialog.confirm({
          title: "删除好友",
          message: `请您确认是否要删除"${state.friend.name}"`,
        })
          .then(async () => {
            // 确认
            const data = await axios.delete("/HNBC/friend/delete", {
              nickname: state.friend.name,
            });
            Toast.success(data.msg);
            state.show = false;
            ctx.emit("refresh");
          })
          .catch(() => {});
      }
    };
    const setting = () => {
      state.show = !state.show;
    };
    onMounted(() => {
      state.friend.id = props.friendInfo.friendid;
      state.friend.name = props.friendInfo.friendname;
      const mark = props.friendInfo.marks;
      state.friend.mark =
        mark === "" || mark === null
          ? props.friendInfo.friendname + " (未备注)"
          : mark;
      state.friend.onLineTime = props.friendInfo.onlinetime;
    });
    return {
      ...toRefs(state),
      onSelect,
      actions,
      setting,
      beforeClose,
    };
  },
};
</script>
<style lang="less">
@import url("../config/custom.less");
.overlay {
  background-color: rgba(0, 0, 0, 0.5);
}
.friendState {
  font-size: 0.2rem;
  margin-top: 0;
  padding: 0;
  .circle {
    display: flex; /*实现垂直居中*/
    align-items: center; /*实现水平居中*/
  }
}
</style>