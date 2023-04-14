<template>
  <div class="account">
    <Header title="个人资料" />
    <van-form @submit="onSubmit">
      <van-field name="uploader" label="上传头像">
        <template #input>
          <van-uploader
            v-model="avatar"
            accept="image/*"
            :before-read="beforeRead"
            :max-count="1"
            :max-size="2 * 1024 * 1024"
            @oversize="onOversize"
            @delete="deleteFile"
          />
        </template>
      </van-field>
      <van-cell-group inset>
        <van-field
          v-model="nickName"
          name="昵称"
          label="昵称"
          placeholder="昵称"
        />
        <van-field v-model="age" name="年龄" label="年龄" placeholder="年龄" />
        <van-field v-model="sex" name="性别" label="性别" placeholder="性别" />
      </van-cell-group>
      <div style="margin: 16px">
        <van-button round block type="primary" native-type="submit">
          提交
        </van-button>
      </div>
    </van-form>
  </div>
</template>

<script>
import { reactive, toRaw, toRefs } from "vue";
import { useRouter } from "vue-router";
import { Toast } from "vant";
import { ref } from "vue";
import Header from "../components/PageComponents/Header.vue";
import axios from "../utils/axios";
import router from "../router/index";
export default {
  name: "Info",
  components: {
    Header,
  },
  setup() {
    const router = useRouter();
    const state = reactive({
      nickName: "",
      age: "",
      sex: "",
    });
    const avatar = ref();

    const userInfo = JSON.parse(localStorage.getItem("user"));
    state.nickName = userInfo.nickname;
    state.age = userInfo.age;
    state.sex = userInfo.sex;

    //提交信息
    const onSubmit = async () => {
      axios.defaults.headers.post["Content-Type"] = "multipart/form-data";
      /* console.log(axios.defaults.headers); */
      const icon = JSON.stringify(avatar.value ? avatar.value[0].content : "");
      const formdata = new FormData();
      formdata.append("nickname", state.nickName);
      formdata.append("age", state.age);
      formdata.append("sex", state.sex);
      formdata.append("icon", icon);

      /* const userInfo = {
        nickname: state.nickName,
        age: state.age,
        sex: state.sex,
        icon: icon,
      }; */
      const data = await axios.post("/HNBC/userinfo/saveuserinfo", formdata);
      axios.defaults.headers.post["Content-Type"] = "application/json";
      Toast.success(data.msg);
      if (data.state === "200") {
        setTimeout(() => {
          router.replace("/user");
        }, 1000);
      }
    };

    //图片过大
    const onOversize = () => {
      Toast.fail("文件太大");
    };
    //校验图片格式
    const beforeRead = (avatar) => {
      let fileType = "";
      if (avatar instanceof Array && avatar.length) {
        for (let i = 0; i < avatar.length; i++) {
          fileType = avatar[i].type.substr(0, avatar[i].type.indexOf("/"));
          if (fileType !== "image") {
            Toast("格式错误");
            return false;
          }
        }
      } else {
        fileType = avatar.type.substr(0, avatar.type.indexOf("/"));
        if (fileType !== "image") {
          Toast("格式错误");
          return false;
        }
      }
      return true;
    };

    //删除图片
    const deleteFile = (avatar) => {
      avatar = "";
      console.log(avatar);
    };

    return {
      ...toRefs(state),
      avatar,
      onSubmit,
      onOversize,
      beforeRead,
      deleteFile,
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
</style>