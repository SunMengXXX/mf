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
        <van-field
          v-model="timeValue"
          is-link
          readonly
          label="生日"
          placeholder="请选择您的生日"
          @click="pickerShow = true"
        />
        <van-popup
          :show="pickerShow"
          position="bottom"
          :style="{ height: '40%' }"
        >
          <van-datetime-picker
            v-model="currentDate"
            type="date"
            :min-date="minDate"
            :max-date="maxDate"
            @change="changeFn()"
            @confirm="confirmFn()"
            @cancel="cancelFn()"
          />
        </van-popup>
        <van-row class="state" :align="center" :wrap="false">
          <van-col span="5" class="statetitle">性别</van-col>
          <van-col offset="0" span="19">
            <van-radio-group v-model="checked">
              <van-cell-group inset>
                <van-cell title="男" clickable @click="checked = '1'">
                  <template #right-icon>
                    <van-radio name="1" />
                  </template>
                </van-cell>
                <van-cell title="女" clickable @click="checked = '2'">
                  <template #right-icon>
                    <van-radio name="2" />
                  </template>
                </van-cell>
              </van-cell-group>
            </van-radio-group>
          </van-col>
        </van-row>
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
import { onMounted, reactive, toRaw, toRefs } from "vue";
import { useRouter } from "vue-router";
import { Toast } from "vant";
import { ref } from "vue";
import Header from "../components/PageComponents/Header.vue";
import axios from "../utils/axios";
import router from "../router/index";
import dayjs from "dayjs";
import {
  base64ToFile,
  convertBase64UrlToBlob,
  compressImage,
} from "../tools/compressImage";
function timeFormat(time) {
  // 时间格式化 2019-09-08
  var time = new Date(time);
  let year = time.getFullYear();
  let month = time.getMonth() + 1;
  let day = time.getDate();
  return year + "年" + month + "月" + day + "日";
}
export default {
  name: "Info",
  components: {
    Header,
  },
  setup() {
    const currentTime = new Date();
    const router = useRouter();
    const checked = ref(1);
    const state = reactive({
      nickName: "",
      birthday: new Date(),
      sex: "",
    });
    const date = reactive({
      msg: "",
      currentDate: new Date(),
      changeDate: new Date(),
      minDate: new Date("1900", "0", "1"),
      maxDate: new Date(
        currentTime.getFullYear(),
        currentTime.getMonth(),
        currentTime.getDate()
      ),
      chosenDate: null,
      pickerShow: false, // 用来显示弹出层
      timeValue: "",
    });
    const avatar = ref([]);

    const userInfo = JSON.parse(localStorage.getItem("user"));
    state.nickName = userInfo.nickname;
    state.birthday = userInfo.birthday;
    state.sex = userInfo.sex;
    checked.value = state.sex === "男" ? "1" : "2";
    date.changeDate = state.birthday ? state.birthday : date.maxDate;
    date.currentDate = state.birthday ? state.birthday : date.maxDate;
    date.timeValue = timeFormat(date.changeDate);
    date.chosenDate = date.currentDate;

    //提交信息
    const onSubmit = async () => {
      var compressedImg = "";
      if (avatar.value) {
        compressedImg = avatar.value[0].file.content;
        if (!/userAvatar_modified/.test(avatar.value[0].file.name)) {
          const file = avatar.value[0].file;
          compressedImg = file.content;
          let url =
            window.webkitURL.createObjectURL(file) ||
            window.URL.createObjectURL(file);
          compressImage(url, {
            width: 200, // 压缩后图片的宽
            //height: 100, // 压缩后图片的高，宽高若只传一个，则按图片原比例进行压缩
            quality: 0.8, // 压缩后图片的清晰度，取值0-1，不传默认为0.7，值越小，所绘制出的图像越模糊
          }).then((result) => {
            compressedImg = result; // result即为压缩后的结果
            
          });
          console.log("icon"+compressedImg);
        }
      }
      setTimeout(async () => {
        //console.log(compressedImg);
        const data = await axios.put("/HNBC/userinfo/saveuserinfo", {
          nickname: state.nickName,
          birthday: dayjs(date.changeDate).format("YYYY-MM-DD HH:mm:ss"),
          sex: checked.value === "1" ? "男" : "女",
          icon: compressedImg ? compressedImg : null,
        });
        if (data.state === "200") {
          Toast.success(data.msg);
          setTimeout(() => {
            router.replace("/user");
          }, 1000);
        } /* else{
          Toast.fail(data.msg);
        } */
      }, 200);
    };
    onMounted(async () => {
      const base64 = userInfo.icon;
      if (base64) {
        const file = base64ToFile(base64, "userAvatar_modified");
        //console.log("base64转回file的---", file);
        let url =
          window.webkitURL.createObjectURL(file) ||
          window.URL.createObjectURL(file);
        avatar.value.push({
          content: base64,
          file: file,
          name: avatar,
          status: "done",
          message: "上传中",
          isImage: true,
          url,
        });
      }
    });
    const changeFn = () => {
      // 值变化是触发
      date.changeDate = date.currentDate; // Tue Sep 08 2020 00:00:00 GMT+0800 (中国标准时间)
    };
    const confirmFn = () => {
      // 确定按钮
      setTimeout(() => {
        date.pickerShow = false;
        date.timeValue = timeFormat(date.changeDate);
        date.chosenDate = date.changeDate;
      }, 100);
    };
    const cancelFn = () => {
      date.pickerShow = false;
      date.currentDate = date.chosenDate;
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
    };

    return {
      ...toRefs(state),
      ...toRefs(date),
      avatar,
      checked,
      onSubmit,
      onOversize,
      beforeRead,
      deleteFile,
      cancelFn,
      confirmFn,
      changeFn,
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
.state {
  .van-cell {
    padding-left: 1rem;
  }
  .statetitle {
    font-size: 0.37333rem;
    color: #646566;
    padding-left: 0.42667rem;
    display: flex; /*实现垂直居中*/
    align-items: center; /*实现水平居中*/
  }
}
</style>