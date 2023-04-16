<template>
  <div class="about">
    <Header title='智能消费分析与建议' />
    <van-divider
      content-position="left"
      :style="{ color: '#1ab9e7', borderColor: '#1ab9e7', padding: '0 16px' }"
    >
      统计信息
    </van-divider>
    <div class="content">

      大家好，我们是来自河海大学的海纳百川小组，这个项目是我们在2022年至2023年的服务外包竞赛中的作品。
    </div>
    <van-divider
      content-position="left"
      :style="{ color: '#1ab9e7', borderColor: '#1ab9e7', padding: '0 16px' }"
    >
      关于项目
    </van-divider>
    <div class="content">
      <p>此次项目前端用到的技术栈包括 Vite 构建项目、flexible 移动端适配、Vant 3.x 组件库、Vue-Router 4.x 路由插件等等。</p>
    </div>
  </div>
  <van-search
  v-model="value"
  shape="round"
  background="#1ab9e7"
  placeholder="请输入搜索关键词"
/>

</template>

<script>
import Header from '../components/PageComponents/Header.vue'
export default {
  name: 'About',
  components: {
    Header
  }
}
</script>

<style lang="less">
  .about {
    .content {
      padding: 0 16px;
      font-size: 14px;
      color: rgba(0, 0, 0, .5);
      line-height: 24px;
      p {
        margin-bottom: 10px;
      }
    }
  }
</style>