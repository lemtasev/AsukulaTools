<template>
  <div class="aside-container">
    <div class="aside-start"></div>
    <div class="aside-end">
      <button class="aside-btn" @click="clickAsideBtn('more')" title="更多"><i class="el-icon-more-outline"></i></button>
      <button class="aside-btn" @click="clickAsideBtn('setting')" title="设置"><i class="el-icon-setting"></i></button>
    </div>
  </div>
</template>

<script>
import { sysMenus } from '@/assets/js/default-value'
export default {
  name: 'AsideCmp',
  data () {
    return {
    }
  },
  watch: {},
  created () {
    console.log(`${this.$options.name} created`)
  },
  mounted () {
    console.log(`${this.$options.name} mounted`)
  },
  methods: {
    clickAsideBtn (type) {
      switch (type) {
        case 'setting':
          this.$store.dispatchPromise('Tab/do', { type: 'open', data: sysMenus.get('/sys/Settings') })
          break
        default:
          console.log('unknow', type)
          break
      }
    }
  }
}
</script>

<style lang="less" scoped>
.aside-container{
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  .aside-start, .aside-end{
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    .aside-btn {
      margin: 2px 0;
      padding: 8px 0;
      border: 0;
      width: 100%;
      background: none;
      outline: none;
      color: white;
      cursor: pointer;
      color: rgb(133, 133, 133);
      font-size: 24px;
      &:hover {
        color: rgb(233, 233, 233);
      }
    }
  }
}
</style>
