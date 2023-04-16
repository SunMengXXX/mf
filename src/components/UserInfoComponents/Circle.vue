<template>
  <van-row justify="center">
    <van-col offset="" span="4rem"
      ><van-circle
        :current-rate="currentRate"
        :rate="rate"
        :speed="1"
        :color="gradientColor"
        :text="text"
        @load="onload"
    /></van-col>
    <van-col class="budget">
      <div>当月已使用预算{{ (all - remain).toFixed(2) }}</div>
      <div>当月总预算{{ all.toFixed(2) }}</div>
    </van-col>
  </van-row>
</template>
<script>
import { ref, computed, watch, toRaw } from "vue";
export default {
  name: "Circle",
  props: {
    all: {
      type: Number,
    },
    remain: {
      type: Number,
    },
  },
  setup(props) {
    //定义环形进度条
    const all = ref(0);
    const remain = ref(0);

    const currentRate = computed(() =>
      all.value > 0 ? remain.value / all.value : 0
    );
    const rate = ref(100);
    const gradientColor =
      currentRate.value < 80
        ? {
            "0%": "#3fecff",
            "100%": "#6149f6",
          }
        : "red";
    const text = computed(
      () =>
        "已使用\n" +
        (currentRate.value < 100 ? currentRate.value.toFixed(0) : 100) +
        "%"
    );

    watch(props, (newVal) => {
      /* console.log(toRaw(newVal)); */
      all.value = newVal.all;
      remain.value = newVal.remain;
      /* console.log(rate, currentRate); */
    });
    return {
      all,
      remain,
      rate,
      currentRate,
      gradientColor,
      text,
      onload,
    };
  },
};
</script>
<style lang="less" scoped>
.budget {
  font-size: large;
}
</style>